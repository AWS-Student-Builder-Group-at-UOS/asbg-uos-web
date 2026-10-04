# 세션 도식 생성 프롬프트

아래 전체를 복사해 AI에게 전달한다. 맨 위 "입력"의 경로만 고쳐 쓴다. 저장소를 읽고 명령을 실행할 수 있는 AI(Claude Code 같은)에게 맡기는 것을 전제로 한다.

---

## 입력

- 가이드: `template/session-diagram/README.md`
- 발표 폴더: `cohort-01/activities/session-03-presentation-01`
- 발표 자료: `cohort-01/activities/session-03-presentation-01/index.md`, `cohort-01/activities/session-03-presentation-01/files/slides.pdf`

## 작업

너는 ASBG UOS 웹사이트의 발표 본문에 들어갈 도식을 만든다. 위 가이드의 규칙을 기준으로 삼고, `template/session-diagram/kit.py`로 그리고, `template/session-diagram/build.py`로 SVG를 만든다.

## 절차

1. 발표 자료를 읽고 글만으로는 머릿속에 그리기 어려운 곳을 고른다. 무엇이 무엇 안에 있는지(구조), 무엇이 어디로 가는지(흐름), 둘이 어떻게 다른지(비교)가 있는 곳이다. 문단을 그대로 옮긴 그림이나 장식용 그림은 만들지 않는다. 보통 발표 하나에 두 개에서 여덟 개.
2. 도식마다 독자가 그림에서 가져갈 한 가지를 한 문장으로 정한다. 파란색은 그 한 가지에만 쓴다.
3. `template/session-diagram/diagrams/`에서 모양이 비슷한 기존 도식을 찾아 복사해 고친다. 가이드의 "새 도식 추가" 표에 모양별 예시가 있다. 파일은 발표 폴더와 같은 경로에 만든다.
4. 발표 폴더에 `index.en.md`가 있으면 같은 함수에 영어 문구를 넣고 `LANGS = ("ko", "en")`으로 둔다. 없으면 `LANGS = ("ko",)`.
5. `python template/session-diagram/build.py <발표 경로> --preview`를 실행하고 `.cache/preview.html`을 본문 폭에서 확인한다. 글자 겹침, 상자 밖으로 나간 글자, 한 단어만 다음 줄로 넘어간 줄바꿈이 없어야 한다. 렌더링할 수 없는 환경이면 좌표와 `fits`로 겹침을 확인한다.
6. `index.md`(있으면 `index.en.md`도)의 알맞은 문단 뒤에 `![대체 텍스트](img/diagram-이름.svg)`로 넣는다. 영어 본문에서는 `.en.svg`를 쓴다. 대체 텍스트에는 그림이 말하는 내용을 한 문장으로 쓴다.
7. `python template/session-diagram/build.py --check`가 통과하는지 확인한다.

## 규칙

- 가이드의 규칙을 따른다. 특히 이미지 안에 제목, 부제, 결론 문장을 넣지 않는다. 본문이 이미 말한다.
- 내용은 발표 자료에 있는 것만 쓴다. 숫자, 서비스 이름, 순서를 지어내지 않는다.
- 문구는 짧게 쓴다. 상자 하나에 이름 한 줄과 설명 한두 줄까지.
- 색, 글꼴, 크기를 새로 만들지 않는다. `kit.py`의 상수만 쓴다.

## 출력

- `template/session-diagram/diagrams/<발표 경로>.py`
- 발표 폴더의 `img/diagram-*.svg`(영어 본문이 있으면 `*.en.svg`도)와 그림을 넣은 `index.md`, `index.en.md`
- 마지막에 도식마다 무엇을 보여 주는지 한 줄씩 보고한다.
