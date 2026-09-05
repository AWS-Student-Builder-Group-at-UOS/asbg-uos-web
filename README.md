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
│   └── img/               # 멤버 사진 (4:5 비율, 900px 내외로 미리 리사이즈). 없으면 GitHub 프로필 사진을 씀
├── session-01/
│   ├── presentation-01/
│   │   ├── index.md      # frontmatter + 한국어 본문
│   │   ├── index.en.md   # 영어 본문 (없으면 한국어 본문을 그대로 보여줌)
│   │   ├── img/          # 이 발표의 썸네일과 본문 이미지
│   │   └── files/        # 이 발표의 자료. 상세 페이지 하단 "자료"에 자동으로 나열됨
│   └── presentation-02/ …
└── session-02/ …
```

`cohort-NN/` 안의 이미지·PDF는 `/content/cohort-NN/...` 경로로 그대로 서빙됩니다. 마크다운에서는 해당 글의 `index.md`가 있는 폴더 기준 상대 경로로 씁니다. (`![도식](img/diagram.svg)`, `[슬라이드](files/slides.pdf)`)

### 발표 `index.md`

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

### 세션에 발표 올리기

모든 글은 `session-NN/presentation-NN/index.md`에 작성합니다. 발표가 하나인 세션도 `presentation-01/`을 사용합니다. 기수·세션·발표 번호는 모두 두 자리로 씁니다.

`session-NN/`은 발표를 묶는 폴더이며, 그 안에는 `presentation-NN/` 폴더만 둡니다. 세션 대표 글은 만들지 않습니다. 발표를 추가할 때에는 `presentation-02/`, `presentation-03/`처럼 폴더를 늘리면 됩니다.

발표마다 별도 카드와 상세 페이지가 생기며, 같은 세션 안에서는 발표 번호순으로 표시됩니다. 각 발표의 `index.md`에 위 frontmatter와 본문을 작성하고 날짜·상태·제목·발표자 등을 개별적으로 지정합니다. 홈 통계는 완료된 발표를 각각 1건으로 집계하며, `upcoming` 발표는 제외합니다.

`presentation-01/index.md` 예시:

```markdown
---
date: 2026-09-08
status: done
title: ASBG UOS 소개
keywords: [ASBG, Community, Kickoff]
speakers: [son-subin]
---
동아리 소개와 이번 학기 운영 방식을 정리합니다.
```

`presentation-02/index.md` 예시:

```markdown
---
date: 2026-09-08
status: done
title: 첫 AWS 계정 안전하게 시작하기
keywords: [IAM, MFA, Budgets]
speakers: [lee-yena]
---
AWS 계정 보안 설정과 예산 알림을 정리합니다.
```

발표별 `index.en.md`, `img/`, `files/`도 같은 발표 폴더에 둡니다. 영어 본문이 없으면 한국어 본문을 보여줍니다. 첫 번째 발표 주소는 `/ko/sessions/cohort-01/session-01/presentation-01`이며, 영어 페이지는 맨 앞의 `ko`를 `en`으로 바꾼 주소입니다.

`cohort-02/session-01/presentation-01/`과 `presentation-02/`에는 화면 확인을 위한 가상의 발표 기록을 넣었습니다. 각 폴더에 한국어·영어 본문, 도식, PDF 체크리스트가 있으며, 실제 행사나 계정 작업의 기록은 아닙니다.

### 링크 미리보기

홈·목록 페이지에는 동아리 대표 이미지가, 발표 링크에는 해당 글의 `title`·`description`·`thumbnail`이 표시됩니다. 한국어·영어 주소에 맞는 Open Graph와 Twitter 카드 정보를 제공합니다.

완료된 발표의 썸네일은 빌드할 때 `/og/cohort-NN/session-NN/presentation-NN`에 1200×630 PNG로 자동 생성됩니다. 원본 비율과 전체 내용을 유지하며, 썸네일이 없는 글은 대표 이미지를 사용합니다. 원본 파일을 바꾸고 다시 배포하면 공유 이미지도 함께 갱신됩니다. 공유 서비스에 이미 저장된 미리보기는 해당 서비스의 캐시 갱신이 필요할 수 있습니다.

공유 이미지의 SVG 텍스트는 시스템 폰트에 의존하지 않도록 `src/assets/fonts/`의 Geist·Geist Mono를 사용합니다. [Geist v1.7.2](https://github.com/vercel/geist-font/tree/v1.7.2)의 `fonts/Geist/variable/Geist[wght].ttf`와 `fonts/GeistMono/variable/GeistMono[wght].ttf`를 수정 없이 포함했으며, 라이선스는 같은 폴더의 `OFL.txt`에 있습니다.

### 멤버 `core.yaml` / `general.yaml`

```yaml
- id: hwang-sujin           # 소문자·하이픈. @멘션 링크와 페이지 앵커(#hwang-sujin)에 쓰임
  name: { ko: 황수진, en: Sujin Hwang }
  role: Tech Lead           # 선택 (코어팀)
  major: { ko: 컴퓨터과학부, en: Computer Science }
  photo: img/hwang-sujin.jpg  # 선택. 비우면 links.github 의 프로필 사진을 대신 보여줌
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
│   ├── layout.tsx           # 루트 <html>·테마. lang 은 첫 로드는 인라인 스크립트, 언어 전환은 HtmlLang 이 맞춤
│   ├── [locale]/            # ko · en. 헤더·푸터, 홈, sessions, members, resources
│   ├── content/[...path]/   # cohort-NN/ 안의 정적 파일을 빌드 시점에 그대로 내보내는 라우트
│   └── og/                 # 동아리 대표 이미지와 발표별 공유용 PNG
├── components/
│   ├── icons.tsx            # 16×16 픽셀 아이콘 전부 (문자열 격자로 정의)
│   ├── ui/                  # Container · Section · Chip · Button · CopyButton · CohortTabs · Trace
│   ├── layout/              # Header · Footer · Logo · LocaleSwitch · ThemeToggle · ThemeProvider · HtmlLang
│   ├── diagrams/            # Loop(히어로 폐루프) · Architecture(요청 경로) · Gap(수업↔동아리) · PixelField
│   ├── home/ sessions/ members/
└── lib/
    ├── content/             # cohort 폴더 파싱 (schema.ts 가 콘텐츠 형식의 기준)
    ├── i18n/                # locales · dict/ko.ts · dict/en.ts
    ├── metadata.ts          # 페이지별 제목·소개·공유 이미지·대표 URL
    ├── routes.ts · site.ts  # URL 규칙 · 채널 링크 상수
```

디자인 토큰(색·라운드·그림자·글꼴)은 `src/app/globals.css` 한 곳에 있습니다. 색은 하늘(`--sky`)·파랑(`--blue`)·흰·검 넷을 기준으로 불투명도만 달리해 씁니다.
