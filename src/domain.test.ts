import { describe, expect, it } from "vitest";
import { assertWorkspace, createWorkspace } from "./domain";

describe("modèle du workspace", () => {
  it("normalise les champs et crée un profil local", () => {
    const workspace = createWorkspace("  Coffre pilote  ", "  Mme Martin  ", "granted");
    expect(workspace.label).toBe("Coffre pilote");
    expect(workspace.profile.displayName).toBe("Mme Martin");
    expect(() => assertWorkspace(workspace)).not.toThrow();
  });

  it("refuse une future version de schéma", () => {
    const workspace = { ...createWorkspace("Coffre", "Pro", "unknown"), schemaVersion: 2 };
    expect(() => assertWorkspace(workspace)).toThrow("Version de données non prise en charge");
  });
});
