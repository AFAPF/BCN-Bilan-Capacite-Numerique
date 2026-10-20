import { describe, expect, it } from "vitest";
import { createVaultMaterial, decryptJson, encryptJson, sha256, unlockVaultMaterial } from "./crypto";

describe("coffre chiffré", () => {
  it("chiffre et déchiffre un état avec la clé de données", async () => {
    const material = await createVaultMaterial("une phrase secrète de test", 100_000);
    const clear = { firstName: "Camille", count: 4 };
    const encrypted = await encryptJson(clear, material.dataKey);
    expect(encrypted.data).not.toContain("Camille");
    await expect(decryptJson(encrypted, material.dataKey)).resolves.toEqual(clear);
  });

  it("retrouve la clé uniquement avec la bonne phrase", async () => {
    const material = await createVaultMaterial("la phrase secrète correcte", 100_000);
    const unlocked = await unlockVaultMaterial("la phrase secrète correcte", material.config);
    const encrypted = await encryptJson({ ok: true }, material.dataKey);
    await expect(decryptJson(encrypted, unlocked)).resolves.toEqual({ ok: true });
    await expect(unlockVaultMaterial("une phrase vraiment incorrecte", material.config)).rejects.toThrow();
  });

  it("produit une empreinte stable et sensible aux modifications", async () => {
    expect(await sha256("contenu")).toBe(await sha256("contenu"));
    expect(await sha256("contenu")).not.toBe(await sha256("contenu modifié"));
  });
});
