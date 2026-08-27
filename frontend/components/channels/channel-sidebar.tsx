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
    <aside className="flex min-h-[72vh] flex-col rounded-2xl border border-riwi-line bg-riwi-panel shadow-sm">
      <div className="border-b border-riwi-line p-4">
        <p className="text-sm font-semibold text-riwi-ink">
          {props.currentUser.firstName} {props.currentUser.lastName}
        </p>
        <p className="mt-0.5 break-all text-xs text-riwi-muted">{props.currentUser.email}</p>
        <p className="mt-1 text-xs text-riwi-muted">{props.currentUser.jobTitle}</p>
        <button
          className="mt-4 w-full rounded-lg border border-riwi-line px-3 py-2 text-sm font-medium text-riwi-primary-strong hover:bg-riwi-subtle disabled:opacity-60"
          onClick={props.onLogout}
          type="button"
        >
          {props.t.logout}
        </button>
      </div>

      <div className="flex items-center justify-between px-4 py-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-riwi-muted">
          {props.t.channels}
        </h2>
        <button
          className="rounded-lg border border-riwi-line px-2.5 py-1.5 text-xs font-medium text-riwi-primary-strong hover:bg-riwi-subtle"
          onClick={props.onRefresh}
          type="button"
        >
          {props.t.refresh}
        </button>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto px-3 pb-4">
        {props.loading ? (
          <p className="rounded-xl bg-riwi-subtle px-3 py-8 text-center text-sm text-riwi-muted">
            {props.t.loadingChannels}
          </p>
        ) : props.channels.length === 0 ? (
          <div className="rounded-xl border border-dashed border-riwi-line bg-riwi-subtle px-4 py-8 text-center">
            <p className="text-sm font-medium text-riwi-ink">{props.t.channelEmpty}</p>
            <p className="mt-2 text-xs leading-5 text-riwi-muted">{props.t.channelEmptyHelp}</p>
          </div>
        ) : (
          props.channels.map((channel) => (
            <button
              className={`w-full rounded-xl border px-3 py-3 text-left shadow-sm ${
                props.selectedChannelId === channel.id
                  ? "border-riwi-primary bg-riwi-primary-soft text-riwi-primary-strong"
                  : "border-riwi-line bg-white hover:bg-riwi-subtle"
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
