require('../../queue/process.js');

const { Command } = require('discord.js-commando');
const chrono      = require('chrono-node');
const exceptions  = require('../../util/exceptions.json');
const parseDate   = require('../../util/translateDatetime.js');
const redis       = require('../../redis/client.js');

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

    const data = {
      reminders: []
    };

    if (!chrono.parseDate(datetime)) {
      return new Promise((resolve, reject) =>
        reject(msg.say(exceptions.invalid_datetime_format)));
    }

    return redis.hgetallAsync(author.id)
    .then((res) => {
      if (!res || !res.timezone) {
        msg.say(exceptions.timezone_not_set);
      } else {
        if (res.reminders) {
          data.reminders = JSON.parse(res.reminders);
        }

        data.timezone = res.timezone;
      }
    })
    .then(() => {
      const parsedTime = parseDate(datetime, data.timezone);

      if (parsedTime.delayAmt < 500) {
        return Promise.reject(msg.say(exceptions.past_time));
      }

      data.reminders.push({
        target: target.id,
        parsedTime: parsedTime.parsed,
        timeInMS: parsedTime.timeInMilliseconds,
        content
      });

      return redis.hsetAsync(author.id, [
        'reminders',
        JSON.stringify(data.reminders)
      ])
      .then(() => redis.hgetallAsync(author.id)
      .then(() => msg.direct(
        `${parsedTime.parsed}, ${target} will be reminded "${content}"`
      )))
      .catch(err => console.error(err.stack));
    })
    .catch(err => console.error(err.stack));
  }
};
