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
  const helpText = !props.channelSelected
    ? props.t.assistantNeedsChannel
    : props.prompt.trim()
      ? null
      : props.t.assistantNeedsQuestion;

  return (
    <section className="rounded-2xl border border-riwi-line bg-riwi-panel p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-riwi-muted">
          {props.t.assistant}
        </h2>
        <span className="rounded-full bg-riwi-primary-soft px-2.5 py-1 text-xs font-medium text-riwi-primary-strong">
          {props.t.assistantConnected}
        </span>
      </div>
      <form className="space-y-3" onSubmit={props.onAsk}>
        <textarea
          className="min-h-28 w-full resize-y rounded-xl border border-riwi-line bg-white px-3 py-2.5 text-sm outline-none focus:border-riwi-primary focus:shadow-[0_0_0_3px_rgba(39,90,145,0.12)] disabled:opacity-60"
          disabled={props.loading}
          onChange={(event) => props.onPromptChange(event.target.value)}
          placeholder={props.t.assistantPlaceholder}
          value={props.prompt}
        />
        {helpText ? <p className="text-xs leading-5 text-riwi-muted">{helpText}</p> : null}
        <button
          className="w-full rounded-lg bg-riwi-ink px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-riwi-primary-strong disabled:opacity-60"
          disabled={!props.channelSelected || props.loading || !props.prompt.trim()}
          type="submit"
        >
          {props.loading ? props.t.assistantThinking : props.t.askAssistant}
        </button>
      </form>
      {props.response ? (
        <div className="mt-4 rounded-xl border border-riwi-line bg-riwi-subtle p-3">
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
