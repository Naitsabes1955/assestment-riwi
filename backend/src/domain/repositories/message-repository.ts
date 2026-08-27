import type { DatabaseRow } from "./database";

export interface MessageRecord extends DatabaseRow {
  readonly id: string;
  readonly channel_id: string;
  readonly sender_id: string;
  readonly content: string;
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly deleted_at: Date | null;
  readonly search_vector: string | null;
}

export interface SearchMessageRecord extends DatabaseRow {
  readonly message_id: string;
  readonly channel_id: string;
  readonly sender_id: string;
  readonly content: string;
  readonly highlighted_content: string;
  readonly created_at: Date;
}

export interface CopilotContextRecord extends DatabaseRow {
  readonly message_id: string;
  readonly channel_id: string;
  readonly sender_id: string;
  readonly content: string;
  readonly created_at: Date;
}

export interface MessageCursor {
  readonly createdAt: Date;
  readonly id: string;
}

export interface MessageRepository {
  sendMessage(
    userId: string,
    channelId: string,
    content: string,
  ): Promise<MessageRecord>;

  getChannelMessages(
    userId: string,
    channelId: string,
    cursor: MessageCursor | null,
    limit: number,
  ): Promise<readonly MessageRecord[]>;

  searchMessages(
    userId: string,
    searchTerm: string,
    limit: number,
  ): Promise<readonly SearchMessageRecord[]>;

  getCopilotContext(
    userId: string,
    searchTerm: string,
    limit: number,
  ): Promise<readonly CopilotContextRecord[]>;

  deleteMessage(userId: string, messageId: string): Promise<boolean>;
}