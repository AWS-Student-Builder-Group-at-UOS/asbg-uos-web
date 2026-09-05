import { cn } from "@/lib/utils";

export function Chip({ children, hash = true, className }: { children: string; hash?: boolean; className?: string }) {
  return (
    <span className={cn("chip", className)}>
      {hash && "#"}
      {children}
    </span>
  );
}

export function ChipList({ items, className }: { items: readonly string[]; className?: string }) {
  return (
    <ul className={cn("flex flex-wrap gap-1.5", className)}>
      {items.map((item) => (
        <li key={item}>
          <Chip>{item}</Chip>
        </li>
      ))}
    </ul>
  );
}
