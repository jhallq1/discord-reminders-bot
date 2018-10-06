const moment = require('moment-timezone');

const reminderStore = require('./client.js').reminders;
const tzStore = require('./client.js').timezones;
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

const getExpiredReminders = (allAuthorIds) => {
  let timeInAuthorTz;

  allAuthorIds.forEach((id) => {
    return tzStore.getAsync(id).then((timezone) => {
      timeInAuthorTz = moment().tz(timezone).valueOf();

      return reminderStore.getAsync(id).then((reminders) => {
        console.log(reminders)
      });
    });
  });
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
      reminders.forEach((arrayOfReminders) => {
        remindersToSend.push(...JSON.parse(arrayOfReminders));
      });
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
  return scanReminderStore().then((authorIds) => {
    if (authorIds.length > 0) {
      const expiredReminders = getExpiredReminders(authorIds);

      // return getReminders(expiredTimestamps).then((res) => {
      //   if (res[0].length > 0) {
      //     sendReminders(...res);
      //   }
      // });
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
