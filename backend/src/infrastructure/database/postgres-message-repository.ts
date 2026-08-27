import type {
  CopilotContextRecord,
  MessageRecord,
  MessageRepository,
  SearchMessageRecord,
} from "@/src/domain/repositories/message-repository";
import type { DatabaseRow } from "@/src/domain/repositories/database";

import { database } from "./postgres-repository";

export class PostgresMessageRepository implements MessageRepository {
  async sendMessage(
    userId: string,
    channelId: string,
    content: string,
  ): Promise<MessageRecord> {
    const rows = await database.transactionAs(userId, (transaction) =>
      transaction.query<MessageRecord>(
        "SELECT * FROM rw.send_message($1, $2, $3)",
        [userId, channelId, content],
      ),
    );
    const message = rows[0];

    if (!message) {
      throw new Error("Send message returned no rows");
    }

    return message;
  }

  async getChannelMessages(
    userId: string,
    channelId: string,
    cursor: { readonly createdAt: Date; readonly id: string } | null,
    limit: number,
  ): Promise<readonly MessageRecord[]> {
    return database.transactionAs(userId, (transaction) =>
      transaction.query<MessageRecord>(
        "SELECT * FROM rw.get_channel_messages($1, $2, $3, $4, $5)",
        [
          userId,
          channelId,
          cursor?.createdAt ?? null,
          cursor?.id ?? null,
          limit,
        ],
      ),
    );
  }

  async searchMessages(
    userId: string,
    searchTerm: string,
    limit: number,
  ): Promise<readonly SearchMessageRecord[]> {
    return database.transactionAs(userId, (transaction) =>
      transaction.query<SearchMessageRecord>(
        "SELECT * FROM rw.search_messages($1, $2, $3)",
        [userId, searchTerm, limit],
      ),
    );
  }

  async getCopilotContext(
    userId: string,
    searchTerm: string,
    limit: number,
  ): Promise<readonly CopilotContextRecord[]> {
    return database.transactionAs(userId, (transaction) =>
      transaction.query<CopilotContextRecord>(
        "SELECT * FROM rw.get_copilot_context($1, $2, $3)",
        [userId, searchTerm, limit],
      ),
    );
  }

  async deleteMessage(userId: string, messageId: string): Promise<boolean> {
    const rows = await database.transactionAs(userId, (transaction) =>
      transaction.query<{ readonly deleted: boolean } & DatabaseRow>(
        "SELECT rw.delete_message($1, $2) AS deleted",
        [userId, messageId],
      ),
    );
    const row = rows[0];

    if (!row) {
      throw new Error("Delete message returned no rows");
    }

    return row.deleted;
  }
}