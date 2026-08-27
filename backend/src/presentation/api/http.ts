import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { z } from "zod";

export class HttpError extends Error {
  public constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
  }
}

export function jsonResponse<T>(data: T, status = 200): NextResponse<T> {
  return NextResponse.json(data, { status });
}

export async function handleRequest(
  request: Request,
  operation: () => Promise<Response>,
): Promise<Response> {
  const correlationId = getCorrelationId(request);

  try {
    return withCorrelationId(await operation(), correlationId);
  } catch (error) {
    return withCorrelationId(
      handleHttpError(
      error instanceof Error ? error : new Error("Unexpected error"),
        correlationId,
      ),
      correlationId,
    );
  }
}

function getCorrelationId(request: Request): string {
  const value = request.headers.get("x-correlation-id");
  return value && z.string().uuid().safeParse(value).success ? value : randomUUID();
}

function withCorrelationId(response: Response, correlationId: string): Response {
  response.headers.set("x-correlation-id", correlationId);
  return response;
}

export function handleHttpError(
  error: Error | z.ZodError,
  correlationId: string,
): NextResponse {
  if (error instanceof HttpError) {
    return NextResponse.json(
      { error: { code: error.code, message: error.message, correlationId } },
      { status: error.status },
    );
  }

  if (error instanceof z.ZodError) {
    return NextResponse.json(
      {
        error: {
          code: "INVALID_REQUEST",
          message: error.issues.map((issue) => issue.message).join("; "),
          correlationId,
        },
      },
      { status: 400 },
    );
  }

  if (error.message === "Missing bearer token" || error.message === "Invalid token") {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Authentication is required", correlationId } },
      { status: 401 },
    );
  }

  if (error.message === "Invalid email or password") {
    return NextResponse.json(
      { error: { code: "INVALID_CREDENTIALS", message: error.message, correlationId } },
      { status: 401 },
    );
  }

  if (error.message === "Invalid refresh token") {
    return NextResponse.json(
      { error: { code: "INVALID_REFRESH_TOKEN", message: error.message, correlationId } },
      { status: 401 },
    );
  }

  if (error.message === "Email is already registered") {
    return NextResponse.json(
      { error: { code: "EMAIL_ALREADY_REGISTERED", message: error.message, correlationId } },
      { status: 409 },
    );
  }

  if (error.message === "User does not have access to this channel") {
    return NextResponse.json(
      { error: { code: "CHANNEL_ACCESS_DENIED", message: error.message, correlationId } },
      { status: 403 },
    );
  }

  if (error.message === "Message not found" || error.message === "User not found") {
    return NextResponse.json(
      { error: { code: "RESOURCE_NOT_FOUND", message: error.message, correlationId } },
      { status: 404 },
    );
  }

  console.error(error.message);
  return NextResponse.json(
    { error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred", correlationId } },
    { status: 500 },
  );
}

export function parseUuid(value: string, field: string): string {
  const result = z.string().uuid().safeParse(value);

  if (!result.success) {
    throw new HttpError(400, "INVALID_PARAMETER", `${field} must be a valid UUID`);
  }

  return result.data;
}

export function parseLimit(value: string | null, defaultValue: number): number {
  const result = z.coerce.number().int().min(1).max(100).safeParse(value ?? defaultValue);

  if (!result.success) {
    throw new HttpError(400, "INVALID_LIMIT", "limit must be between 1 and 100");
  }

  return result.data;
}