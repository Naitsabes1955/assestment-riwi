import { application } from "@/src/presentation/api/container";
import { handleRequest, parseUuid } from "@/src/presentation/api/http";
import { requireUser } from "@/src/presentation/api/request-auth";
import { z } from "zod";

const updateUserSchema = z.object({
  name: z.string().trim().min(1).max(100),
  jobTitle: z.string().trim().min(1).max(150),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

interface UserRouteContext {
  readonly params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, context: UserRouteContext) {
  return handleRequest(request, async () => {
    await requireUser(request);
    const { id } = await context.params;
    const body = updateUserSchema.parse(await request.json());
    await application.updateUser.execute({
      userId: parseUuid(id, "id"),
      ...body,
    });
    return new Response(null, { status: 204 });
  });
}

export async function DELETE(request: Request, context: UserRouteContext) {
  return handleRequest(request, async () => {
    await requireUser(request);
    const { id } = await context.params;
    await application.deleteUser.execute({ userId: parseUuid(id, "id") });
    return new Response(null, { status: 204 });
  });
}