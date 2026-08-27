import type {
  MessageCursor,
  MessageRecord,
  MessageRepository,
} from "@/src/domain/repositories/message-repository";

export interface GetChannelMessagesInput {
  readonly userId: string;
  readonly channelId: string;
  readonly cursor: MessageCursor | null;
  readonly limit: number;
}

export class GetChannelMessages {
  public constructor(private readonly messages: MessageRepository) {}

  execute(
    input: GetChannelMessagesInput,
  ): Promise<readonly MessageRecord[]> {
    return this.messages.getChannelMessages(
      input.userId,
      input.channelId,
      input.cursor,
      input.limit,
    );
  }
}