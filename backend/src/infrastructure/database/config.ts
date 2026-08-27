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

  if (schema !== "rw") {
    throw new Error("PG_SCHEMA must be rw");
  }

  return {
    databaseUrl: getRequiredEnvironmentVariable(environment, "DATABASE_URL"),
    schema,
  };
}
