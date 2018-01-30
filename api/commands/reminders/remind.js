const { Command } = require('discord.js-commando');
const chrono      = require('chrono-node');
const moment      = require('moment');
const kue         = require('kue');
const bot         = require('../../bot.js');
const keys        = require('../../keys.json');
const exceptions  = require('../../util/exceptions.json');
const selectTz    = require('../../../db/queries/selectTimezone.js');
const parseDate   = require('../../util/translateDatetime.js');

const queue = kue.createQueue({
  redis: {
    "port": keys.redisPort,
    "host": keys.redisHost,
    "auth": keys.redisKey
  }
});

const command = {
  name: 'remind',
  group: 'reminders',
  memberName: 'remind',
  description: 'Set a new reminder.',
  examples: ['rbot remind @user "Buy milk" tomorrow',
    'rbot remind @user "Pick up the dog" in 4 hours',
    'rbot remind @user take the trash out at 6pm',
    'rbot remind @user renew driver license in 2 weeks'],
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
    if (!chrono.parseDate(datetime)) {
      return new Promise((resolve, reject) => {
        return reject(msg.say(exceptions.invalid_datetime_format));
      });
    }

    return selectTz([target.username, target.discriminator])
    .then(timezone => {
      if (!timezone) {
        return Promise.reject(msg.say(exceptions.timezone_not_set));
      } else {
        let parsedTime = parseDate(datetime, timezone);
        
        if (moment(parsedTime.timeWithOffset).diff(moment()) < 0) {
          return Promise.reject(msg.say(exceptions.past_time));
        }

        return queue.create('reminder', {
          target_id: target.id,
          content: content
        })
        .delay(parsedTime.delayAmt)
        .save(function(err) {
          if (!err) {
            return msg.direct(
              `${parsedTime.parsed}, ${target} will be reminded "${content}"`
            );
          } else {
            return Promise.reject(exceptions.queue_save);
          }
        });
      }
    })
    .then(job => {
      return queue.process('reminder', function(job, done) {
        bot.fetchUser(job.data.target_id).then(user => {
          user.send(job.data.content);
        })
        .catch(exception => {
          return Promise.reject(exception);
        });

        done();
      });
    });
  };
};
