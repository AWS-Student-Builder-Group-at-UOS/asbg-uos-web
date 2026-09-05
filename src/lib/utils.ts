export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function pad2(n: number) {
  return String(n).padStart(2, "0");
}
