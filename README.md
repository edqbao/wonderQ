# WonderQ

Implementation of simple wonderQ application and CLI with NodeJS and Redis

## Getting Started



### Prerequisites

Must have node and redis installed:
```
brew install node
brew install redis
```

### Setting Up wonderQ

Clone Repository into local directory:

```
git clone https://github.com/edqbao/wonderQ.git
```

Install node_modules

```
npm install
```

Start Watcher

```
npm run watch
or
node watcher.js
```

You should see: "Watcher Started"

## Using the CLI

Watcher must be running

```
npm run queue printq
or
node server.js printq
```

Shows current state of message queue

```
npm run queue addq <message>
or
node server.js addq <message>
```

Adds message to queue, returns messageId of message

```
npm run queue recieve
or
node server.js recieve
```

Consumer recieves a message in queue <br />
Message added to consumer's reception queue <br />
Message made unavailable to other consumers until Timeout

```
npm run queue remove <messageId>
or
node server.js remove <messageId>
```

Consumer processes a message and is permanently deleted from queue <br />
If message has not been recieved, do nothing.

## Potential API Endpoints

#### GET/queue
Return state or other information regarding the queue

#### GET/message
Analogous to recieve; respond with first message of queue
Potential option to set timeout

#### GET/message
Post a message to the queue

#### DELETE/messageId
Delete message with id messageId

## WonderQ Design
#### Multiple producers can write messages to queue with addq operation
addq appends message and messageId object to end of Redis list

#### Consumer reads message with recieve operation
recieve creates a new consumer queue of length 1 with the message recieved <br />
Sets timeout <br />
If message is not processed after timeout, pushes message back onto begining of queue <br />

#### Consumer processes message with remove operation
remove checks if a consumer queue for the message to be removed exists <br />
if consumer queue exists, deletes consumer queue <br />
timeout occurs, and without consumer queue existing, message cant be added back to queue <br />

## System Scalability
Redis is used as data store for this application <br />
Very high speeds for write and read operations using Redis to meet high volume message write and consumption

## Authors

Edward Bao
