"use client";

import { FormEvent, useCallback, useMemo, useState } from "react";
import { getErrorMessage } from "@/lib/utils/format";
import { searchApi } from "@/lib/api/services";
import type { ApiHttpClient } from "@/lib/api/client";
import type { SearchResult } from "@/types";

export function useMessageSearch(client: ApiHttpClient, fallbackError: string) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<readonly SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const api = useMemo(() => searchApi(client), [client]);

  const search = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!query.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        setResults(await api.search(query));
      } catch (requestError) {
        setError(getErrorMessage(requestError, fallbackError));
      } finally {
        setLoading(false);
      }
    },
    [api, fallbackError, query],
  );

  return { error, loading, query, results, search, setQuery };
}
