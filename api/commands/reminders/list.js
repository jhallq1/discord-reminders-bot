const { Command } = require('discord.js-commando');
const getReminders = require('../../queue/get.js');

const command = {
  name: 'list',
  group: 'reminders',
  memberName: 'list',
  description: 'View a list of reminders user has set.',
  examples: ['rbot list']
};

module.exports = class ListCommand extends Command {
  constructor(client) {
    super(client, command);
  }

  run(msg) {
    const author = {
      id: msg.message.author.id,
      username: msg.message.author.username,
      discriminator: msg.message.author.discriminator
    };

    return getReminders(author);
  }
};
