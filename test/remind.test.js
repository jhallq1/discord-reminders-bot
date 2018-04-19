require('./helpers/redisHelpers.js');

const { expect } = require('chai');
// const proxyquire = require('proxyquire').noPreserveCache().noCallThru();
// const tzStore = proxyquire('./helpers/fakeRedis.js').timezones;
// const reminderStore = proxyquire('./helpers/fakeRedis.js').reminders;
const run = require('./helpers/commandHelpers.js').subject;
const exceptions = require('../api/util/exceptions.json');

describe('remind command', () => {
  const msg = 'filler';
  const target = 'Bob';
  const content = 'walk the dog';
  let datetime = 'in 2 hours';

  context('when date format is incorrect', () => {
    datetime = '2 hours';

    it('should throw invalid format exception', () => run(
      msg, target, content, datetime
    )
    .then((res) => {
      console.log(res);
      expect(res).to.eq(1);
    })
    .catch((ex) => {
      console.log(ex);
      expect(ex).to.eq(exceptions.invalid_datetime_format);
    }));
  });
});
