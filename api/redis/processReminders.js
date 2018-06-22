const reminderStore = require('./client.js').reminders;
const bot = require('../bot.js');

const scanReminderStore = () => {
  return reminderStore.scanAsync(0).then((data) => {
    return data[1];
  });
};

const getExpiredTimestamps = (timestampsArray) => {
  const expiredTimestamps = [];

  timestampsArray.forEach((timestamp) => {
    if (timestamp < Date.now()) {
      expiredTimestamps.push(timestamp);
    }
  });

  return expiredTimestamps;
};

const getReminders = (expiredTimestampsArray) => {
  let remindersToGet = [];
  let timestampsToClear = [];

  expiredTimestampsArray.forEach((timestamp) => {
    if (!timestampsToClear.includes(timestamp)) {
      timestampsToClear.push(timestamp);
    }

    remindersToGet.push(reminderStore.getAsync(timestamp));
  });

  return Promise.all(remindersToGet).then((reminders) => {
    let remindersToSend = [];

    if (reminders.length > 0) {
      remindersToSend = JSON.parse(reminders);
    }
    return [remindersToSend, timestampsToClear];
  });
};

const sendReminders = (remindersArray, timestampsToClearArray) => {
  remindersArray.forEach((reminder) => {
    bot.fetchUser(reminder.target).then((user) => {
      return user.send(reminder.content);
    });
  });

  timestampsToClearArray.forEach((timestamp) => {
    reminderStore.del(timestamp);
  });
};

const processReminders = () => {
  return scanReminderStore().then((allTimestamps) => {
    if (allTimestamps.length > 0) {
      const expiredTimestamps = getExpiredTimestamps(allTimestamps);

      return getReminders(expiredTimestamps).then((res) => {
        sendReminders(...res);
      });
    }
  });
};

module.exports = {
  scanReminderStore,
  getExpiredTimestamps,
  sendReminders,
  getReminders,
  processReminders
};

setInterval(processReminders, 10000);
