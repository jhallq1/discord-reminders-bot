const reminderStore = require('./client.js').reminders;
const bot = require('../bot.js');

const scanReminderStore = () => {
  return reminderStore.scanAsync(0).then((data) => {
    if (data[1].length > 0) {
      return data[1];
    }
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

  expiredTimestampsArray.map((timestamp) => {
    if (!timestampsToClear.includes(timestamp)) {
      timestampsToClear.push(timestamp);
    }

    remindersToGet.push(reminderStore.getAsync(timestamp));
  });

  return Promise.all(remindersToGet).then((reminders) => {
    return [JSON.parse(reminders), timestampsToClear];
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
  let allTimestamps     = scanReminderStore();
  let expiredTimestamps = getExpiredTimestamps(allTimestamps);
  let remindersToSend   = getReminders(expiredTimestamps)[0];
  let timestampsToClear = getReminders(expiredTimestamps)[1];

  sendReminders(remindersToSend, timestampsToClear);
};

module.exports = {
  scanReminderStore: scanReminderStore,
  getExpiredTimestamps: getExpiredTimestamps,
  sendReminders: sendReminders,
  getReminders: getReminders,
  processReminders: processReminders
};

setInterval(processReminders, 30000);
