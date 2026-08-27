export type SqlValue = string | number | boolean | Date | null;

export interface DatabaseRow {
  readonly [column: string]: SqlValue;
}

export interface DatabaseTransaction {
  query<T extends DatabaseRow>(
    sql: string,
    values?: readonly SqlValue[],
  ): Promise<readonly T[]>;
}

export interface DatabaseExecutor {
  query<T extends DatabaseRow>(
    sql: string,
    values?: readonly SqlValue[],
  ): Promise<readonly T[]>;

  transaction<T>(
    operation: (transaction: DatabaseTransaction) => Promise<T>,
  ): Promise<T>;

  transactionAs<T>(
    actorId: string,
    operation: (transaction: DatabaseTransaction) => Promise<T>,
  ): Promise<T>;
}
