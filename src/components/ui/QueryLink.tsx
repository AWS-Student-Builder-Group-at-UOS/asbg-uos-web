"use client";

import { Suspense, type ComponentProps } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type Props = Omit<ComponentProps<typeof Link>, "href"> & { href: string };

function LinkWithQuery({ href, ...props }: Props) {
  const searchParams = useSearchParams();
  const [path, hash] = href.split("#");
  const [pathname, query] = path.split("?");
  const params = new URLSearchParams(searchParams);
  new URLSearchParams(query).forEach((value, key) => params.set(key, value));
  const search = params.toString();
  return <Link {...props} href={`${pathname}${search ? `?${search}` : ""}${hash ? `#${hash}` : ""}`} />;
}

export function QueryLink(props: Props) {
  return (
    <Suspense fallback={<Link {...props} />}>
      <LinkWithQuery {...props} />
    </Suspense>
  );
}
