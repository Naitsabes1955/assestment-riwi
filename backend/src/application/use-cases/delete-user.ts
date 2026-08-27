import type { UserRepository } from "@/src/domain/repositories/user-repository";

export interface DeleteUserInput {
  readonly userId: string;
}

export class DeleteUser {
  public constructor(private readonly users: UserRepository) {}

  execute(input: DeleteUserInput): Promise<void> {
    return this.users.deleteUser(input.userId);
  }
}