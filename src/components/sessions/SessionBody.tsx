import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { contentUrl } from "@/lib/routes";

const isAbsolute = (u: string) => /^(https?:)?\/\//.test(u) || u.startsWith("/") || u.startsWith("#") || u.startsWith("mailto:");

export function SessionBody({ cohort, session, markdown }: { cohort: string; session: string; markdown: string }) {
  const resolve = (u: string) => (isAbsolute(u) ? u : contentUrl(cohort, session, u.replace(/^\.\//, "")));

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
            <div className="table-wrap">
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
