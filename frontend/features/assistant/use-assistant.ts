"use client";

import { FormEvent, useCallback, useMemo, useState } from "react";
import { assistantApi } from "@/lib/api/services";
import { getErrorMessage } from "@/lib/utils/format";
import type { ApiHttpClient } from "@/lib/api/client";
import type { AssistantResponse } from "@/types";

export function useAssistant(client: ApiHttpClient, fallbackError: string) {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState<AssistantResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const api = useMemo(() => assistantApi(client), [client]);

  const ask = useCallback(
    async (event: FormEvent<HTMLFormElement>, channelId: string | null) => {
      event.preventDefault();

      if (!channelId || !prompt.trim()) {
        return;
      }

      setLoading(true);
      setResponse(null);
      setError(null);

      try {
        setResponse(await api.ask(channelId, prompt));
      } catch (requestError) {
        setError(getErrorMessage(requestError, fallbackError));
      } finally {
        setLoading(false);
      }
    },
    [api, fallbackError, prompt],
  );

  return { ask, error, loading, prompt, response, setPrompt };
}
