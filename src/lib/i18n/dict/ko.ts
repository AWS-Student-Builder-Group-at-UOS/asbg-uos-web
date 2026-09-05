import { pad2 } from "@/lib/utils";

export const ko = {
  meta: {
    description:
      "서울시립대학교 AWS Student Builder Group. 클라우드를 배우고, 직접 만들고, 나누는 사람들의 기록입니다.",
  },
  nav: { home: "Home", sessions: "Sessions", members: "Members", resources: "Resources" },
  a11y: { openMenu: "메뉴 열기", closeMenu: "메뉴 닫기", theme: "다크 모드 전환", locale: "언어" },
  cohort: (n: number) => `${n}기`,
  session: (n: number) => `Session ${pad2(n)}`,

  home: {
    hero: {
      eyebrow: "AWS Student Builder Groups at University of Seoul",
      title: ["클라우드를 배우고,", "직접 만들고, 나눕니다."],
      body: "서울시립대학교의 AWS 공식 학생 커뮤니티입니다. 개념을 배우고, 각자의 계정에서 직접 만들어 보고, 만든 것을 서로에게 설명하는 과정을 한 학기 단위로 반복합니다.",
      primary: "세션 기록 보기",
      secondary: "멤버 소개",
    },
    stats: { members: "활동 멤버", sessions: "진행한 세션", cohorts: "운영 기수" },
    why: {
      eyebrow: "Why we started",
      title: "왜 모였나",
      body: [
        "수업에서는 무엇을 만드는지 배우지만, 만든 것을 인터넷에 올리고 지켜내는 마지막 단계는 각자의 검색과 시행착오에 맡겨져 있었습니다. VPC, IAM, 로드 밸런서처럼 서로 맞물린 개념은 어디서부터 봐야 할지 막막하고, 실수로 남겨둔 리소스가 청구서로 돌아올지 모른다는 걱정은 계정을 만드는 단계에서 발걸음을 멈추게 합니다.",
        "교내에 클라우드를 같이 공부할 자리가 없다는 아쉬움에서 ASBG UOS를 시작했습니다. 혼자서는 넘기 어려운 이 두 개의 장벽을, 같은 고민을 하는 사람들과 한 번에 하나씩 넘어가는 것이 목표입니다.",
      ],
      facts: ["AWS가 공식 지원하는 글로벌 학생 커뮤니티", "전국 대학 ASBG와 이어지는 연합 네트워크", "서울시립대의 첫 AWS Student Builder Group"],
    },
    what: {
      eyebrow: "What we do",
      title: "모여서 하는 일",
      items: [
        {
          title: "Hands-on Session",
          body: "AWS 인프라, 서버리스, 컨테이너까지. 슬라이드로 듣고 끝나지 않고, 정해진 과제를 각자의 계정에서 직접 만들어 봅니다.",
        },
        {
          title: "Team Session",
          body: "팀을 이뤄 같은 주제를 서로 다른 관점에서 설계하고, 발표와 질의로 그 결정을 비교합니다. 정답보다 트레이드오프를 이야기합니다.",
        },
        {
          title: "Certification Study",
          body: "CLF, SAA, SAP. 혼자 준비하기 막막한 AWS 자격증을 소그룹으로 기출을 풀며 함께 준비합니다.",
        },
        {
          title: "Networking",
          body: "현직자 초청 강연, 타 대학 ASBG 연합 세션, AWS가 주최하는 글로벌 학생 커뮤니티 행사에 함께 참여합니다.",
        },
      ],
    },
    flow: {
      eyebrow: "How it loops",
      title: "세션은 이렇게 돕니다",
      body: "한 번의 세션은 준비, 진행, 회고 세 단계로 나뉩니다. 회고에서 나온 개선점은 다음 세션의 브리프에 반영되고, 그렇게 루프가 닫힙니다.",
      center: "Session",
      nodes: [
        { label: "Pre-Session", body: "코어팀이 주제와 요구 사항을 정리해 공유하고, 참가자는 과제와 발표를 준비합니다." },
        { label: "In-Session", body: "만든 것을 발표하고 질문을 주고받습니다. 서비스 선택의 근거와 한계를 함께 짚습니다." },
        { label: "Post-Session", body: "코어팀이 설계안들을 비교한 종합 회고와 복습 키워드를 정리해 공유합니다." },
        { label: "Reflect", body: "회고의 개선 사항을 다음 세션 브리프에 반영합니다. 여기서 다음 루프가 시작됩니다." },
      ],
      keywordsTitle: "우리가 붙잡는 네 단어",
      keywords: [
        { label: "Learn", body: "기초에서 통합까지, 순서대로" },
        { label: "Build", body: "내 계정에서, 직접" },
        { label: "Share", body: "발표하고, 설명하기" },
        { label: "Connect", body: "교내외, 그리고 전국 ASBG" },
      ],
    },
    contact: {
      eyebrow: "Contact",
      title: "궁금한 것이 있다면",
      body: "궁금한 점, 다뤄보고 싶은 주제, 연사로 함께하고 싶은 분 모두 이 메일로 보내주세요. 2~3일 안에 꼭 답장드립니다.",
    },
  },

  sessions: {
    title: "Sessions",
    body: "기수별 세션 기록입니다. 세션마다 무엇을 배우고 만들었는지 남깁니다.",
    upcoming: "Upcoming",
    speaker: "Speaker",
    files: "자료",
    back: "세션 목록",
    prev: "이전 세션",
    next: "다음 세션",
    empty: "아직 등록된 세션이 없습니다.",
  },
  members: {
    title: "Members",
    body: "ASBG UOS를 함께 만드는 사람들입니다.",
    core: "Core Members",
    general: "General Members",
    empty: "아직 등록된 멤버가 없습니다.",
  },
  resources: {
    title: "Resources",
    body: "ASBG UOS의 공식 채널입니다.",
    items: {
      linkedin: { title: "LinkedIn", body: "공식 페이지. 활동 소식과 세션 후기를 올립니다." },
      github: { title: "GitHub", body: "세션 자료와 실습 코드를 아카이브합니다." },
      email: { title: "Email", body: "문의, 주제 제안, 연사 제안은 이곳으로." },
      instagram: { title: "Instagram", body: "모집과 행사 소식을 가장 먼저 전합니다." },
      meetup: { title: "Meetup", body: "공식 행사 공지와 참가 신청." },
      moreGroups: { title: "More ASBG", body: "전 세계 AWS Student Builder Groups 둘러보기." },
    },
  },
  common: { copy: "이메일 복사", copied: "복사됨", open: "열기" },
  footer: { tagline: "서울시립대학교 AWS 공식 학생 커뮤니티", community: "Community", channels: "Channels" },
  notFound: { title: "페이지를 찾을 수 없어요", body: "주소가 바뀌었거나 아직 없는 페이지입니다.", home: "홈으로" },
};

export type Dict = typeof ko;
