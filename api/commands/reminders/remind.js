const { Command } = require('discord.js-commando');
const chrono      = require('chrono-node');
const kue         = require('kue');
const bot         = require('../../bot.js');
const keys        = require('../../keys.json');
const exceptions  = require('../../util/exceptions.json');
const selectTz    = require('../../../db/queries/selectTimezone.js');
const parseDate   = require('../../util/translateDatetime.js');

const queue = kue.createQueue({
  redis: {
    port: keys.redisPort,
    host: keys.redisHost,
    auth: keys.redisKey
  }
});

queue.process('reminder', (job, done) => {
  bot.fetchUser(job.data.target_id).then((user) => {
    user.send(job.data.content);
  })
  .catch(exception => Promise.reject(exception));

  done();
});

const reminderLater = (target, content, parsedTime) => new Promise(
  (resolve, reject) => {
    queue.create('reminder', {
      target_id: target.id,
      content
    })
    .delay(parsedTime.delayAmt)
    .save((err) => {
      if (err) {
        reject(exceptions.queue_save);
      }

      resolve();
    });
  }
);

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
    let parsedTime;

    if (!chrono.parseDate(datetime)) {
      return new Promise((resolve, reject) =>
        reject(msg.say(exceptions.invalid_datetime_format)));
    }

    return selectTz([target.username, target.discriminator])
    .then((timezone) => {
      if (!timezone) {
        return Promise.reject(msg.say(exceptions.timezone_not_set));
      }

      parsedTime = parseDate(datetime, timezone);

      if (parsedTime.delayAmt < 500) {
        return Promise.reject(msg.say(exceptions.past_time));
      }

      return reminderLater(target, content, parsedTime);
    })
    .then(() => msg.direct(
      `${parsedTime.parsed}, ${target} will be reminded "${content}"`
    ));
  }
};
