import type { ChannelAccessRepository } from "@/src/domain/repositories/channel-access-repository";
import type { DatabaseRow } from "@/src/domain/repositories/database";

import { database } from "./postgres-repository";

interface AccessRow extends DatabaseRow {
  readonly has_access: boolean;
}

export class PostgresChannelAccessRepository
  implements ChannelAccessRepository
{
  async userHasChannelAccess(
    userId: string,
    channelId: string,
  ): Promise<boolean> {
    const rows = await database.query<AccessRow>(
      "SELECT rw.user_has_channel_access($1, $2) AS has_access",
      [userId, channelId],
    );
    const row = rows[0];

    if (!row) {
      throw new Error("Channel access query returned no rows");
    }

    return row.has_access;
  }
}