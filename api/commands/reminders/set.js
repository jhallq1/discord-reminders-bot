const { Command } = require('discord.js-commando');
const chrono = require('chrono-node');
const moment = require('moment');

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
    return msg.say(moment(chrono.parseDate(datetime)).calendar(moment.now(),
      "M/D/YYYY h:mm a") + ': ' + target + ' will be reminded "' + content + '" ');
  };
};
