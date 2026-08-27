export interface TokenHashService {
  hash(token: string): string;
}