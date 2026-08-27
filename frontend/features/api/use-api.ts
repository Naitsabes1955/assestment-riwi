"use client";

import { useMemo } from "react";
import { ApiHttpClient } from "@/lib/api/client";
import { apiBaseUrl } from "@/lib/config";
import { readStoredSession } from "@/lib/auth/session-storage";
import { useAuth } from "@/features/auth/auth-context";

export function useApiClient(
  sessionExpiredMessage: string,
  apiUnavailableMessage: string,
): ApiHttpClient {
  const auth = useAuth();

  return useMemo(
    () =>
      new ApiHttpClient(
        apiBaseUrl,
        readStoredSession,
        auth.setSession,
        sessionExpiredMessage,
        apiUnavailableMessage,
      ),
    [apiUnavailableMessage, auth.setSession, sessionExpiredMessage],
  );
}
