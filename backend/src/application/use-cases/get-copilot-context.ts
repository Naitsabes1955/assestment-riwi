import type {
  CopilotContextRecord,
  MessageRepository,
} from "@/src/domain/repositories/message-repository";

export interface GetCopilotContextInput {
  readonly userId: string;
  readonly searchTerm: string;
  readonly limit: number;
}

export class GetCopilotContext {
  public constructor(private readonly messages: MessageRepository) {}

  execute(
    input: GetCopilotContextInput,
  ): Promise<readonly CopilotContextRecord[]> {
    return this.messages.getCopilotContext(
      input.userId,
      input.searchTerm,
      input.limit,
    );
  }
}