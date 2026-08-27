import type {
  ChannelRecord,
  ChannelRepository,
} from "@/src/domain/repositories/channel-repository";

import { database } from "./postgres-repository";

export class PostgresChannelRepository implements ChannelRepository {
  async getUserChannels(userId: string): Promise<readonly ChannelRecord[]> {
    return database.transactionAs(userId, (transaction) =>
      transaction.query<ChannelRecord>(
        `
          SELECT channel_id, channel_name, channel_created_at
          FROM rw.user_conversations
          WHERE user_id = $1
          ORDER BY channel_created_at DESC, channel_id DESC
        `,
        [userId],
      ),
    );
  }
}
