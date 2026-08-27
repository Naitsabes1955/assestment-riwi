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
    <section className="flex min-h-[70vh] flex-col rounded-lg border border-riwi-line bg-riwi-panel">
      <div className="border-b border-riwi-line px-4 py-3">
        <h1 className="text-lg font-semibold">{props.channel?.name ?? props.t.noChannel}</h1>
        <p className="text-xs text-riwi-muted">{props.t.conversation}</p>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {!props.channel ? (
          <p className="py-16 text-center text-sm text-riwi-muted">{props.t.noChannelHelp}</p>
        ) : props.loading ? (
          <p className="py-16 text-center text-sm text-riwi-muted">{props.t.loadingMessages}</p>
        ) : props.messages.length === 0 ? (
          <p className="py-16 text-center text-sm text-riwi-muted">{props.t.chatEmpty}</p>
        ) : (
          props.messages.map((message) => (
            <article
              className={`rounded-lg border p-3 ${
                message.senderId === props.currentUserId
                  ? "border-riwi-primary bg-riwi-primary-soft"
                  : "border-riwi-line bg-riwi-subtle"
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
                      className="rounded-md border border-red-200 px-2 py-1 text-xs text-red-700 hover:bg-red-50"
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

      <form className="border-t border-riwi-line p-3" onSubmit={props.onSend}>
        <div className="flex gap-2">
          <input
            className="min-w-0 flex-1 rounded-md border border-riwi-line px-3 py-2 text-sm outline-none focus:border-riwi-primary"
            disabled={!props.channel || props.sending}
            onChange={(event) => props.onDraftChange(event.target.value)}
            placeholder={props.t.messagePlaceholder}
            value={props.draft}
          />
          <button
            className="rounded-md bg-riwi-primary px-4 py-2 text-sm font-semibold text-white hover:bg-riwi-primary-strong disabled:opacity-60"
            disabled={!props.channel || props.sending || !props.draft.trim()}
            type="submit"
          >
            {props.sending ? props.t.sending : props.t.send}
          </button>
        </div>
      </form>
    </section>
  );
}
