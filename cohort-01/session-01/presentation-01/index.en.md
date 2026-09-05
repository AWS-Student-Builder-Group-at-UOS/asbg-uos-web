## Three decisions before the first server

Launching an instance takes only a few steps, but the identity pressing the button and its permissions affect the whole account. This talk uses a learning account for a small online store to explain the preparation that comes before deployment.

Who signs in? Which actions are allowed? Who reviews increasing costs? MFA and a budget alert address different questions. Sign-in protection, request authorization, and cost review each need their own checks.

![Account preparation divided into root sign-in protection, roles and least privilege, and budget alerts with a response plan](img/diagram.svg)

## Reserve root for tasks that need it

The root user has broad authority over the account. Use a separate work identity for everyday deployment and exercises, returning to it after a task that needs root. Verify root MFA and recovery contacts, and do not create root access keys. [AWS root user best practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/root-user-best-practices.html)

Check the current identity before interpreting a security screen. MFA registered for a work user is not evidence that root MFA is configured. Shared notes should record the result and check date, excluding passwords and MFA enrollment secrets. MFA adds a sign-in check; it does not automatically make exposed access keys unusable. Credential handling needs a separate review.

## Separate human sign-in from application credentials

People should use their assigned sign-in path and roles, preferably obtaining temporary credentials through federation such as IAM Identity Center. Applications can obtain permissions through a role attached to their compute environment, including EC2. Review IAM users and long-term access keys when there is a specific need for them. [IAM security best practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)

A role is not an account with a shared password. An authorized principal assumes it and works with credentials that expire. The conditions for assuming the role and the actions allowed once it is assumed answer different questions. [IAM roles](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html)

For example, a store server that needs to read product images does not need a copy of a developer's access key. Give the server's role the relevant reading permission and define human administration separately. That makes ownership and the reason for each permission easier to explain.

## Start least privilege with a list of tasks

Write the required operations before assigning broad permissions. Reading an image and uploading a new image are different tasks. Map each task to actions and resource scope, adding conditions where needed. [IAM policies and permissions](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html)

| Required task | Scope to define first | Result to check |
|---|---|---|
| Read workshop guidance | The store and path containing the guide | Reading that file succeeds |
| Upload product images | The uploader's role and target path | Uploads stay within the allowed scope |
| Review exercise costs | The reviewer and required cost screens | Read access works without unnecessary modification permissions |

Prepare both an intended success and an out-of-scope case. An upload denied to a reading role may be the correct outcome. Before expanding permissions, compare the requested action and resource with the purpose of the exercise.

## Give budget alerts a response plan

Consider an example that reviews monthly spending against USD 5. The useful decisions are the cost scope, notification threshold, and recipient. Configure actual-cost alerts and check that enough usage history exists before relying on forecast alerts. [AWS Budgets best practices](https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-best-practices.html)

An alert is not a payment cap that stops spending at the specified amount. Usage reporting and notifications can lag, and running resources can continue generating costs after a message arrives. Automated budget actions need separate configuration. [Tracking costs with AWS Budgets](https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html)

For this example, the response is to acknowledge the alert, identify the service contributing the cost, compare remaining resources with their purpose, and agree on cleanup with the owner. A short record of the next action is more useful than an amount and email address alone.

## Diagnose billing access at two levels

Do not immediately add administrator permissions when a cost screen is denied. Access to the Billing and Cost Management console involves both the account's IAM access activation setting and the signed-in identity's permissions. Activation does not itself grant the necessary policy permissions. [Managing access to billing information](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/control-access-billing.html)

Record the current identity, requested screen or operation, error, and settings already checked. “The cost-review role cannot open Budgets” narrows the investigation more than “AWS does not work.” Confirm the account as well before changing a policy.

## What a prepared account looks like

- Root and work sign-in paths are distinct, with the relevant authentication settings checked.
- The purpose, actions, and resource scope of the exercise role can be explained.
- The chosen access method keeps credentials out of source code and shared notes.
- Budget scope, recipients, and the response to a notification are recorded.
- The account, Regions, resource owners, and cleanup responsibilities are known.

These are readiness criteria, not just a list of things created. Do not assume that an exercise is free without checking the account's applicable conditions. At the end, review retained storage and materials as well as running resources.

## Two common questions

**Must I create a long-term access key before using the CLI?**

First check whether the assigned sign-in method provides temporary credentials for the CLI. Choosing between console and command-line access is a separate decision from issuing a long-term key. The role and permissions should still match the task.

**If no budget alert has arrived, can I assume there is no cost?**

No. Check the configured scope, thresholds, and delivery path, and inspect the cost view directly. A prepared account has a clear answer to who is working, with which permissions, and how costs will be reviewed.
