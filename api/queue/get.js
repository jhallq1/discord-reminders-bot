const _     = require('lodash');
const queue = require('./queue.js');
const bot   = require('../bot.js');

const noReminders = author => bot.fetchUser(author).then((user) => {
  user.send('No active reminders to display.');
});

function formatReminder(idx, { datetime, target, content }) {
  return `[${idx}] ${datetime}: @${target} will be reminded "${content}"\n`;
}

module.exports = (author) => {
  const reminders = [];

  queue.getDelayed().then((res) => {
    if (res) {
      res.forEach((item) => {
        if (_.isEqual(item.data.author, author)) {
          reminders.push({
            target: item.data.target.username,
            content: item.data.content,
            datetime: item.data.parsedTime.parsed
          });
        }
      });
    } else {
      noReminders(author);
    }
  }).then(() => {
    if (reminders.length) {
      let message = '';
      for (let i = 0; i < reminders.length; i++) {
        message += formatReminder(i + 1, reminders[i]);
      }

      bot.fetchUser(author).then((user) => {
        user.send(message);
      });
    } else {
      noReminders(author);
    }
  });
};
