> This session covers **Redrawing the Service We Built — A Final Check Before Launch**. The content below is a reference draft from an earlier plan; the actual presentation materials will be updated after the session.

## Start with requirements, not service names

An online store diagram can contain plenty of AWS icons without explaining how an order is actually saved. This talk uses a small store, where customers browse products, add items to a cart, and place orders, to connect each component to a concrete requirement.

There are three starting requirements. Many customers repeatedly download the same product images; orders must survive application server replacement; and the store must handle traffic increases during promotions. Different reads also need different levels of freshness. Product copy may briefly show an earlier version, while the price and stock used to confirm an order must be checked against the authoritative data. That distinction determines what belongs in a cache and what belongs in a database transaction.

## Separate image delivery from order processing

CloudFront selects an origin by path: `/images/*` goes to S3, while `/api/*` goes to the ALB. Each path uses an appropriate cache policy. Image delivery and order processing behave differently even when they share a domain.

```text
Product image: browser → CloudFront → S3 (on a cache miss)
Product read:  browser → CloudFront → ALB → EC2 → cache or RDS
Create order:  browser → CloudFront → ALB → EC2 → RDS transaction
```

CloudFront reuses image responses. The API behavior disables caching and forwards the methods, authentication headers, cookies, and query strings the application needs. EC2 handles authorization and order processing, while responses specific to a customer stay out of shared caches. The S3 bucket stays private. Origin access control, or OAC, authenticates access to a regular S3 bucket origin, and the bucket policy grants that distribution access only to the required objects. An S3 website endpoint does not support this OAC setup. The [CloudFront guide to restricting an S3 origin](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html) describes the access controls.

![Online store architecture with separate CloudFront paths for static assets and API requests](img/diagram.svg)

The ASG manages EC2 capacity and instance replacement outside the request path. Connections representing requests and those representing capacity management should be read differently.

## Draw network boundaries and permissions together

The internet-facing ALB uses public subnets in different Availability Zones. Application instances and RDS use private subnets. Drawing several servers without showing their Availability Zones can hide a shared failure boundary, so the diagram should make zone placement explicit.

Security groups follow the intended callers. The ALB accepts HTTPS requests forwarded by CloudFront. The application port on EC2 accepts traffic from the ALB security group, and the database port accepts traffic from the application security group. Review direct access to the ALB as a possible bypass path as well. Private instances may still need outbound access to download packages, so deployment planning must include the required outbound path and its cost.

Private placement does not replace application authorization. EC2 receives an IAM role scoped to the resources it needs, and the database account has permissions appropriate to the application's work. TLS on network connections, encryption at rest, and access to encryption keys remain separate review items.

## Cache replaceable reads; commit orders to the source of truth

Product reads can use cache-aside. The application looks up a product ID in the cache; on a miss, it reads RDS and stores the result with a time to live. Database traffic does not automatically pass through the cache. After committing a product update, the application invalidates the affected cache entry, while a TTL limits how long an old entry can remain. The basic flow and stale-data trade-off are covered in the [ElastiCache caching strategies guide](https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/Strategies.html).

A TTL does not guarantee immediate consistency. A read that overlaps an update can repopulate the cache with an older value. The cache therefore holds read results that can be reconstructed, while order confirmation checks price and inventory in a database transaction. A unique constraint on a request identifier is one way to prevent a retried request from creating a second order.

If the cache stops responding, the application can fall back to the database after a short timeout. However, sending every request there at once can turn the database into the next failure. Bound fallback concurrency and database connections, and define a retryable error response for requests beyond available capacity.

## Decide what takes over after a failure

When an EC2 instance disappears, ALB target health checks and ASG replacement perform different jobs. A replacement needs time before it can serve requests, so login state and order data cannot live only on an instance's local disk. During deployment, new instances must become ready before receiving traffic, and old instances should finish in-flight requests before termination.

For the database, this design assumes an RDS Multi-AZ DB instance deployment. Its standby in another Availability Zone supports failover and does not serve reads. That differs from a Multi-AZ DB cluster, which provides readable standby instances. The [RDS Multi-AZ DB instance documentation](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZSingleStandby.html) explains this distinction.

Automatic failover can still involve connection errors. The application must discard failed connections and reconnect, and it must not blindly submit a failed order as a new one. Review the database failover behavior together with the flow for checking an order's result by its request identifier.

## Look for recovery evidence, not just a working page

Loading the home page is insufficient evidence of operational readiness. Review tail latency, error rates, unhealthy ALB targets, database connection counts, and cache hit rates together. A request identifier carried through logs makes it possible to follow a slow order across processing stages. Passwords and payment details should not be written directly into those logs.

Recovery planning starts by agreeing on an RTO, the acceptable restoration time after an interruption, and an RPO, the acceptable age of the recovery point. Having a backup and being able to restore service within the target are different claims. Restore into a separate environment and verify order counts and important query results. The [AWS Well-Architected guidance on recovery objectives](https://docs.aws.amazon.com/wellarchitected/latest/framework/rel_planning_for_recovery_objective_defined_recovery.html) explains how to tie those targets to business impact.

## Record what a cost reduction gives up

ASG maximum capacity limits instance expansion. It does not cap spending on the ALB, database, storage, or data transfer. Reducing that maximum also reduces scaling headroom, so the design needs a policy for limiting requests when capacity runs out.

A cache can reduce database work while adding its own cost and consistency management. Multi-AZ improves resilience but does not solve every failure or recover an accidentally deleted record. Cost reviews should also include retained snapshots, logs, and network paths. For every selected feature, record the requirement it satisfies and the trade-off it introduces.

## Questions that finish an architecture review

The final diagram should explain the normal request path, permission boundaries, and what happens after failure. These questions make the reasons for its connections concrete:

- Are the paths for an image cache miss and a failed order write clearly different?
- Can the remaining capacity handle the required workload after one Availability Zone is lost?
- Can the cache be emptied without losing orders or overwhelming the database?
- Can a request be retried without creating a duplicate order?
- Is there a practical way to verify backup restoration and deployment rollback?

A useful architecture is one whose choices can be explained against requirements and failures, rather than one with the largest collection of service icons.
