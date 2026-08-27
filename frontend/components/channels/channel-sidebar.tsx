import { formatDate } from "@/lib/utils/format";
import type { Channel, Locale, User } from "@/types";
import type { Dictionary } from "@/i18n/dictionaries";

export function ChannelSidebar(props: {
  readonly channels: readonly Channel[];
  readonly currentUser: User;
  readonly loading: boolean;
  readonly locale: Locale;
  readonly onLogout: () => void;
  readonly onRefresh: () => void;
  readonly onSelect: (channelId: string) => void;
  readonly selectedChannelId: string | null;
  readonly t: Dictionary;
}) {
  return (
    <aside className="flex min-h-[70vh] flex-col rounded-lg border border-riwi-line bg-riwi-panel">
      <div className="border-b border-riwi-line p-3">
        <p className="text-sm font-medium">
          {props.currentUser.firstName} {props.currentUser.lastName}
        </p>
        <p className="break-all text-xs text-riwi-muted">{props.currentUser.email}</p>
        <button
          className="mt-3 w-full rounded-md border border-riwi-line px-3 py-2 text-sm font-medium hover:bg-riwi-subtle"
          onClick={props.onLogout}
          type="button"
        >
          {props.t.logout}
        </button>
      </div>

      <div className="flex items-center justify-between p-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-riwi-muted">
          {props.t.channels}
        </h2>
        <button
          className="rounded-md border border-riwi-line px-2 py-1 text-xs hover:bg-riwi-subtle"
          onClick={props.onRefresh}
          type="button"
        >
          {props.t.refresh}
        </button>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto p-3 pt-0">
        {props.loading ? (
          <p className="py-8 text-center text-sm text-riwi-muted">{props.t.loadingChannels}</p>
        ) : props.channels.length === 0 ? (
          <p className="py-8 text-center text-sm text-riwi-muted">{props.t.channelEmpty}</p>
        ) : (
          props.channels.map((channel) => (
            <button
              className={`w-full rounded-md border px-3 py-2 text-left ${
                props.selectedChannelId === channel.id
                  ? "border-riwi-primary bg-riwi-primary-soft"
                  : "border-riwi-line hover:bg-riwi-subtle"
              }`}
              key={channel.id}
              onClick={() => props.onSelect(channel.id)}
              type="button"
            >
              <span className="block text-sm font-medium"># {channel.name}</span>
              <span className="block text-xs text-riwi-muted">
                {formatDate(channel.createdAt, props.locale)}
              </span>
            </button>
          ))
        )}
      </div>
    </aside>
  );
}
