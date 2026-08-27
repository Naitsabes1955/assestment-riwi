import { Pool } from "pg";

import { loadDatabaseConfig } from "./config";

declare global {
  var postgresPool: Pool | undefined;
}

const config = loadDatabaseConfig();

export const postgresPool =
  globalThis.postgresPool ??
  new Pool({
    connectionString: config.databaseUrl,
    options: `-c search_path=${config.schema},public`,
  });

globalThis.postgresPool = postgresPool;
