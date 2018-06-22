/* global describe beforeEach context it */
require('./helper.js');
const proxyquire = require('proxyquire').noCallThru();
const { expect } = require('chai');
const msg        = require('./stubs/message.js');
const exceptions = require('../api/util/exceptions.json');
const tzStore    = require('../api/redis/client.js').timezones;

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
  const invalidInput = 'losangeles';
  const validInput = 'America/Chicago';
  const expectedSuccessMsg = 'Your timezone has been set to America/Chicago';

  context('when user inputs invalid timezone', () => {
    it('throws invalid_timezone error', () => subject(
      msg, invalidInput
    ).catch((error) => {
      expect(error).to.eq(exceptions.invalid_timezone);
    }));
  });

  context('when user inputs valid timezone', () => {
    it('returns successful timezone update message', () => subject(
      msg, validInput
    ).then((res) => {
      expect(res).to.eq(expectedSuccessMsg);
    }));

    // after(() => {
    //   tzStore.flushallAsync();
    // })
  });
});
