import { z } from "zod";

import type { AuthRepository } from "@/src/domain/repositories/auth-repository";
import type { TokenHashService } from "@/src/domain/repositories/token-hash-service";

const logoutSchema = z.object({
  refreshToken: z.string().min(1),
});

export type LogoutInput = z.infer<typeof logoutSchema>;

export class Logout {
  public constructor(
    private readonly auth: AuthRepository,
    private readonly tokenHashes: TokenHashService,
  ) {}

  async execute(input: LogoutInput): Promise<boolean> {
    const data = logoutSchema.parse(input);
    return this.auth.revokeRefreshToken(this.tokenHashes.hash(data.refreshToken));
  }
}