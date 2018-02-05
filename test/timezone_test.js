require('./test_helpers/db_helpers.js');

const proxyquire = require('proxyquire').noPreserveCache().noCallThru();
const { expect } = require('chai');
const msg        = require('./stubs/message.js');
const exceptions = require('../api/util/exceptions.json');
const insertTz   = require('../db/queries/insertTimezone.js');

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

  const user  = {
    id: 1,
    username: 'test_user',
    discriminator: '1234'
  };

  describe('timezone upsertion', () => {
    context("when timezone is not included in moment's zone list", () => {
      it('throws invalid timezone exception', () => subject(
        msg, invalidTz
      ).catch((ex) => {
        expect(ex).to.eq(exceptions.invalid_timezone);
      }));
    });

    context("when timezone is included in moment's zone list", () => {
      it('upserts into table and returns rowCount of 1', () => insertTz(
        [user.username, user.discriminator, validTz]
      )
      .then((res) => {
        expect(res).to.eq(1);
      }));
    });
  });
});
