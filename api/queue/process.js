const queue = require('./queue.js');
const bot   = require('../bot.js');

module.exports = queue.process((job, done) => {
  bot.fetchUser(job.data.target_id).then((user) => {
    user.send(job.data.content);
  })
  .catch(exception => Promise.reject(exception));
  done();
});
