/* global describe before after context it */
const proxyquire = require('proxyquire').noCallThru();
const { expect } = require('chai');
const msg        = require('./stubs/message.js');
const exceptions = require('../api/util/exceptions.json');

/* eslint-disable global-require */
const RemindCommand = proxyquire(
  '../api/commands/reminders/remind.js',
  {
    'discord.js-commando': require('./stubs/Command.js'),
    '../../bot.js': new (require('./stubs/CommandoClient.js').CommandoClient)()
  }
);
/* eslint-enable global-require */

const subject = (message, content) => new RemindCommand({}).run(
  message, { content }
);

describe('Remind Command', () => {
  const reminder = {
    target: 'test_user',
    content: 'This is a test reminder',
    datetime: '5 minutes from now'
  };

  context('user does not have a timezone set', () => {
    before(() => {
      msg.message.author.id = 'no_timezone_set';
    });

    it('throws timezone_not_set error', () => subject(
      msg, reminder
    ).catch((error) => {
      expect(error).to.eq(exceptions.timezone_not_set);
    }));

    after(() => {
      msg.message.author.id = '123456789';
    });
  });

  context('user has a timezone set', () => {
    context('user inputs datetime in the past', () => {
      it('throws past_time error', () => {
        reminder.datetime = "five minutes ago";

        return subject(
          msg, reminder
        ).catch((error) => {
          expect(error).to.eq(exceptions.past_time);
        });
      });
    });

    context('user inputs invalid datetime format', () => {
      it('throws invalid_datetime_format error', () => {
        reminder.datetime = "1 hour";

        return subject(
          msg, reminder
        ).catch((error) => {
          expect(error).to.eq(exceptions.invalid_datetime_format);
        });
      });
    });
  });
});
