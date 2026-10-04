# 활동 도식 생성 프롬프트

아래 전체를 복사해 저장소를 읽고 명령을 실행할 수 있는 AI에게 전달한다. 맨 위 입력의 경로와 근거 자료만 바꾼다. 발표와 회고를 비롯한 모든 활동 게시물의 본문 도식에 같은 규칙을 적용한다.

---

## 입력

- 활동 폴더: `cohort-NN/activities/{slug}`
- 본문: 활동 폴더의 `index.md`, 영어 본문이 있으면 `index.en.md`
- 근거 자료: 본문에 연결된 발표 자료, 활동 기록, 결과물 또는 GitHub 원문
- 공통 도구: `template/activity-diagram/kit.py`, `template/activity-diagram/build.py`

## 작업

본문을 읽고 구조, 흐름, 비교를 이해하는 데 필요한 SVG 도식을 만든다. 문단을 그대로 옮기거나 장식하기 위한 그림은 만들지 않는다. 도식마다 독자가 가져갈 한 가지를 정하고, 근거 자료에 있는 숫자와 서비스 이름, 순서만 사용한다. 회고에서는 실제로 확인한 결과와 계획을 구분하며 학생 성과를 추측하지 않는다.

공통 도구만 저장소에 유지한다. 게시물별 생성 소스와 미리보기는 임시 디렉토리에 만들고 검토 후 삭제한다. 저장소에는 완성된 SVG와 이를 연결한 본문만 남긴다. 기존 도식은 활동 폴더의 SVG를 참고하되 생성 코드를 모으는 디렉토리는 만들지 않는다.

## 디자인 규칙

| 항목 | 규칙 |
| --- | --- |
| 크기 | viewBox 폭 800, 바깥 여백 32. 높이는 내용에 맞춘다 |
| 바탕과 모양 | 흰 바탕과 직각 모서리. 바깥 테두리는 본문이 그리므로 넣지 않는다 |
| 색 | 아래 공통 색만 쓴다. 파랑은 독자가 가져갈 핵심 하나에 사용한다 |
| 글자 | Pretendard. 이름 굵기 600, 설명 400. IP, 경로, 명령어는 Geist Mono |
| 글자 크기 | 이름 14~16, 설명 13~14, 주석 12~13. 12보다 작게 쓰지 않는다 |
| 번호 | 순서가 있을 때만 붙인다 |
| 영어판 | 같은 함수가 `lang="en"`으로 그린다. 두 언어 중 더 긴 문구에 맞춰 공간을 잡는다 |

이미지 안에 제목, 부제, 결론 문장을 반복하지 않는다. 본문의 소제목과 문단이 그 역할을 맡는다. 작은 눈썹 번호, 상자 옆 색띠, 그림자, 그라디언트와 장식용 아이콘도 넣지 않는다. 가운뎃점으로 이어 붙인 나열과 문장 속 `=`, `→` 대신 쉼표와 짧은 문장을 쓴다.

| 상수 | 값 | 용도 |
| --- | --- | --- |
| `INK` | `#0B0F17` | 이름, 중요한 글자, 진한 테두리 |
| `BODY` | `#2B323B` | 본문 글자 |
| `MUTED` | `#5B6470` | 설명, 기본 화살표 |
| `FAINT` | `#8A94A0` | 흐린 주석, 막힌 길 |
| `STROKE` | `#C5CCD4` | 상자 테두리 |
| `HAIR` | `#E3E7EC` | 구분선 |
| `REGION` | `#F4F6F8` | VPC, 서브넷 같은 영역의 바탕 |
| `ACCENT` | `#1160D8` | 핵심 하나 |
| `ACCENT_SOFT` | `#EDF3FC` | 강조한 상자의 바탕 |
| `WHITE` | `#FFFFFF` | 바탕 |

## 임시 소스 작성

Python 3.10 이상에서 저장소 루트 기준으로 실행한다. 의존성이 없으면 먼저 설치한다.

```bash
pip install -r template/activity-diagram/requirements.txt
```

임시 `.py` 파일에서 `from kit import Diagram, Run, ...`으로 필요한 도구만 가져온다. `build.py`가 공통 도구의 위치를 연결하므로 경로나 `sys.path`를 소스에 넣지 않는다.

- 도식 하나는 `lang`을 받아 `Diagram`을 반환하는 함수 하나다.
- 함수 첫머리에 `t = {"ko": ..., "en": ...}[lang]`처럼 문구를 모으고 같은 레이아웃을 쓴다.
- `DIAGRAMS = {"diagram-flow": flow}`처럼 출력 이름과 함수를 연결한다. 이름은 `diagram` 또는 `diagram-` 뒤 소문자·숫자·하이픈으로 짓는다. 경로나 확장자를 넣지 않는다.
- 영어 본문이 있으면 `LANGS = ("ko", "en")`, 없으면 `LANGS = ("ko",)`로 둔다. 생략하면 한국어만 만든다.
- `diagram-flow`는 `img/diagram-flow.svg`, 영어판은 `img/diagram-flow.en.svg`가 된다.
- 상자 하나에는 이름 한 줄과 설명 한두 줄을 담는다. 직접 놓는 글자는 `fits`로 폭을 확인한다.

`Diagram` 좌표는 px이며 글자의 `y`는 바닥선이다.

| API | 용도 |
| --- | --- |
| `Diagram(height, label)` | 높이와 그림의 의미를 설명하는 대체 텍스트로 도식 생성 |
| `box(x, y, w, h, title, sub)` | 이름과 설명을 가운데 놓은 상자. 글자가 폭을 넘으면 실패 |
| `arrow([(x, y), ...])` | 꺾인 선 화살표. `head="both"`, `dash="4 4"`, `color=ACCENT` 지원 |
| `text(x, y, text)` | 한 줄. 혼합 스타일은 `[Run("강조", wt=600), Run(" 설명")]` |
| `para(x, y, text, maxw=width)` | 폭에 맞춰 줄을 나누는 문단. 문자열 목록은 지정한 줄바꿈을 유지 |
| `mid(center_y, size)` | 시각적으로 가운데 놓이는 글자 바닥선 |
| `fits(text, size, maxw)` | 글자가 지정한 폭을 넘으면 실패 |
| `rect`, `line`, `path` | 기본 도형 |
| `numbered`, `badge` | 순서가 있는 단계 번호 |
| `chip` | 명령어 같은 짧은 글자의 회색 바탕 |
| `cross`, `lock` | 막힌 곳 표시와 자물쇠 |

글자 폭은 실제 글꼴로 측정하며, SVG에는 사용한 글자만 담은 글꼴을 내장한다. 첫 실행 때 Pretendard v1.3.9를 jsDelivr에서 받아 공통 도구의 `.cache/fonts/`에 캐시한다. Geist Mono는 `src/assets/fonts/`의 파일을 쓴다. 두 글꼴 모두 SIL Open Font License를 따르며 글꼴 캐시는 커밋하지 않는다.

## 생성과 검토

`source`는 임시 파이썬 파일, `output`은 활동 폴더 또는 그 안의 `img/` 경로다. `img/`를 지정하면 그곳에 바로 쓰고, 활동 폴더를 지정하면 그 안의 `img/`에 쓴다. `.py` 파일은 직접 실행되므로 직접 작성했거나 검토한 소스만 사용한다.

```bash
python template/activity-diagram/build.py /tmp/activity-diagrams.py cohort-NN/activities/{slug} --preview /tmp/activity-diagrams.html
python template/activity-diagram/build.py /tmp/activity-diagrams.py cohort-NN/activities/{slug}/img --check
```

1. 첫 명령으로 SVG와 임시 미리보기를 만든다. 다른 SVG는 건드리지 않고 `DIAGRAMS`에 선언한 파일 중 바뀐 것만 쓴다.
2. 미리보기를 브라우저에서 본문 폭으로 확인한다. 두 언어에서 글자 겹침, 상자 밖으로 나간 글자, 한 단어만 넘어간 줄바꿈을 고친다. 자동 폭 검사만으로 도형 간 겹침까지 확인했다고 판단하지 않는다.
3. `--check`로 소스와 출력이 같은지 확인한다. SVG가 없거나 내용이 다르면 실패하며 SVG와 미리보기는 쓰지 않는다. `--preview`와 함께 사용할 수 없다.
4. 본문의 알맞은 문단 뒤에 `![그림이 말하는 내용](img/diagram-flow.svg)`를 넣는다. 영어 본문은 `.en.svg`를 연결한다.
5. 임시 소스와 미리보기를 삭제한다. 저장소에 게시물별 생성 코드, 검토용 이미지나 테스트 파일을 남기지 않는다.

## 출력

- 활동 폴더의 `img/diagram-*.svg`와 필요한 영어판.
- 도식을 연결한 `index.md`, `index.en.md`.
- 도식마다 보여 주는 내용과 확인한 결과를 한 줄씩 보고한다.
