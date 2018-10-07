const moment = require('moment-timezone');

const reminderStore = require('./client.js').reminders;
const tzStore = require('./client.js').timezones;
const bot = require('../bot.js');

const processReminders = async () => {
  let reminders;
  let indexesOfElementsToRemove;
  let expiredReminders;
  let user;

  try {
    const authorIds = (await reminderStore.scanAsync(0))[1];

    if (authorIds.length > 0) {
      authorIds.forEach(async (id) => {
        const authorTz = await tzStore.getAsync(id);
        const timeInAuthorTz = moment().tz(authorTz).valueOf();

        reminders = JSON.parse(await reminderStore.getAsync(id));

        if (reminders.length > 0) {
          indexesOfElementsToRemove = [];
          expiredReminders = [];

          for (let i = 0; i < reminders.length; i++) {
            if (reminders[i].parsedTime.timeInMS < timeInAuthorTz) {
              indexesOfElementsToRemove.push(i);
              expiredReminders.push(reminders[i]);
            }
          }
        }

        if (expiredReminders.length > 0) {
          expiredReminders.forEach(async (reminder) => {
            user = await bot.fetchUser(reminder.target);
            user.send(reminder.content);
          });

          indexesOfElementsToRemove.forEach((idx) => {
            reminders.splice(idx, 1);
          });

          await reminderStore.setAsync(id, JSON.stringify(reminders));
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  processReminders
};

setInterval(processReminders, 10000);
