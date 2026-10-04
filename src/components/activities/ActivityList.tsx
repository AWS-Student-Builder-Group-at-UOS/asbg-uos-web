"use client";

import { Fragment, useId, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { compareActivities, matchesActivitySearch, type ActivityOrder } from "@/lib/activities";
import { getDict, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export type ActivityListItem = ActivityOrder & {
  status: "done" | "upcoming";
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
  variant = "chips",
  showLabel = false,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  resultsId: string;
  onChange: (value: string) => void;
  variant?: "tabs" | "chips";
  showLabel?: boolean;
}) {
  return (
    <fieldset className="min-w-0">
      <legend className={showLabel ? "mb-1.5 font-mono text-[11px] uppercase tracking-wider text-muted" : "sr-only"}>{label}</legend>
      <div className="flex flex-wrap gap-1">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={value === option.value}
            aria-controls={resultsId}
            onClick={() => onChange(option.value)}
            className={cn(
              "min-h-10 whitespace-nowrap px-2.5 py-2 font-mono text-xs transition-colors duration-200",
              variant === "tabs"
                ? cn("border-b-2", value === option.value ? "border-accent text-accent" : "border-transparent text-muted hover:text-ink")
                : cn("rounded-sm", value === option.value ? "bg-accent-soft text-accent" : "text-muted hover:bg-surface-2 hover:text-ink"),
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
  const [expanded, setExpanded] = useState(false);
  const id = useId();
  const resultsId = `${id}-results`;
  const filtersId = `${id}-filters`;
  const query = params.get("q") ?? "";
  const typeParam = params.get("type");
  const statusParam = params.get("status");
  const type = typeParam === "presentation" || typeParam === "retrospective" ? typeParam : "all";
  const status = statusParam === "done" || statusParam === "upcoming" ? statusParam : "all";
  const sort = params.get("sort") === "newest" ? "newest" : "oldest";
  const hasFilters = filterKeys.some((key) => params.has(key));
  const showTypes = new Set(items.map((item) => item.type)).size > 1 || type !== "all";
  const activeCount = Number(status !== "all") + Number(sort !== "oldest");
  const summary = [status !== "all" && d.filters[status], sort === "newest" && d.filters.newest].filter(Boolean).join(" · ");
  const statusOptions = [
    { value: "all", label: d.filters.all },
    { value: "done", label: d.filters.done },
    { value: "upcoming", label: d.filters.upcoming },
  ];
  const sortOptions = [
    { value: "oldest", label: d.filters.oldest },
    { value: "newest", label: d.filters.newest },
  ];
  const visible = items.filter((item) => (type === "all" || item.type === type)
    && (status === "all" || item.status === status)
    && matchesActivitySearch(item, query)
  ).sort((a, b) => (sort === "oldest" ? 1 : -1) * compareActivities(a, b));

  function updateFilter(key?: typeof filterKeys[number], value?: string) {
    const next = new URLSearchParams(window.location.search);
    if (key) {
      if (!value || (key !== "q" && value === "all") || (key === "sort" && value === "oldest")) next.delete(key);
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
    <div className="mt-6">
      <section aria-label={d.filters.label} className="pads border-b border-line pb-3">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex w-full items-center gap-2 lg:w-48 lg:shrink-0 xl:w-56">
            <label htmlFor={`${id}-search`} className="sr-only">{d.filters.search}</label>
            <input
              id={`${id}-search`}
              type="search"
              value={query}
              onChange={(event) => updateFilter("q", event.target.value)}
              onBlur={() => { searchHistory.current = null; }}
              placeholder={d.filters.searchPlaceholder}
              aria-controls={resultsId}
              autoComplete="off"
              className="h-10 w-full min-w-0 rounded-sm border border-line bg-surface-2 px-3 text-base text-ink placeholder:text-faint sm:text-sm"
            />
            <button
              type="button"
              aria-label={activeCount > 0 ? `${d.filters.advanced}, ${d.filters.active(activeCount)}` : d.filters.advanced}
              aria-describedby={summary ? `${id}-summary` : undefined}
              aria-expanded={expanded}
              aria-controls={filtersId}
              onClick={() => setExpanded((value) => !value)}
              className={cn(
                "inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-sm px-2.5 font-mono text-xs transition-colors duration-200 lg:hidden",
                expanded || activeCount > 0 ? "bg-accent-soft text-accent" : "bg-surface-2 text-muted hover:text-ink",
              )}
            >
              <span>{d.filters.advanced}</span>
              {activeCount > 0 && <span aria-hidden="true" className="font-semibold tabular-nums">{activeCount}</span>}
              <span aria-hidden="true" className="text-base leading-none">{expanded ? "−" : "+"}</span>
            </button>
          </div>
          {showTypes && (
            <FilterGroup
              label={d.filters.type}
              value={type}
              resultsId={resultsId}
              variant="tabs"
              onChange={(value) => updateFilter("type", value)}
              options={[
                { value: "all", label: d.filters.all },
                { value: "presentation", label: d.types.presentation },
                { value: "retrospective", label: d.types.retrospective },
              ]}
            />
          )}
          <div className="ml-auto hidden items-center gap-3 lg:flex">
            <FilterGroup
              label={d.filters.status}
              value={status}
              resultsId={resultsId}
              onChange={(value) => updateFilter("status", value)}
              options={statusOptions}
            />
            <span aria-hidden="true" className="h-5 border-l border-line" />
            <FilterGroup
              label={d.filters.sort}
              value={sort}
              resultsId={resultsId}
              onChange={(value) => updateFilter("sort", value)}
              options={sortOptions}
            />
          </div>
        </div>
        <div id={filtersId} className={cn("mt-3 gap-x-6 gap-y-3 border-t border-line pt-3 sm:grid-cols-2 lg:hidden", expanded ? "grid" : "hidden")}>
          <FilterGroup
            label={d.filters.status}
            value={status}
            resultsId={resultsId}
            showLabel
            onChange={(value) => updateFilter("status", value)}
            options={statusOptions}
          />
          <FilterGroup
            label={d.filters.sort}
            value={sort}
            resultsId={resultsId}
            showLabel
            onChange={(value) => updateFilter("sort", value)}
            options={sortOptions}
          />
        </div>
        <div className="mt-1 flex min-h-6 items-center gap-3">
          <p role="status" aria-live="polite" aria-atomic="true" className="shrink-0 font-mono text-[11px] text-muted">
            {d.filters.count(visible.length, items.length)}
          </p>
          {summary && <span id={`${id}-summary`} className="truncate font-mono text-[11px] text-muted lg:hidden">{summary}</span>}
          {hasFilters && (
            <button type="button" onClick={() => updateFilter()} className="link-quiet ml-auto min-h-6 shrink-0 text-xs text-muted underline decoration-line-strong underline-offset-4">
              {d.filters.reset}
            </button>
          )}
        </div>
      </section>

      <div id={resultsId} className="mt-5">
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
