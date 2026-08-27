import type { AuthUserRecord } from "@/src/domain/repositories/auth-repository";

export interface AuthenticatedUser {
  readonly id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly jobTitle: string;
  readonly status: string;
  readonly createdAt: Date;
}

export interface AuthenticationResult {
  readonly user: AuthenticatedUser;
  readonly accessToken: string;
  readonly refreshToken: string;
}

export function toAuthenticatedUser(user: AuthUserRecord): AuthenticatedUser {
  return {
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    jobTitle: user.job_title,
    status: user.status,
    createdAt: user.created_at,
  };
}