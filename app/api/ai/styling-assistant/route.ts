import { NextResponse } from "next/server";
import { applyRateLimit } from "@/lib/rate-limit";
import { validateAndSanitizeAiPrompt } from "@/lib/ai-guard";

/**
 * POST /api/ai/styling-assistant
 * Demonstrates enterprise-grade AI defense:
 * 1. AI_HEAVY Rate limiting (max 10 req/min per IP to prevent bill abuse)
 * 2. Prompt injection & jailbreak detection
 * 3. XML boundary isolation
 * 4. Token & character caps
 */
export async function POST(req: Request) {
  // 1. Strict AI Rate Limiting (Prevents bill exhaustion & DDoS)
  const rateLimitResponse = applyRateLimit(req, "AI_HEAVY");
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = await req.json();

    // 2. Validate and sanitize prompt against injection attacks
    const promptValidation = validateAndSanitizeAiPrompt(body?.prompt, 500);

    if (!promptValidation.isSafe) {
      return NextResponse.json(
        {
          success: false,
          error: promptValidation.reason || "Invalid input detected.",
        },
        { status: 400 }
      );
    }

    const { sanitized } = promptValidation;

    // 3. Example AI response with strict system framing
    // In production, `sanitized` is passed to the LLM within strict system constraints
    const responseRecommendations = [
      "For grand weddings: Pure Kanchipuram Silk with traditional peacock and mango zari motifs in royal magenta or emerald green.",
      "For festive celebrations: Lightweight Organza with delicate silver zari and custom handcrafted Aari work blouse.",
      "For modern evening receptions: Designer Georgette saree paired with an intricate beadwork blouse and contemporary silhouette.",
    ];

    return NextResponse.json({
      success: true,
      message: "Styling consultation generated safely with prompt injection guardrails active.",
      isolatedPrompt: sanitized,
      recommendation:
        responseRecommendations[
          Math.floor(Math.random() * responseRecommendations.length)
        ],
    });
  } catch (error: any) {
    console.error("POST /api/ai/styling-assistant error:", error);
    return NextResponse.json(
      { success: false, error: "AI styling service temporarily unavailable." },
      { status: 500 }
    );
  }
}
