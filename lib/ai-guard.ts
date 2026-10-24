/**
 * AI Security & Prompt Injection Guardrails
 * Defends against prompt injection, jailbreaks, data exfiltration, and resource abuse.
 */

// Heuristic patterns for prompt injection & system prompt override attempts
const JAILBREAK_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+(instructions|prompts|directions)/i,
  /disregard\s+(all\s+)?(previous|prior)\s+(instructions|rules)/i,
  /reveal\s+(your\s+)?(system\s+prompt|developer\s+mode|internal\s+instructions)/i,
  /print\s+(the\s+)?(initial|hidden|system)\s+(instructions|prompt)/i,
  /you\s+are\s+now\s+in\s+(developer|dan|jailbreak|god|root)\s+mode/i,
  /act\s+as\s+(an\s+unrestricted|a\s+jailbroken|an\s+unfiltered)\s+ai/i,
  /bypass\s+(all\s+)?(content\s+filters|safety\s+guidelines|restrictions)/i,
  /system\s*override\s*:/i,
  /\[system\s+message\]/i,
  /roleplay\s+as\s+an\s+evil/i,
  /do\s+anything\s+now/i,
];

export interface AiPromptValidationResult {
  isSafe: boolean;
  sanitized: string;
  reason?: string;
}

/**
 * Validates and sanitizes user input directed towards AI styling / chat assistants.
 * Strips delimiter-escaping attempts and wraps user content in isolated boundary tags.
 */
export function validateAndSanitizeAiPrompt(
  input: unknown,
  maxChars = 500
): AiPromptValidationResult {
  if (typeof input !== "string" || !input.trim()) {
    return {
      isSafe: false,
      sanitized: "",
      reason: "Prompt cannot be empty.",
    };
  }

  // 1. Check max character limit to prevent token flood attacks
  if (input.length > maxChars) {
    return {
      isSafe: false,
      sanitized: "",
      reason: `Prompt exceeds maximum allowed length of ${maxChars} characters.`,
    };
  }

  const raw = input.trim();

  // 2. Scan for jailbreak / prompt injection signatures
  for (const pattern of JAILBREAK_PATTERNS) {
    if (pattern.test(raw)) {
      return {
        isSafe: false,
        sanitized: "",
        reason:
          "Input rejected: Prompt injection or system boundary override detected.",
      };
    }
  }

  // 3. Neutralize fake system/assistant markers and delimiter breakouts
  let cleaned = raw
    .replace(/<\|im_start\|>/gi, "")
    .replace(/<\|im_end\|>/gi, "")
    .replace(/\[INST\]/gi, "")
    .replace(/\[\/INST\]/gi, "")
    .replace(/<<SYS>>/gi, "")
    .replace(/<<\/SYS>>/gi, "")
    .replace(/<system>/gi, "")
    .replace(/<\/system>/gi, "")
    .replace(/<\/?user_inquiry>/gi, "")
    .replace(/[`]{3,}/g, "'''") // Prevent markdown code fence breakout
    .trim();

  // 4. Wrap with safe XML boundary tags to isolate user content from system prompts
  const boundarySafe = `<user_inquiry safe="true">\n${cleaned}\n</user_inquiry>`;

  return {
    isSafe: true,
    sanitized: boundarySafe,
  };
}
