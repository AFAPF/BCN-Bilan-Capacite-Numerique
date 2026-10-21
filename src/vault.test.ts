import "fake-indexeddb/auto";
import { beforeEach, describe, expect, it } from "vitest";
import { vaultExists, workspaceExists } from "./storage";
import { vaultService } from "./vault";

async function clearDatabase(): Promise<void> {
  if (vaultService.current) await vaultService.lock();
  await new Promise<void>((resolve, reject) => {
    const request = indexedDB.deleteDatabase("bcn-local-vault");
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error("Suppression de la base de test bloquée."));
  });
}

describe("cycle de vie du coffre local", () => {
  beforeEach(clearDatabase);

  it("crée, verrouille, déverrouille, sauvegarde et restaure", async () => {
    const password = "phrase secrète assez longue";
    const created = await vaultService.create(password, "Poste test", "Professionnel test", "granted");
    expect(created.profile.displayName).toBe("Professionnel test");

    await vaultService.lock();
    await expect(vaultService.unlock("phrase incorrecte et longue")).rejects.toThrow("Phrase secrète incorrecte");
    const unlocked = await vaultService.unlock(password);
    expect(unlocked.label).toBe("Poste test");

    const backup = await vaultService.exportBackup();
    expect(backup.json).not.toContain("Professionnel test");
    const restored = await vaultService.restoreBackup(backup.json, password);
    expect(restored.profile.displayName).toBe("Professionnel test");
    expect(restored.audit.at(-1)?.type).toBe("backup_restored");
  }, 20_000);

  it("migre l’ancien coffre vers l’accès local sans perdre les données", async () => {
    const previousPassword = "ancienne phrase secrète locale";
    const created = await vaultService.create(previousPassword, "Poste existant", "FOURCADE Arnaud", "granted");
    created.participants.push({ id: crypto.randomUUID(), firstName: "Élève", lastName: "Test", schoolLevel: "CM2", ageYears: 10, ageMonths: 4, createdAt: new Date().toISOString() });
    await vaultService.save();

    await vaultService.lock();
    const migrated = await vaultService.migrateToLocal(previousPassword);
    expect(migrated.participants).toHaveLength(1);
    expect(await workspaceExists()).toBe(true);
    expect(await vaultExists()).toBe(false);

    await vaultService.lock();
    const reopened = await vaultService.openLocal();
    expect(reopened.participants[0]?.firstName).toBe("Élève");
  }, 20_000);
});
