import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const allowedOrigin = process.env.FRONTEND_ORIGIN ?? "http://localhost:3001";
const corsHeaders = {
  "access-control-allow-headers": "authorization, content-type, x-correlation-id",
  "access-control-allow-methods": "GET, POST, PATCH, DELETE, OPTIONS",
  "access-control-allow-origin": allowedOrigin,
};

export function proxy(request: NextRequest) {
  if (request.method === "OPTIONS") {
    return new NextResponse(null, { status: 204, headers: corsHeaders });
  }

  const response = NextResponse.next();

  for (const [header, value] of Object.entries(corsHeaders)) {
    response.headers.set(header, value);
  }

  return response;
}

export const config = {
  matcher: "/api/:path*",
};
