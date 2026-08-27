import { application } from "@/src/presentation/api/container";
import { handleRequest, jsonResponse, parseLimit } from "@/src/presentation/api/http";
import { requireUser } from "@/src/presentation/api/request-auth";

export async function GET(request: Request) {
  return handleRequest(request, async () => {
    await requireUser(request);
    const url = new URL(request.url);
    return jsonResponse(await application.getUsers.execute({
      limit: parseLimit(url.searchParams.get("limit"), 20),
    }));
  });
}
