import { z } from "zod";

const SEOUL_OFFSET = 9 * 60 * 60 * 1000;
const TITLE_LENGTH = 80;
const INVISIBLE = /[\u200b\u2800\u3164]/g;

const size = z.object({ mediaUrl: z.url(), width: z.number(), height: z.number() });

const media = z.object({
  mediaType: z.enum(["IMAGE", "VIDEO", "CAROUSEL_ALBUM"]).catch("IMAGE"),
  sizes: z.object({ small: size, medium: size, large: size, full: size }),
});

const feedSchema = z.object({
  posts: z.array(
    media.extend({
      id: z.string(),
      permalink: z.url(),
      timestamp: z.string(),
      caption: z.string().optional(),
      prunedCaption: z.string().optional(),
      altText: z.string().optional(),
      children: z.array(media).optional(),
    }),
  ),
});

type Media = z.infer<typeof media>;
type FeedPost = z.infer<typeof feedSchema>["posts"][number];

export type InstagramSlide = { src: string; srcSet: string; width: number; height: number; video: boolean };

export type InstagramPost = {
  id: string;
  url: string;
  date: string;
  title?: string;
  body?: string;
  alt: string;
  slides: InstagramSlide[];
};

function toSlide({ mediaType, sizes }: Media): InstagramSlide {
  const { small, medium, large, full } = sizes;
  return {
    src: medium.mediaUrl,
    srcSet: [small, medium, large, full].map((s) => `${s.mediaUrl} ${s.width}w`).join(", "),
    width: full.width,
    height: full.height,
    video: mediaType === "VIDEO",
  };
}

function parseCaption(caption: string) {
  const lines = caption.replace(INVISIBLE, "").split("\n").map((line) => line.trim());
  const start = lines.findIndex(Boolean);
  if (start < 0) return {};
  const title = lines[start].length <= TITLE_LENGTH ? lines[start] : undefined;
  const body = lines.slice(title ? start + 1 : start).join("\n").replace(/\n{3,}/g, "\n\n").trim();
  return { title, body: body || undefined };
}

function toPost(post: FeedPost): InstagramPost {
  return {
    id: post.id,
    url: post.permalink,
    date: new Date(Date.parse(post.timestamp) + SEOUL_OFFSET).toISOString().slice(0, 10),
    ...parseCaption(post.prunedCaption ?? post.caption ?? ""),
    alt: post.altText ?? "",
    slides: (post.children?.length ? post.children : [post]).map(toSlide),
  };
}

export async function getInstagramPosts(): Promise<InstagramPost[]> {
  const url = process.env.BEHOLD_FEED_URL;
  if (!url) return [];

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return feedSchema.parse(await res.json()).posts.map(toPost);
  } catch (error) {
    console.error("[instagram] feed unavailable", error);
    return [];
  }
}
