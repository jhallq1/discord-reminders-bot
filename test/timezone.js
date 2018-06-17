/* global describe context it */

const proxyquire = require('proxyquire');
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

describe('#run', () => {
  const invalidTz = 'America/San_Diego';
  const validTz = 'America/Los_Angeles';

  const validInput = 6;
  const invalidInput = 11;

  describe('timezone upsertion', () => {
    context("when timezone is not included in moment's zone list", () => {
      it('throws invalid timezone exception', () => subject(
        msg, 'rbot timezone'
      ).catch((ex) => {
        expect(ex).to.eq(exceptions.invalid_timezone);
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
});
