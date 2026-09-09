# Beyond Code, Into Service

> From a developer who builds to a developer who operates

## Overview

Building a service is only the beginning.

This talk explores what it takes to move beyond writing code and actually **operate a service in the real world**.

From a startup perspective, we look at why being able to experiment quickly and repeatedly matters, and how cloud and infrastructure can help reduce the time and cost of each experiment.

---

## 01. Building a Service Is Different from Operating One

With backend and frontend development, we can build the basic form of a service.

But once the service is actually running, new problems begin to appear.

- Servers and APIs
- Deployment and server operations
- Handling traffic
- Data management
- Failure and incident response

**Finishing the code doesn't mean the service is finished.**

---

## 02. Startups Are a Game of Continuous Experimentation

Startups constantly repeat the cycle:

**Idea → MVP → Launch → User Feedback → Iteration → Try Again**

The goal is not always to make one perfect attempt.

What matters is **how quickly and cheaply you can make each attempt**.

- **Time-to-Market**
- **Experiment Cost**
- 10 fast attempts can be more valuable than 1 perfect attempt

---

## 03. As the Service Grows, Infrastructure Grows With It

### The Airbnb Case

As a service grows, its infrastructure grows along with it.

The Airbnb case shows how the scale and complexity of infrastructure can increase as a service grows.

- 200 EC2 instances
- 50GB of data per day
- 10TB of photo data
- 15 minutes of database migration downtime

The key takeaway is that **service growth also brings greater infrastructure and operational complexity.**

---

## 04. Infrastructure Requires Engineering Resources Too

### Airbnb × AWS KMS

Building and operating infrastructure requires significant engineering time and resources as well.

The value of cloud is not simply that it provides servers.

It allows teams to use **managed infrastructure instead of spending engineering resources building and operating everything themselves**.

Those resources can then be redirected toward:

- Product development
- User experience
- Experimentation
- Iteration

---

## 05. Cloud Makes Experimentation Faster and Cheaper

Cloud changes the way startups build and operate services.

### SPEED

Infrastructure can be provisioned and started quickly.

### CAPITAL

You don't need to make a large upfront investment in infrastructure.  
You can pay for what you actually use.

### SCALE

Infrastructure can grow along with the service.

### OPERATION

Managed services can reduce the burden of directly operating infrastructure.

Ultimately,

**cloud lowers the time and cost required for each experiment,  
making more experiments possible.**

---

## 06. But Cloud Doesn't Eliminate Risk

Cloud is not a solution to every problem.

There are still risks such as:

- Increasing cloud costs
- Vendor Lock-in
- Security issues
- Over-engineering

The important point is:

> **Cloud doesn't eliminate risk. It changes the type and timing of risk.**

The question is not whether there is risk.

It is **which risks you take, and when you take them.**

---

## 07. From Building Developer to Service Operator

Learning cloud is not simply about learning more AWS services.

It's about learning **how to keep something you built running in the real world.**

That means being able to:

- Build a service
- Handle growing traffic and users
- Respond to failures
- Control infrastructure costs
- Continuously operate the service

### Key Message

**From a developer who builds  
to a developer who operates.**