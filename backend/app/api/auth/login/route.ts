import { application } from "@/src/presentation/api/container";
import { handleRequest, jsonResponse } from "@/src/presentation/api/http";

export async function POST(request: Request) {
  return handleRequest(request, async () =>
    jsonResponse(await application.login.execute(await request.json())),
  );
}