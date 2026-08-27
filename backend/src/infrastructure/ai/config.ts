export interface GeminiConfig {
  readonly apiKey: string;
  readonly model: string;
}

export function loadGeminiConfig(
  environment: NodeJS.ProcessEnv = process.env,
): GeminiConfig {
  if ((environment.AI_PROVIDER ?? "gemini").toLowerCase() !== "gemini") {
    throw new Error("AI_PROVIDER must be gemini");
  }

  const apiKey = environment.AI_API_KEY;

  if (!apiKey) {
    throw new Error("Missing required environment variable: AI_API_KEY");
  }

  return {
    apiKey,
    model: environment.GEMINI_MODEL ?? "gemini-2.0-flash",
  };
}