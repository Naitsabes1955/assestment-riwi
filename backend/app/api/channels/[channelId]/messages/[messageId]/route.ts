import { application } from "@/src/presentation/api/container";
import { handleRequest, parseUuid } from "@/src/presentation/api/http";
import { requireUser } from "@/src/presentation/api/request-auth";

interface MessageDeleteRouteContext {
  readonly params: Promise<{ channelId: string; messageId: string }>;
}

export async function DELETE(
  request: Request,
  context: MessageDeleteRouteContext,
) {
  return handleRequest(request, async () => {
    const userId = await requireUser(request);
    const { channelId, messageId } = await context.params;
    parseUuid(channelId, "channelId");
    const deleted = await application.deleteMessage.execute({
      userId,
      messageId: parseUuid(messageId, "messageId"),
    });

    if (!deleted) {
      return new Response(
        JSON.stringify({ error: { code: "MESSAGE_NOT_FOUND", message: "Message not found" } }),
        { status: 404, headers: { "content-type": "application/json" } },
      );
    }

    return new Response(null, { status: 204 });
  });
}