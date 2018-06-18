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

const expectedPrompt = `Quick-select your timezone by entering a number from the
        following list. Otherwise, enter the name of your zone if it is not
        included here.

        [1] Atlantic
        [2] Eastern
        [3] Central
        [4] Mountain
        [5] MST
        [6] Pacific
        [7] Alaska
        [8] Hawaii`;

describe('Timezone Command', () => {
  context("when user calls 'rbot timezone'", () => {
    it('displays list of timezones from which to select', () => subject(
      new TimezoneCommand({})
    ).then((res) => {
      expect(res).to.eq(expectedPrompt);
    }));
  });

  // context('when timezones array does not include inputted number', () => {
  //   it('throws invalid timezone exception', () => subject(
  //     msg, invalidInput
  //   ).catch((ex) => {
  //     expect(ex).to.eq(exceptions.invalid_timezone);
  //   }));
  // });

  // context("when timezone is included in moment's zone list", () => {
  //   it('upserts into table and DMs user success msg', () => subject(
  //     msg, validTz
  //   )
  //   .then((res) => {
  //     expect(res).to.eq('Your timezone has been set to America/Los_Angeles');
  //   }));
  // });

  // context('when timezones array includes user inputted number', () => {
  //   it('upserts into table and DMs user success msg', () => subject(
  //     msg, validInput
  //   ).then((res) => {
  //     expect(res).to.eq('Your timezone has been set to America/Los_Angeles');
  //   }));
  // });
});
