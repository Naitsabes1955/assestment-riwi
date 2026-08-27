import { application } from "@/src/presentation/api/container";
import { handleRequest, jsonResponse, parseLimit } from "@/src/presentation/api/http";
import { requireUser } from "@/src/presentation/api/request-auth";
import { z } from "zod";

export async function GET(request: Request) {
  return handleRequest(request, async () => {
    const userId = await requireUser(request);
    const url = new URL(request.url);
    const searchTerm = z.string().trim().min(1).parse(url.searchParams.get("q"));
    const messages = await application.searchMessages.execute({
      userId,
      searchTerm,
      limit: parseLimit(url.searchParams.get("limit"), 20),
    });
    return jsonResponse(messages);
  });
}