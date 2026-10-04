"use client";

import { Fragment, useId, useRef, useSyncExternalStore, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { getDict, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export type ActivityListItem = {
  slug: string;
  type: "presentation" | "retrospective";
  status: "done" | "upcoming";
  date: string;
  searchText: string;
  content: ReactNode;
};

const filterKeys = ["q", "type", "status", "sort"] as const;
const filterEvent = "activity-filters";

function subscribe(callback: () => void) {
  window.addEventListener("popstate", callback);
  window.addEventListener(filterEvent, callback);
  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener(filterEvent, callback);
  };
}

function getSearch() {
  return window.location.search.slice(1);
}

function FilterGroup({
  label,
  value,
  options,
  resultsId,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  resultsId: string;
  onChange: (value: string) => void;
}) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-2 font-mono text-[11px] uppercase tracking-wider text-muted">{label}</legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={value === option.value}
            aria-controls={resultsId}
            onClick={() => onChange(option.value)}
            className={cn(
              "min-h-10 rounded-sm border px-3 py-2 font-mono text-xs transition-colors duration-200",
              value === option.value
                ? "border-accent/30 bg-accent-soft text-accent"
                : "border-line bg-surface text-muted hover:border-line-strong hover:text-ink",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export function ActivityList({ items, locale }: { items: ActivityListItem[]; locale: Locale }) {
  const d = getDict(locale).activities;
  const searchParams = useSearchParams();
  const search = useSyncExternalStore(subscribe, getSearch, () => searchParams.toString());
  const params = new URLSearchParams(search);
  const searchHistory = useRef<string | null>(null);
  const id = useId();
  const resultsId = `${id}-results`;
  const query = params.get("q") ?? "";
  const typeParam = params.get("type");
  const statusParam = params.get("status");
  const type = typeParam === "presentation" || typeParam === "retrospective" ? typeParam : "all";
  const status = statusParam === "done" || statusParam === "upcoming" ? statusParam : "all";
  const sort = params.get("sort") === "oldest" ? "oldest" : "newest";
  const hasFilters = filterKeys.some((key) => params.has(key));
  const showTypes = new Set(items.map((item) => item.type)).size > 1 || type !== "all";
  const words = query.normalize("NFKC").trim().toLocaleLowerCase(locale).split(/\s+/).filter(Boolean);
  const visible = items.filter((item) => {
    const text = item.searchText.normalize("NFKC").toLocaleLowerCase(locale);
    return (type === "all" || item.type === type)
      && (status === "all" || item.status === status)
      && words.every((word) => text.includes(word));
  }).sort((a, b) => sort === "oldest" ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date));

  function updateFilter(key?: typeof filterKeys[number], value?: string) {
    const next = new URLSearchParams(window.location.search);
    if (key) {
      if (!value || (key !== "q" && value === "all") || (key === "sort" && value === "newest")) next.delete(key);
      else next.set(key, value);
    } else {
      filterKeys.forEach((filter) => next.delete(filter));
    }
    const queryString = next.toString();
    const url = `${window.location.pathname}${queryString ? `?${queryString}` : ""}${window.location.hash}`;
    const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (url === current) return;
    if (key === "q" && searchHistory.current === current) window.history.replaceState(null, "", url);
    else window.history.pushState(null, "", url);
    searchHistory.current = key === "q" ? url : null;
    window.dispatchEvent(new Event(filterEvent));
  }

  return (
    <div className="mt-8">
      <section aria-label={d.filters.label} className="pads rounded-md border border-line bg-surface p-4 sm:p-5">
        <label htmlFor={`${id}-search`} className="mb-2 block font-mono text-[11px] uppercase tracking-wider text-muted">
          {d.filters.search}
        </label>
        <input
          id={`${id}-search`}
          type="search"
          value={query}
          onChange={(event) => updateFilter("q", event.target.value)}
          onBlur={() => { searchHistory.current = null; }}
          placeholder={d.filters.searchPlaceholder}
          aria-controls={resultsId}
          autoComplete="off"
          className="h-11 w-full min-w-0 rounded-sm border border-line bg-surface-2 px-3 text-sm text-ink placeholder:text-faint focus:border-accent"
        />
        <div className="mt-5 flex flex-wrap gap-x-8 gap-y-5">
          {showTypes && (
            <FilterGroup
              label={d.filters.type}
              value={type}
              resultsId={resultsId}
              onChange={(value) => updateFilter("type", value)}
              options={[
                { value: "all", label: d.filters.all },
                { value: "presentation", label: d.types.presentation },
                { value: "retrospective", label: d.types.retrospective },
              ]}
            />
          )}
          <FilterGroup
            label={d.filters.status}
            value={status}
            resultsId={resultsId}
            onChange={(value) => updateFilter("status", value)}
            options={[
              { value: "all", label: d.filters.all },
              { value: "done", label: d.filters.done },
              { value: "upcoming", label: d.filters.upcoming },
            ]}
          />
          <div className="sm:ml-auto">
            <FilterGroup
              label={d.filters.sort}
              value={sort}
              resultsId={resultsId}
              onChange={(value) => updateFilter("sort", value)}
              options={[
                { value: "newest", label: d.filters.newest },
                { value: "oldest", label: d.filters.oldest },
              ]}
            />
          </div>
        </div>
      </section>

      <div className="my-5 flex min-h-9 items-center justify-between gap-4">
        <p role="status" aria-live="polite" aria-atomic="true" className="font-mono text-xs text-muted">
          {d.filters.count(visible.length, items.length)}
        </p>
        {hasFilters && (
          <button type="button" onClick={() => updateFilter()} className="link-quiet min-h-9 text-xs text-muted underline decoration-line-strong underline-offset-4">
            {d.filters.reset}
          </button>
        )}
      </div>

      <div id={resultsId}>
        {visible.length > 0 ? (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((item) => <Fragment key={item.slug}>{item.content}</Fragment>)}
          </ul>
        ) : (
          <div className="rounded-md border border-dashed border-line-strong px-5 py-16 text-center">
            <p className="font-medium">{items.length === 0 ? d.empty : d.filters.empty}</p>
            {items.length > 0 && <p className="mt-2 text-sm text-muted">{d.filters.emptyHint}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
