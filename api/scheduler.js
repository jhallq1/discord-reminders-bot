const scheduler = require('node-schedule');

let worker = {
  scheduleJob: function() {
    rule = '* * * * *';

    let job = scheduler.scheduleJob(rule, function() {
      console.log('ping!');
    });
  },

  init: function() {
    worker.scheduleJob();
  }
};

module.exports = {
  "worker": worker
}
