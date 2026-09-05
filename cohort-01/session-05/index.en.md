## Overview

Session 05, held on the evening of Tuesday, December 29 in the Information Technology Building, was the last session of Cohort 1, and it introduced no new AWS concepts. The VPC and EC2 from Session 02, the ALB and Auto Scaling group we put in front of it in Session 03, and the S3 bucket and RDS instance we added in Session 04 still existed only as pieces built on separate days. Under the premise that this was the final check before the store opened, we spent the whole session combining those three pieces into one drawing and explaining to each other why each decision had been made.

Subin Son (Leader) ran the opening, the convergence on the reference architecture, and the SAA-C03 questions; Chaewoo Lee (Director of Events) ran the team activity, the trade-off discussion, and the closing awards. During the ten-minute opening we listed everything built so far on the whiteboard in three groups, then split into the same five teams as Sessions 02–04 and spent fifteen minutes drawing an integrated architecture in Excalidraw. Fifteen minutes turned out to be short. Most teams drew the vertical flow from user to ALB to EC2 to RDS quickly, then stalled on where CloudFront belongs. Some put it in front of S3 only, some wrapped everything including the ALB, and some left it out. About half the teams also forgot ElastiCache.

We picked two teams at random to explain their drawings for three minutes each, then put up the reference architecture slide the core team had prepared and pointed out what was missing one item at a time. More time went to "why did you put it there" than to whether the drawing was right. In the discussion and question rounds that followed, teams took turns answering, and at one point the person who had actually force-terminated an instance in the Session 03 assignment gave a more concrete answer than the people who had memorized the textbook one. After the 90 minutes, we finished by checking together that no resources were left running in anyone's account.

## What we covered

| Time | Content |
|---|---|
| 19:00–19:10 | Opening — listed the pieces from Sessions 02–04 (VPC/EC2, ALB/ASG, S3/RDS) on the whiteboard and said up front that there would be no new concepts today |
| 19:10–19:25 | Team activity — five teams drew an integrated architecture in Excalidraw |
| 19:25–19:40 | Presentations and convergence — two teams explained their drawings; we compared them with the reference architecture and filled in the gaps |
| 19:40–20:00 | Trade-off discussion — teams took turns on four questions: Multi-AZ cost, Auto Scaling maximum capacity, static/dynamic separation, and risks not yet covered |
| 20:00–20:20 | SAA-C03 connection — solved and explained one question from each of the four domains on the spot |
| 20:20–20:30 | Closing — guidance on individual study after the program, and Cohort 1 awards |

## Concepts we pinned down

- **What RDS Multi-AZ costs and buys** — You pay for a standby replica, and in return you get automatic failover when an AZ fails. We separated it again from read replicas, which exist to scale reads.
- **Auto Scaling maximum of 2–3 instances** — This was a guardrail to stay within the free tier. When traffic exceeds it, CPU keeps climbing, responses slow down, and targets start failing health checks and dropping out. The maximum is a cost ceiling and a performance ceiling at the same time.
- **Separating static assets from dynamic requests** — Images and CSS live in S3 and are cached at CloudFront edges, so EC2 only handles dynamic requests. In the integrated drawing, the caching from Session 03 reads as "a way to need fewer EC2 instances."
- **Public and private subnet placement** — Only the ALB, which has to accept requests from the internet, goes in a public subnet; EC2 and RDS go in private subnets. The 0.0.0.0/0 route in the route table from Session 02 is still the criterion.
- **Scope of encryption** — Encryption at rest for S3 and RDS is a single checkbox in the console backed by a KMS key. In a diagram, KMS is not a box on the request path; it is a dashed relation to the data stores.
- **Risks we have not covered** — Deployment automation, logging and monitoring, and disaster recovery were outside this program's scope. We wrote down that even with the pre-launch check done, the problems of the operating phase are still ahead.

## Assignment and results

There was no new assignment this time. Members who had not yet submitted the Session 02–04 assignments were told that this session was the final deadline, and anyone who wanted to could additionally submit one final architecture diagram of their own. The completion criteria stayed the same: a screenshot and a short reflection posted to the study repository. Since this was the last session, we also went over resource cleanup again: lower the Auto Scaling group's desired capacity to 0 or delete it, take a snapshot of RDS and then delete the instance, and confirm that no EC2 instances are left running.

Two gaps came up repeatedly in the submitted final diagrams. The first was a drawing with no Availability Zone boundaries. Several EC2 instances were drawn inside one Auto Scaling group box, but all in the same AZ, so the "keeps running when one instance dies" behavior confirmed in the Session 03 assignment was in fact fully exposed to a single-AZ failure. The second was placing RDS and ElastiCache side by side on the same tier, as if EC2 chose one or the other. We pointed out that the cache is not an alternative to the database; it sits in front of it.

![Architecture diagram](img/diagram.svg)

## Questions that came up

**Q.** I turned on RDS Multi-AZ in the Session 04 assignment, but query speed did not change. Did I set something up wrong?
A. That is expected. Multi-AZ keeps a standby replica in another AZ and fails over automatically; it has nothing to do with read performance. Splitting read load takes read replicas, which we did not include in this program's hands-on scope.

**Q.** If there is almost no traffic at night, why not set the minimum capacity to 0?
A. At 0 there is no instance to receive requests during that window, so the service stops. Set the minimum to the floor at which the service can still respond, and let the desired capacity shrink according to the CPU metric. The point of the SAA-C03 cost question was that scaling in is as much Auto Scaling's job as scaling out.

**Q.** Can't I attach a security group to the S3 bucket to block access?
A. A security group is a firewall attached to instances inside a VPC, and S3 is a service outside the VPC, so there is nothing to attach it to. S3 is protected by keeping Block Public Access on, restricting access with a bucket policy, and turning on encryption at rest with KMS.

## Keywords to review

`AZ distribution`, `RDS Multi-AZ`, `read replica`, `S3 Block Public Access`, `KMS encryption at rest`, `CloudFront edge caching`, `Auto Scaling min/desired/max capacity`

## Toward the next session

Cohort 1's official sessions ended with this one. Because having teams draw the integrated diagram only once at the end left some teams missing the Session 02 pieces, the brief for the next cohort adds ten minutes at the close of every session for drawing that day's pieces onto one cumulative diagram.
