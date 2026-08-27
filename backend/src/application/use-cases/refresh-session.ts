import { z } from "zod";

import type { AuthRepository } from "@/src/domain/repositories/auth-repository";
import type { TokenHashService } from "@/src/domain/repositories/token-hash-service";
import type { TokenService } from "@/src/domain/repositories/token-service";

const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

export type RefreshSessionInput = z.infer<typeof refreshSchema>;

export interface RefreshSessionResult {
  readonly accessToken: string;
  readonly refreshToken: string;
}

export class RefreshSession {
  public constructor(
    private readonly auth: AuthRepository,
    private readonly tokens: TokenService,
    private readonly tokenHashes: TokenHashService,
  ) {}

  async execute(input: RefreshSessionInput): Promise<RefreshSessionResult> {
    const data = refreshSchema.parse(input);
    const claims = await this.tokens.verifyRefreshToken(data.refreshToken);
    const replacement = await this.tokens.issueRefreshToken(claims.userId);
    const rotated = await this.auth.rotateRefreshToken(
      this.tokenHashes.hash(data.refreshToken),
      this.tokenHashes.hash(replacement.token),
      replacement.expiresAt,
    );

    if (!rotated || rotated.userId !== claims.userId) {
      throw new Error("Invalid refresh token");
    }

    const accessToken = await this.tokens.issueAccessToken(claims.userId);

    return {
      accessToken: accessToken.token,
      refreshToken: replacement.token,
    };
  }
}