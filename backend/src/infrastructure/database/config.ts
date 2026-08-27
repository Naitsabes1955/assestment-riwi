export interface DatabaseConfig {
  databaseUrl: string;
  schema: string;
}

function getRequiredEnvironmentVariable(
  environment: NodeJS.ProcessEnv,
  name: string,
): string {
  const value = environment[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function loadDatabaseConfig(
  environment: NodeJS.ProcessEnv = process.env,
): DatabaseConfig {
  const schema = environment.PG_SCHEMA ?? "rw";
  const databaseUrl = getRequiredEnvironmentVariable(environment, "DATABASE_URL");
  const parsedDatabaseUrl = new URL(databaseUrl);

  if (schema !== "rw") {
    throw new Error("PG_SCHEMA must be rw");
  }

  if (parsedDatabaseUrl.username !== "rw_app") {
    throw new Error("DATABASE_URL must use the rw_app database user");
  }

  return {
    databaseUrl,
    schema,
  };
}
