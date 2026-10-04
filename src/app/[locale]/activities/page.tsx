import { redirect } from "next/navigation";
import { getLatestCohort } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { routes } from "@/lib/routes";

export default async function ActivitiesIndex({ params, searchParams }: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  const query = new URLSearchParams();
  Object.entries(await searchParams).forEach(([key, value]) => {
    if (Array.isArray(value)) value.forEach((item) => query.append(key, item));
    else if (value !== undefined) query.set(key, value);
  });
  const search = query.toString();
  redirect(`${routes.activities(locale, getLatestCohort().slug)}${search ? `?${search}` : ""}`);
}
