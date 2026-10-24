/**
 * Input sanitization & validation utility for NITHU FASHION WORLD
 * Guards against:
 * 1. XSS (Cross-Site Scripting)
 * 2. SQL & NoSQL injection ($gt, $ne, $where operator injection)
 * 3. Insecure file uploads & SSRF attacks
 * 4. Prototype pollution
 * 5. Excessive data exposure
 */

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
const PHONE_DIGITS_REGEX = /^\+?[0-9]{10,15}$/;

const ALLOWED_PRODUCT_CATEGORIES = [
  "sarees",
  "blouses",
  "dresses",
  "kids",
  "crafts",
  "gifts",
  "festive",
] as const;

export type AllowedCategory = (typeof ALLOWED_PRODUCT_CATEGORIES)[number];

// Prohibited SSRF hostnames and IP blocks
const BLOCKED_HOSTS = [
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "::1",
  "169.254.169.254", // AWS/GCP/Azure instance metadata
  "metadata.google.internal",
  "10.", // Class A private
  "192.168.", // Class C private
];

/**
 * Recursively sanitizes MongoDB query filters to eliminate NoSQL operator injection.
 * Strips any object key starting with '$' or containing '.' as well as prototype keys.
 */
export function sanitizeMongoQuery<T>(input: T): T {
  if (input === null || typeof input !== "object") {
    return input;
  }

  if (Array.isArray(input)) {
    return input.map((item) => sanitizeMongoQuery(item)) as unknown as T;
  }

  const cleanObj: Record<string, any> = {};
  for (const [key, value] of Object.entries(input)) {
    // Drop prototype pollution attempts
    if (key === "__proto__" || key === "constructor" || key === "prototype") {
      continue;
    }

    // Drop any MongoDB query operator key or path traversal
    if (key.startsWith("$") || key.includes(".")) {
      console.warn(`[NoSQL Injection Guard] Blocked prohibited query key: "${key}"`);
      continue;
    }

    cleanObj[key] = sanitizeMongoQuery(value);
  }

  return cleanObj as T;
}

/**
 * Strips dangerous HTML tags, event handlers, scripts, null bytes, and trims whitespace.
 * Defends against Stored and Reflected XSS.
 */
export function sanitizeString(input: unknown, maxLength = 500): string {
  if (typeof input !== "string") {
    return "";
  }

  // 1. Remove null bytes and unicode controls
  let cleaned = input.replace(/\0/g, "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "");

  // 2. Strip HTML tags and script elements
  cleaned = cleaned.replace(/<[^>]*>?/gm, "");

  // 3. Remove dangerous protocols and inline event handlers
  cleaned = cleaned
    .replace(/javascript\s*:/gi, "")
    .replace(/data\s*:/gi, "")
    .replace(/vbscript\s*:/gi, "")
    .replace(/on\w+\s*=/gi, "");

  // 4. Normalize multiple whitespaces
  cleaned = cleaned.trim().replace(/\s+/g, " ");

  // 5. Enforce max length
  if (cleaned.length > maxLength) {
    cleaned = cleaned.substring(0, maxLength);
  }

  return cleaned;
}

/**
 * Validates image URLs to defend against SSRF and Insecure File Upload / inclusion attacks.
 */
export function validateImageUrl(input: unknown): {
  isValid: boolean;
  value: string;
  error?: string;
} {
  if (typeof input !== "string" || !input.trim()) {
    return {
      isValid: true,
      value: "/images/categories/sarees.jpg",
    };
  }

  const trimmed = input.trim();

  // Allow local static assets under /images/
  if (trimmed.startsWith("/images/") || trimmed.startsWith("/")) {
    if (trimmed.includes("..") || trimmed.includes("//")) {
      return { isValid: false, value: "", error: "Invalid path traversal in image URL." };
    }
    return { isValid: true, value: trimmed };
  }

  // Enforce secure HTTPS for external image hosting
  if (!trimmed.startsWith("https://")) {
    return {
      isValid: false,
      value: "",
      error: "External image URLs must use HTTPS.",
    };
  }

  try {
    const parsed = new URL(trimmed);

    // SSRF Check: Disallow local networks, metadata endpoints, and private IPs
    const hostname = parsed.hostname.toLowerCase();
    for (const blocked of BLOCKED_HOSTS) {
      if (hostname === blocked || hostname.startsWith(blocked)) {
        return {
          isValid: false,
          value: "",
          error: "Prohibited image host: Internal or private addresses not allowed.",
        };
      }
    }

    // Check 172.16.0.0 - 172.31.255.255 range
    if (/^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname)) {
      return {
        isValid: false,
        value: "",
        error: "Prohibited image host: Internal IP range.",
      };
    }

    return { isValid: true, value: parsed.toString() };
  } catch {
    return { isValid: false, value: "", error: "Malformed image URL." };
  }
}

/**
 * Validates and normalizes email address
 */
export function validateEmail(input: unknown): {
  isValid: boolean;
  value?: string;
  error?: string;
} {
  if (typeof input !== "string" || !input.trim()) {
    return { isValid: false, error: "Email address is required." };
  }

  const email = input.trim().toLowerCase();

  if (email.length > 120) {
    return { isValid: false, error: "Email address cannot exceed 120 characters." };
  }

  if (!EMAIL_REGEX.test(email)) {
    return {
      isValid: false,
      error: "Please enter a valid email address (e.g. name@domain.com).",
    };
  }

  return { isValid: true, value: email };
}

/**
 * Validates and sanitizes phone number
 */
export function validatePhone(input: unknown): {
  isValid: boolean;
  value: string;
  error?: string;
} {
  if (!input || typeof input !== "string") {
    return { isValid: true, value: "" };
  }

  const cleaned = input.replace(/[^0-9+]/g, "").trim();

  if (cleaned.length > 0 && !PHONE_DIGITS_REGEX.test(cleaned)) {
    return {
      isValid: false,
      value: "",
      error: "Phone number must contain 10 to 15 digits.",
    };
  }

  return { isValid: true, value: cleaned };
}

/**
 * Validates safe numeric value within min/max bounds
 */
export function validateNumber(
  input: unknown,
  min = 0,
  max = 1_000_000,
  fallback = 0
): number {
  if (typeof input === "number" && !isNaN(input) && isFinite(input)) {
    return Math.min(Math.max(input, min), max);
  }

  if (typeof input === "string") {
    const parsed = parseFloat(input.replace(/[^0-9.-]/g, ""));
    if (!isNaN(parsed) && isFinite(parsed)) {
      return Math.min(Math.max(parsed, min), max);
    }
  }

  return fallback;
}

/**
 * Validates Product input for POST/PUT endpoints
 */
export function validateProductPayload(body: any): {
  isValid: boolean;
  errors: string[];
  sanitized?: {
    name: string;
    category: AllowedCategory;
    categoryLabel: string;
    price: number;
    oldPrice: number;
    discount: number;
    image: string;
    description: string;
    features: string[];
    inStock: boolean;
    isCustomizable: boolean;
  };
} {
  const errors: string[] = [];

  const name = sanitizeString(body?.name, 120);
  if (!name || name.length < 2) {
    errors.push("Product title must be at least 2 characters long.");
  }

  const category = (body?.category || "").toLowerCase();
  if (!ALLOWED_PRODUCT_CATEGORIES.includes(category as AllowedCategory)) {
    errors.push(
      `Category must be one of: ${ALLOWED_PRODUCT_CATEGORIES.join(", ")}.`
    );
  }

  const price = validateNumber(body?.price, 1, 1_000_000, -1);
  if (price <= 0) {
    errors.push("Product price must be greater than ₹0.");
  }

  const oldPrice = validateNumber(body?.oldPrice, 0, 1_000_000, 0);
  const discount = validateNumber(body?.discount, 0, 100, 0);

  // Validate image URL with SSRF protection
  const imageValidation = validateImageUrl(body?.image);
  if (!imageValidation.isValid) {
    errors.push(imageValidation.error || "Invalid product image URL.");
  }
  const image = imageValidation.value || "/images/categories/sarees.jpg";

  const description = sanitizeString(
    body?.description || "Exquisite luxury artisanal craft piece from Nithu Fashion World.",
    1500
  );

  let features: string[] = [];
  if (Array.isArray(body?.features)) {
    features = body.features
      .map((f: unknown) => sanitizeString(f, 100))
      .filter((f: string) => f.length > 0)
      .slice(0, 10);
  } else {
    features = ["Artisan Handcrafted", "Custom Fitting Available"];
  }

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  return {
    isValid: true,
    errors: [],
    sanitized: {
      name,
      category: category as AllowedCategory,
      categoryLabel:
        sanitizeString(body?.categoryLabel, 60) ||
        category.charAt(0).toUpperCase() + category.slice(1),
      price,
      oldPrice,
      discount,
      image,
      description,
      features,
      inStock: Boolean(body?.inStock ?? true),
      isCustomizable: Boolean(body?.isCustomizable ?? true),
    },
  };
}

/**
 * Validates Customer input for Registration/Profile update
 */
export function validateCustomerPayload(
  body: any,
  isUpdate = false
): {
  isValid: boolean;
  errors: string[];
  sanitized?: {
    name: string;
    email: string;
    phone: string;
    password?: string;
    address: string;
    city: string;
    pincode: string;
  };
} {
  const errors: string[] = [];

  const name = sanitizeString(body?.name, 80);
  if (!isUpdate && (!name || name.length < 2)) {
    errors.push("Customer name must be at least 2 characters long.");
  }

  const emailResult = validateEmail(body?.email);
  if (!isUpdate && !emailResult.isValid) {
    errors.push(emailResult.error || "Valid email is required.");
  }

  const phoneResult = validatePhone(body?.phone);
  if (!phoneResult.isValid) {
    errors.push(phoneResult.error || "Invalid phone number format.");
  }

  const address = sanitizeString(body?.address, 250);
  const city = sanitizeString(body?.city, 80) || "Tamil Nadu";
  const pincode = sanitizeString(body?.pincode, 12);

  let password: string | undefined = undefined;
  if (body?.password && typeof body.password === "string") {
    if (body.password.length < 6) {
      errors.push("Password must be at least 6 characters long.");
    } else {
      password = body.password.substring(0, 100);
    }
  }

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  return {
    isValid: true,
    errors: [],
    sanitized: {
      name: name || "Customer",
      email: emailResult.value || "",
      phone: phoneResult.value,
      password,
      address,
      city,
      pincode,
    },
  };
}
