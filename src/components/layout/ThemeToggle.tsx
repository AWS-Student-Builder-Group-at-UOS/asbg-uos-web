"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Icon } from "@/components/icons";

const subscribe = () => () => {};
const useMounted = () => useSyncExternalStore(subscribe, () => true, () => false);

export function ThemeToggle({ label }: { label: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();
  const dark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label={label}
      aria-pressed={dark}
      className="inline-flex size-9 items-center justify-center rounded-sm text-muted transition-colors duration-200 hover:bg-surface-2 hover:text-ink"
    >
      <Icon name={dark ? "sun" : "moon"} size={15} className={mounted ? undefined : "opacity-0"} />
    </button>
  );
}
