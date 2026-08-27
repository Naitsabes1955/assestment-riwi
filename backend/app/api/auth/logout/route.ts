import { application } from "@/src/presentation/api/container";
import { handleRequest } from "@/src/presentation/api/http";

export async function POST(request: Request) {
  return handleRequest(request, async () => {
    await application.logout.execute(await request.json());
    return new Response(null, { status: 204 });
  });
}