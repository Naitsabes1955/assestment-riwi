import { FormEvent } from "react";
import { formatDate } from "@/lib/utils/format";
import type { Channel, Locale, Message } from "@/types";
import type { Dictionary } from "@/i18n/dictionaries";

export function ChatPanel(props: {
  readonly channel: Channel | null;
  readonly currentUserId: string;
  readonly draft: string;
  readonly loading: boolean;
  readonly locale: Locale;
  readonly messages: readonly Message[];
  readonly onDelete: (messageId: string) => void;
  readonly onDraftChange: (value: string) => void;
  readonly onSend: (event: FormEvent<HTMLFormElement>) => void;
  readonly sending: boolean;
  readonly t: Dictionary;
}) {
  return (
    <section className="flex min-h-[72vh] flex-col rounded-2xl border border-riwi-line bg-riwi-panel shadow-sm">
      <div className="border-b border-riwi-line px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-riwi-muted">
          {props.t.conversation}
        </p>
        <h1 className="mt-1 text-xl font-semibold tracking-tight text-riwi-ink">
          {props.channel?.name ? `# ${props.channel.name}` : props.t.noChannel}
        </h1>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto bg-riwi-subtle/40 p-4">
        {!props.channel ? (
          <div className="mx-auto mt-16 max-w-sm rounded-2xl border border-dashed border-riwi-line bg-white px-5 py-8 text-center shadow-sm">
            <p className="text-sm font-semibold text-riwi-ink">{props.t.noChannel}</p>
            <p className="mt-2 text-sm leading-6 text-riwi-muted">{props.t.noChannelHelp}</p>
          </div>
        ) : props.loading ? (
          <p className="py-16 text-center text-sm text-riwi-muted">{props.t.loadingMessages}</p>
        ) : props.messages.length === 0 ? (
          <div className="mx-auto mt-16 max-w-sm rounded-2xl border border-dashed border-riwi-line bg-white px-5 py-8 text-center shadow-sm">
            <p className="text-sm font-semibold text-riwi-ink">{props.t.chatEmpty}</p>
          </div>
        ) : (
          props.messages.map((message) => (
            <article
              className={`rounded-2xl border p-3 shadow-sm ${
                message.senderId === props.currentUserId
                  ? "border-riwi-primary bg-riwi-primary-soft"
                  : "border-riwi-line bg-white"
              }`}
              key={message.id}
            >
              <div className="mb-1 flex items-start justify-between gap-3">
                <p className="break-all text-xs text-riwi-muted">
                  {message.senderId === props.currentUserId ? props.t.you : message.senderId}
                </p>
                <div className="flex items-center gap-2">
                  <time className="whitespace-nowrap text-xs text-riwi-muted">
                    {formatDate(message.createdAt, props.locale)}
                  </time>
                  {message.senderId === props.currentUserId ? (
                    <button
                      className="rounded-lg border border-red-200 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
                      onClick={() => props.onDelete(message.id)}
                      type="button"
                    >
                      {props.t.delete}
                    </button>
                  ) : null}
                </div>
              </div>
              <p className="whitespace-pre-wrap break-words text-sm">{message.content}</p>
            </article>
          ))
        )}
      </div>

      <form className="border-t border-riwi-line bg-white p-3" onSubmit={props.onSend}>
        {props.channel ? (
        <div className="flex gap-2 rounded-xl border border-riwi-line bg-riwi-subtle p-1.5">
          <input
            className="min-w-0 flex-1 rounded-lg border border-transparent bg-white px-3 py-2.5 text-sm outline-none focus:border-riwi-primary focus:shadow-[0_0_0_3px_rgba(39,90,145,0.12)] disabled:opacity-60"
            disabled={props.sending}
            onChange={(event) => props.onDraftChange(event.target.value)}
            placeholder={props.t.messagePlaceholder}
            value={props.draft}
          />
          <button
            className="rounded-lg bg-riwi-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-riwi-primary-strong disabled:opacity-60"
            disabled={props.sending || !props.draft.trim()}
            type="submit"
          >
            {props.sending ? props.t.sending : props.t.send}
          </button>
        </div>
        ) : (
          <p className="rounded-xl border border-dashed border-riwi-line bg-riwi-subtle px-4 py-3 text-center text-sm text-riwi-muted">
            {props.t.noChannelComposer}
          </p>
        )}
      </form>
    </section>
  );
}
