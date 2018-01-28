require('./test_helpers/db_helpers.js');

const proxyquire = require('proxyquire').noCallThru();
const expect     = require('chai').expect;
const msg        = require('./stubs/message.js');
const exceptions = require('../api/util/exceptions.json');
const insertTz   = require('../db/queries/insertTimezone.js');

const RemindCommand = proxyquire(
    '../api/commands/reminders/remind.js',
    {
        'discord.js-commando': require('./stubs/Command.js'),
        'kue': require('./stubs/Kue.js'),
        '@global': true
    }
);

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
        return new RemindCommand({}).run(
            msg,
            {
              target: target,
              content: content,
              datetime:
              unparsable_time
            }
        ).catch(res => {
            expect(res).to.eq(
              exceptions.invalid_datetime_format
            );
        });
      });
    });

    context('when timezone is not set', () => {
      let time = 'tomorrow at noon';
    
      it('throws invalid timezone exception', () => {
        return new RemindCommand({}).run(
            msg,
            {
              target: target,
              content: content,
              datetime:
              parsable_time
            }
        ).catch(test => {
            expect(test).to.eq(exceptions.timezone_not_set);
        });
      });
    });

    context('when date is in the past', () => {
      let timezone = 'America/Los_Angeles';

      it('throws date in past exception', () => {
        return insertTz(
          [target.username, target.discriminator, timezone]
        )
        .then(() => {
          return new RemindCommand({}).run(
            msg,
            {
              target: target,
              content: content,
              datetime:
              past_time
            }
          );
        })
        .catch(test => {
          expect(test).to.eq(exceptions.past_time);
        });
      });
    });
  });
});
