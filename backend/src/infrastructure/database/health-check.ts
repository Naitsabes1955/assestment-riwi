import { database } from "./postgres-repository";
import type { SqlValue } from "@/src/domain/repositories/database";

export interface DatabaseHealth {
  [column: string]: SqlValue;
  databaseName: string;
  schemaName: string;
}

export async function checkDatabaseConnection(): Promise<DatabaseHealth> {
  const rows = await database.query<DatabaseHealth>(
    "SELECT current_database() AS \"databaseName\", current_schema() AS \"schemaName\"",
  );
  const health = rows[0];

  if (!health) {
    throw new Error("Database health check returned no rows");
  }

  return health;
}
