/* global describe context it */
const proxyquire = require('proxyquire').noCallThru();
const { expect } = require('chai');
const msg        = require('./stubs/message.js');
const exceptions = require('../api/util/exceptions.json');

/* eslint-disable global-require */
const TimezoneCommand = proxyquire(
  '../api/commands/misc/timezone.js',
  {
    'discord.js-commando': require('./stubs/Command.js'),
    '../../bot.js': new (require('./stubs/CommandoClient.js').CommandoClient)(),
    '../../redis/client.js': require('./mocks/redisClient.js')
  }
);
/* eslint-enable global-require */

const subject = (message, content) => new TimezoneCommand({}).run(
  message, { content }
);

describe('Timezone Command', () => {
  context("when user inputs invalid timezone", () => {
    it('displays list of timezones from which to select', () => subject(
      msg, 'invalid_timezone'
    ).catch((ex) => {
      expect(ex).to.eq(exceptions.invalid_timezone);
    }));
  });
});
