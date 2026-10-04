> From a developer who builds to a developer who operates

Once you've learned the back-end (servers and APIs) and the front-end (what users see), you can build a service. I remember thinking at that point, "I could probably build a whole service on my own now." This talk starts where that thought fell apart, and goes on to what the cloud and infrastructure actually do for a startup that has to keep trying things.

## 01. Building a service and running one are different things

The code was done. But the moment you actually open a service to people, the next questions arrive. Is the server going to stay up? What happens when users pile in? How do you deploy safely? If the server dies, who finds out first? Giving a service its shape with a back-end and a front-end is one thing; handling what happens while it runs is another. Servers and APIs, deployment and operations, traffic, data, incidents. **The code is finished, but the service is just getting started.**

## 02. At a startup, this problem gets much bigger

In an ordinary team there's a back-end person, a front-end person, and an infrastructure person. At a startup, one person is all three, plus operations. Not one role per person but N roles per person.

And yet what really scares a startup isn't the server itself. The cycle is idea, MVP, launch, user feedback, iterate, and the problem is having to prepare far too much before you've validated anything. There's the money it takes before you can even start (setup cost) and the time it takes to keep looking after it (operation load).

## 03. A startup is a game of repeated attempts

A startup keeps cycling: hypothesis, MVP, launch, reaction, fix, try again. What matters isn't nailing it in one perfect attempt but how fast and how cheaply you can make each attempt. Time-to-market and experiment cost are the two numbers that count. **Ten fast attempts beat one perfect one.**

## 04. How a small service grows

Take Airbnb. It started small, but at one point it was running 200 EC2 instances, handling 50 GB of data a day and 10 TB of user photos, and moving its database meant accepting 15 minutes of downtime. As a service grows, the infrastructure grows with it, and so does the complexity of operating it.

![The AWS services Airbnb uses: EC2, S3, RDS, Elastic Load Balancing, CloudWatch, Elastic MapReduce](img/airbnb_aws_image.webp)

## 05. Build it yourself?

Suppose you built and ran that infrastructure yourself. Three engineers for six months is 18 engineer-months. What could that time have gone into instead? The value of the cloud isn't that it rents you servers. It's that the people and time that would have gone into infrastructure can go back into the product and into experiments.

## 06. The cloud is really about how fast you can start

It used to take weeks to buy servers, set them up, and wire the network. Now it's a few clicks in a console and a few minutes. For a startup that breaks down four ways.

- **SPEED** Starting takes minutes.
- **CAPITAL** No big upfront spend on infrastructure, so failing is cheap and you can try again.
- **SCALE** Success isn't scary either. You grow the infrastructure as the service grows.
- **OPERATION** Fewer hands needed to keep it running.

Each attempt gets cheaper and faster, so you get more of them. **More iterations, higher survival probability.**

## 07. But the cloud isn't free

None of this means the cloud solves everything. Costs grow with scale, you can get locked into a vendor, security is not automatic, and putting a heavy architecture under a small service does more harm than good. The cloud doesn't remove risk; it changes what kind of risk you carry and when. Deciding which risks to take, and when, is still on you.

## 08. So these days I'm studying the cloud

After back-end and front-end, the reason to learn infrastructure and cloud is simple: I want to know how the whole thing actually runs. Studying the cloud isn't about knowing more AWS services. It's about learning how to keep something you built running in the real world: building it, handling more users, managing failures, controlling costs, and keeping it going. **From someone who builds to someone who runs the service.**
