export type ActivityOrder = {
  date: string;
  session?: number;
  presentation?: number;
  type: "presentation" | "retrospective";
  slug: string;
};

export function compareActivities(a: ActivityOrder, b: ActivityOrder) {
  return a.date.localeCompare(b.date)
    || (a.session ?? 0) - (b.session ?? 0)
    || Number(a.type === "retrospective") - Number(b.type === "retrospective")
    || (a.presentation ?? 0) - (b.presentation ?? 0)
    || a.slug.localeCompare(b.slug, "en");
}

export function matchesActivitySearch(activity: { session?: number; searchText: string }, query: string) {
  const normalize = (text: string) => text.normalize("NFKC").toLowerCase();
  const search = normalize(query);
  const sessionPattern = /(?:\bsession|세션)\s*[-#]?\s*(\d+)\b/g;
  const sessions = [...search.matchAll(sessionPattern)].map((match) => Number(match[1]));
  const words = search.replace(sessionPattern, " ").trim().split(/\s+/).filter(Boolean);
  const text = normalize(activity.searchText);
  return sessions.every((session) => activity.session === session) && words.every((word) => text.includes(word));
}
