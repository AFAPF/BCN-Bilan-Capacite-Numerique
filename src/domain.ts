export const SCHEMA_VERSION = 1 as const;
export const APP_VERSION = "0.1.0";

export type PersistenceStatus = "granted" | "denied" | "unknown";

export interface AuditEvent {
  id: string;
  type: "vault_created" | "vault_unlocked" | "vault_locked" | "backup_created" | "backup_restored";
  at: string;
}

export interface ProfessionalProfile {
  id: string;
  displayName: string;
  role: "local_admin";
  active: true;
  createdAt: string;
  lastLoginAt: string;
}

export interface Workspace {
  id: string;
  label: string;
  schemaVersion: typeof SCHEMA_VERSION;
  appVersion: string;
  createdAt: string;
  updatedAt: string;
  lastOpenedAt: string;
  retentionPolicyVersion: "experimental-v1";
  storagePersistence: PersistenceStatus;
  lastBackupAt: string | null;
  lastBackupHash: string | null;
  profile: ProfessionalProfile;
  audit: AuditEvent[];
}

export function createWorkspace(label: string, displayName: string, persistence: PersistenceStatus): Workspace {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    label: normalizeRequired(label, 80, "Nom du coffre"),
    schemaVersion: SCHEMA_VERSION,
    appVersion: APP_VERSION,
    createdAt: now,
    updatedAt: now,
    lastOpenedAt: now,
    retentionPolicyVersion: "experimental-v1",
    storagePersistence: persistence,
    lastBackupAt: null,
    lastBackupHash: null,
    profile: {
      id: crypto.randomUUID(),
      displayName: normalizeRequired(displayName, 80, "Nom professionnel"),
      role: "local_admin",
      active: true,
      createdAt: now,
      lastLoginAt: now,
    },
    audit: [{ id: crypto.randomUUID(), type: "vault_created", at: now }],
  };
}

export function assertWorkspace(value: unknown): asserts value is Workspace {
  if (!value || typeof value !== "object") throw new Error("État du coffre invalide.");
  const candidate = value as Partial<Workspace>;
  if (candidate.schemaVersion !== SCHEMA_VERSION) throw new Error("Version de données non prise en charge.");
  if (typeof candidate.id !== "string" || typeof candidate.label !== "string") throw new Error("Coffre incomplet.");
  if (!candidate.profile || typeof candidate.profile.displayName !== "string") throw new Error("Profil professionnel invalide.");
  if (!Array.isArray(candidate.audit)) throw new Error("Journal local invalide.");
}

function normalizeRequired(value: string, maximum: number, label: string): string {
  const normalized = value.trim().normalize("NFC");
  if (normalized.length < 1 || normalized.length > maximum) {
    throw new Error(`${label} : entre 1 et ${maximum} caractères.`);
  }
  return normalized;
}
