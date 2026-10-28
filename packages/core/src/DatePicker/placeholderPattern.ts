/** Letters for day, month and year in the pattern shown in an empty field. */
const LETTERS: Readonly<Record<string, { day: string; month: string; year: string }>> = {
  de: { day: "TT", month: "MM", year: "JJJJ" },
};

/**
 * Pattern shown in an empty field for languages Carbide knows letters for
 * (order and separators follow the locale, "de-DE" gives `TT.MM.JJJJ`).
 * Returns `undefined` for all others so Ark's own pattern stays.
 */
export function localePlaceholder(locale: string): string | undefined {
  const language = locale.split("-")[0]?.toLowerCase() ?? "";
  const letters = LETTERS[language];
  if (letters === undefined) return undefined;
  return new Intl.DateTimeFormat(locale)
    .formatToParts(new Date(2026, 0, 1))
    .map((part) => {
      if (part.type === "day") return letters.day;
      if (part.type === "month") return letters.month;
      if (part.type === "year") return letters.year;
      return part.value;
    })
    .join("");
}
