import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getDict, type Locale } from "@/lib/i18n";
import { contentUrl } from "@/lib/routes";

const isAbsolute = (u: string) => /^(https?:)?\/\//.test(u) || u.startsWith("/") || u.startsWith("#") || u.startsWith("mailto:");

export function ActivityBody({ cohort, activity, markdown, locale }: { cohort: string; activity: string; markdown: string; locale: Locale }) {
  const d = getDict(locale);
  const resolve = (u: string) => (isAbsolute(u) ? u : contentUrl(cohort, "activities", activity, u.replace(/^\.\//, "")));

  return (
    <div className="article">
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          img: ({ src, alt }) => <img src={resolve(String(src ?? ""))} alt={alt ?? ""} loading="lazy" />,
          a: ({ href, children }) => {
            const url = resolve(String(href ?? ""));
            const external = /^https?:\/\//.test(url) || url.endsWith(".pdf");
            return (
              <a href={url} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>
                {children}
              </a>
            );
          },
          table: ({ children }) => (
            <div className="table-wrap" role="region" aria-label={d.activities.tableScrollLabel} tabIndex={0}>
              <table>{children}</table>
            </div>
          ),
        }}
      >
        {markdown}
      </Markdown>
    </div>
  );
}
