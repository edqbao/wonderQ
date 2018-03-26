const client  = require("redis").createClient();
const shortid = require('shortid');

const addq = (message,id) => {
  let messageO = JSON.stringify({'message':message, 'messageId':id});
  let append = ['queue']
  append.push(messageO)
  client.exists(id,function(err, reply) {
    if (reply == 1){
      client.lpush(append, function(err, reply) {
        client.del(id, function(err, reply) {
        });
      });
    }
  });
}

client.monitor(function (err, res) {
    console.log("Watcher Started");
});

client.on("monitor", function (time, args, raw_reply) {
    console.log(time + ": " + args);
    if(args.length > 2){
      if (args[0] == 'lpush' && args[1] != 'queue'){
        setTimeout(function() {
            addq(JSON.parse(args[2]).message,JSON.parse(args[2]).messageId)
        }, 30000);
      }
    }

});