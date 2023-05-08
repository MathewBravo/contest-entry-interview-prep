# Contest Entry Lambda Functions

## Overview

### ContestRegistry

This Lambda function is responsible for registering a user for a contest. It will query the database using a `UPSERT`.
This allows it to maintain atomic time inserts on unique constraints.

```javascript
const res = await client.query('INSERT INTO contest_entries (firstname, lastname, email)\n' +
    'VALUES ($1, $2, $3)\n' +
    'ON CONFLICT ON CONSTRAINT unique_email DO NOTHING;\n', [firstName, lastName, email]);
```

#### Scalability

Whilst the insertion methodology does protect against concurrent entries into the database using the same information.
The email validation is not production ready.

For proper email validation it would be better to use a service like AWS Simple Email Service(
SES), [verifyEmailIdentity](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SES.html#verifyEmailIdentity-property),
or a service like ZeroBounce.

### SelectWinner

This function selects a winner for the contest by randomly selecting a single entry from the contest_entries table.

```javascript
const res = await client.query('SELECT * FROM contest_entries ORDER BY RANDOM() LIMIT 1;');
```

#### Scalability

You could also have a separate table that stores a count of the contest_entries table. However, this level of complexity
may be too much for an action as simple as retrieving a random winner from the database, and allowing the database to
handle the retrieval of the winner removes all security risks associated with manually creating the function.

### ViewAllEntries

Simply shows all entries into the contest.

```javascript
const res = await client.query('SELECT * FROM contest_entries');
```