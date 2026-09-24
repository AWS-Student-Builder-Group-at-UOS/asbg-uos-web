> From clicking around to building and running things together

I opened Cohort 1's first session with the kickoff — what ASBG UOS is and how the semester will go. But underneath all of it was really one question: why learn AWS together instead of alone? This post is my answer.

## How ASBG got started here

ASBG stands for AWS Student Builder Group, a student community program AWS runs at universities worldwide. It comes down to three words: Learn, Build, Connect. Learn what a service is, build something with it yourself, then show each other what you made and talk it through. Cohort 1 at the University of Seoul just took its first step this semester.

## Clicking around the console isn't the same as running a service

Say "studying AWS" and most people picture opening the console and clicking through EC2, S3, and the rest, one at a time. But knowing a service's name and its screens isn't the same as actually running something on it. Where does the server live, how do you deploy to it, what happens when traffic spikes, where does the money leak? None of that shows up just by clicking around — you only see it once you've designed, deployed, and operated something yourself.

So this semester's regular sessions aren't ordered one service at a time — they're ordered so one service grows a little each time. First, EC2 goes inside a VPC with an ALB in front and RDS behind it: a 3-tier setup, with a server that takes requests, a load balancer that spreads traffic when it spikes, and a database managed separately. Next, the parts that don't need a server move to Lambda and DynamoDB, with an SQS queue in between so work can be deferred and pieces stay loosely coupled. Finally, ECR and ECS smooth out environment differences and CodePipeline automates deployment. At the end of the semester, we go back over all of it with SAA-style questions.

![One service grown over the semester: set up the server, split into serverless, automate deployment, final review](img/diagram.en.svg)

In order: network and servers, then serverless and events, then containers and automated deployment. It starts as the problem of running one server well. Then splitting things into smaller pieces and deploying them automatically, step by step getting closer to how a real service actually gets operated.

## Two places people get stuck going it alone

Anyone who's tried AWS solo tends to stall at the same two spots. The first is cost — worrying that a resource left running will come back as a surprise bill is enough to make people hesitate before they even finish setting up an account. So the group covers part of what session assignments cost, because nobody should skip the hands-on part out of fear of the bill. In return, since a forgotten resource really can add up, we build the habit of cleaning up after each session.

The second is that, alone, the only work you ever see is your own. How someone else solved the same assignment, where they got stuck, how they got past it: you only get that from a community. So assignments follow a fixed template — what you built, why you configured it that way, what went wrong, and screenshots — go up as GitHub pull requests, and we review each other's work. What builds up over time is a portfolio. I think that's the real value of a community program: showing up, listening together, asking questions, and seeing what others made.

## Certifications come after!

Rather than chasing the certification itself, I'd recommend this order: hands-on first, then the concepts, then certification study. Wire up several EC2 instances with an ALB in front yourself, then read "an ALB distributes traffic" again — it lands completely differently. Study groups for the SAA and similar aren't scheduled by the core team either; whoever wants one just starts it. The goal isn't to have every activity decided from the top, but a structure where anyone can build what they want.

## What learning together looks like

Connect doesn't just mean talking about AWS. Beyond the regular sessions, we're also putting together networking meetups for career questions and swapping notes on how people use AI, exchanges with ASBG chapters at other universities, and talks from people working in the field.

Over the semester we'll build one service together, work through the parts that stall us together, and keep showing each other what we made. From the next session on, everyone opens their own console. The cloud is more fun than it looks~~~
