export const DEFAULT_PBKDF2_ITERATIONS = 600_000;
const encoder = new TextEncoder();
const decoder = new TextDecoder();

export interface CipherText {
  iv: string;
  data: string;
}

export interface VaultConfig {
  format: "bcn-vault";
  version: 1;
  salt: string;
  iterations: number;
  wrappedDataKey: CipherText;
  createdAt: string;
}

export interface VaultMaterial {
  config: VaultConfig;
  dataKey: CryptoKey;
}

export async function createVaultMaterial(password: string, iterations = DEFAULT_PBKDF2_ITERATIONS): Promise<VaultMaterial> {
  validatePassword(password);
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const dataKeyBytes = crypto.getRandomValues(new Uint8Array(32));
  const dataKey = await crypto.subtle.importKey("raw", dataKeyBytes, { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
  const wrappingKey = await deriveWrappingKey(password, salt, iterations);
  const wrappedDataKey = await encryptBytes(dataKeyBytes, wrappingKey, "bcn:vault-key:v1");
  dataKeyBytes.fill(0);
  return {
    dataKey,
    config: {
      format: "bcn-vault",
      version: 1,
      salt: toBase64(salt),
      iterations,
      wrappedDataKey,
      createdAt: new Date().toISOString(),
    },
  };
}

export async function unlockVaultMaterial(password: string, config: VaultConfig): Promise<CryptoKey> {
  validateConfig(config);
  const wrappingKey = await deriveWrappingKey(password, fromBase64(config.salt), config.iterations);
  const raw = await decryptBytes(config.wrappedDataKey, wrappingKey, "bcn:vault-key:v1");
  try {
    return await crypto.subtle.importKey("raw", asBuffer(raw), { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
  } finally {
    raw.fill(0);
  }
}

export async function encryptJson(value: unknown, key: CryptoKey): Promise<CipherText> {
  return encryptBytes(encoder.encode(JSON.stringify(value)), key, "bcn:vault-state:v1");
}

export async function decryptJson(cipher: CipherText, key: CryptoKey): Promise<unknown> {
  const clear = await decryptBytes(cipher, key, "bcn:vault-state:v1");
  try {
    return JSON.parse(decoder.decode(clear)) as unknown;
  } finally {
    clear.fill(0);
  }
}

export async function sha256(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  return toBase64(new Uint8Array(digest));
}

export function validatePassword(password: string): void {
  if (password.length < 12) throw new Error("La phrase secrète doit contenir au moins 12 caractères.");
  if (password.length > 256) throw new Error("La phrase secrète est trop longue.");
}

function validateConfig(config: VaultConfig): void {
  if (config.format !== "bcn-vault" || config.version !== 1) throw new Error("Format de coffre non pris en charge.");
  if (!Number.isInteger(config.iterations) || config.iterations < 100_000) throw new Error("Paramètres de chiffrement invalides.");
}

async function deriveWrappingKey(password: string, salt: Uint8Array, iterations: number): Promise<CryptoKey> {
  const material = await crypto.subtle.importKey("raw", encoder.encode(password.normalize("NFC")), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", hash: "SHA-256", salt: asBuffer(salt), iterations },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

async function encryptBytes(value: Uint8Array, key: CryptoKey, context: string): Promise<CipherText> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: asBuffer(iv), additionalData: asBuffer(encoder.encode(context)), tagLength: 128 },
    key,
    asBuffer(value),
  );
  return { iv: toBase64(iv), data: toBase64(new Uint8Array(encrypted)) };
}

async function decryptBytes(cipher: CipherText, key: CryptoKey, context: string): Promise<Uint8Array> {
  const clear = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: asBuffer(fromBase64(cipher.iv)), additionalData: asBuffer(encoder.encode(context)), tagLength: 128 },
    key,
    asBuffer(fromBase64(cipher.data)),
  );
  return new Uint8Array(clear);
}

function asBuffer(value: Uint8Array): ArrayBuffer {
  return value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength) as ArrayBuffer;
}

export function toBase64(value: Uint8Array): string {
  let binary = "";
  for (const byte of value) binary += String.fromCharCode(byte);
  return btoa(binary);
}

export function fromBase64(value: string): Uint8Array {
  const binary = atob(value);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}
