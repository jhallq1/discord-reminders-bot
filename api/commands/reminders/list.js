const { Command } = require('discord.js-commando');
const selectJobIds = require('../../../db/queries/selectJobIds.js');
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
      author_id: msg.message.author.id,
      username: msg.message.author.username,
      discriminator: msg.message.author.discriminator
    };

    return selectJobIds([author.username, author.discriminator])
    .then((res) => {
      const ids = res.job_ids;
      return getReminders(ids, author.author_id);
    });
  }
};
