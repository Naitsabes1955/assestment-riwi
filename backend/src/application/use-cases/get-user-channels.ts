import type {
  ChannelRecord,
  ChannelRepository,
} from "@/src/domain/repositories/channel-repository";

export interface GetUserChannelsInput {
  readonly userId: string;
}

export class GetUserChannels {
  public constructor(private readonly channels: ChannelRepository) {}

  async execute(input: GetUserChannelsInput): Promise<readonly ChannelRecord[]> {
    return this.channels.getUserChannels(input.userId);
  }
}
