const { Command } = require('discord.js-commando');
const chrono = require('chrono-node');
const moment = require('moment');
const kue = require('kue');
const bot = require('../../bot.js');

const queue = kue.createQueue();

module.exports = class SetCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'set',
      aliases: ['set-reminder', 'create-reminder', 'add-reminder'],
      group: 'reminders',
      memberName: 'set',
      description: 'Set a new reminder.',
      examples: ['set "Buy milk" tomorrow'],
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
    });
  }

  run(msg, { target, content, datetime }) {
    if (!chrono.parseDate(datetime)) {
      return msg.say('Error! Please use the `rbot help set` command to view' +
      ' accepted datetime formats.');
    }

    let millisecondsTillReminder = chrono.parseDate(datetime).getTime() -
      moment().valueOf();

    if (millisecondsTillReminder < 0) {
      return msg.say('Error! You cannot schedule a reminder for the past.');
    }

    let job = queue.create('reminder', {
      target_id: target.id,
      content: content
    }).delay(millisecondsTillReminder).save(function(err) {
      if (!err) {
        return msg.direct(moment(chrono.parseDate(datetime)).calendar(
          moment.now(), "M/D/YYYY h:mm a") + ', ' + target +
          ' will be reminded "' + content + '" ');
      }
    });

    queue.process('reminder', function(job, done) {
      bot.fetchUser(job.data.target_id).then(user => {
        user.send(job.data.content);
      });

      done();
    });
  };
};
