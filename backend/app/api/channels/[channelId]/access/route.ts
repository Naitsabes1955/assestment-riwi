import { application } from "@/src/presentation/api/container";
import { handleRequest, jsonResponse, parseUuid } from "@/src/presentation/api/http";
import { requireUser } from "@/src/presentation/api/request-auth";

interface AccessRouteContext {
  readonly params: Promise<{ channelId: string }>;
}

export async function GET(request: Request, context: AccessRouteContext) {
  return handleRequest(request, async () => {
    const userId = await requireUser(request);
    const { channelId } = await context.params;
    const hasAccess = await application.checkChannelAccess.execute({
      userId,
      channelId: parseUuid(channelId, "channelId"),
    });
    return jsonResponse({ hasAccess });
  });
}