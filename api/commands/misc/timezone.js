const { Command } = require('discord.js-commando');
const exceptions  = require('../../util/exceptions.json');
const insertTz    = require('../../../db/queries/insertTimezone.js');
const moment      = require('moment-timezone');

const timezones = {
  1: 'America/Puerto_Rico',
  2: 'America/New_York',
  3: 'America/Chicago',
  4: 'America/Denver',
  5: 'America/Phoenix',
  6: 'America/Los_Angeles',
  7: 'America/Anchorage',
  8: 'Pacific/Honolulu'
};

const command = {
  name: 'timezone',
  group: 'misc',
  memberName: 'timezone',
  description: 'Select from a list of timezones.',
  args: [
    {
      key: 'content',
      prompt: 'Quick-select your timezone by entering a number ' +
        'from the following list. Otherwise, enter the name of your zone ' +
        'if it is not included in the following list. ' +
        '[1] Atlantic ' +
        '[2] Eastern ' +
        '[3] Central ' +
        '[4] Mountain ' +
        '[5] MST ' +
        '[6] Pacific ' +
        '[7] Alaska ' +
        '[8] Hawaii',
      type: 'number'
    }
  ]
};

module.exports = class TimezoneCommand extends Command {
  constructor(client) {
    super(client, command);
  }

  run(msg, { content }) {
    if (
      !Object.prototype.hasOwnProperty.call(timezones, content) &&
      !moment.tz.names().includes(content)
    ) {
      return new Promise((resolve, reject) =>
        reject(msg.say(exceptions.invalid_timezone)));
    }

    return insertTz([
      msg.message.author.username,
      msg.message.author.discriminator,
      content
    ])
    .then(() => msg.direct(`Your timezone has been set to ${content}`));
  }
};
