import type { DatabaseRow } from "./database";

export interface AuthUserRecord extends DatabaseRow {
  readonly id: string;
  readonly first_name: string;
  readonly last_name: string;
  readonly email: string;
  readonly password_hash: string;
  readonly job_title: string;
  readonly status: string;
  readonly created_at: Date;
}

export interface RefreshTokenRecord extends DatabaseRow {
  readonly id: string;
  readonly user_id: string;
  readonly token_hash: string;
  readonly expires_at: Date;
  readonly revoked_at: Date | null;
  readonly replaced_by_id: string | null;
  readonly created_at: Date;
}

export interface AuthRepository {
  findUserByEmail(email: string): Promise<AuthUserRecord | null>;

  findUserById(userId: string): Promise<AuthUserRecord | null>;

  createUser(input: {
    readonly firstName: string;
    readonly lastName: string;
    readonly email: string;
    readonly passwordHash: string;
    readonly jobTitle: string;
  }): Promise<AuthUserRecord>;

  createRefreshToken(
    userId: string,
    tokenHash: string,
    expiresAt: Date,
  ): Promise<RefreshTokenRecord>;

  rotateRefreshToken(
    tokenHash: string,
    replacementHash: string,
    replacementExpiresAt: Date,
  ): Promise<{ readonly userId: string; readonly token: RefreshTokenRecord } | null>;

  revokeRefreshToken(tokenHash: string): Promise<boolean>;
}