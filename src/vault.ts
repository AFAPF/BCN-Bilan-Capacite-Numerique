import { createVaultMaterial, decryptJson, encryptJson, sha256, unlockVaultMaterial, type VaultConfig } from "./crypto";
import { APP_VERSION, createWorkspace, migrateWorkspace, type AuditEvent, type PersistenceStatus, type Workspace } from "./domain";
import { readVault, readWorkspace, removeEncryptedVault, writeVault, writeWorkspace, type StoredVault } from "./storage";

export interface EncryptedBackupContainer {
  format: "bcn-backup";
  version: 1;
  exportedAt: string;
  vault: StoredVault;
  integrity: string;
}

export interface LocalBackupContainer {
  format: "bcn-backup";
  version: 2;
  exportedAt: string;
  workspace: Workspace;
  integrity: string;
}

export type BackupContainer = EncryptedBackupContainer | LocalBackupContainer;

export class UnlockDelayedError extends Error {
  constructor(public readonly retryAfterMs: number) {
    super(`Nouvel essai possible dans ${Math.ceil(retryAfterMs / 1000)} seconde(s).`);
  }
}

class VaultService {
  private dataKey: CryptoKey | null = null;
  private config: VaultConfig | null = null;
  private workspace: Workspace | null = null;
  private localMode = false;
  private failedUnlocks = 0;
  private blockedUntil = 0;

  get current(): Workspace | null {
    return this.workspace;
  }

  async create(password: string, label: string, displayName: string, persistence: PersistenceStatus): Promise<Workspace> {
    if (await readVault()) throw new Error("Un coffre existe déjà sur cet appareil.");
    const material = await createVaultMaterial(password);
    const workspace = createWorkspace(label, displayName, persistence);
    const state = await encryptJson(workspace, material.dataKey);
    await writeVault({ config: material.config, state });
    this.dataKey = material.dataKey;
    this.config = material.config;
    this.workspace = workspace;
    return workspace;
  }

  async createLocal(label: string, displayName: string, persistence: PersistenceStatus): Promise<Workspace> {
    const workspace = createWorkspace(label, displayName, persistence);
    await writeWorkspace(workspace);
    this.dataKey = null;
    this.config = null;
    this.workspace = workspace;
    this.localMode = true;
    return workspace;
  }

  async openLocal(): Promise<Workspace> {
    const stored = await readWorkspace();
    if (!stored) throw new Error("Aucun espace local n’a été trouvé.");
    const workspace = migrateWorkspace(stored);
    const now = new Date().toISOString();
    workspace.appVersion = APP_VERSION;
    workspace.lastOpenedAt = now;
    workspace.profile.lastLoginAt = now;
    this.dataKey = null;
    this.config = null;
    this.workspace = workspace;
    this.localMode = true;
    await this.save();
    return workspace;
  }

  async migrateToLocal(password: string): Promise<Workspace> {
    const workspace = await this.unlock(password);
    await writeWorkspace(workspace);
    await removeEncryptedVault();
    this.dataKey = null;
    this.config = null;
    this.localMode = true;
    return workspace;
  }

  async unlock(password: string): Promise<Workspace> {
    const remaining = this.blockedUntil - Date.now();
    if (remaining > 0) throw new UnlockDelayedError(remaining);
    const stored = await readVault();
    if (!stored) throw new Error("Aucun coffre local n’a été trouvé.");
    try {
      const key = await unlockVaultMaterial(password, stored.config);
      const value = migrateWorkspace(await decryptJson(stored.state, key));
      const now = new Date().toISOString();
      value.appVersion = APP_VERSION;
      value.lastOpenedAt = now;
      value.profile.lastLoginAt = now;
      value.audit.push(audit("vault_unlocked"));
      this.dataKey = key;
      this.config = stored.config;
      this.workspace = value;
      this.failedUnlocks = 0;
      this.blockedUntil = 0;
      await this.save();
      return value;
    } catch (error) {
      this.failedUnlocks += 1;
      if (this.failedUnlocks >= 5) {
        const delay = Math.min(30_000, 1000 * 2 ** (this.failedUnlocks - 5));
        this.blockedUntil = Date.now() + delay;
      }
      if (error instanceof UnlockDelayedError) throw error;
      throw new Error("Phrase secrète incorrecte ou coffre illisible.");
    }
  }

  async save(): Promise<void> {
    if (!this.workspace) throw new Error("L’espace local n’est pas ouvert.");
    this.workspace.updatedAt = new Date().toISOString();
    if (this.localMode) {
      await writeWorkspace(this.workspace);
      return;
    }
    if (!this.dataKey || !this.config) throw new Error("Le coffre est verrouillé.");
    const state = await encryptJson(this.workspace, this.dataKey);
    await writeVault({ config: this.config, state });
  }

  async lock(): Promise<void> {
    try {
      if (this.workspace) {
        this.workspace.audit.push(audit("vault_locked"));
        await this.save();
      }
    } finally {
      this.dataKey = null;
      this.config = null;
      this.workspace = null;
      this.localMode = false;
    }
  }

  async exportBackup(): Promise<{ json: string; hash: string }> {
    if (!this.workspace) throw new Error("Le coffre est verrouillé.");
    this.workspace.lastBackupAt = new Date().toISOString();
    this.workspace.audit.push(audit("backup_created"));
    await this.save();
    if (this.localMode) {
      const unsigned = { format: "bcn-backup" as const, version: 2 as const, exportedAt: new Date().toISOString(), workspace: structuredClone(this.workspace) };
      const integrity = await sha256(JSON.stringify(unsigned));
      this.workspace.lastBackupHash = integrity;
      await this.save();
      return { json: JSON.stringify({ ...unsigned, integrity }, null, 2), hash: integrity };
    }
    const stored = await readVault();
    if (!stored) throw new Error("Coffre local introuvable.");
    const unsigned = { format: "bcn-backup" as const, version: 1 as const, exportedAt: new Date().toISOString(), vault: stored };
    const integrity = await sha256(JSON.stringify(unsigned));
    this.workspace.lastBackupHash = integrity;
    await this.save();
    return { json: JSON.stringify({ ...unsigned, integrity }, null, 2), hash: integrity };
  }

  async verifyBackup(json: string): Promise<BackupContainer> {
    const parsed = JSON.parse(json) as Partial<BackupContainer>;
    if (parsed.format !== "bcn-backup" || typeof parsed.integrity !== "string") {
      throw new Error("Format de sauvegarde BCN invalide.");
    }
    const unsigned = parsed.version === 2 && "workspace" in parsed
      ? { format: parsed.format, version: parsed.version, exportedAt: parsed.exportedAt, workspace: parsed.workspace }
      : parsed.version === 1 && "vault" in parsed
        ? { format: parsed.format, version: parsed.version, exportedAt: parsed.exportedAt, vault: parsed.vault }
        : null;
    if (!unsigned) throw new Error("Format de sauvegarde BCN invalide.");
    if ((await sha256(JSON.stringify(unsigned))) !== parsed.integrity) throw new Error("Sauvegarde corrompue ou modifiée.");
    return parsed as BackupContainer;
  }

  async restoreBackup(json: string, password?: string): Promise<Workspace> {
    const candidate = await this.verifyBackup(json);
    if (candidate.version === 2) {
      const workspace = migrateWorkspace(candidate.workspace);
      const now = new Date().toISOString();
      workspace.appVersion = APP_VERSION;
      workspace.updatedAt = now;
      workspace.lastOpenedAt = now;
      workspace.profile.lastLoginAt = now;
      workspace.audit.push(audit("backup_restored"));
      await writeWorkspace(workspace);
      await removeEncryptedVault();
      this.dataKey = null;
      this.config = null;
      this.workspace = workspace;
      this.localMode = true;
      return workspace;
    }
    if (!password) throw new Error("Cette ancienne sauvegarde nécessite sa phrase secrète.");
    let key: CryptoKey;
    let value: unknown;
    try {
      key = await unlockVaultMaterial(password, candidate.vault.config);
      value = migrateWorkspace(await decryptJson(candidate.vault.state, key));
    } catch {
      throw new Error("Phrase secrète incorrecte ou sauvegarde illisible.");
    }
    const workspace = value as Workspace;
    const now = new Date().toISOString();
    workspace.appVersion = APP_VERSION;
    workspace.updatedAt = now;
    workspace.lastOpenedAt = now;
    workspace.profile.lastLoginAt = now;
    workspace.audit.push(audit("backup_restored"));
    const state = await encryptJson(workspace, key);
    await writeVault({ config: candidate.vault.config, state });
    this.dataKey = key;
    this.config = candidate.vault.config;
    this.workspace = workspace;
    this.localMode = false;
    return workspace;
  }
}

function audit(type: AuditEvent["type"]): AuditEvent {
  return { id: crypto.randomUUID(), type, at: new Date().toISOString() };
}

export const vaultService = new VaultService();
