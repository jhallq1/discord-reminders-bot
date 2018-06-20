const { Command }   = require('discord.js-commando');
const chrono        = require('chrono-node');
const exceptions    = require('../../util/exceptions.json');
const parseDate     = require('../../util/translateDatetime.js');
const tzStore       = require('../../redis/client.js').timezones;
const reminderStore = require('../../redis/client.js').reminders;

const command = {
  name: 'remind',
  group: 'reminders',
  memberName: 'remind',
  description: `Set a new reminder. When using the one-line/short-hand
    version of this command, enclose the reminder task in double quotes
    for more accurate parsing.`,
  examples: ['rbot remind @user "Tell Kiba he\'s a good boy" tomorrow morning',
    'rbot remind @user "Pick up the dog" in 4 hours'],
  args: [
    {
      key: 'target',
      prompt: 'Which user do you want to receive this reminder?',
      type: 'user'
    },
    {
      key: 'content',
      prompt: 'What is the reminder?',
      type: 'string'
    },
    {
      key: 'datetime',
      prompt: 'When would you like this reminder to go off?',
      type: 'string'
    }
  ]
};

module.exports = class RemindCommand extends Command {
  constructor(client) {
    super(client, command);
  }

  run(msg, { target, content, datetime }) {
    const { author } = msg.message;

    let timezone;
    let reminders = [];
    let remindersJson;


    // for handling of reminder object from RemindCommand test
    if ((!target || !datetime) && content) {
      target = content.target;
      datetime = content.datetime;
      content = content.content;
    }

    if (!chrono.parseDate(datetime)) {
      return new Promise((resolve, reject) =>
        reject(msg.say(exceptions.invalid_datetime_format)));
    }

    return tzStore.getAsync(author.id)
    .then((tz) => {
      if (!tz) {
        msg.say(exceptions.timezone_not_set);
      } else {
        timezone = tz;
      }
    })
    .then(() => {
      const parsedTime = parseDate(datetime, timezone);

      if (parsedTime.delayAmt < 500) {
        return Promise.reject(msg.say(exceptions.past_time));
      }
      console.log(1, parsedTime);
      return reminderStore.getAsync(parsedTime.timeInMS)
      .then((existingReminders) => {
        if (existingReminders) {
          reminders = JSON.parse(existingReminders);
        }

        reminders.push({
          target: target.id,
          parsedTime: parsedTime.parsed,
          content
        });

        remindersJson = JSON.stringify(reminders);
      })
      .then(() => reminderStore.setAsync(parsedTime.timeInMS, remindersJson))
      .then(() => msg.direct(
        `${parsedTime.parsed}, ${target} will be reminded "${content}"`
      ))
      .catch(err => console.error(err.stack));
    })
    .catch(err => console.error(err.stack));
  }
};
