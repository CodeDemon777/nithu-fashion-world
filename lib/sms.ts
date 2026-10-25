import crypto from "crypto";

interface InMemOtp {
  code: string;
  expiresAt: number;
  attempts: number;
}

// In-memory fallback map (phone -> { code, expiresAt, attempts })
const inMemoryOtpStore = new Map<string, InMemOtp>();

/**
 * Generates a cryptographically secure 6-digit numeric OTP code
 */
export function generateOtp(): string {
  // Generates number between 100000 and 999999
  const n = crypto.randomInt(100000, 1000000);
  return n.toString();
}

/**
 * Saves OTP to memory fallback store (valid for 10 minutes)
 */
export function saveOtpToMemory(phone: string, code: string): void {
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  inMemoryOtpStore.set(cleanPhone, {
    code,
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    attempts: 0,
  });
}

/**
 * Verifies OTP against memory fallback store
 */
export function verifyOtpFromMemory(
  phone: string,
  code: string
): { isValid: boolean; error?: string } {
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  const record = inMemoryOtpStore.get(cleanPhone);

  if (!record) {
    return {
      isValid: false,
      error: "No active verification code found. Please request a new code.",
    };
  }

  if (Date.now() > record.expiresAt) {
    inMemoryOtpStore.delete(cleanPhone);
    return {
      isValid: false,
      error: "Verification code has expired. Please request a new code.",
    };
  }

  if (record.attempts >= 5) {
    inMemoryOtpStore.delete(cleanPhone);
    return {
      isValid: false,
      error: "Too many failed attempts. Please request a new verification code.",
    };
  }

  if (record.code !== code.trim()) {
    record.attempts += 1;
    return {
      isValid: false,
      error: "Incorrect verification code. Please check and try again.",
    };
  }

  // Code is valid: delete from memory to prevent replay attacks
  inMemoryOtpStore.delete(cleanPhone);
  return { isValid: true };
}

/**
 * Dispatches OTP SMS to user's phone number
 */
export async function sendOtpSms(
  phone: string,
  otp: string,
  customerName = "Customer"
): Promise<{ success: boolean; simulated: boolean; previewMessage: string }> {
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  const formattedPhone = cleanPhone.length === 10 ? `+91 ${cleanPhone}` : `+${cleanPhone}`;
  const message = `Hello ${customerName}, your NITHU FASHION WORLD mobile verification code is: ${otp}. Valid for 10 minutes. Please do not share this code with anyone.`;

  console.log(`📱 =======================================================`);
  console.log(`📱 [NITHU FASHION WORLD - SMS GATEWAY]`);
  console.log(`📱 To: ${formattedPhone}`);
  console.log(`📱 Code: [ ${otp} ]`);
  console.log(`📱 Content: "${message}"`);
  console.log(`📱 =======================================================`);

  // Optional: If Fast2SMS or Twilio credentials are in environment, dispatch external SMS
  if (process.env.FAST2SMS_API_KEY && cleanPhone.length === 10) {
    try {
      await fetch("https://www.fast2sms.com/dev/bulkV2", {
        method: "POST",
        headers: {
          authorization: process.env.FAST2SMS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          route: "otp",
          variables_values: otp,
          numbers: cleanPhone,
        }),
      });
    } catch (e) {
      console.warn("Fast2SMS dispatch warning (non-fatal):", e);
    }
  }

  return {
    success: true,
    simulated: true,
    previewMessage: message,
  };
}
