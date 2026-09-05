import { pad2 } from "@/lib/utils";
import type { Dict } from "./ko";

export const en: Dict = {
  meta: {
    description:
      "AWS Student Builder Group at the University of Seoul. A record of people who learn cloud, build it themselves, and share what they learned.",
  },
  nav: { home: "Home", sessions: "Sessions", members: "Members", resources: "Resources" },
  a11y: { openMenu: "Open menu", closeMenu: "Close menu", theme: "Toggle dark mode", locale: "Language" },
  cohort: (n: number) => `Cohort ${n}`,
  session: (n: number) => `Session ${pad2(n)}`,

  home: {
    hero: {
      eyebrow: "AWS Student Builder Groups at University of Seoul",
      title: ["Learn the cloud.", "Build it. Then explain it."],
      body: "We are the official AWS student community at the University of Seoul. Each semester we repeat one loop: learn a concept, build it in our own accounts, and explain what we built to each other.",
      primary: "Browse sessions",
      secondary: "Meet the members",
    },
    stats: { members: "Active members", sessions: "Sessions held", cohorts: "Cohorts" },
    why: {
      eyebrow: "Why we started",
      title: "Why we got together",
      body: [
        "Classes teach you how to make things, but the last step, putting what you made on the internet and keeping it running, is left to each student's own searching and trial and error. Concepts like VPC, IAM and load balancers all depend on each other, so it is hard to know where to begin, and the fear of a leftover resource turning into a bill stops many people before they even create an account.",
        "ASBG UOS started because there was no place on campus to study cloud together. The goal is to clear those two walls one step at a time, with people who are stuck on the same questions.",
      ],
      facts: ["A global student community officially supported by AWS", "Connected to ASBG chapters at universities across Korea", "The first AWS Student Builder Group at the University of Seoul"],
    },
    what: {
      eyebrow: "What we do",
      title: "What happens when we meet",
      items: [
        {
          title: "Hands-on Session",
          body: "AWS infrastructure, serverless and containers. Instead of just listening to slides, everyone builds the assigned exercise in their own account.",
        },
        {
          title: "Team Session",
          body: "Teams design the same problem from different viewpoints, then present and compare their decisions. We talk about trade-offs rather than a single right answer.",
        },
        {
          title: "Certification Study",
          body: "CLF, SAA, SAP. Small groups work through past questions together, so nobody has to prepare for an AWS certification alone.",
        },
        {
          title: "Networking",
          body: "Guest talks from practitioners, joint sessions with other ASBG chapters, and global student community events hosted by AWS.",
        },
      ],
    },
    flow: {
      eyebrow: "How it loops",
      title: "How a session runs",
      body: "Every session has three stages: prepare, run, and look back. What we learn in the retrospective goes into the next brief, and that is how the loop closes.",
      center: "Session",
      nodes: [
        { label: "Pre-Session", body: "The core team writes up the topic and requirements; participants prepare their exercise and presentation." },
        { label: "In-Session", body: "Everyone presents what they built and takes questions. We look at why each service was chosen and where it falls short." },
        { label: "Post-Session", body: "The core team compares the designs and shares a retrospective with keywords to review." },
        { label: "Reflect", body: "Improvements from the retrospective go into the next session brief. That is where the next loop begins." },
      ],
      keywordsTitle: "Four words we hold on to",
      keywords: [
        { label: "Learn", body: "From basics to the whole picture, in order" },
        { label: "Build", body: "In your own account, with your own hands" },
        { label: "Share", body: "Present it, explain it" },
        { label: "Connect", body: "On campus, off campus, and across ASBG" },
      ],
    },
    contact: {
      eyebrow: "Contact",
      title: "Have a question?",
      body: "Questions, topics you want covered, or an offer to speak at a session: send them all to this address. We reply within two to three days.",
    },
  },

  sessions: {
    title: "Sessions",
    body: "Session records by cohort. For each one we note what we learned and what we built.",
    upcoming: "Upcoming",
    speaker: "Speaker",
    files: "Files",
    back: "All sessions",
    prev: "Previous",
    next: "Next",
    empty: "No sessions yet.",
  },
  members: {
    title: "Members",
    body: "The people who make ASBG UOS.",
    core: "Core Members",
    general: "General Members",
    empty: "No members yet.",
  },
  resources: {
    title: "Resources",
    body: "Official channels of ASBG UOS.",
    items: {
      linkedin: { title: "LinkedIn", body: "Official page. Activity updates and session recaps." },
      github: { title: "GitHub", body: "Archive of session materials and lab code." },
      email: { title: "Email", body: "Questions, topic ideas and speaker offers go here." },
      instagram: { title: "Instagram", body: "Recruiting and event news, posted first." },
      meetup: { title: "Meetup", body: "Official event announcements and RSVPs." },
      moreGroups: { title: "More ASBG", body: "Explore AWS Student Builder Groups around the world." },
    },
  },
  common: { copy: "Copy email", copied: "Copied", open: "Open" },
  footer: { tagline: "The official AWS student community at the University of Seoul", community: "Community", channels: "Channels" },
  notFound: { title: "Page not found", body: "The address may have changed, or the page does not exist yet.", home: "Back home" },
};
