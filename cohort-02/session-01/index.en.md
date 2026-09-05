## Overview

On Tuesday, March 9, at 7 p.m. in the Information Technology Building, Cohort 2 held its first session, which was also Round 0 of the league. The most frequent comment in the Cohort 1 retrospective was that people understood the concepts but their hands did not move enough. So Cohort 2 works differently: in each round, a team completes one official workshop from AWS Workshop Studio end to end and records the process in a GitHub repository. Round 0 had two goals to finish before any workshop starts. Nobody should get stuck in week one because of the terminal or Git, and every account should be set up safely so that cost and credential accidents are blocked from the start.

We used the full two hours. Sujin Hwang (Tech Lead) took the first 15 minutes on the terminal and Git. Since some participants had never seen a Linux command line, we limited it to cd, ls, and ssh plus the git init, add, commit, push flow, and put the team repository folder structure on screen for everyone to reproduce. Yena Lee (Tech Lead) then ran the 90-minute hands-on. Each team signed in to the AWS account issued to it in advance and checked and configured, in order, root account MFA, a least-privilege role, SCPs, and AWS Budgets alerts.

Two places stalled the room the longest. One was "if I can sign in as root, why do I have to sign in again with a role?" The other was "if SCPs already block expensive resources, why do we also need budget alerts?" Neither cleared up on the first explanation, so we put the actual SCP JSON and the Budgets alert settings side by side on screen and traced which one blocks what and which one only notifies. The last 15 minutes were the league kickoff, where we introduced the Round 1 workshop and the completion criteria.

## What we covered

| Time | Content |
|---|---|
| 19:00–19:10 | Opening — how Cohort 2 works (one official workshop per round, completed as a team and recorded on GitHub), core team and mentor introductions |
| 19:10–19:25 | Terminal and Git — cd, ls, ssh, git init/add/commit/push, a shared folder structure for team repositories |
| 19:25–19:50 | Account structure — one account per team, registering MFA on root, signing in to the console with a least-privilege role, why we do not create long-term access keys |
| 19:50–20:15 | Blocking cost up front — how SCPs deny expensive instance types and regions, the allowed-resource list, tag policy |
| 20:15–20:40 | Watching cost after the fact — AWS Budgets alerts at 50%, 80%, and 100%, the rule to clean up resources within 48 hours of a round ending |
| 20:40–20:55 | League kickoff — the Round 1 workshop (VPC Fundamentals module of the AWS Networking Workshop), completion criteria, mentor assignments |
| 20:55–21:00 | Assignment briefing and Q&A |

## Concepts we pinned down

- **Minimum terminal and Git set** — What you need to follow a workshop is cd, ls, ssh, and the init/add/commit/push flow. Everything else gets looked at with a mentor when you get stuck.
- **Root account and MFA** — Root holds the entire account, so it gets MFA and stays unused day to day. Routine work goes through a separate role.
- **Least-privilege role** — You sign in with a role that allows only what this round needs. It feels restrictive at first, but the blast radius of a mistake shrinks accordingly.
- **No long-term access keys** — An access key saved on a laptop slips into a commit easily. Temporary credentials from a role take its place, and a secrets scan runs before every commit.
- **SCP (service control policy)** — Restricts, at the organization level, which kinds of resources an account can create at all. Expensive instance types and regions are denied at the attempt.
- **AWS Budgets alerts and tags** — Billing data refreshes only a few times a day, so budget alerts are a monitoring device, not an immediate block. Every resource carries team and round tags, and cleanup is verified against those tags.

## Assignment and results

The assignment had two parts. Create the team GitHub repository with the agreed folder structure and a README, and commit screenshots from the team account showing root MFA enabled, the console signed in through the role, and the three Budgets alert thresholds. The completion criterion was a single repository link from which all three screenshots and the commit history can be verified. This assignment creates no billable resources, so there is no cost, but we asked everyone to mask account IDs and email addresses in the screenshots.

Two things tripped teams up in the submissions. First, some teams failed authentication on git push. GitHub does not accept password authentication over HTTPS, so an SSH key or a token is required, and although we covered ssh in the session we never connected it to registering the key on GitHub. Second, one team created an IAM user per member instead of a role, and issued access keys as well. Since that violates the rules, the keys were deleted and the setup was redone with role switching.

![Architecture diagram](img/diagram.svg)

## Questions that came up

**Q.** If SCPs already block all the expensive resources, is there a reason to set up budget alerts separately?
A. SCPs block kinds of resources; they cannot stop an allowed resource from being left running. Even an instance on the allowed list accumulates cost after a few days, and the Budgets alert is what tells you. One is a preventive block, the other is monitoring after the fact, and the roles are different.

**Q.** If we do not create access keys, how do we use the CLI?
A. Signing in through a role gives you temporary credentials that expire after a few hours. The CLI can use those same credentials, and if they leak they are only valid until expiry, so the damage is smaller than with a long-term key. Most of this semester's workshops run in the console, so a mentor will walk through the CLI setup when a round needs it.

**Q.** What happens if we cannot clean up within 48 hours of a round ending?
A. The team lead checks for leftover resources by tag, and if anything remains the assigned mentor cleans it up together with the team. Cleanup status is checked again per team at the next round's kickoff.

## Keywords to review

`ssh`, `git commit`, `git push`, `MFA`, `least-privilege role`, `SCP`, `AWS Budgets`

## Toward the next session

Round 1 is the session where each team completes the VPC Fundamentals module of the AWS Networking Workshop and presents the result. From this retrospective, we noted that some teams did not get as far as push within the 15-minute Git block, so the Round 1 brief now includes "at least one commit in the team repository before the session" as a pre-check item.
