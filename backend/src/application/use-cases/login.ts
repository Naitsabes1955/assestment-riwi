import { z } from "zod";

import type { AuthRepository } from "@/src/domain/repositories/auth-repository";
import type { PasswordHasher } from "@/src/domain/repositories/password-hasher";
import type { TokenHashService } from "@/src/domain/repositories/token-hash-service";
import type { TokenService } from "@/src/domain/repositories/token-service";

import {
  type AuthenticationResult,
  toAuthenticatedUser,
} from "./auth-types";

const loginSchema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(1).max(128),
});

export type LoginInput = z.infer<typeof loginSchema>;

export class Login {
  public constructor(
    private readonly auth: AuthRepository,
    private readonly passwords: PasswordHasher,
    private readonly tokens: TokenService,
    private readonly tokenHashes: TokenHashService,
  ) {}

  async execute(input: LoginInput): Promise<AuthenticationResult> {
    const data = loginSchema.parse(input);
    const user = await this.auth.findUserByEmail(data.email.toLowerCase());

    if (!user || user.status !== "ACTIVE") {
      throw new Error("Invalid email or password");
    }

    const passwordMatches = await this.passwords.compare(
      data.password,
      user.password_hash,
    );

    if (!passwordMatches) {
      throw new Error("Invalid email or password");
    }

    const accessToken = await this.tokens.issueAccessToken(user.id);
    const refreshToken = await this.tokens.issueRefreshToken(user.id);

    await this.auth.createRefreshToken(
      user.id,
      this.tokenHashes.hash(refreshToken.token),
      refreshToken.expiresAt,
    );

    return {
      user: toAuthenticatedUser(user),
      accessToken: accessToken.token,
      refreshToken: refreshToken.token,
    };
  }
}