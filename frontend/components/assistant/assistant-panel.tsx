import { translateCount } from "@/i18n/dictionaries";
import type { AssistantResponse } from "@/types";
import type { Dictionary } from "@/i18n/dictionaries";
import type { FormEvent } from "react";

export function AssistantPanel(props: {
  readonly channelSelected: boolean;
  readonly loading: boolean;
  readonly onAsk: (event: FormEvent<HTMLFormElement>) => void;
  readonly onPromptChange: (value: string) => void;
  readonly prompt: string;
  readonly response: AssistantResponse | null;
  readonly t: Dictionary;
}) {
  return (
    <section className="rounded-lg border border-riwi-line bg-riwi-panel p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-riwi-muted">
          {props.t.assistant}
        </h2>
        <span className="rounded-full bg-riwi-primary-soft px-2 py-1 text-xs text-riwi-primary-strong">
          {props.t.assistantConnected}
        </span>
      </div>
      <form className="space-y-3" onSubmit={props.onAsk}>
        <textarea
          className="min-h-28 w-full resize-y rounded-md border border-riwi-line px-3 py-2 text-sm outline-none focus:border-riwi-primary"
          disabled={!props.channelSelected || props.loading}
          onChange={(event) => props.onPromptChange(event.target.value)}
          placeholder={props.t.assistantPlaceholder}
          value={props.prompt}
        />
        <button
          className="w-full rounded-md bg-riwi-ink px-4 py-2 text-sm font-semibold text-white hover:bg-riwi-primary-strong disabled:opacity-60"
          disabled={!props.channelSelected || props.loading || !props.prompt.trim()}
          type="submit"
        >
          {props.loading ? props.t.assistantThinking : props.t.askAssistant}
        </button>
      </form>
      {props.response ? (
        <div className="mt-4 rounded-md bg-riwi-subtle p-3">
          <p className="whitespace-pre-wrap text-sm">{props.response.answer}</p>
          <p className="mt-3 text-xs text-riwi-muted">
            {translateCount(props.t.contextMessages, props.response.contextMessageIds.length)}
          </p>
        </div>
      ) : (
        <p className="mt-4 text-sm text-riwi-muted">{props.t.assistantIdle}</p>
      )}
    </section>
  );
}
