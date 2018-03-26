const redis = require('redis');
const redisClient = redis.createClient();
const program = require('commander');
const shortid = require('shortid');

const printq = () => {
  redisClient.lrange('queue', 0, -1, function(err, reply) {
      console.log(reply); // ['angularjs', 'backbone']
      redisClient.quit()
  });
}

const addq = (message) => {
  let id = shortid.generate()
  let messageO = JSON.stringify({'message':message, 'messageId':id});
  let append = ['queue']
  append.push(messageO)
  redisClient.lpush(append, function(err, reply) {
    console.log(id);
    redisClient.quit()
  });
}

const recieve = () => {
  redisClient.blpop('queue',2, function(err, reply) {
    if(reply == null){
      console.log('Queue Empty')
      redisClient.quit()
    }
    else{
      console.log(reply[1].slice(2,-1));
      let append = [JSON.parse(reply[1]).messageId]
      let message = append.push(reply[1])
      redisClient.lpush(append, function(err, reply) {
        redisClient.quit()
      });
    }
  });
}

const remove = (messageId) => {
  redisClient.exists(messageId,function(err, reply) {
    if(err){throw err}
    if (reply == 1){
      redisClient.del(messageId, function(err, reply) {
        if(err){throw err}
        console.log('message ' + messageId + ' deleted')
        redisClient.quit()
      });
    }
    else{
      console.log('messageId not valid')
      redisClient.quit()
    }
  });
}

program
  .version('0.0.1')
  .description('queue demo');


program
  .command('printq')
  .action(() => {
    printq()
  });

program
  .command('recieve')
  .action(() => {
    recieve()
  });

program
  .command('addq <message>')
  .action((message) => {
    addq(message)
  });

program
  .command('remove <messageId>')
  .action((messageId) => {
    remove(messageId)
  });

program.parse(process.argv);
