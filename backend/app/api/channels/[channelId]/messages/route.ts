import { z } from "zod";

import type { MessageCursor } from "@/src/domain/repositories/message-repository";
import { application } from "@/src/presentation/api/container";
import { handleRequest, jsonResponse, parseLimit, parseUuid } from "@/src/presentation/api/http";
import { requireUser } from "@/src/presentation/api/request-auth";

const sendMessageSchema = z.object({
  content: z.string().trim().min(1),
});

interface MessageRouteContext {
  readonly params: Promise<{ channelId: string }>;
}

function publicMessage(message: {
  readonly id: string;
  readonly channel_id: string;
  readonly sender_id: string;
  readonly content: string;
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly deleted_at: Date | null;
}) {
  return {
    id: message.id,
    channelId: message.channel_id,
    senderId: message.sender_id,
    content: message.content,
    createdAt: message.created_at,
    updatedAt: message.updated_at,
    deletedAt: message.deleted_at,
  };
}

export async function POST(request: Request, context: MessageRouteContext) {
  return handleRequest(request, async () => {
    const userId = await requireUser(request);
    const { channelId } = await context.params;
    const body = sendMessageSchema.parse(await request.json());
    const message = await application.sendMessage.execute({
      userId,
      channelId: parseUuid(channelId, "channelId"),
      content: body.content,
    });
    return jsonResponse(publicMessage(message), 201);
  });
}

export async function GET(request: Request, context: MessageRouteContext) {
  return handleRequest(request, async () => {
    const userId = await requireUser(request);
    const { channelId } = await context.params;
    const url = new URL(request.url);
    const createdAt = url.searchParams.get("cursorCreatedAt");
    const cursorId = url.searchParams.get("cursorId");
    let cursor: MessageCursor | null = null;

    if (createdAt !== null || cursorId !== null) {
      const parsedCursor = z.object({
        createdAt: z.coerce.date(),
        id: z.string().uuid(),
      }).parse({ createdAt, id: cursorId });
      cursor = { createdAt: parsedCursor.createdAt, id: parsedCursor.id };
    }

    const messages = await application.getChannelMessages.execute({
      userId,
      channelId: parseUuid(channelId, "channelId"),
      cursor,
      limit: parseLimit(url.searchParams.get("limit"), 20),
    });
    return jsonResponse(messages.map(publicMessage));
  });
}