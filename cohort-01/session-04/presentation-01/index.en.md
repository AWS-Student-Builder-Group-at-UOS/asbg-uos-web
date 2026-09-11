> This session covers **Moving to Container-Based Microservices**. The content below is a reference draft from an earlier plan; the actual presentation materials will be updated after the session.

## Choose storage by how the data is used

Product photographs and order records are both data, but the operations they need differ. A photograph is uploaded as a file and retrieved by a key. An order needs relationships with customers and products, and consistent changes to orders and inventory. In this design, S3 holds images and downloadable documents, while RDS holds relational tables for customers, orders, and stock.

The database stores object keys so the application can locate files. Using both services does not make an object upload and a database update one transaction. The design must account for a file left behind when a database write fails, and for a database record whose referenced object is missing.

## Check both ends of a database connection

The example database is reached by application servers in the same VPC, rather than directly from the internet. Disabling public accessibility and allowing traffic through security groups are separate settings. For an EC2 client, the database's inbound rule should reference the client's security group rather than the IP address of the developer's laptop.

Use the configured database port. The defaults are 3306 for MySQL and 5432 for PostgreSQL, but they can change. Check the endpoint's DNS name, network path, security groups, and database authentication separately. A timeout and a password error do not imply the same cause. [RDS access scenarios within a VPC](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_VPC.Scenarios.html)

Use an engine-appropriate client and a non-mutating query such as `SELECT 1;` to check a connection. Then confirm access to the required tables and review whether the application account has unnecessary administrative privileges. A reachable port alone does not establish that application permissions are correct.

## Encryption and private access are separate controls

New S3 object uploads receive SSE-S3 encryption with S3-managed keys by default. Consider SSE-KMS when the design needs control over customer-managed key policies and lifecycle. Reading an SSE-KMS object requires reviewing the KMS decrypt permission as well as S3 read access, and KMS usage has cost implications. [S3 default encryption and SSE-KMS](https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingKMSEncryption.html)

An authorized principal can still read an encrypted file. Review Block Public Access, relevant policies, and an object's actual encryption configuration separately. Changing the bucket default does not mean existing objects have all been re-encrypted with a new key. HTTPS and database-client TLS protect data in transit and belong alongside the review of encryption at rest.

## Read the Multi-AZ deployment type

A **Multi-AZ DB instance deployment** uses a standby in another Availability Zone for failover; that standby does not serve read traffic. A **Multi-AZ DB cluster deployment** has a writer and two readers that can also serve reads. The statement that Multi-AZ cannot support reads therefore does not apply to every deployment type. [RDS Multi-AZ deployment types](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.html)

Separate the design questions. Are we reducing interruption after a failure, or distributing ordinary read load? Use that purpose to choose a deployment type and connection targets. Also check how the application reconnects after a broken connection. A replicated database does not provide the historical recovery plan needed for an accidentally changed order, so backups need their own design.

![Four review areas: private S3 access, RDS connection controls, backup and restore, and encryption with key management](img/diagram.svg)

## Define tolerable loss before choosing backups

RPO describes tolerable data loss; RTO describes the time allowed for recovery. Suppose an order system has a ten-minute RPO and a one-hour RTO. Saying that a snapshot is taken every day does not establish that those goals are met. These values are illustrative business targets, not AWS recovery guarantees.

RDS automated backups support recovery to a point within the retention period. A manual snapshot preserves a particular state and is not automatically removed when the DB instance is deleted. The handling of automated backups at deletion depends on the retention choice. Review retention and the latest restorable time, and explicitly decide which backups to retain before deleting a database. [RDS automated backups and snapshots](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.html)

## Verify that the restored database is usable

If an order status was changed incorrectly, identify a recovery point before the mistake. For a DB instance, point-in-time recovery creates a new instance rather than overwriting the original, so prepare the connection change and the checks that must precede it.

Work through these checks:

1. Compare the incident time and target recovery time with the available restoration range.
2. Verify the restored database's network, security groups, key access, and application connection.
3. Compare known order identifiers, order counts, amount totals, and timestamps of recent orders.
4. Confirm that the object keys stored in RDS still resolve to the required S3 files.
5. Include validation and connection-switching time when comparing recovery with the RTO.

A database being `available` does not mean the service is working correctly. Investigate missing orders or inconsistencies between files and database records before switching traffic. Separately decide how to handle valid orders received after the mistake.

## Keep five decisions in the design record

Record where each kind of data lives, who can read or write it and through which path, the encryption choice and key owner, the deployment type needed for failure handling, and the RPO/RTO with a procedure to verify them. Describe the expected result in a concrete situation, rather than merely recording that a feature was enabled.

The cost review includes database runtime, storage, retained backups and manual snapshots, the database created during recovery, and KMS usage. Neither the word “workshop” nor an instance class name establishes that the work is free. Likewise, separate deleting a database from deciding how to retain or remove its backups and keys.

## Frequently asked questions

**Q. Does AccessDenied at an S3 URL prove the configuration is safe?**

It establishes that the particular request was denied. It does not review every access policy or every other principal. Also verify that the intended user can read the required file.

**Q. How do I administer a private database from my laptop?**

Use the organization's approved private connection or management path. Before enabling public access to address a failure, identify the request's origin and its intended route to the database.

**Q. Is recovery ready once a backup appears in the list?**

That is a first indication that a recovery source exists. Evaluating the recovery target also requires being able to restore it, validate the data, and switch the application's connection.
