import { redirect } from "next/navigation";
import { getLatestCohort } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { routes } from "@/lib/routes";

export default async function SessionsIndex({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  redirect(routes.sessions(locale, getLatestCohort().slug));
}
