export type Locale = "es" | "en";

export interface User {
  readonly id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly jobTitle: string;
  readonly status: string;
}

export interface AuthSession {
  readonly user: User;
  readonly accessToken: string;
  readonly refreshToken: string;
}

export interface Channel {
  readonly id: string;
  readonly name: string;
  readonly createdAt: string;
}

export interface Message {
  readonly id: string;
  readonly channelId: string;
  readonly senderId: string;
  readonly content: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly deletedAt: string | null;
}

export interface SearchResult {
  readonly message_id: string;
  readonly channel_id: string;
  readonly sender_id: string;
  readonly content: string;
  readonly highlighted_content: string;
  readonly created_at: string;
}

export interface AssistantResponse {
  readonly answer: string;
  readonly contextMessageIds: readonly string[];
}

export interface LoginInput {
  readonly email: string;
  readonly password: string;
}

export interface RegisterInput {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly password: string;
  readonly jobTitle: string;
}
