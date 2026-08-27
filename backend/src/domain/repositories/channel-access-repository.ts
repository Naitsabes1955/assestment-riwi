export interface ChannelAccessRepository {
  userHasChannelAccess(userId: string, channelId: string): Promise<boolean>;
}