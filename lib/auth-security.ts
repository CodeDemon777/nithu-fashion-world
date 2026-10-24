import crypto from "crypto";

/**
 * Enterprise-grade password hashing and verification using Node.js native crypto.
 * Implements salted scrypt with constant-time equality checks to prevent timing attacks.
 */

const KEY_LENGTH = 64;
const SALT_LENGTH = 16;
const SCRYPT_PREFIX = "scrypt$";

/**
 * Hashes a plaintext password using a cryptographically secure random salt and scrypt
 */
export function hashPassword(password: string): string {
  if (!password || typeof password !== "string") {
    throw new Error("Password must be a non-empty string");
  }

  const salt = crypto.randomBytes(SALT_LENGTH).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, KEY_LENGTH);
  return `${SCRYPT_PREFIX}${salt}$${derivedKey.toString("hex")}`;
}

/**
 * Constant-time password verification supporting salted scrypt hashes
 * Also supports legacy plain text passwords for seamless backward-compatibility
 */
export function verifyPassword(password: string, storedHashOrPlain: string): {
  isValid: boolean;
  needsRehash: boolean;
} {
  if (!password || !storedHashOrPlain) {
    return { isValid: false, needsRehash: false };
  }

  // Case 1: Stored password is an scrypt hash
  if (storedHashOrPlain.startsWith(SCRYPT_PREFIX)) {
    try {
      const parts = storedHashOrPlain.split("$");
      if (parts.length !== 3) {
        return { isValid: false, needsRehash: false };
      }

      const salt = parts[1];
      const originalKey = Buffer.from(parts[2], "hex");
      const currentKey = crypto.scryptSync(password, salt, KEY_LENGTH);

      const isValid =
        originalKey.length === currentKey.length &&
        crypto.timingSafeEqual(originalKey, currentKey);

      return { isValid, needsRehash: false };
    } catch (e) {
      console.error("Password verification error:", e);
      return { isValid: false, needsRehash: false };
    }
  }

  // Case 2: Legacy plain text password - verify using constant time buffer compare
  try {
    const inputBuf = Buffer.from(password);
    const storedBuf = Buffer.from(storedHashOrPlain);

    const isMatch =
      inputBuf.length === storedBuf.length &&
      crypto.timingSafeEqual(inputBuf, storedBuf);

    return { isValid: isMatch, needsRehash: isMatch };
  } catch {
    return { isValid: password === storedHashOrPlain, needsRehash: true };
  }
}
