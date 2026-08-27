import { FormEvent } from "react";
import { formatDate } from "@/lib/utils/format";
import type { Locale, SearchResult } from "@/types";
import type { Dictionary } from "@/i18n/dictionaries";

export function SearchPanel(props: {
  readonly loading: boolean;
  readonly locale: Locale;
  readonly onQueryChange: (value: string) => void;
  readonly onSearch: (event: FormEvent<HTMLFormElement>) => void;
  readonly onSelectChannel: (channelId: string) => void;
  readonly query: string;
  readonly results: readonly SearchResult[];
  readonly t: Dictionary;
}) {
  return (
    <section className="rounded-lg border border-riwi-line bg-riwi-panel p-4">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-riwi-muted">
        {props.t.searchMessages}
      </h2>
      <form className="flex gap-2" onSubmit={props.onSearch}>
        <input
          className="min-w-0 flex-1 rounded-md border border-riwi-line px-3 py-2 text-sm outline-none focus:border-riwi-primary"
          onChange={(event) => props.onQueryChange(event.target.value)}
          placeholder={props.t.search}
          value={props.query}
        />
        <button
          className="rounded-md border border-riwi-line px-3 py-2 text-sm font-medium hover:bg-riwi-subtle disabled:opacity-60"
          disabled={props.loading}
          type="submit"
        >
          {props.loading ? "..." : props.t.search}
        </button>
      </form>
      <div className="mt-3 space-y-2">
        {props.results.length === 0 ? (
          <p className="py-4 text-sm text-riwi-muted">{props.t.noResults}</p>
        ) : (
          props.results.map((result) => (
            <button
              className="w-full rounded-md border border-riwi-line p-3 text-left hover:bg-riwi-subtle"
              key={result.message_id}
              onClick={() => props.onSelectChannel(result.channel_id)}
              type="button"
            >
              <p className="text-sm">{result.content}</p>
              <p className="mt-1 break-all text-xs text-riwi-muted">
                {result.channel_id} - {formatDate(result.created_at, props.locale)}
              </p>
            </button>
          ))
        )}
      </div>
    </section>
  );
}
