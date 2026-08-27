import type {
  MessageRepository,
  SearchMessageRecord,
} from "@/src/domain/repositories/message-repository";

export interface SearchMessagesInput {
  readonly userId: string;
  readonly searchTerm: string;
  readonly limit: number;
}

export class SearchMessages {
  public constructor(private readonly messages: MessageRepository) {}

  execute(
    input: SearchMessagesInput,
  ): Promise<readonly SearchMessageRecord[]> {
    return this.messages.searchMessages(
      input.userId,
      input.searchTerm,
      input.limit,
    );
  }
}