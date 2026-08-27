import type { ChannelAccessRepository } from "@/src/domain/repositories/channel-access-repository";

export interface CheckChannelAccessInput {
  readonly userId: string;
  readonly channelId: string;
}

export class CheckChannelAccess {
  public constructor(private readonly access: ChannelAccessRepository) {}

  execute(input: CheckChannelAccessInput): Promise<boolean> {
    return this.access.userHasChannelAccess(input.userId, input.channelId);
  }
}