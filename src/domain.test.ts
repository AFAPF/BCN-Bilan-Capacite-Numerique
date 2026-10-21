import { describe, expect, it } from "vitest";
import { assertWorkspace, createWorkspace, migrateWorkspace } from "./domain";

describe("modèle du workspace", () => {
  it("normalise les champs et crée un profil local", () => {
    const workspace = createWorkspace("  Coffre pilote  ", "  Mme Martin  ", "granted");
    expect(workspace.label).toBe("Coffre pilote");
    expect(workspace.profile.displayName).toBe("Mme Martin");
    expect(() => assertWorkspace(workspace)).not.toThrow();
  });

  it("refuse une future version de schéma", () => {
    const workspace = { ...createWorkspace("Coffre", "Pro", "unknown"), schemaVersion: 3 };
    expect(() => assertWorkspace(workspace)).toThrow("Version de données non prise en charge");
  });

  it("migre un coffre existant sans perdre son profil", () => {
    const previous = createWorkspace("Ancien coffre", "Mme Test", "granted") as unknown as Record<string, unknown>;
    previous.schemaVersion = 1;
    delete previous.participants;
    delete previous.assessments;
    const migrated = migrateWorkspace(previous);
    expect(migrated.schemaVersion).toBe(2);
    expect(migrated.profile.displayName).toBe("Mme Test");
    expect(migrated.participants).toEqual([]);
  });
});
