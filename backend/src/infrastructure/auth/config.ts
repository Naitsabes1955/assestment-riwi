export interface AuthConfig {
  readonly accessSecret: Uint8Array;
  readonly refreshSecret: Uint8Array;
  readonly accessExpiresIn: string;
  readonly refreshExpiresIn: string;
  readonly passwordRounds: number;
}

function required(environment: NodeJS.ProcessEnv, name: string): string {
  const value = environment[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function loadAuthConfig(
  environment: NodeJS.ProcessEnv = process.env,
): AuthConfig {
  const roundsText = environment.BCRYPT_ROUNDS ?? "12";
  const passwordRounds = Number.parseInt(roundsText, 10);

  if (!Number.isInteger(passwordRounds) || passwordRounds < 10 || passwordRounds > 31) {
    throw new Error("BCRYPT_ROUNDS must be an integer between 10 and 31");
  }

  return {
    accessSecret: new TextEncoder().encode(required(environment, "JWT_ACCESS_SECRET")),
    refreshSecret: new TextEncoder().encode(required(environment, "JWT_REFRESH_SECRET")),
    accessExpiresIn: environment.JWT_ACCESS_EXPIRES_IN ?? "15m",
    refreshExpiresIn: environment.JWT_REFRESH_EXPIRES_IN ?? "7d",
    passwordRounds,
  };
}