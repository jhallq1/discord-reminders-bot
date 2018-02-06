const { Command } = require('discord.js-commando');
const exceptions  = require('../../util/exceptions.json');
const insertTz    = require('../../../db/queries/insertTimezone.js');
const moment      = require('moment-timezone');

const timezones = [
  'America/Puerto_Rico',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Phoenix',
  'America/Los_Angeles',
  'America/Anchorage',
  'Pacific/Honolulu'
];

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
    const tz = typeof content === 'number' ? timezones[content] : content;

    if (!moment.tz.names().includes(tz)) {
      return new Promise((resolve, reject) =>
        reject(msg.say(exceptions.invalid_timezone)));
    }

    return insertTz([
      msg.message.author.username,
      msg.message.author.discriminator,
      tz
    ])
    .then(() => msg.direct(`Your timezone has been set to ${tz}`));
  }
};
