import { application } from "@/src/presentation/api/container";
import { handleRequest, jsonResponse } from "@/src/presentation/api/http";
import { requireUser } from "@/src/presentation/api/request-auth";

function publicChannel(channel: {
  readonly channel_id: string;
  readonly channel_name: string;
  readonly channel_created_at: Date;
}) {
  return {
    id: channel.channel_id,
    name: channel.channel_name,
    createdAt: channel.channel_created_at,
  };
}

export async function GET(request: Request) {
  return handleRequest(request, async () => {
    const userId = await requireUser(request);
    const channels = await application.getUserChannels.execute({ userId });
    return jsonResponse(channels.map(publicChannel));
  });
}
