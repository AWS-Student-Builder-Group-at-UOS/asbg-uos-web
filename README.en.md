# ASBG UOS Web

[한국어](README.md)

The official website of AWS Student Builder Groups at University of Seoul, ASBG UOS for short. ASBG is the official student community that AWS runs at universities, and ASBG UOS is its group at the University of Seoul. The site introduces what the club does and gathers each cohort's activity records, members and official channels in one place.

Site: https://asbg.uos.ac.kr

## Why it is built this way

This site exists to introduce ASBG UOS. Before building it, we settled on three conditions.

1. It must cost nothing to run.
2. It must stay easy to maintain when the organizers change.
3. Members who do not know web development must still be able to contribute.

The implementation is kept as simple as those conditions allow. There is no database and no admin page. All content lives in this repository as Markdown and YAML files, which are read at build time and turned into static pages. With no server, database or login to operate, both the running cost and the points of failure disappear. Nothing depends on an external CMS, storage or API key, so the repository is self-contained and moving to another host needs no code changes. Publishing content is nothing more than adding files, so a member with no web experience can take part through a Pull Request.

## Stack

Built with Next.js, TypeScript and Tailwind CSS, deployed on Vercel.

Next.js was chosen mainly for search and sharing. Every page is generated as complete HTML at build time, and each carries its own title, description, canonical URL, alternate-language links and Open Graph image, so it reads well to search engines and shows a proper preview when a link is shared. File-based routing, the metadata API and OG image generation come with the framework, which made localized routes and share images possible without extra libraries, and a push to Git is all Vercel needs to build and deploy.

| Area | Used |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 4. Design tokens live in one place, `src/app/globals.css` |
| Content | Markdown + YAML frontmatter, react-markdown, remark-gfm |
| Content validation | zod, schema-checked at build time |
| Localization | `app/[locale]` routes with Korean and English dictionaries |
| Theme | next-themes, light and dark |
| Share images | next/og and sharp, rendering activity thumbnails from SVG to PNG |
| Fonts | Pretendard, Geist Mono |
| Hosting | Vercel |

## Design

It starts from two things: the University of Seoul and the cloud. The blue that people associate with the university sets the palette, and the way the cloud assembles small parts into one service became the imagery of pixels and circuit boards. We wanted the site to look made by students rather than polished like a corporate page. Pixel art gives it that handmade feel, and its rules are simple enough that anyone can add a drawing in the same style.

### Color

```mermaid
flowchart LR
  c1["Sky<br/>#42B4FF<br/>accent · icons"] ~~~ c2["Blue<br/>#1160D8<br/>links · buttons"] ~~~ c3["White<br/>#FFFFFF<br/>light canvas"] ~~~ c4["Black<br/>#0B0F17<br/>text · dark canvas"]
  classDef sky fill:#42B4FF,stroke:#42B4FF,color:#0B0F17
  classDef blue fill:#1160D8,stroke:#1160D8,color:#FFFFFF
  classDef white fill:#FFFFFF,stroke:#0B0F17,color:#0B0F17
  classDef black fill:#0B0F17,stroke:#0B0F17,color:#FFFFFF
  class c1 sky
  class c2 blue
  class c3 white
  class c4 black
```

There are only four colors. The university's blue goes where people are meant to click, such as links and buttons, and the color of a sky with clouds in it goes where the eye should land first, such as icons and accents. White and black complete the set, and every grey and translucent surface is one of the four at a different opacity. Light and dark mode only swap the roles of the same four colors. Keeping the palette this small means the look holds together no matter who adds a page.

### Pixels

Every icon is pixel art on a 16×16 grid, and the code defines it exactly as it looks, as a grid of characters. On the left is the logo as written in `src/components/icons.tsx`; on the right is what appears on screen.

```
...##..##..##...          ████    ████    ████
...##..##..##...          ████    ████    ████
..############..        ████████████████████████
####........####    ████████                ████████
####........####    ████████                ████████
..##........##..        ████                ████
..##........##..        ████                ████
####........####    ████████                ████████
####........####    ████████                ████████
..##........##..        ████                ████
..##........##..        ████                ████
####........####    ████████                ████████
####........####    ████████                ████████
..############..        ████████████████████████
...##..##..##...          ████    ████    ████
...##..##..##...          ████    ████    ████
```

A single pixel is just a square, but together they become a lock or a server. It is the same principle as the cloud, where small services such as instances, functions and queues are wired into one product. The logo, the channel icons and the activity thumbnails are all drawn on this one grid.

### Circuit board

All the graphics speak the language of a circuit board. The dot grid in the background is a perfboard before any part is placed, the diagrams drawn on it with chips and traces are the closed loop and the request path on the home page, and the small squares at card corners are solder pads. Numbers, dates and keywords, the information closest to code, are set in a monospace font (Geist Mono), a nod to sessions that mostly happen in everyone's own console.

Talk thumbnails use the same language: a dark dot grid with three keywords on the left and, on the right, one pixel icon that represents the talk inside a dashed frame. The guide, prompt and validation script are in `template/presentation-thumbnail/`.

```
┌────────────────────────────────────────────────────────┐
│  · · · · · · · · · · · · · · · · · · · · · · · · · · · │
│    ASBG UOS · COHORT 01                                │
│                                                        │
│    COMMUNITY                     ╭ ─ ─ ─ ─ ─ ─ ─ ╮     │
│    HANDS-ON                          ██   ██           │
│    CURRICULUM                    │   ██   ██     │     │
│                                     ████ ████          │
│                                  ╰ ─ ─ ─ ─ ─ ─ ─ ╯     │
│    SESSION 01 · PRESENTATION 01                        │
│  · · · · · · · · · · · · · · · · · · · · · · · · · · · │
└────────────────────────────────────────────────────────┘
```

Recap thumbnails use a white notebook page, a blue spine, a `RECAP` heading and three ruled keyword entries. Their palette and layout distinguish them from the dark, dotted presentation thumbnails while retaining the brand colors and pixel icons. Every recap uses this layout, including project and cohort reviews without a session number. The guide, prompt, generator and validator are in `template/retrospective-thumbnail/`.

Diagrams inside the talk write-ups are quieter than the thumbnails: a white background, grey lines and a single blue. The rules, prompt and generator are in `template/session-diagram/`.

## Development and contributing

Requires Node.js 20 or later.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static build, including content validation
npm run lint
```

Content lives under `cohort-NN/` at the repository root, one folder per cohort. Members go in `members/*.yaml`, with their photos alongside them. `src/lib/content/schema.ts` is the reference for every field, and copying an existing file is the fastest way to start. Send changes as a Pull Request.

### Activity records

Activities shows presentations and retrospectives in one list per cohort, with a small type label on each post. There are no session folders to navigate through. Assignments are one possible activity; a later cohort can document projects or study groups in the same structure.

```text
cohort-01/
  activities/
    session-01-presentation-01/
      index.md
      index.en.md
      img/
      files/
  members/
```

Each activity has one `activities/{slug}/` folder. Use lowercase letters, numbers and hyphens for the slug, and keep it stable after publication. Existing presentations retain their numbers, such as `session-01-presentation-01`. A post without a session can use a descriptive name such as `cohort-retrospective`. English body text goes in `index.en.md`. Keep images in `img/` and PDFs in `files/` within the same post, and link to them using relative paths.

| Field | Rule |
| --- | --- |
| `type` | `presentation` or `retrospective` |
| `date` | `"YYYY-MM-DD"`. Publication date, or scheduled date for upcoming posts |
| `status` | `done` or `upcoming`; defaults to `done` |
| `title`, `description` | Title and optional description; a string or `{ ko, en }` |
| `keywords` | Exactly three; use English keywords of 1–28 characters for thumbnails |
| `session`, `presentation` | Optional positive integers for the related session and presentation |
| `speakers` | Optional list of speaker member IDs |
| `author` | String or `{ ko, en }`; optional. Use `{ group: core }` for an `@core` link to the cohort's Core section in Members |
| `thumbnail` | Optional image path; `img/thumbnail.svg` for the templates |

Use the following frontmatter for a retrospective. Add `session` only when a review relates to a session. A retrospective does not need a `presentation` number. See the [Session 02 retrospective](cohort-01/activities/session-02-retrospective/index.en.md) for a complete article.

```yaml
---
type: retrospective
date: "2026-10-15"
title:
  ko: 함께 배우는 방식을 돌아보며
  en: Reflecting on how we learn together
author:
  group: core
keywords: [Community, Feedback, Iteration]
thumbnail: img/thumbnail.svg
---
```

A retrospective can describe the activity's intent, actual outcomes, feedback, changes and lessons for the next round, with links to original work. An assignment format used by one cohort is not required of every retrospective.

### Lists and URLs

Cohorts use paths such as `/en/activities/cohort-01`, and posts use `/en/activities/cohort-01/{slug}`. Existing presentation URLs such as `/en/sessions/cohort-01/session-01/presentation-01` redirect to the new post URLs.

Search and filters are stored in the URL, so a reload or a shared link shows the same list. Desktop uses a short search field alongside filter buttons. Mobile keeps search and type visible, with status and sort inside an expandable filter panel. There are no platform-specific native dropdowns.

`session 02`, `session 2`, `session-02`, and `세션 02` all match presentations and recaps with `session: 2`. Search, type, and status conditions apply together. Oldest orders by date, session number, post type, presentation number, and slug; Newest reverses the entire order. For the same date and session, presentations precede recaps in chronological order.

| Parameter | Values | When omitted |
| --- | --- | --- |
| `q` | Search text | No search |
| `type` | `presentation`, `retrospective` | All types |
| `status` | `done`, `upcoming` | All statuses |
| `sort` | `newest`, `oldest` | Newest date first |

Example: `/en/activities/cohort-01?type=presentation&q=vpc&sort=oldest`.

### Thumbnails and diagrams

- Presentation thumbnails: `template/presentation-thumbnail/prompt.md`. The existing presentation layout and background are preserved.
- Retrospective thumbnails: `template/retrospective-thumbnail/prompt.md`. The generator below can create the default notebook icon immediately.
- Article diagrams: `template/session-diagram/README.md`. Generator sources also follow `diagrams/cohort-NN/activities/{slug}.py`.

```bash
node template/presentation-thumbnail/validate.mjs cohort-01/activities/session-01-presentation-01/img/thumbnail.svg
node template/retrospective-thumbnail/build.mjs cohort-01/activities/cohort-retrospective
node template/retrospective-thumbnail/validate.mjs cohort-01/activities/cohort-retrospective/img/thumbnail.svg
python template/session-diagram/build.py --check
```

Run the retrospective commands after writing that post's `index.md` and metadata. Remove any temporary posts or assets used for review before publishing the real content.
