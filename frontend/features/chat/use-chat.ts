"use client";

import { FormEvent, useCallback, useMemo, useState } from "react";
import { getErrorMessage } from "@/lib/utils/format";
import { messagesApi } from "@/lib/api/services";
import type { ApiHttpClient } from "@/lib/api/client";
import type { Message } from "@/types";

export function useChat(client: ApiHttpClient, fallbackError: string) {
  const [messages, setMessages] = useState<readonly Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const api = useMemo(() => messagesApi(client), [client]);

  const loadMessages = useCallback(
    async (channelId: string | null) => {
      if (!channelId) {
        setMessages([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        setMessages(await api.list(channelId));
      } catch (requestError) {
        setError(getErrorMessage(requestError, fallbackError));
      } finally {
        setLoading(false);
      }
    },
    [api, fallbackError],
  );

  const sendMessage = useCallback(
    async (event: FormEvent<HTMLFormElement>, channelId: string | null) => {
      event.preventDefault();

      if (!channelId || !draft.trim()) {
        return;
      }

      setSending(true);
      setError(null);

      try {
        await api.send(channelId, draft);
        setDraft("");
        setMessages(await api.list(channelId));
      } catch (requestError) {
        setError(getErrorMessage(requestError, fallbackError));
      } finally {
        setSending(false);
      }
    },
    [api, draft, fallbackError],
  );

  const deleteMessage = useCallback(
    async (channelId: string | null, messageId: string) => {
      if (!channelId) {
        return;
      }

      setError(null);

      try {
        await api.delete(channelId, messageId);
        setMessages(await api.list(channelId));
      } catch (requestError) {
        setError(getErrorMessage(requestError, fallbackError));
      }
    },
    [api, fallbackError],
  );

  return {
    deleteMessage,
    draft,
    error,
    loadMessages,
    loading,
    messages,
    sendMessage,
    sending,
    setDraft,
  };
}
