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

  async run(msg, { target, content, datetime }) {
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

    try {
      if (!chrono.parseDate(datetime)) {
        return msg.say(exceptions.invalid_datetime_format);
      }

      let tz = await tzStore.getAsync(author.id);

      if (!tz) {
        return msg.say(exceptions.timezone_not_set);
      } else {
        timezone = tz;
      }

      const parsedTime = parseDate(datetime, timezone);

      if (parsedTime.delayAmt < 500) {
        return msg.say(exceptions.past_time);
      }

      const existingReminders = await reminderStore.getAsync(
        author.id
      );

      if (existingReminders) {
        reminders = JSON.parse(existingReminders);
      }

      reminders.push({
        target: target.id,
        parsedTime: parsedTime.parsed,
        content
      });

      remindersJson = JSON.stringify(reminders);

      await reminderStore.setAsync(author.id, remindersJson);
      await msg.direct(
        `${parsedTime.parsed}, ${target} will be reminded "${content}"`
      );
    } catch (error) {
      console.log(error);
    }
  }
};
