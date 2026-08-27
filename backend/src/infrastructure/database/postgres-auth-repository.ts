import type {
  AuthRepository,
  AuthUserRecord,
  RefreshTokenRecord,
} from "@/src/domain/repositories/auth-repository";
import type { DatabaseRow } from "@/src/domain/repositories/database";

import { database } from "./postgres-repository";

interface RefreshUserRow extends DatabaseRow {
  readonly user_id: string;
}

export class PostgresAuthRepository implements AuthRepository {
  async findUserByEmail(email: string): Promise<AuthUserRecord | null> {
    const rows = await database.query<AuthUserRecord>(
      "SELECT id, first_name, last_name, email, password_hash, job_title, status, created_at FROM rw.rw_users WHERE email = $1 LIMIT 1",
      [email],
    );

    return rows[0] ?? null;
  }

  async findUserById(userId: string): Promise<AuthUserRecord | null> {
    const rows = await database.query<AuthUserRecord>(
      "SELECT id, first_name, last_name, email, password_hash, job_title, status, created_at FROM rw.rw_users WHERE id = $1 LIMIT 1",
      [userId],
    );

    return rows[0] ?? null;
  }

  async createUser(input: {
    readonly firstName: string;
    readonly lastName: string;
    readonly email: string;
    readonly passwordHash: string;
    readonly jobTitle: string;
  }): Promise<AuthUserRecord> {
    const rows = await database.query<AuthUserRecord>(
      "INSERT INTO rw.rw_users (first_name, last_name, email, password_hash, job_title) VALUES ($1, $2, $3, $4, $5) RETURNING id, first_name, last_name, email, password_hash, job_title, status, created_at",
      [
        input.firstName,
        input.lastName,
        input.email,
        input.passwordHash,
        input.jobTitle,
      ],
    );
    const user = rows[0];

    if (!user) {
      throw new Error("User creation returned no rows");
    }

    return user;
  }

  async createRefreshToken(
    userId: string,
    tokenHash: string,
    expiresAt: Date,
  ): Promise<RefreshTokenRecord> {
    const rows = await database.query<RefreshTokenRecord>(
      "INSERT INTO rw.rw_refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3) RETURNING id, user_id, token_hash, expires_at, revoked_at, replaced_by_id, created_at",
      [userId, tokenHash, expiresAt],
    );
    const token = rows[0];

    if (!token) {
      throw new Error("Refresh token creation returned no rows");
    }

    return token;
  }

  async rotateRefreshToken(
    tokenHash: string,
    replacementHash: string,
    replacementExpiresAt: Date,
  ): Promise<{ readonly userId: string; readonly token: RefreshTokenRecord } | null> {
    return database.transaction(async (transaction) => {
      const current = await transaction.query<RefreshUserRow>(
        "SELECT user_id FROM rw.rw_refresh_tokens WHERE token_hash = $1 AND revoked_at IS NULL AND expires_at > CURRENT_TIMESTAMP FOR UPDATE",
        [tokenHash],
      );
      const existing = current[0];

      if (!existing) {
        return null;
      }

      const replacementRows = await transaction.query<RefreshTokenRecord>(
        "INSERT INTO rw.rw_refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3) RETURNING id, user_id, token_hash, expires_at, revoked_at, replaced_by_id, created_at",
        [existing.user_id, replacementHash, replacementExpiresAt],
      );
      const replacement = replacementRows[0];

      if (!replacement) {
        throw new Error("Refresh token rotation returned no rows");
      }

      await transaction.query(
        "UPDATE rw.rw_refresh_tokens SET revoked_at = CURRENT_TIMESTAMP, replaced_by_id = $1 WHERE token_hash = $2 AND revoked_at IS NULL",
        [replacement.id, tokenHash],
      );

      return { userId: existing.user_id, token: replacement };
    });
  }

  async revokeRefreshToken(tokenHash: string): Promise<boolean> {
    const rows = await database.query<{ readonly revoked: boolean } & DatabaseRow>(
      "UPDATE rw.rw_refresh_tokens SET revoked_at = CURRENT_TIMESTAMP WHERE token_hash = $1 AND revoked_at IS NULL RETURNING TRUE AS revoked",
      [tokenHash],
    );

    return rows.length > 0;
  }
}