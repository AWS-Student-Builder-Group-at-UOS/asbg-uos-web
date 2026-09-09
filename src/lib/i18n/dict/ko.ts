import { pad2 } from "@/lib/utils";

export const ko = {
  meta: {
    title: "ASBG UOS · 서울시립대 AWS 학생 커뮤니티",
    description: "AWS로 직접 만들고, 배운 것을 나누며 함께 성장합니다. 서울시립대 AWS 학생 커뮤니티의 발표와 실습 기록을 만나보세요.",
  },
  nav: { home: "Home", sessions: "Sessions", members: "Members", resources: "Resources" },
  a11y: { openMenu: "메뉴 열기", closeMenu: "메뉴 닫기", theme: "다크 모드 전환", locale: "언어" },
  cohort: (n: number) => `${n}기`,
  session: (n: number) => `Session ${pad2(n)}`,

  home: {
    hero: {
      eyebrow: "AWS Student Builder Groups at University of Seoul",
      title: ["만든 걸 인터넷에 올리고,", "계속 돌아가게 하는 법"],
      body: "서울시립대의 AWS 공식 학생 커뮤니티입니다. 수업에서 배운 걸 실제 서버에 올려 보고, 트래픽과 비용을 어떻게 감당하는지 각자 계정에서 직접 겪어 봅니다. 혼자 하면 막히는 부분을 같이 고민하고 풀어 가려고 모였습니다.",
      primary: "세션 보기",
      secondary: "멤버 보기",
    },
    stats: { members: "활동 멤버", presentations: "진행한 발표", cohorts: "기수" },
    why: {
      eyebrow: "Why",
      title: "수업이 끝나는 곳에서 시작합니다",
      body: [
        "학교에는 프로그래밍 언어, 자료구조, 데이터베이스, AI까지 무엇을 만드는지 가르쳐 주는 과목이 많습니다. 그런데 만든 것을 인터넷에 올리고 계속 돌아가게 하는 마지막 단계는 정규 과정에 없어서, 각자 검색하고 삽질하며 배우게 됩니다.",
        "막히는 이유는 대개 둘 중 하나였습니다. VPC, 서브넷, IAM, 로드 밸런서처럼 서로 얽힌 개념이 한꺼번에 나와서 어디서부터 봐야 할지 모르겠거나, 실습하다 남겨 둔 리소스가 청구서로 돌아올까 봐 계정 만드는 단계에서 멈추거나. 교내에 이걸 같이 풀어 볼 자리가 없어서 직접 만들었습니다.",
      ],
      gap: {
        learned: { label: "만들기", body: "언어, 자료구조, DB, AI. 무엇을 만드는지는 수업에서 충분히 배웁니다." },
        missing: [
          { label: "올리기", body: "만든 것을 서버에 올려 실제 사용자가 쓸 수 있게 하는 일." },
          { label: "지키기", body: "트래픽이 몰려도 버티고, 비용이 새지 않게 지키면서 계속 돌리는 일." },
        ],
        caption: "나머지 두 칸을 채우는 곳이 ASBG UOS입니다.",
        tags: { school: "수업", club: "ASBG UOS" },
      },
      facts: ["AWS가 전 세계 대학 단위로 운영하는 공식 학생 커뮤니티", "전국 대학 ASBG와 이어지는 네트워크", "서울시립대의 첫 AWS Student Builder Group"],
    },
    what: {
      eyebrow: "What we do",
      title: "모이면 이런 걸 합니다",
      body: "형식은 기수마다 조금씩 바뀌지만, 모이면 대개 아래 네 가지 중 하나를 합니다.",
      items: [
        {
          title: "Hands-on Workshop",
          body: "AWS 인프라, 서버리스, 컨테이너를 AWS Workshop Studio의 공식 랩으로 따라 만듭니다. 슬라이드는 짧게, 나머지는 각자 콘솔에서.",
          tags: ["Workshop Studio", "Lambda", "Kubernetes"],
        },
        {
          title: "Tech Talk",
          body: "클라우드 업계 동향이나 실제 기업이 AWS를 어떻게 쓰는지 같은 주제를 하나 골라 발표하고 이야기합니다. 발표자는 현직자일 때도 있고, 먼저 파 본 멤버일 때도 있습니다.",
          tags: ["Case Study", "Trends", "Q&A"],
        },
        {
          title: "Certification Study",
          body: "CLF, SAA, SAP. 소그룹으로 기출을 풀고 틀린 문제를 서로 설명합니다. 혼자 시작하기 애매한 자격증을 같이 밀고 갑니다.",
          tags: ["CLF", "SAA", "SAP"],
        },
        {
          title: "Networking",
          body: "다른 대학 ASBG와의 연합 세션, AWS가 여는 글로벌 학생 커뮤니티 행사, 현직자와 직접 만나는 자리. 공식 행사는 Meetup에 올라옵니다.",
          tags: ["Guest Talk", "ASBG Network", "Meetup"],
        },
      ],
    },
    cloud: {
      eyebrow: "Cloud, in one picture",
      title: "요청 하나가 서버까지 갔다 오는 길",
      body: "클라우드는 남의 데이터센터에 있는 서버를 필요한 만큼 빌려 쓰는 것입니다. 컴퓨터를 사서 두는 대신 클릭 몇 번으로 켜고 끄고, 쓴 만큼만 냅니다. 아래는 브라우저에 주소를 친 순간부터 응답이 돌아오기까지 요청이 지나가는 길이고, 세션에서 나오는 이름 대부분이 이 그림 안에 있습니다.",
      nodes: {
        users: "사용자",
        route53: "주소 찾기",
        cloudfront: "가까이서 응답",
        alb: "요청 나누기",
        compute: "앱 실행",
        autoscaling: "대수 조절",
        rds: "데이터베이스",
        s3: "파일 저장",
        iam: "권한",
        cloudwatch: "지표와 로그",
        budgets: "예산 알림",
      },
      steps: [
        {
          label: "주소를 찾고, 가까운 곳에서 받는다",
          body: "브라우저에 주소를 치면 Route 53이 어느 서버로 가야 하는지 알려 줍니다. 이미지나 정적 파일처럼 자주 쓰는 것은 CloudFront가 사용자와 가까운 곳에서 바로 돌려줘서 서버까지 갈 필요가 없습니다.",
        },
        {
          label: "요청을 나눠 받는다",
          body: "CloudFront에서 끝나지 않은 나머지 요청은 ALB, 그러니까 로드 밸런서가 받습니다. 뒤에 있는 여러 서버에 고르게 나눠 주고, 하나가 죽으면 그쪽으로는 보내지 않습니다. 사용자는 서버가 몇 대인지, 어느 게 죽었는지 몰라도 됩니다.",
        },
        {
          label: "서버는 필요한 만큼 늘고 준다",
          body: "실제로 앱을 돌리는 건 EC2나 컨테이너 여러 대입니다. Auto Scaling이 트래픽을 보고 대수를 조절하는데, 새벽에는 줄이고 낮에는 늘리는 식이라 항상 최대치로 켜 두는 것보다 돈이 훨씬 덜 듭니다. 서버를 미리 넉넉히 사 둘 필요가 없는 것도 이 때문입니다.",
        },
        {
          label: "데이터는 따로, 안전하게",
          body: "서버는 늘었다 줄었다 하고 가끔 교체되니, 데이터를 그 안에 두면 같이 사라집니다. 그래서 데이터베이스는 RDS에, 파일은 S3에 따로 둡니다. 서버와 저장소를 분리하는 게 클라우드 설계의 기본이고, 이걸 지키면 서버를 갈아 끼워도 데이터는 그대로 남습니다.",
        },
        {
          label: "그리고 지켜본다",
          body: "IAM으로 누가 무엇을 할 수 있는지 정하고, CloudWatch로 지표와 로그를 보고, Budgets로 예산을 넘기 전에 알림을 받습니다. 계정을 만든 첫날 제일 먼저 하는 일이기도 합니다.",
        },
      ],
      vocab: [
        { group: "Edge", items: ["Route 53", "CloudFront", "WAF"] },
        { group: "Compute", items: ["EC2", "ECS / EKS", "Lambda", "Auto Scaling"] },
        { group: "Data", items: ["RDS", "DynamoDB", "S3"] },
        { group: "Ops", items: ["IAM", "CloudWatch", "Budgets", "Terraform"] },
      ],
      noteLabel: "Goal",
      note: "다루는 순서는 기수마다 달라도, 한 기수를 마칠 때쯤엔 이 그림을 직접 그려서 설명할 수 있게 되는 것이 목표입니다.",
    },
    keywords: {
      eyebrow: "Four words",
      title: "Learn, Build, Connect. 여기에 Share를 더했습니다",
      body: "AWS Student Builder Group의 공식 키워드는 Learn, Build, Connect 세 개입니다. 우리는 만든 것을 발표하고 설명하는 Share를 하나 더 넣어 네 단어로 씁니다.",
      items: [
        { label: "Learn", body: "기초부터 순서대로. 이름만 외우지 않고 왜 필요한지부터 봅니다." },
        { label: "Build", body: "읽고 끝내지 않습니다. 직접 띄워 보고, 망가뜨려 보고, 지웁니다." },
        { label: "Share", body: "만든 것을 발표하고 왜 그렇게 했는지 설명합니다. 우리가 더한 단어가 이겁니다." },
        { label: "Connect", body: "교내에서 시작해 전국 ASBG와 현직자까지 이어집니다." },
      ],
    },
    contact: {
      eyebrow: "Contact",
      title: "궁금한 게 있으면 메일로",
      body: "동아리에 대한 질문이나 세션에서 다뤄 줬으면 하는 주제는 이 주소로 보내 주세요. 연사로 오고 싶은 분도 여기로 연락 주시면 됩니다. 늦어도 2~3일 안에는 꼭 답장하겠습니다.",
      hint: "누르면 복사됩니다",
    },
  },

  sessions: {
    title: "Sessions",
    body: "기수별 세션 기록입니다. 그날 무엇을 배우고 만들었는지 남깁니다.",
    upcoming: "Upcoming",
    speaker: "Speaker",
    files: "자료",
    back: "세션 목록",
    prev: "이전 글",
    next: "다음 글",
    empty: "아직 올라온 세션이 없습니다. 다음 세션이 정해지면 여기와 Meetup에 올립니다.",
  },
  members: {
    title: "Members",
    body: "운영을 맡은 코어팀, 그리고 같이 공부하는 멤버들입니다.",
    core: "Core Members",
    general: "General Members",
    empty: "아직 등록된 멤버가 없습니다. 모집 소식은 Instagram에 올립니다.",
  },
  resources: {
    title: "Resources",
    body: "채널마다 올리는 게 다르니, 어디서 뭘 보면 되는지 정리해 뒀습니다.",
    items: {
      linkedin: { title: "LinkedIn", body: "공식 페이지. 활동 소식과 세션 후기를 올립니다." },
      github: { title: "GitHub", body: "세션 자료와 실습 코드를 모아 둡니다." },
      email: { title: "Email", body: "질문, 주제 제안, 연사 제안은 여기로." },
      instagram: { title: "Instagram", body: "모집과 행사 소식이 가장 먼저 올라옵니다." },
      meetup: { title: "Meetup", body: "공식 행사 공지와 참가 신청." },
      moreGroups: { title: "More ASBG", body: "전 세계 AWS Student Builder Groups 목록으로, 다른 대학은 어떻게 하는지 볼 수 있습니다." },
    },
  },
  common: { copy: "복사", copied: "복사됨", open: "열기", more: "더 보기", less: "접기" },
  footer: { tagline: "서울시립대학교 AWS 공식 학생 커뮤니티", community: "Community", channels: "Channels" },
  notFound: { title: "페이지를 찾을 수 없습니다", body: "링크가 오래됐거나 주소를 잘못 친 것 같습니다.", home: "홈으로" },
};

export type Dict = typeof ko;
