module.exports = {
  createQueue: secrets => {
    return secrets;
  },
  create: (key, msg) => {
    return { key: key, msg: msg };
  },
  delay: milliseconds => {
    return milliseconds;
  },
  save: fn => {
    return fn;
  },
  process: (key, cb) => {
    return { key: key, cb: cb };
  }
}


// const queue = kue.createQueue({
//   redis: {
//     "port": keys.redisPort,
//     "host": keys.redisHost,
//     "auth": keys.redisKey
//   }
// });
//     let job = queue.create('reminder', {
//       target_id: target.id,
//       content: content
//     }).delay(millisecondsTillReminder).save(function(err) {
//       if (!err) {
//         return msg.direct(moment(chrono.parseDate(datetime)).calendar(
//           moment.now(), "M/D/YYYY h:mm a") + ', ' + target +
//           ' will be reminded "' + content + '" ');
//       }
//     });

//     queue.process('reminder', function(job, done) {
//       bot.fetchUser(job.data.target_id).then(user => {
//         user.send(job.data.content);
//       });

//       done();
//     });