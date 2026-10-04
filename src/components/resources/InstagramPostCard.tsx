import { Icon } from "@/components/icons";
import { InstagramCaption } from "@/components/resources/InstagramCaption";
import { InstagramGallery } from "@/components/resources/InstagramGallery";
import { getDict, type Locale } from "@/lib/i18n";
import type { InstagramPost } from "@/lib/instagram";

export function InstagramPostCard({ post, locale }: { post: InstagramPost; locale: Locale }) {
  const { common, resources } = getDict(locale);

  return (
    <li className="card ring-hover grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 p-4 sm:flex sm:gap-5 sm:p-6">
      <InstagramGallery post={post} locale={locale} className="w-24 self-start sm:w-36" />

      <div className="contents sm:flex sm:min-w-0 sm:flex-1 sm:flex-col">
        <div className="col-start-2 row-start-1 min-w-0 wrap-anywhere">
          <div className="flex items-center gap-3">
            <time dateTime={post.date} className="font-mono text-xs text-muted">{post.date}</time>
            <a
              href={post.url}
              target="_blank"
              rel="noreferrer"
              aria-label={resources.feed.open}
              className="-my-1.5 -mr-1.5 ml-auto inline-flex size-7 shrink-0 items-center justify-center rounded-sm text-faint transition-colors duration-200 hover:bg-surface-2 hover:text-accent"
            >
              <Icon name="external" size={12} />
            </a>
          </div>
          {post.title && <h3 className="mt-2 font-semibold leading-snug">{post.title}</h3>}
        </div>
        {post.body && (
          <InstagramCaption
            text={post.body}
            more={common.more}
            less={common.less}
            className="col-span-2 min-w-0 wrap-anywhere sm:mt-1.5"
          />
        )}
      </div>
    </li>
  );
}
