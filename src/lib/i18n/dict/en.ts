import { pad2 } from "@/lib/utils";
import type { Dict } from "./ko";

export const en: Dict = {
  meta: {
    description: "The first AWS Student Builder Group at the University of Seoul. We learn how to get what we build onto the internet and keep it running by doing it in real AWS accounts.",
  },
  nav: { home: "Home", sessions: "Sessions", members: "Members", resources: "Resources" },
  a11y: { openMenu: "Open menu", closeMenu: "Close menu", theme: "Toggle dark mode", locale: "Language" },
  cohort: (n: number) => `Cohort ${n}`,
  session: (n: number) => `Session ${pad2(n)}`,

  home: {
    hero: {
      eyebrow: "AWS Student Builder Groups at University of Seoul",
      title: ["Put your work online,", "then keep it running."],
      body: "We're the official AWS student community at the University of Seoul. We take what classes taught us, deploy it on real servers, and find out first-hand how traffic and cost behave, each in our own account. It's easier to get unstuck together.",
      primary: "See sessions",
      secondary: "Meet the members",
    },
    stats: { members: "Active members", sessions: "Sessions held", cohorts: "Cohorts" },
    why: {
      eyebrow: "Why",
      title: "We start where the syllabus stops",
      body: [
        "There are plenty of courses on how to build things: programming languages, data structures, databases, AI. But the last step, putting what you built on the internet and keeping it up, isn't on any syllabus. Most of us learned it by searching and breaking things on our own.",
        "People usually get stuck for one of two reasons. Either VPCs, subnets, IAM and load balancers all show up at once and there's no obvious place to start, or the fear of a forgotten resource turning into a bill stops them before they even open an account. There was nowhere on campus to work through this together, so we made one.",
      ],
      gap: {
        learned: { label: "Make", body: "Languages, data structures, databases, AI. Classes cover this part well." },
        missing: [
          { label: "Ship", body: "Getting what you built onto a server so real people can use it." },
          { label: "Keep", body: "Keeping it running through traffic spikes without the bill getting away from you." },
        ],
        caption: "ASBG UOS is for those last two.",
        tags: { school: "Class", club: "ASBG UOS" },
      },
      facts: ["An official student community AWS runs at universities worldwide", "Part of a network of ASBG chapters across Korea", "The first AWS Student Builder Group at the University of Seoul"],
    },
    what: {
      eyebrow: "What we do",
      title: "What happens when we meet",
      body: "The format shifts a little from cohort to cohort, but a session is usually one of these four.",
      items: [
        {
          title: "Hands-on Workshop",
          body: "AWS infrastructure, serverless and containers, following the official labs on AWS Workshop Studio. Slides are short; the rest happens in your own console.",
          tags: ["Workshop Studio", "Lambda", "Kubernetes"],
        },
        {
          title: "Tech Talk",
          body: "Short talks on a topic someone picked: where the cloud industry is heading, or how a real company actually uses AWS. Sometimes the speaker is a practitioner, sometimes a member who dug in first.",
          tags: ["Case Study", "Trends", "Q&A"],
        },
        {
          title: "Certification Study",
          body: "CLF, SAA, SAP. Small groups work through past questions and explain the ones they got wrong to each other. Certifications are hard to start alone.",
          tags: ["CLF", "SAA", "SAP"],
        },
        {
          title: "Networking",
          body: "Joint sessions with other ASBG chapters, AWS's global student community events, and chances to meet people working in the field. Official events go up on Meetup.",
          tags: ["Guest Talk", "ASBG Network", "Meetup"],
        },
      ],
    },
    cloud: {
      eyebrow: "Cloud, in one picture",
      title: "One request, there and back",
      body: "The cloud is someone else's data center, and you rent only the parts you need. Instead of buying a machine, you switch servers on and off with a few clicks and pay for what you used. The picture below follows one request from the moment you type a URL until the response comes back, and most of the names that come up in our sessions are on it.",
      nodes: {
        users: "a browser",
        route53: "find the address",
        cloudfront: "answer nearby",
        alb: "spread requests",
        compute: "run the app",
        autoscaling: "adds or removes servers",
        rds: "database",
        s3: "file storage",
        iam: "permissions",
        cloudwatch: "metrics and logs",
        budgets: "budget alerts",
      },
      steps: [
        {
          label: "Find the address, answer from nearby",
          body: "When you type a URL, Route 53 says which server to go to. Things that get requested constantly, like images and static files, CloudFront serves from a location near you, so they never reach the server at all.",
        },
        {
          label: "Spread the requests out",
          body: "Whatever CloudFront couldn't answer goes to the ALB, the load balancer. It spreads requests evenly across several servers, and if one dies it simply stops sending traffic there. From the outside you can't tell how many servers there are or which one dropped.",
        },
        {
          label: "Servers grow and shrink",
          body: "The app itself runs on a fleet of EC2 instances or containers. Auto Scaling watches traffic and adjusts the count: fewer overnight, more during the day. That costs a lot less than running everything at full size around the clock, and it's why you don't have to buy more servers than you need up front.",
        },
        {
          label: "Data lives somewhere safer",
          body: "Servers scale up and down and occasionally get replaced, so anything stored on them goes with them. The database lives in RDS and files live in S3, away from the servers. Separating compute from storage is close to the first rule of cloud design, and if you follow it you can swap servers out and lose nothing.",
        },
        {
          label: "And keep an eye on it",
          body: "IAM decides who can do what, CloudWatch shows metrics and logs, and Budgets warns you before you blow past your spending limit. This is also the first thing you set up on day one.",
        },
      ],
      vocab: [
        { group: "Edge", items: ["Route 53", "CloudFront", "WAF"] },
        { group: "Compute", items: ["EC2", "ECS / EKS", "Lambda", "Auto Scaling"] },
        { group: "Data", items: ["RDS", "DynamoDB", "S3"] },
        { group: "Ops", items: ["IAM", "CloudWatch", "Budgets", "Terraform"] },
      ],
      note: "The order changes from cohort to cohort. The goal is that by the end of a semester you can draw this picture yourself and explain it.",
    },
    keywords: {
      eyebrow: "Four words",
      title: "Learn, Build, Connect. Then we added Share.",
      body: "AWS Student Builder Groups run on three words: Learn, Build, Connect. We added a fourth, Share, for presenting what you built and explaining why.",
      items: [
        { label: "Learn", body: "Basics first, in order. We look at why a service exists before memorizing its name." },
        { label: "Build", body: "We don't stop at reading. We launch it, break it, and tear it down." },
        { label: "Share", body: "Present what you built and explain the choices. This is the one we added." },
        { label: "Connect", body: "It starts on campus and reaches ASBG chapters nationwide and people in the industry." },
      ],
    },
    contact: {
      eyebrow: "Contact",
      title: "Questions? Email us",
      body: "Questions about the club, topics you'd like a session on, or an offer to come speak: send them all here. We reply within two or three days, every time.",
      hint: "Click to copy",
    },
  },

  sessions: {
    title: "Sessions",
    body: "Session notes by cohort. What we learned and built that day.",
    upcoming: "Upcoming",
    speaker: "Speaker",
    files: "Files",
    back: "All sessions",
    prev: "Previous",
    next: "Next",
    empty: "Nothing here yet. The next session goes up here and on Meetup once it's set.",
  },
  members: {
    title: "Members",
    body: "The core team that runs things, and everyone studying with us.",
    core: "Core Members",
    general: "General Members",
    empty: "No members listed yet. Recruiting news goes out on Instagram.",
  },
  resources: {
    title: "Resources",
    body: "Each channel is for something different, so here's what goes where.",
    items: {
      linkedin: { title: "LinkedIn", body: "Official page. Updates and session recaps." },
      github: { title: "GitHub", body: "Session materials and lab code." },
      email: { title: "Email", body: "Questions, topic ideas and speaker offers." },
      instagram: { title: "Instagram", body: "Recruiting and event news, posted here first." },
      meetup: { title: "Meetup", body: "Official event announcements and RSVPs." },
      moreGroups: { title: "More ASBG", body: "The full list of AWS Student Builder Groups worldwide. Worth a look to see what other schools are doing." },
    },
  },
  common: { copy: "Copy", copied: "Copied", open: "Open", more: "More", less: "Less" },
  footer: { tagline: "The official AWS student community at the University of Seoul", community: "Community", channels: "Channels" },
  notFound: { title: "Page not found", body: "The link may be old, or there's a typo in the address.", home: "Back home" },
};
