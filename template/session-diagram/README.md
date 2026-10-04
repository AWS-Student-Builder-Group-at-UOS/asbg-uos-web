# 세션 도식

발표 본문(`index.md`)에 들어가는 도식 `img/diagram-*.svg`를 그리는 규칙과 생성 스크립트입니다. 표지 썸네일은 `../presentation-thumbnail/`을 따릅니다.

도식은 코드로 그립니다. `diagrams/` 아래 파이썬 파일 하나가 발표 하나의 도식을 담고, `build.py`가 그 코드로 SVG를 만들어 발표 폴더의 `img/`에 씁니다. 글자 폭을 실제 글꼴로 재서 상자를 넘치면 멈추고, 쓴 글자만 담은 글꼴을 SVG 안에 넣어 어느 기기에서나 사이트와 같은 글꼴로 보입니다.

## 규칙

| 항목 | 규칙 |
|---|---|
| 크기 | viewBox 폭은 800으로 고정하고 높이는 내용에 맞춘다. 바깥 여백은 32. 모든 도식의 폭이 같아야 본문에서 글자 크기가 같아진다 |
| 바탕과 모양 | 흰 바탕, 직각 모서리. 바깥 테두리는 본문이 그리므로 넣지 않는다 |
| 색 | 아래 표의 회색과 파랑만 쓴다. 파랑은 그 도식에서 독자가 가져갈 한 가지에만 |
| 글자 | Pretendard. 이름은 600, 설명은 400. IP, 경로, 명령어처럼 코드에 가까운 글자는 Geist Mono. 이름 14~16, 설명 13~14, 주석 12~13. 12보다 작게 쓰지 않는다 |
| 번호 | 순서가 있을 때만 붙인다 |
| 영어판 | 같은 함수가 `lang="en"`으로 그린다. 두 언어가 레이아웃을 함께 쓰므로 더 긴 쪽에 맞춰 폭을 잡는다 |

넣지 않는 것도 정해 두었습니다.

- 이미지 안의 제목, 부제, 결론 문장. 본문의 소제목과 문단이 이미 말하고 있다.
- "01" 같은 작은 눈썹 번호, 카드 왼쪽의 색띠, 그림자와 그라디언트, 장식용 아이콘.
- 가운뎃점으로 이어 붙인 나열(`A · B · C`)과 문장 속 `=`, `→`. 쉼표와 짧은 문장으로 쓴다.

| 이름 | 값 | 쓰는 곳 |
|---|---|---|
| `INK` | `#0B0F17` | 이름, 중요한 글자, 진한 테두리 |
| `BODY` | `#2B323B` | 본문 글자 |
| `MUTED` | `#5B6470` | 설명, 기본 화살표 |
| `FAINT` | `#8A94A0` | 흐린 주석, 막힌 길 |
| `STROKE` | `#C5CCD4` | 상자 테두리 |
| `HAIR` | `#E3E7EC` | 구분선 |
| `REGION` | `#F4F6F8` | VPC, 서브넷 같은 영역의 바탕 |
| `ACCENT` | `#1160D8` | 핵심 하나 |
| `ACCENT_SOFT` | `#EDF3FC` | 강조한 상자의 바탕 |

## 실행

Python 3.10 이상이 필요합니다. 저장소 루트에서 실행합니다.

```bash
pip install -r template/session-diagram/requirements.txt
python template/session-diagram/build.py
```

| 명령 | 하는 일 |
|---|---|
| `build.py` | 모든 도식을 그리고, 그림이 바뀐 파일만 다시 쓴다 |
| `build.py session-03` | 경로에 이 글자가 들어간 도식만 그린다 |
| `build.py --preview` | 본문 폭으로 모아 보는 `.cache/preview.html`을 만든다. 브라우저로 연다 |
| `build.py --check` | 파일을 쓰지 않고, 코드와 다른 SVG가 있으면 실패한다 |

처음 실행할 때 사이트와 같은 Pretendard v1.3.9를 jsDelivr에서 받고 굵기별 사본을 만들어 `.cache/`에 둡니다(30초쯤 걸립니다). Geist Mono는 `src/assets/fonts/`의 것을 씁니다. `.cache/`는 커밋하지 않습니다.

## 새 도식 추가

1. 발표 폴더와 같은 경로로 파일을 만든다. `cohort-01/activities/session-03-presentation-01`이면 `diagrams/cohort-01/activities/session-03-presentation-01.py`.
2. 도식 하나가 함수 하나다. 함수는 `lang`을 받아 `Diagram`을 돌려준다. 문구는 함수 첫머리의 `t = {"ko": ..., "en": ...}`에 모은다.
3. 파일 끝 `DIAGRAMS`에 파일 이름과 함수를 적는다. `"diagram-vpc": vpc`는 `img/diagram-vpc.svg`가 되고 영어는 `img/diagram-vpc.en.svg`가 된다. 영어 본문이 없는 발표는 `LANGS = ("ko",)`.
4. `build.py <발표 경로> --preview`로 확인한 뒤 본문에 `![대체 텍스트](img/diagram-vpc.svg)`로 넣는다. 대체 텍스트에는 그림이 말하는 내용을 문장으로 쓴다.

비슷한 기존 도식을 복사해 고치는 것이 가장 빠릅니다.

| 모양 | 예시 (`diagrams/cohort-01/activities/`) |
|---|---|
| 단계가 이어지는 흐름 | `session-01-presentation-01.py` `diagram`, `session-01-presentation-03.py` `roadmap` |
| 같은 틀을 여러 장 나란히 | `session-01-presentation-03.py` `ha`, `session-02-presentation-01.py` `flow` |
| 영역 안에 영역이 든 구조 | `session-02-presentation-01.py` `nesting`, `vpc_map`, `session-02-presentation-02.py` `build_order` |
| 두 가지 비교 | `session-02-presentation-01.py` `lb`, `security`, `session-02-presentation-02.py` `tiers` |
| 누가 어디서 무엇을 하는 순서 | `session-01-presentation-04.py` `attitude`, `session-02-presentation-02.py` `deploy` |
| 표와 목록 | `session-02-presentation-02.py` `requests`, `sg_rules` |

## 도구

`kit.py`의 `Diagram`에 그리는 메서드가 있습니다. 좌표는 모두 px이고 글자의 `y`는 바닥선입니다.

| 메서드 | 쓰임 |
|---|---|
| `Diagram(높이, 대체 텍스트)` | 도식 한 장 |
| `box(x, y, w, h, 이름, 설명)` | 이름과 설명이 가운데 놓인 상자. 넘치면 멈춘다 |
| `arrow([(x, y), ...])` | 꺾인 선 화살표. `head="both"`, `dash="4 4"`, `color=ACCENT` |
| `text(x, y, 글자)` | 한 줄. 한 줄 안에서 스타일을 바꿀 땐 `[Run("굵게", wt=700), Run(" 보통")]` |
| `para(x, y, 문장, maxw=폭)` | 폭에 맞춰 줄을 나누는 문단. 리스트를 주면 그 줄바꿈 그대로 |
| `mid(가운데 y, 크기)` | 글자가 눈으로 보기에 가운데 오는 바닥선 |
| `fits(글자, 크기, 폭)` | 폭을 넘으면 멈춘다. 직접 놓은 글자에 쓴다 |
| `rect`, `line`, `path` | 기본 도형 |
| `numbered`, `badge` | 단계 번호. 흐린 숫자와 이름, 또는 검은 정사각형 배지 |
| `chip` | 명령어 같은 짧은 글자의 회색 바탕 |
| `cross`, `lock` | 막힌 곳 표시, 자물쇠 |

SVG에 들어가는 Pretendard와 Geist Mono는 둘 다 SIL Open Font License를 따릅니다.
