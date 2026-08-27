import bcrypt from "bcryptjs";

import type { PasswordHasher } from "@/src/domain/repositories/password-hasher";

export class BcryptPasswordHasher implements PasswordHasher {
  public constructor(private readonly rounds: number) {}

  hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.rounds);
  }

  compare(password: string, passwordHash: string): Promise<boolean> {
    return bcrypt.compare(password, passwordHash);
  }
}