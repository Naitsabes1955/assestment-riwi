import { z } from "zod";

import { application } from "@/src/presentation/api/container";
import { handleRequest, jsonResponse, parseUuid } from "@/src/presentation/api/http";
import { requireUser } from "@/src/presentation/api/request-auth";

const copilotSchema = z.object({
  channelId: z.string().uuid(),
  message: z.string().trim().min(1).max(4000),
});

export async function POST(request: Request) {
  return handleRequest(request, async () => {
    const userId = await requireUser(request);
    const body = copilotSchema.parse(await request.json());
    const result = await application.askAssistant.execute({
      userId,
      channelId: parseUuid(body.channelId, "channelId"),
      message: body.message,
    });

    return jsonResponse(result);
  });
}