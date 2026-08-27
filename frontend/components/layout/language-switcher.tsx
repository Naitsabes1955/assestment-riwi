import type { Locale } from "@/types";

export function LanguageSwitcher(props: {
  readonly locale: Locale;
  readonly onChange: (locale: Locale) => void;
}) {
  return (
    <div className="grid grid-cols-2 rounded-md border border-riwi-line p-1 text-sm">
      <button
        className={`rounded px-2 py-1 ${props.locale === "es" ? "bg-riwi-ink text-white" : ""}`}
        onClick={() => props.onChange("es")}
        type="button"
      >
        ES
      </button>
      <button
        className={`rounded px-2 py-1 ${props.locale === "en" ? "bg-riwi-ink text-white" : ""}`}
        onClick={() => props.onChange("en")}
        type="button"
      >
        EN
      </button>
    </div>
  );
}
