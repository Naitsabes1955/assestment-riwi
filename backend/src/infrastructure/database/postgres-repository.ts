import type {
  DatabaseExecutor,
  DatabaseRow,
  DatabaseTransaction,
  SqlValue,
} from "@/src/domain/repositories/database";

import { postgresPool } from "./pool";

class PostgresTransaction implements DatabaseTransaction {
  public constructor(private readonly client: import("pg").PoolClient) {}

  async query<T extends DatabaseRow>(
    sql: string,
    values: readonly SqlValue[] = [],
  ): Promise<readonly T[]> {
    const result = await this.client.query<T>(sql, [...values]);
    return result.rows;
  }
}

export class PostgresRepository implements DatabaseExecutor {
  async query<T extends DatabaseRow>(
    sql: string,
    values: readonly SqlValue[] = [],
  ): Promise<readonly T[]> {
    const result = await postgresPool.query<T>(sql, [...values]);
    return result.rows;
  }

  async transaction<T>(
    operation: (transaction: DatabaseTransaction) => Promise<T>,
  ): Promise<T> {
    return this.runTransaction(undefined, operation);
  }

  async transactionAs<T>(
    actorId: string,
    operation: (transaction: DatabaseTransaction) => Promise<T>,
  ): Promise<T> {
    return this.runTransaction(actorId, operation);
  }

  private async runTransaction<T>(
    actorId: string | undefined,
    operation: (transaction: DatabaseTransaction) => Promise<T>,
  ): Promise<T> {
    const client = await postgresPool.connect();

    try {
      await client.query("BEGIN");

      if (actorId) {
        await client.query(
          "SELECT set_config('app.current_user_id', $1, true)",
          [actorId],
        );
      }

      const result = await operation(new PostgresTransaction(client));
      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}

export const database = new PostgresRepository();
