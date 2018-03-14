const reminderStore = require('./client.js').reminders;
const bot = require('../bot.js');

const getTimestamps = (array) => {
  const timestamps = [];

  array.forEach((timestamp) => {
    if (timestamp < Date.now()) {
      timestamps.push(timestamp);
    }
  });
  return timestamps;
};

const sendReminders = (remindersArray, timestamp) => {
  remindersArray.forEach((reminder) => {
    bot.fetchUser(reminder.target).then((user) => {
      user.send(reminder.content);
    });
  });

  reminderStore.del(timestamp);
};

const getReminders = (timestampsArray) => {
  timestampsArray.forEach(timestamp => reminderStore.getAsync(timestamp)
  .then((remindersToSend) => {
    sendReminders(JSON.parse(remindersToSend), timestamp);
  }));
};

const processReminders = () => {
  let expiredTimestamps;

  reminderStore.scanAsync(0).then((data) => {
    if (data[1].length > 0) {
      expiredTimestamps = getTimestamps(data[1]);

      getReminders(expiredTimestamps);
    }
  });
};

module.exports = setInterval(processReminders, 30000);
