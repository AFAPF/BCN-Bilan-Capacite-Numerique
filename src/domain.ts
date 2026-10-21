export const SCHEMA_VERSION = 2 as const;
export const APP_VERSION = "0.4.0";

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
  participants: Participant[];
  assessments: Assessment[];
}

export type SchoolLevel = "CM1" | "CM2" | "6E" | "5E" | "4E" | "3E";
export type TaskCode = "typing_copy" | "pointing_click" | "pointing_double" | "pointing_drag" | "visual_search" | "keyboard_shortcuts" | "file_management" | "comprehension" | "navigation";

export interface Participant {
  id: string;
  firstName: string;
  lastName: string;
  schoolLevel: SchoolLevel;
  ageYears: number;
  ageMonths: number;
  createdAt: string;
}

export interface ItemResult {
  success: boolean;
  durationMs: number;
  failureReason?: string;
}

export interface TaskResult {
  taskCode: TaskCode;
  completedAt: string;
  items: ItemResult[];
  metrics: Record<string, number | string>;
}

export interface Assessment {
  id: string;
  participantId: string;
  status: "draft" | "active" | "completed";
  selectedTasks: TaskCode[];
  results: TaskResult[];
  createdAt: string;
  completedAt: string | null;
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
    participants: [],
    assessments: [],
  };
}

export function assertWorkspace(value: unknown): asserts value is Workspace {
  if (!value || typeof value !== "object") throw new Error("État du coffre invalide.");
  const candidate = value as Partial<Workspace>;
  if (candidate.schemaVersion !== SCHEMA_VERSION) throw new Error("Version de données non prise en charge.");
  if (typeof candidate.id !== "string" || typeof candidate.label !== "string") throw new Error("Coffre incomplet.");
  if (!candidate.profile || typeof candidate.profile.displayName !== "string") throw new Error("Profil professionnel invalide.");
  if (!Array.isArray(candidate.audit)) throw new Error("Journal local invalide.");
  if (!Array.isArray(candidate.participants) || !Array.isArray(candidate.assessments)) throw new Error("Données métier invalides.");
}

export function migrateWorkspace(value: unknown): Workspace {
  if (!value || typeof value !== "object") throw new Error("État du coffre invalide.");
  const candidate = value as Record<string, unknown>;
  if (candidate.schemaVersion === 1) {
    candidate.schemaVersion = SCHEMA_VERSION;
    candidate.appVersion = APP_VERSION;
    candidate.participants = [];
    candidate.assessments = [];
  }
  assertWorkspace(candidate);
  return candidate;
}

function normalizeRequired(value: string, maximum: number, label: string): string {
  const normalized = value.trim().normalize("NFC");
  if (normalized.length < 1 || normalized.length > maximum) {
    throw new Error(`${label} : entre 1 et ${maximum} caractères.`);
  }
  return normalized;
}
