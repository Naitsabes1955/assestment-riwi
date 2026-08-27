export interface TokenClaims {
  readonly userId: string;
}

export interface IssuedToken {
  readonly token: string;
  readonly expiresAt: Date;
}

export interface TokenService {
  issueAccessToken(userId: string): Promise<IssuedToken>;
  issueRefreshToken(userId: string): Promise<IssuedToken>;
  verifyAccessToken(token: string): Promise<TokenClaims>;
  verifyRefreshToken(token: string): Promise<TokenClaims>;
}