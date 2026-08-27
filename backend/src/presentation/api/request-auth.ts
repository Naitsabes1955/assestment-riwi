import { getAuthenticatedUserId } from "./authenticated-user";
import { HttpError } from "./http";
import { tokenService } from "./container";

export async function requireUser(request: Request): Promise<string> {
  try {
    return await getAuthenticatedUserId(
      request.headers.get("authorization"),
      tokenService,
    );
  } catch {
    throw new HttpError(401, "UNAUTHORIZED", "Authentication is required");
  }
}