"use client";

import { useCallback, useMemo, useState } from "react";
import { channelsApi } from "@/lib/api/services";
import { getErrorMessage } from "@/lib/utils/format";
import type { Channel } from "@/types";
import type { ApiHttpClient } from "@/lib/api/client";

export function useChannels(client: ApiHttpClient, fallbackError: string) {
  const [channels, setChannels] = useState<readonly Channel[]>([]);
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const api = useMemo(() => channelsApi(client), [client]);

  const loadChannels = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await api.list();
      setChannels(data);
      setSelectedChannelId((current) => current ?? data[0]?.id ?? null);
    } catch (requestError) {
      setError(getErrorMessage(requestError, fallbackError));
    } finally {
      setLoading(false);
    }
  }, [api, fallbackError]);

  return {
    channels,
    error,
    loadChannels,
    loading,
    selectedChannelId,
    setSelectedChannelId,
  };
}
