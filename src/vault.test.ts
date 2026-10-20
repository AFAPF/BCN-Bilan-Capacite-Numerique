import "fake-indexeddb/auto";
import { beforeEach, describe, expect, it } from "vitest";
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
});
