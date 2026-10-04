On September 29, the second session of ASBG UOS Cohort 1 connected network fundamentals with deploying a server. A talk explaining VPCs and subnets led into a hands-on exercise serving a web page from a single EC2 instance. Looking back as the organizing team, what mattered about this sequence was placing each concept along the path of an actual request. We wanted learning a service's name to lead to asking why it belongs there.

## Following a request from theory into practice

The [network fundamentals talk](/en/activities/cohort-01/session-02-presentation-01) began with IP addresses and ports, TCP and UDP, and CIDR, then expanded to subnets and EC2 within a VPC. It covered public and private subnets and the different routes taken by user requests and a server's outbound traffic. That sequence also gives security group settings a purpose: before entering a port number, we should be able to explain who needs access to which program.

The [3-tier talk and EC2 hands-on](/en/activities/cohort-01/session-02-presentation-02) continued with creating an EC2 instance in the default VPC and serving a web page through Nginx. The exercise included removing and restoring the HTTP allow rule to observe the change in access. With the server and files unchanged, a network setting becomes the variable to investigate. The final steps covered terminating the instance and cleaning up remaining resources, so the exercise addressed deployment through to its end.

## Why separate tiers, and what does it cost?

The hands-on covered the WEB tier alone. It is worth keeping that scope distinct from building a complete 3-tier system. The talk explored access control, independent scaling, and containing the effects of resource use and changes, alongside the additional cost and operational work that separation brings. **Recognizing a three-tier diagram and explaining why a particular service needs it are different skills.** In the work that follows, we want to look more closely at the problem being solved and the reasoning behind a choice than at the number of components in a diagram.

## Turning design explanations into validation questions

The [Session 02 assignment](https://github.com/AWS-Student-Builder-Group-at-UOS/cohort-01-assignments/blob/main/session-02/README.md) applies those questions to a course registration portal. Its scenario describes lost login sessions, requests still reaching failed servers, and a server configuration unable to respond to changes in traffic. Designs must include VPC, EC2, Auto Scaling, ALB, and RDS, with an explanation of each choice and the limitations that remain. It extends the request paths covered in the session by introducing server replacement, failure, and changing load.

The assignment requires an architecture diagram, a design explanation, and a validation plan; implementation is optional. When reading the submissions, we therefore want to distinguish intended behavior from what has actually been verified. The [submission format](https://github.com/AWS-Student-Builder-Group-at-UOS/cohort-01-assignments/blob/main/TEMPLATE.md) also asks for decision rationale, validation evidence, and the limits of what was checked. The questions we want to carry into review connect these parts.

| What the design should explain | The question to carry into validation |
| --- | --- |
| How login state survives a change of APP server | Does the state persist when a request reaches another APP server or an instance is replaced? |
| How failed servers are detected, excluded, and recovered | When do requests stop reaching a failed server, and under what conditions does normal service resume? |
| How server count responds to load | Do preparation before registration opens and subsequent scaling out and in happen when intended? |

## Recording the reasoning that comes next

The optional assignment in our [assignment repository](https://github.com/AWS-Student-Builder-Group-at-UOS/cohort-01-assignments) runs until October 13 at 9 p.m. KST. After submissions, we want to look at how different designs answer the same problems and how questions in pull requests help refine their explanations. We also want to preserve the scope of each implementation and the conditions still unverified. This session was a starting point for following a request's path; in our next reflection, we hope to capture the reasoning behind designing that path.
