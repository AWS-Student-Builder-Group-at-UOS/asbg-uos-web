import { cn } from "@/lib/utils";

export function Chip({ children, className }: { children: string; className?: string }) {
  return <span className={cn("chip", className)}>#{children}</span>;
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
