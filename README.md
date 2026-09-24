# ASBG UOS Web

AWS Student Builder Groups at University of Seoul(ASBG UOS)의 공식 웹사이트입니다. ASBG는 AWS가 대학 단위로 운영하는 공식 학생 커뮤니티이며, ASBG UOS는 그 서울시립대 그룹입니다. 이 사이트는 동아리를 처음 접하는 분에게 활동을 소개하고, 기수별 발표 기록과 멤버, 공식 채널을 한곳에 모아 보여 줍니다.

| 구분 | 주소 |
| --- | --- |
| 프로덕션 | https://asbg.uos.ac.kr |
| 개발 확인용 | https://asbg-uos.vercel.app |

## 설계 원칙

이 사이트의 목적은 ASBG UOS를 소개하는 것입니다. 운영 비용이 들지 않고, 운영진이 바뀌어도 유지보수가 쉽고, 누구나 부담 없이 기여할 수 있어야 한다는 세 가지 조건을 먼저 정한 뒤 구현을 그에 맞게 최대한 단순하게 가져갔습니다.

- **데이터베이스와 관리자 페이지가 없습니다.** 모든 콘텐츠는 이 저장소의 `cohort-NN/` 폴더에 마크다운과 YAML로 들어 있고, 빌드 시점에 읽어 정적 페이지로 만듭니다. 서버, DB, 로그인 기능을 운영하지 않으니 비용과 장애 지점이 함께 사라집니다.
- **외부 서비스에 기대지 않습니다.** CMS, 스토리지, API 키 같은 외부 의존성 없이 저장소 하나로 완결됩니다. 사진과 PDF도 저장소에 함께 둡니다. 호스팅을 옮겨야 할 때도 코드를 고칠 일이 없습니다.
- **기여는 파일을 추가하는 일입니다.** 발표를 올리거나 멤버를 등록하는 작업은 폴더와 파일을 만드는 것이 전부라, 웹 개발을 모르는 멤버도 GitHub에서 Pull Request로 참여할 수 있습니다. 형식이 틀리면 빌드가 어느 파일의 어느 필드인지 알려 주며 실패하므로 잘못된 내용이 배포되지 않습니다.
- **구현을 작게 유지합니다.** 프레임워크의 기본 기능을 우선 쓰고 라이브러리는 꼭 필요한 것만 더합니다. 코드를 처음 보는 사람도 구조를 금방 파악할 수 있어야 하기 때문입니다.

## 기술 스택

### 핵심

| 기술 | 역할 |
| --- | --- |
| Next.js 16 (App Router) | 정적 페이지 생성, 라우팅, 메타데이터, 공유 이미지 |
| TypeScript | 콘텐츠 형식까지 타입으로 관리 |
| Tailwind CSS 4 | 스타일. 디자인 토큰은 `src/app/globals.css` 한 곳에 정의 |
| Vercel | 빌드와 배포 |

### 세부

| 영역 | 사용 |
| --- | --- |
| 콘텐츠 | Markdown + YAML frontmatter, react-markdown, remark-gfm |
| 콘텐츠 검증 | zod. 빌드 시 스키마 검사 |
| 다국어 | `app/[locale]` 라우트와 `ko` · `en` 사전 파일 |
| 테마 | next-themes. 라이트 · 다크 |
| 공유 이미지 | next/og, sharp. 발표 썸네일 SVG를 PNG로 변환 |
| 글꼴 | Pretendard, Geist Mono |
| 코드 검사 | ESLint (eslint-config-next) |

### Next.js를 고른 이유

- **검색과 공유에 강합니다.** 모든 페이지가 빌드 시점에 완성된 HTML로 만들어지고, 페이지마다 제목과 설명, 대표 URL, 언어별 대체 링크(hreflang), Open Graph 이미지가 붙습니다. 검색 엔진에도, 링크를 공유했을 때의 미리보기에도 잘 잡힙니다.
- **서버 없이 돌아갑니다.** 콘텐츠 폴더를 빌드 때 읽어 정적 페이지를 만들므로 런타임에 실행되는 서버 로직이 없습니다.
- **기본 기능으로 충분합니다.** 파일 기반 라우팅, 메타데이터 API, OG 이미지 생성이 프레임워크에 들어 있어 다국어 경로와 공유 이미지를 별도 라이브러리 없이 구현했습니다.
- **배포가 단순합니다.** Git에 push하면 Vercel이 빌드하고 배포합니다. 브랜치마다 미리보기 주소가 생겨 확인이 쉽습니다.

## 디자인

### 색

서울시립대 하면 떠오르는 파랑 계열을 기준색으로 삼았습니다. 색은 네 가지만 쓰고, 회색과 반투명 배경은 이 네 색의 불투명도를 달리해 만듭니다.

| 이름 | 값 | 쓰임 |
| --- | --- | --- |
| Sky | `#42B4FF` | 강조, 픽셀 아이콘, 다크 모드의 링크와 버튼 |
| Blue | `#1160D8` | 라이트 모드의 링크와 버튼 |
| White | `#FFFFFF` | 라이트 모드 바탕 |
| Black | `#0B0F17` | 글자, 다크 모드 바탕 |

### 요소

- **픽셀 아이콘.** 아이콘은 모두 16×16 격자로 그린 픽셀 아트이며 `src/components/icons.tsx`에 문자열 격자로 정의합니다. 로고, 채널 아이콘, 도식이 같은 격자를 씁니다.
- **점 격자 배경과 코너 마크.** 회로 기판을 연상시키는 점 격자와 코너 마크가 섹션과 카드에 반복됩니다.
- **세션 썸네일.** 발표마다 1200×750 SVG를 같은 규격으로 만듭니다. 가이드, 프롬프트, 검증 스크립트는 `template/session-thumbnail/`에 있습니다.
- **라이트 · 다크 모드와 한국어 · 영어**를 지원합니다.

## 시작하기

Node.js 20 이상이 필요합니다.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # 정적 빌드. 콘텐츠 형식 검사 포함
npm run lint
```

## 콘텐츠 올리기

콘텐츠는 저장소 루트의 `cohort-NN/` 폴더에 있습니다. 기수 폴더 하나가 Sessions와 Members의 탭 하나가 되며, 폴더를 추가하면 자동으로 반영됩니다. 기수 · 세션 · 발표 번호는 모두 두 자리로 씁니다.

```
cohort-01/
├── members/
│   ├── core.yaml            # Core Members
│   ├── general.yaml         # General Members
│   └── img/                 # 멤버 사진 (4:5, 900px 내외). 없으면 GitHub 프로필 사진을 씀
└── session-01/
    └── presentation-01/
        ├── index.md         # frontmatter + 한국어 본문
        ├── index.en.md      # 영어 본문. 없으면 한국어 본문을 보여 줌
        ├── img/             # 썸네일과 본문 이미지
        └── files/           # 발표 자료. 상세 페이지 하단에 자동으로 나열
```

`cohort-NN/` 안의 이미지와 PDF는 `/content/cohort-NN/...` 주소로 그대로 서빙되며, 마크다운에서는 `index.md`가 있는 폴더 기준 상대 경로로 씁니다. (`![도식](img/diagram.svg)`)

### 발표

세션은 발표를 묶는 폴더이고, 글은 항상 `session-NN/presentation-NN/index.md`에 씁니다. 발표가 하나인 세션도 `presentation-01/`을 씁니다. 발표마다 카드와 상세 페이지가 생기고, 완료된 발표는 홈 통계에 각각 1건으로 집계됩니다.

```yaml
---
date: 2026-09-29                       # YYYY-MM-DD
status: upcoming                       # 생략하면 done. upcoming이면 예고만 표시
title:
  ko: 온라인 쇼핑몰, 첫 서버를 열다
  en: An Online Store Opens Its First Server
description:                           # 카드 요약 (선택)
  ko: …
  en: …
keywords: [VPC, EC2, Security Group]   # 정확히 3개
speakers: [hwang-sujin]                # 같은 기수 members/*.yaml 의 id
thumbnail: img/thumbnail.svg           # 선택. 없으면 기본 그림을 보여 줌
---
본문(마크다운)
```

### 멤버

`members/core.yaml`과 `members/general.yaml`에 목록으로 씁니다.

```yaml
- id: hwang-sujin                      # 소문자와 하이픈. @멘션과 페이지 앵커에 쓰임
  name: { ko: 황수진, en: Sujin Hwang }
  role: Tech Lead                      # 선택
  major: { ko: 컴퓨터과학부, en: Computer Science }
  photo: img/hwang-sujin.jpg           # 선택. 없으면 links.github 의 프로필 사진
  links:                               # github · linkedin · website 중 1개 이상
    github: https://github.com/…
  keywords: [Linux, Networking, Container]   # 정확히 3개
  description:
    ko: …
    en: …
```

`ko` / `en`이 필요한 필드는 문자열 하나만 써도 되고(두 언어 공용), `en`을 비우면 `ko`로 대체됩니다.

## 코드 구조

```
src/
├── app/
│   ├── [locale]/            # ko · en 페이지: 홈, sessions, members, resources
│   ├── content/[...path]/   # cohort-NN/ 안의 파일을 그대로 내보내는 라우트
│   └── og/                  # 대표 이미지와 발표별 공유 이미지
├── components/              # icons, ui, layout, diagrams, home, sessions, members
└── lib/
    ├── content/             # cohort 폴더 파싱. schema.ts 가 콘텐츠 형식의 기준
    ├── i18n/                # locales, dict/ko.ts, dict/en.ts
    └── metadata.ts, routes.ts, site.ts
```
