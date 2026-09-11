> This session covers **Building a 3-Tier Web Service**. The content below is a reference draft from an earlier plan; the actual presentation materials will be updated after the session.

## Start with one page that responds

Imagine a small shop showing three products and their prices. The HTML already exists, but it opens only on your laptop. To let someone else enter an address and receive the page, you need a server that produces the response and a network path that reaches it. Our starting design puts a static page containing no personal information on one EC2 instance.

Adding a database and several servers immediately makes failures harder to isolate. First establish that an external request reaches the intended server and returns the expected body. Then explain what changes when the address, route, or access rule is wrong. That is a more useful foundation than a screenshot of a page that happened to load.

## Use a VPC and subnet to define the address space

A VPC defines the network address boundary. With an example VPC of `10.0.0.0/16` and a first subnet of `10.0.1.0/24`, the instance receives a private address from that subnet. The important checks are containment and nonoverlap, not memorizing these particular ranges. Consider the address ranges of other networks if you expect to connect them later.

A subnet belongs to one Availability Zone. Selecting a VPC and subnet when launching EC2 determines where the server lives. Giving a subnet a name containing `public` does not create internet connectivity. Inspect the route table actually associated with that subnet.

## Provide both an address and an internet route

This direct IPv4 design needs an internet gateway attached to the VPC, suitable subnet routes, a public IPv4 address on the instance, and rules permitting the required traffic. A route such as `0.0.0.0/0 → IGW` supplies the destination for internet-bound IPv4 traffic that does not match a more specific route.

A subnet with a route to an internet gateway is public, but that does not make every instance reachable. Missing addresses or access rules still matter; an address without a route is also insufficient. Check these conditions against the [AWS internet gateway guide](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html).

![DNS address lookup and the HTTP connection to EC2, with subnet, routing, and security group requirements](img/diagram.svg)

## DNS resolves the destination; it does not proxy HTTP

A domain name requires an address lookup before the connection. Route 53 can provide authoritative DNS, but the subsequent HTTP request does not pass through its DNS servers. The browser connects to the returned address. Cached DNS information can also avoid repeating the full lookup. These stages are separate in the [AWS DNS request flow](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/welcome-dns-service.html).

For the first check, entering the public IP directly avoids setting up a domain. If the IP works but the domain does not, compare the record target and actual lookup result before rebuilding the web server. A correct DNS answer alone, however, does not prove that the web application responds.

## Write access rules for specific traffic

A newly created security group starts with no inbound rules and an allow-all outbound rule. Inspect the VPC's default security group and rules added by launch tools separately. Assuming every initial configuration blocks both directions leads to incorrect diagnosis. Security groups use allow rules rather than explicit deny rules. See the [AWS security group rules reference](https://docs.aws.amazon.com/vpc/latest/userguide/security-group-rules.html).

To view this practice page only from your browser, restrict the source for HTTP port 80 to your public IP. If SSH is needed, restrict port 22 to the required source as well. Decide the exposure and HTTPS configuration separately for a public website. Because security groups track connections, responses to permitted traffic do not need a separate reverse-direction rule. A new outbound connection initiated by the server is a different case.

## Check inside the server before checking from outside

Launching EC2 requires connecting the intended subnet and security group as well as choosing an operating system image, instance capacity, and disk. A working network cannot serve a page if the web server process is not running. On a Linux instance with Nginx installed, begin by reading its local state:

```sh
sudo systemctl status nginx --no-pager
sudo ss -lntp
curl --max-time 5 -i http://127.0.0.1/
```

Check that the service is running, that a process is listening on port 80, and that a local request returns a status code and body. An application bound only to `127.0.0.1` is reachable only from inside the instance, so also inspect its listening address. Then use `http://PUBLIC-IPv4/` in your own browser and compare the response. Requesting HTTPS from a server configured only for HTTP uses a different port and protocol.

## Narrow the investigation using the symptom

If SSH works but HTTP does not, the entire internet path is not simply absent. Start with the web port rule, process, and listening address. A connection timeout calls for checking the current public IP, the subnet's actual route table association, and the security group's source. Moving between home and an office network can change your own public IP. Inspect any custom network ACL or operating system firewall rules as well.

`Connection refused` suggests investigating whether anything accepts connections on that port or actively rejects them. An HTTP 403 or 404 means a web server responded, so file permissions, the document root, and the requested path become better leads. Connect one setting to one observation instead of opening every rule at once.

## Stopping a server does not remove every cost

A small instance type is not a guarantee of free usage. Check the benefits and conditions that apply to the account, and consider runtime, storage, addresses, and transfer together. In this EBS-backed design, stopping the instance stops compute usage charges but does not eliminate charges for resources that remain, including EBS storage.

Before terminating something you no longer need, preserve required files and distinguish instance termination from cleanup of associated resources. Volumes may remain depending on their deletion settings. An automatically assigned public IPv4 address may change after a stop and start, so a saved browser address is not necessarily permanent. Use the [AWS instance state and billing guide](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-lifecycle.html) to verify the final state as part of completing the design.
