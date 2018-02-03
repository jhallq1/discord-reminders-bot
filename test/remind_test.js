process.env.TZ = 'UTC';

require('./test_helpers/db_helpers.js');

const proxyquire = require('proxyquire').noPreserveCache().noCallThru();
const { expect } = require('chai');
const msg        = require('./stubs/message.js');
const exceptions = require('../api/util/exceptions.json');
const insertTz   = require('../db/queries/insertTimezone.js');

/* eslint-disable global-require */
const RemindCommand = proxyquire(
  '../api/commands/reminders/remind.js',
  {
    'discord.js-commando': require('./stubs/Command.js'),
    kue: require('./stubs/Kue.js'),
    '../../bot.js': new (require('./stubs/CommandoClient.js').CommandoClient)()
  }
);
/* eslint-enable global-require */

function subject(message, target, content, datetime) {
  return new RemindCommand({}).run(
    message, { target, content, datetime }
  );
}

function roundTimestampToDay(milliseconds) {
  return Math.round(milliseconds / (10 ** 5)) * (10 ** 5);
}

describe('#run', () => {
  const content = 'Hello World!';
  const target  = {
    id: 1,
    username: 'test_user',
    discriminator: '1234'
  };

  describe('time parsing', () => {
    const unparsableTime = 'hello';
    const pastTime       = 'yesterday at noon';
    const parsableTime   = 'tomorrow at noon';

    context('when date format is incorrect', () => {
      it('throws invalid format exception', () => {
        return subject(msg, target, content, unparsableTime).catch((ex) => {
          expect(ex).to.eq(exceptions.invalid_datetime_format);
        });
      });
    });

    context('when timezone is not set', () => {
      const time = 'tomorrow at noon';

      it('throws invalid timezone exception', () => {
        return subject(msg, target, content, pastTime).catch((ex) => {
          expect(ex).to.eq(exceptions.timezone_not_set);
        });
      });
    });

    context('when date is in the past', () => {
      it('throws date in past exception', () => {
        return insertTz(
          [target.username, target.discriminator, 'America/Los_Angeles']
        )
        .then(() => subject(msg, target, content, pastTime))
        .catch((ex) => {
          expect(ex).to.eq(exceptions.past_time);
        });
      });
    });
  });

  describe('message timezone', () => {
    const reminderTime = 'in 24 hours';
    const delay        = 8.64 * (10 ** 7);

    context('same as server', () => {
      it('adds two hours to the server time', () => {
        return insertTz(
          [target.username, target.discriminator, 'UTC']
        )
        .then(() => subject(msg, target, content, reminderTime))
        .then((res) => {
          expect(res.processed).to.eq(true)
          expect(roundTimestampToDay(res.delayInMilliseconds))
          .to.eq(delay);
        });
      });
    });

    context('behind server', () => {
      const timezone = 'America/Los_Angeles'

      it('adds two hours to the server time', () => {
        return insertTz(
          [target.username, target.discriminator, timezone]
        )
        .then(() => {
          return subject(msg, target, content, reminderTime);
        })
        .then((res) => {
          expect(res.processed).to.eq(true)
          expect(roundTimestampToDay(res.delayInMilliseconds))
          .to.eq(delay);
        });
      });
    });

    context('ahead of server', () => {
      let offset = 'Asia/Tokyo';

      it('adds two hours to the server time', () => {
        return insertTz(
          [target.username, target.discriminator, offset]
        )
        .then(() => {
          return subject(msg, target, content, reminderTime);
        })
        .then(res => {
          expect(res.processed).to.eq(true)
          expect(roundTimestampToDay(res.delayInMilliseconds))
          .to.eq(delay);
        });
      });
    });
  });
});
