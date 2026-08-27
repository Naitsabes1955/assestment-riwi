import type { AuthSession, Locale } from "@/types";

const sessionKey = "riwi.messaging.session";
const localeKey = "riwi.messaging.locale";

export function readStoredSession(): AuthSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const value = window.localStorage.getItem(sessionKey);
    return value ? (JSON.parse(value) as AuthSession) : null;
  } catch {
    return null;
  }
}

export function storeSession(session: AuthSession | null): void {
  if (typeof window === "undefined") {
    return;
  }

  if (session) {
    window.localStorage.setItem(sessionKey, JSON.stringify(session));
  } else {
    window.localStorage.removeItem(sessionKey);
  }
}

export function readStoredLocale(): Locale {
  if (typeof window === "undefined") {
    return "en";
  }

  return window.localStorage.getItem(localeKey) === "es" ? "es" : "en";
}

export function storeLocale(locale: Locale): void {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(localeKey, locale);
  }
}
