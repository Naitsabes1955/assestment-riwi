import type { DatabaseRow } from "./database";

export interface ChannelRecord extends DatabaseRow {
  readonly channel_id: string;
  readonly channel_name: string;
  readonly channel_created_at: Date;
}

export interface ChannelRepository {
  getUserChannels(userId: string): Promise<readonly ChannelRecord[]>;
}
