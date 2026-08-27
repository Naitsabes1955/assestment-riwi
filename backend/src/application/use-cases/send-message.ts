import type { MessageRecord, MessageRepository } from "@/src/domain/repositories/message-repository";

export interface SendMessageInput {
  readonly userId: string;
  readonly channelId: string;
  readonly content: string;
}

export class SendMessage {
  public constructor(private readonly messages: MessageRepository) {}

  execute(input: SendMessageInput): Promise<MessageRecord> {
    return this.messages.sendMessage(
      input.userId,
      input.channelId,
      input.content,
    );
  }
}