## A flash sale creates several different bottlenecks

Imagine visitors who normally browse slowly all refreshing the shop at one o'clock. Image downloads, product reads, stock checks, and order creation rise together. The instance's CPU may saturate, or requests may wait for database connections while CPU remains low. Adding instances without separating these cases can increase cost without improving response time.

Inspect latency, errors, application processing time, and database waits separately. An ALB distributes requests, Auto Scaling changes running capacity, and caching avoids repeated work. None replaces the others. Keeping the servers responsive and enforcing the correct number of accepted orders are also different design problems.

## An ALB selects the destination for a request

An ALB accepts HTTP or HTTPS through a listener and forwards requests according to its rules. A target group's algorithm and target state determine which instance handles them. Round robin is the default, but one browser is not guaranteed to display A, B, A, B on successive refreshes. Stickiness and browser caching can affect that observation.

Compare response identifiers across multiple requests with server logs. Repeatedly seeing one server is not sufficient evidence of failure. Also distinguish requests reaching both targets from equal workload: two requests can take very different amounts of processing time. See the [AWS target group routing settings](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/edit-target-group-attributes.html) for the algorithms and their interaction with stickiness.

## Routing around a failure is not the same as repairing it

Health checks test a configured path against expected response codes. For example, `/health` can return 200 when the application is ready to accept work. A redirect to a login page or a nonexistent path can fail the check even when the process is running. With healthy targets remaining, traffic can move away from a failed target.

When every registered target is unhealthy, however, an ALB can fail open and send traffic to all of them. A health check is not a guaranteed service shutdown mechanism or a complete recovery strategy. The ALB also does not launch replacement instances. This behavior is described in the [AWS target health check guide](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html).

## Auto Scaling maintains the desired capacity

Consider minimum 2, desired 2, and maximum 4. The minimum and maximum define capacity boundaries; desired capacity is the current goal. Without a scaling policy, increased traffic alone does not automatically raise that goal. Before choosing average CPU as a signal, establish that CPU changes with the application's processing demand.

EC2 status checks are enabled by default. To use ALB health results for replacement, enable Elastic Load Balancing health checks on the Auto Scaling group. A stopped web process and a stopped EC2 instance can therefore produce different observations. Allow for application initialization as well. The distinction between default and optional checks is described in the [AWS Auto Scaling health check guide](https://docs.aws.amazon.com/autoscaling/ec2/userguide/health-checks-overview.html).

Launching and preparing a new instance takes time. For a scheduled event, preparing capacity and testing it beforehand is more sensible than relying only on a reaction after a threshold is crossed. A maximum of four is a limit you selected, not proof that four instances can serve the event.

## Replacement servers must serve the same application

For a standard Regional internet-facing ALB, configure subnets in two different Availability Zones. Put the application instances where the ALB can reach them, and allow the application port from the ALB security group. A rule allowing only your own public IP may permit direct browser access while blocking the ALB's connections.

The launch template and deployment process need a consistent application version, configuration, and startup procedure. A manual edit made only on the first instance will not magically appear on a replacement. Sessions and uploaded files kept only on one instance's local disk also complicate scaling. Decide where state that must survive instance changes belongs.

![Request distribution by ALB, capacity management by Auto Scaling, and the separate roles of CloudFront and ElastiCache](img/diagram.svg)

## Cache results that can actually be reused

CloudFront can deliver shared assets such as product images from edge caches. It is not limited to static files; response behavior and policies determine what is cached and for how long. Repeated application reads can use a separate cache such as ElastiCache. In a cache-aside design, application code checks the cache, reads the source, and stores a result. Adding a service beside the database is not an automatic performance improvement.

A thirty-second cache for product descriptions makes sense only if that staleness is acceptable and the response can safely be reused across its intended audience. A short-lived stock display does not replace order-time validation and concurrency control against authoritative state. Reducing the TTL alone does not prevent duplicate orders or overselling.

Measure source demand when the cache is empty or entries expire together. Request coalescing and spreading expiry times are options for avoiding a sudden surge at the source. Check whether hit rate and source request volume actually improve. The [AWS discussion of caching strategies](https://aws.amazon.com/builders-library/caching-challenges-and-strategies/) develops these tradeoffs further.

## Verify distribution, scaling, and caching separately

Give practice responses an instance-specific identifier. Send a small number of requests to your own test environment and compare responses with logs. Keep checks that bypass caches to inspect real server responses separate from checks of cache hit rate. A recovery experiment that changes one target's state should observe traffic routing and Auto Scaling replacement independently.

For scaling, record when launch begins, when the application becomes ready, the number of healthy targets, and latency and error trends. An EC2 instance being in the running state does not prove application readiness. For caching, check both reduced source calls under repeated reads and the point at which updated data becomes visible. The goal is evidence that each function performs its job, rather than a collection of service names in the console.

## Where to look when configuration does not match the intent

For a target that remains unhealthy, inspect the path, port, expected response code, and security group rules between the ALB and instance. Check whether the health endpoint unnecessarily depends on authentication or an external API. Repeated replacement calls for comparing initialization failures, readiness time, and health conditions. An inactive scaling policy calls for checking the incoming metric and the minimum, desired, and maximum settings.

When cleaning up, desired capacity cannot be reduced to zero while the minimum remains two. Check schedules and policies that could raise capacity again. Removing every instance can still leave an ALB or separate cache incurring charges. Treat resource cleanup separately from failure recovery, and verify each resource created for the experiment.
