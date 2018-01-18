const { Command } = require('discord.js-commando');
const bot         = require('../../bot.js');
const exceptions  = require('../../util/exceptions.json');
const selectTz    = require('../../../db/queries/selectTimezone.js');
const insertTz    = require('../../../db/queries/insertTimezone.js');
const moment      = require('moment-timezone');

const command = {
  name: 'timezone',
  group: 'misc',
  memberName: 'timezone',
  description: 'Set your timezone. To view a list of zones, please visit ' +
    '`https://en.wikipedia.org/wiki/List_of_tz_database_time_zones`',
  examples: ['rbot timezone America/Los_Angeles'],
  args: [
    {
      key: 'content',
      prompt: 'What is your timezone?',
      type: 'string'
    }
  ]
};

module.exports = class TimezoneCommand extends Command {
  constructor(client) {
    super(client, command);
  }

  run(msg, { content }) {
    if (!moment.tz.names().includes(content)) {
      return msg.say(exceptions.invalid_timezone);
    }

    return insertTz([
      msg.message.author.username,
      msg.message.author.discriminator,
      content
    ])
    .then(res => {
      if (res > 0) {
        return msg.direct(`Your timezone has been set to ${content}`);
      };
    });
  };
};
