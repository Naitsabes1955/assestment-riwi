import { jwtVerify, SignJWT } from "jose";
import { randomUUID } from "node:crypto";

import type {
  IssuedToken,
  TokenClaims,
  TokenService,
} from "@/src/domain/repositories/token-service";

import type { AuthConfig } from "./config";

type TokenType = "access" | "refresh";

interface JwtClaims {
  readonly sub: string;
  readonly type: TokenType;
}

export class JwtTokenService implements TokenService {
  public constructor(private readonly config: AuthConfig) {}

  issueAccessToken(userId: string): Promise<IssuedToken> {
    return this.issue(userId, "access", this.config.accessSecret, this.config.accessExpiresIn);
  }

  issueRefreshToken(userId: string): Promise<IssuedToken> {
    return this.issue(userId, "refresh", this.config.refreshSecret, this.config.refreshExpiresIn);
  }

  verifyAccessToken(token: string): Promise<TokenClaims> {
    return this.verify(token, "access", this.config.accessSecret);
  }

  verifyRefreshToken(token: string): Promise<TokenClaims> {
    return this.verify(token, "refresh", this.config.refreshSecret);
  }

  private async issue(
    userId: string,
    type: TokenType,
    secret: Uint8Array,
    expiration: string,
  ): Promise<IssuedToken> {
    const expiresAt = new Date(Date.now() + this.expirationMilliseconds(expiration));
    const token = await new SignJWT({ type })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setSubject(userId)
      .setJti(randomUUID())
      .setIssuedAt()
      .setExpirationTime(Math.floor(expiresAt.getTime() / 1000))
      .sign(secret);

    return { token, expiresAt };
  }

  private async verify(
    token: string,
    expectedType: TokenType,
    secret: Uint8Array,
  ): Promise<TokenClaims> {
    const result = await jwtVerify<JwtClaims>(token, secret, {
      algorithms: ["HS256"],
    });
    const subject = result.payload.sub;

    if (!subject || result.payload.type !== expectedType) {
      throw new Error("Invalid token");
    }

    return { userId: subject };
  }

  private expirationMilliseconds(value: string): number {
    const match = /^(\d+)([smhd])$/.exec(value);

    if (!match) {
      throw new Error("JWT expiration must use a value such as 15m or 7d");
    }

    const amount = Number.parseInt(match[1], 10);
    const unit = match[2];
    const multiplier = unit === "s" ? 1000 : unit === "m" ? 60000 : unit === "h" ? 3600000 : 86400000;

    return amount * multiplier;
  }
}