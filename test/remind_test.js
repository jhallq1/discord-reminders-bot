process.env.TZ = 'UTC'

require('./test_helpers/db_helpers.js');

const proxyquire = require('proxyquire').noPreserveCache().noCallThru();
const expect     = require('chai').expect;
const msg        = require('./stubs/message.js');
const exceptions = require('../api/util/exceptions.json');
const insertTz   = require('../db/queries/insertTimezone.js');
const moment     = require('moment');

const RemindCommand = proxyquire(
    '../api/commands/reminders/remind.js',
    {
      'discord.js-commando': require('./stubs/Command.js'),
      'kue': require('./stubs/Kue.js'),
      '../../bot.js': new (require('./stubs/CommandoClient.js').CommandoClient)
    }
);

function subject(msg, target, content, datetime) {
  return new RemindCommand({}).run(
    msg, { target: target, content: content, datetime: datetime }
  );
}

describe('#run', () => {
  const content = "Hello World!";
  const target  = {
    id: 1,
    username: 'test_user',
    discriminator: '1234'
  };

  describe('time parsing', () => {
    let unparsable_time = 'hello';
    let past_time       = 'yesterday at noon';
    let parsable_time   = 'tomorrow at noon';

    context('when date format is incorrect', () => {
      it('throws invalid format exception', () => {
        return subject(msg, target, content, unparsable_time).catch(ex => {
          expect(ex).to.eq(exceptions.invalid_datetime_format);
        });
      });
    });

    context('when timezone is not set', () => {
      let time = 'tomorrow at noon';
    
      it('throws invalid timezone exception', () => {
        return subject(msg, target, content, parsable_time).catch(ex => {
          expect(ex).to.eq(exceptions.timezone_not_set);
        });
      });
    });

    context('when date is in the past', () => {
      it('throws date in past exception', () => {
        return insertTz(
          [target.username, target.discriminator, 'America/Los_Angeles']
        )
        .then(res => {
          return subject(msg, target, content, past_time)
        })
        .catch(ex => {
          expect(ex).to.eq(exceptions.past_time);
        });
      });
    });
  });

  describe('message timezone', () => {
    let reminder_time = `in 24 hours`;
    let delay         = 8.64*10**7;

    context('same as server', () => {
      it('adds two hours to the server time', () => {
        return insertTz(
          [target.username, target.discriminator, 'UTC']
        )
        .then(() => {
          return subject(msg, target, content, reminder_time);
        })
        .then(res => {
          expect(res.processed).to.eq(true)
          expect(round_timestamp_to_day(res.delayInMilliseconds))
          .to.eq(delay);
        });
      });
    });

    context('behind server', () => {
      let timezone = 'America/Los_Angeles'

      it('adds two hours to the server time', () => {
        return insertTz(
          [target.username, target.discriminator, timezone]
        )
        .then(() => {
          return subject(msg, target, content, reminder_time);
        })
        .then(res => {
          expect(res.processed).to.eq(true)
          expect(round_timestamp_to_day(res.delayInMilliseconds))
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
          return subject(msg, target, content, reminder_time);
        })
        .then(res => {
          expect(res.processed).to.eq(true)
          expect(round_timestamp_to_day(res.delayInMilliseconds))
          .to.eq(delay);
        });
      });
    });
  });
});

function round_timestamp_to_day(milliseconds) {
  return Math.round(milliseconds/10**5)*10**5;
}
