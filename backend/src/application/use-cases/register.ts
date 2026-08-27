import { z } from "zod";

import type { AuthRepository } from "@/src/domain/repositories/auth-repository";
import type { PasswordHasher } from "@/src/domain/repositories/password-hasher";
import type { TokenHashService } from "@/src/domain/repositories/token-hash-service";
import type { TokenService } from "@/src/domain/repositories/token-service";

import {
  type AuthenticationResult,
  toAuthenticatedUser,
} from "./auth-types";

const registerSchema = z.object({
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  password: z.string().min(8).max(128),
  jobTitle: z.string().trim().min(1).max(150),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export class Register {
  public constructor(
    private readonly auth: AuthRepository,
    private readonly passwords: PasswordHasher,
    private readonly tokens: TokenService,
    private readonly tokenHashes: TokenHashService,
  ) {}

  async execute(input: RegisterInput): Promise<AuthenticationResult> {
    const data = registerSchema.parse(input);
    const email = data.email.toLowerCase();
    const existingUser = await this.auth.findUserByEmail(email);

    if (existingUser) {
      throw new Error("Email is already registered");
    }

    const user = await this.auth.createUser({
      firstName: data.firstName,
      lastName: data.lastName,
      email,
      passwordHash: await this.passwords.hash(data.password),
      jobTitle: data.jobTitle,
    });
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