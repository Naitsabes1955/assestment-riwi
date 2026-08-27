import type { TokenService } from "@/src/domain/repositories/token-service";

export async function getAuthenticatedUserId(
  authorizationHeader: string | null,
  tokens: TokenService,
): Promise<string> {
  if (!authorizationHeader?.startsWith("Bearer ")) {
    throw new Error("Missing bearer token");
  }

  const token = authorizationHeader.slice("Bearer ".length).trim();

  if (!token) {
    throw new Error("Missing bearer token");
  }

  const claims = await tokens.verifyAccessToken(token);
  return claims.userId;
}