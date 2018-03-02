const queue = require('./queue.js');
const bot   = require('../bot.js');

module.exports = (ids, author) => {
  const promises = [];

  ids.forEach((id) => {
    promises.push(queue.getJob(id));
  });

  Promise.all(promises).then((res) => {
    // console.log(1, res);
    const jobs = [];
    for (let i = 0; i < res.length; i++) {
      if (res[i]) {
        jobs.push(res[i]);
      }
    }

    if (jobs.length > 0) {
      const job = {};
      let reminders = '';

      for (let j = 0; j < jobs.length; j++) {
        job.target = jobs[j].data.target.username;
        job.content = jobs[j].data.content;
        job.datetime = jobs[j].data.parsedTime.parsed;

        reminders += `${job.datetime}: @${job.target} will be reminded
        "${job.content}".\n`;
      }
      bot.fetchUser(author).then((user) => {
        user.send(reminders);
      });
    } else {
      bot.fetchUser(author).then((user) => {
        user.send('No active reminders to display.');
      });
    }
  });
};
