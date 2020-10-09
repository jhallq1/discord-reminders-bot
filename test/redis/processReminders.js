/* global describe beforeEach context it */

require('./../helper.js');

const proxyquire = require('proxyquire').noCallThru();
const { expect } = require('chai');
const moment     = require('moment');
const msg        = require('./../stubs/message.js');
const tzStore    = require('../../redis/client.js').timezones;
const reminders  = require('../../redis/client.js').reminders;

/* eslint-disable global-require */
const subject = proxyquire(
  '../../redis/processReminders.js',
  {
    // 'discord.js-commando': require('./stubs/Command.js'),
    './../bot.js': new (require('./../stubs/CommandoClient.js').CommandoClient)()
  }
);
/* eslint-enable global-require */

describe('Process Reminders', () => {
  const readyReminder = [{
    target: msg.message.author.id,
    content: 'I am ready',
    datetime: 'in 5 seconds'
  }];

  const notReadyReminder = [{
    target: msg.message.author.id,
    content: 'I will be ready later',
    datetime: 'in 5 minutes'
  }];

  const inFiveSeconds = (moment().valueOf() - 5000);
  const inFiveMinutes = (moment().valueOf() + 300000);

  context('there are reminders ready for processing', () => {
    beforeEach(() => {
      reminders.setAsync(inFiveSeconds, JSON.stringify(readyReminder));
      reminders.setAsync(inFiveMinutes, JSON.stringify(notReadyReminder));
    });

    it('retrieves all pending reminders', () => {
      return subject.scanReminderStore().then((res) => {
        expect(res.length).to.eq(2);
        expect(res).to.include(inFiveSeconds.toString());
        expect(res).to.include(inFiveMinutes.toString());
      });
    });

    it('retrieves only the expired timestamps', () => {
      const res = subject.getExpiredTimestamps([inFiveSeconds, inFiveMinutes]);
      expect(res.length).to.eq(1);
    });

    it('retrieves reminders set for expired timestamps', () => {
      return subject.getReminders([inFiveSeconds]).then((res) => {
        expect(res[0]).to.deep.eq(readyReminder);
        expect(res[1][0]).to.eq(inFiveSeconds);
      });
    });
  });
});
