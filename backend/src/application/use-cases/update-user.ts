import type { UserRepository } from "@/src/domain/repositories/user-repository";

export interface UpdateUserInput {
  readonly userId: string;
  readonly name: string;
  readonly jobTitle: string;
  readonly status: string;
}

export class UpdateUser {
  public constructor(private readonly users: UserRepository) {}

  execute(input: UpdateUserInput): Promise<void> {
    return this.users.updateUser(
      input.userId,
      input.name,
      input.jobTitle,
      input.status,
    );
  }
}