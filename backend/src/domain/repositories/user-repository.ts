import type { DatabaseRow } from "./database";

export interface UserRecord extends DatabaseRow {
  readonly id: string;
  readonly first_name: string;
  readonly last_name: string;
  readonly email: string;
  readonly job_title: string;
  readonly status: string;
  readonly created_at: Date;
}

export interface UserRepository {
  getUsers(limit: number): Promise<readonly UserRecord[]>;

  updateUser(
    userId: string,
    name: string,
    jobTitle: string,
    status: string,
  ): Promise<void>;

  deleteUser(userId: string): Promise<void>;
}