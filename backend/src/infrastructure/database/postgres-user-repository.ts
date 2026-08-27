import type {
  UserRecord,
  UserRepository,
} from "@/src/domain/repositories/user-repository";

import { database } from "./postgres-repository";

export class PostgresUserRepository implements UserRepository {
  async getUsers(limit: number): Promise<readonly UserRecord[]> {
    return database.transaction(async (transaction) => {
      await transaction.query("CALL rw.get_users($1, 'rw_users_cursor')", [
        limit,
      ]);

      return transaction.query<UserRecord>(
        'FETCH ALL FROM "rw_users_cursor"',
      );
    });
  }

  async updateUser(
    userId: string,
    name: string,
    jobTitle: string,
    status: string,
  ): Promise<void> {
    await database.query(
      "CALL rw.update_user($1, $2, $3, $4)",
      [userId, name, jobTitle, status],
    );
  }

  async deleteUser(userId: string): Promise<void> {
    await database.query("CALL rw.delete_user($1)", [userId]);
  }
}