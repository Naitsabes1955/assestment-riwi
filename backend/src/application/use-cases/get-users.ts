import type {
  UserRecord,
  UserRepository,
} from "@/src/domain/repositories/user-repository";

export interface GetUsersInput {
  readonly limit: number;
}

export class GetUsers {
  public constructor(private readonly users: UserRepository) {}

  execute(input: GetUsersInput): Promise<readonly UserRecord[]> {
    return this.users.getUsers(input.limit);
  }
}