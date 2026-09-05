# ASBG UOS Web

AWS Student Builder Groups at University of Seoul 공식 웹사이트. 활동 소개, 기수별 세션 기록, 멤버, 채널을 담습니다.

- 배포: https://asbg-uos.vercel.app
- 스택: Next.js (App Router) · TypeScript · Tailwind CSS v4 · React Markdown · YAML
- DB·관리자 페이지 없음. 콘텐츠는 이 레포의 `cohort-NN/` 폴더를 빌드 시점에 읽어 정적 페이지로 만듭니다.

## 시작하기

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # 정적 빌드 (콘텐츠 검증 포함)
npm run lint
```

## 콘텐츠 구조

기수 폴더 하나가 Sessions·Members의 탭 하나가 됩니다. 폴더를 추가하면 자동으로 반영됩니다.

```
cohort-01/
├── members/
│   ├── core.yaml          # Core Members
│   ├── general.yaml       # General Members
│   └── img/               # 멤버 사진 (4:5 비율, 900px 내외로 미리 리사이즈)
├── session-01/
│   ├── index.md           # frontmatter + 한국어 본문
│   ├── index.en.md        # 영어 본문 (없으면 한국어 본문을 그대로 보여줌)
│   ├── img/               # 썸네일과 본문에서 참조하는 이미지
│   └── files/             # 발표 자료 등. 상세 페이지 하단 "자료"에 자동으로 나열됨
└── session-02/ …
```

`cohort-NN/` 안의 이미지·PDF는 `/content/cohort-NN/...` 경로로 그대로 서빙됩니다. 마크다운에서는 세션 폴더 기준 상대 경로로 씁니다. (`![도식](img/diagram.svg)`, `[슬라이드](files/slides.pdf)`)

### 세션 `index.md`

```yaml
---
date: 2026-09-29            # YYYY-MM-DD
status: upcoming            # 생략하면 done. upcoming이면 예고만 표시되고 상세 페이지는 만들지 않음
title:
  ko: 온라인 쇼핑몰, 첫 서버를 열다
  en: An Online Store Opens Its First Server
description:                # 카드 요약 (선택, 예고 세션은 생략 가능)
  ko: …
  en: …
keywords: [VPC, EC2, Security Group]   # 정확히 3개
speakers: [hwang-sujin]     # 같은 기수 members/*.yaml 의 id. 카드에 @멘션으로 표시됨
thumbnail: img/thumbnail.svg
---
본문(마크다운)…
```

### 멤버 `core.yaml` / `general.yaml`

```yaml
- id: hwang-sujin           # 소문자·하이픈. @멘션 링크와 페이지 앵커(#hwang-sujin)에 쓰임
  name: { ko: 황수진, en: Sujin Hwang }
  role: Tech Lead           # 선택 (코어팀)
  major: { ko: 컴퓨터과학부, en: Computer Science }
  photo: img/hwang-sujin.jpg
  links:                    # github · linkedin · website 중 1개 이상
    github: https://github.com/…
  keywords: [Linux, Networking, Container]   # 정확히 3개
  description:
    ko: …
    en: …
```

`ko`/`en`이 필요한 필드는 문자열 하나만 써도 되고(두 언어 공용), `en`을 비우면 `ko`로 대체됩니다. 형식이 틀리면 `npm run build`가 어느 파일의 어느 필드인지 알려주며 실패합니다.

## 코드 구조

```
src/
├── app/
│   ├── [locale]/            # ko · en. 레이아웃(헤더·푸터·테마), 홈, sessions, members, resources
│   └── content/[...path]/   # cohort-NN/ 안의 정적 파일을 빌드 시점에 그대로 내보내는 라우트
├── components/
│   ├── icons.tsx            # 16×16 픽셀 아이콘 전부 (문자열 격자로 정의)
│   ├── ui/                  # Container · Section · Chip · Button · CopyButton · CohortTabs · Trace
│   ├── layout/              # Header · Footer · Logo · LocaleSwitch · ThemeToggle
│   ├── diagrams/            # Loop(폐루프 도식) · PixelField
│   ├── home/ sessions/ members/
└── lib/
    ├── content/             # cohort 폴더 파싱 (schema.ts 가 콘텐츠 형식의 기준)
    ├── i18n/                # locales · dict/ko.ts · dict/en.ts
    ├── routes.ts · site.ts  # URL 규칙 · 채널 링크 상수
```

디자인 토큰(색·라운드·그림자·글꼴)은 `src/app/globals.css` 한 곳에 있습니다. 색은 하늘(`--sky`)·파랑(`--blue`)·흰·검 넷을 기준으로 불투명도만 달리해 씁니다.
