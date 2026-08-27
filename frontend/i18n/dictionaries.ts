import type { Locale } from "@/types";

import en from "./en.json";
import es from "./es.json";

export type Dictionary = typeof es;

export const dictionaries: Record<Locale, Dictionary> = { es, en };

export function translateCount(template: string, count: number): string {
  return template.replace("{{count}}", String(count));
}
