/* global describe beforeEach context it */
const proxyquire = require('proxyquire').noCallThru();
const { expect } = require('chai');
const msg        = require('./stubs/message.js');
const exceptions = require('../api/util/exceptions.json');

/* eslint-disable global-require */
const TimezoneCommand = proxyquire(
  '../api/commands/misc/timezone.js',
  {
    'discord.js-commando': require('./stubs/Command.js'),
    '../../bot.js': new (require('./stubs/CommandoClient.js').CommandoClient)()
  }
);
/* eslint-enable global-require */

const subject = (message, content) => new TimezoneCommand({}).run(
  message, { content }
);

describe('Timezone Command', () => {
  context("when user inputs invalid timezone", () => {
    it('throws invalid_timezone error', () => subject(
      msg, 'Los_Angeles'
    ).catch((error) => {
      expect(error).to.eq(exceptions.invalid_timezone);
    }));
  });

  context("when user inputs valid timezone", () => {
    it('returns success update message', () => subject(
      msg, 'America/Los_Angeles'
    ).then((res) => {
      expect(res).to.eq('Your timezone has been set to America/Los_Angeles');
    }));
  });
});
