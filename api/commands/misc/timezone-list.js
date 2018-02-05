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
  name: 'timezone-list',
  group: 'misc',
  memberName: 'timezone-list',
  description: 'Select from a list of timezones.',
  args: [
    {
      key: 'content',
      prompt: 'Enter the number associated with your timezone. ' +
        '[1] America/Puerto_Rico (Atlantic) ' +
        '[2] America/New_York (Eastern) ' +
        '[3] America/Chicago (Central) ' +
        '[4] America/Denver (Mountain) ' +
        '[5] America/Phoenix (MST) ' +
        '[6] America/Los_Angeles (Pacific) ' +
        '[7] America/Anchorage (Alaska) ' +
        '[8] Pacific/Honolulu (Hawaii) ' +
        '[9] None of the above',
      type: 'number'
    }
  ]
};

module.exports = class TimezoneListCommand extends Command {
  constructor(client) {
    super(client, command);
  }

  run(msg, { content }) {
    if (!Object.prototype.hasOwnProperty.call(timezones, content)) {
      // do this
    }
  }
};
