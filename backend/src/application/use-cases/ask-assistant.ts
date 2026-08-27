import { z } from "zod";

import type { AiProvider } from "@/src/domain/repositories/ai-provider";
import type { CopilotContextRecord } from "@/src/domain/repositories/message-repository";

import type { GetCopilotContext } from "./get-copilot-context";

const askAssistantSchema = z.object({
  userId: z.string().uuid(),
  channelId: z.string().uuid(),
  message: z.string().trim().min(1).max(4000),
  limit: z.number().int().min(1).max(50).default(10),
});

export type AskAssistantInput = z.input<typeof askAssistantSchema>;

export interface AskAssistantResult {
  readonly answer: string;
  readonly contextMessageIds: readonly string[];
}

export class AskAssistant {
  public constructor(
    private readonly context: GetCopilotContext,
    private readonly ai: AiProvider,
  ) {}

  async execute(input: AskAssistantInput): Promise<AskAssistantResult> {
    const data = askAssistantSchema.parse(input);
    const contextRows = await this.context.execute({
      userId: data.userId,
      searchTerm: data.message,
      limit: data.limit,
    });
    const channelRows = contextRows.filter(
      (row) => row.channel_id === data.channelId,
    );
    const response = await this.ai.generateResponse({
      question: data.message,
      context: formatContext(channelRows),
    });

    return {
      answer: response.text,
      contextMessageIds: channelRows.map((row) => row.message_id),
    };
  }
}

function formatContext(rows: readonly CopilotContextRecord[]): string {
  if (rows.length === 0) {
    return "No relevant messages were found in this channel.";
  }

  return rows
    .map(
      (row) =>
        `[message:${row.message_id}] [${row.created_at.toISOString()}] ${row.content}`,
    )
    .join("\n");
}