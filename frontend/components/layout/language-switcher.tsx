import type { Locale } from "@/types";

export function LanguageSwitcher(props: {
  readonly locale: Locale;
  readonly onChange: (locale: Locale) => void;
}) {
  return (
    <div className="grid grid-cols-2 rounded-full border border-riwi-line bg-riwi-subtle p-1 text-sm shadow-inner">
      <button
        className={`rounded-full px-3 py-1 ${
          props.locale === "es" ? "bg-riwi-primary-strong text-white shadow-sm" : "text-riwi-muted"
        }`}
        onClick={() => props.onChange("es")}
        type="button"
      >
        ES
      </button>
      <button
        className={`rounded-full px-3 py-1 ${
          props.locale === "en" ? "bg-riwi-primary-strong text-white shadow-sm" : "text-riwi-muted"
        }`}
        onClick={() => props.onChange("en")}
        type="button"
      >
        EN
      </button>
    </div>
  );
}
