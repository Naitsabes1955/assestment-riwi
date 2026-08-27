import type { MessageRepository } from "@/src/domain/repositories/message-repository";

export interface DeleteMessageInput {
  readonly userId: string;
  readonly messageId: string;
}

export class DeleteMessage {
  public constructor(private readonly messages: MessageRepository) {}

  execute(input: DeleteMessageInput): Promise<boolean> {
    return this.messages.deleteMessage(input.userId, input.messageId);
  }
}