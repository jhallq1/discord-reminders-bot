const { expect } = require('chai');
const fn = require('../api/util/translateDatetime.js');

const roundTimestampToDay = (input, timezone) => Math.round(fn(input, timezone)
.delayAmt / 100000) * 100000;

describe('#translateDatetime', () => {
  const input            = 'in 24 hours';
  const expectedDelayAmt = 8.64 * (10 ** 7);

  let timezone = 'UTC';

  context('when user timezone is same as server', () => {
    it('adds twenty-four hours to server time', () => {
      expect(roundTimestampToDay(input, timezone)).to.eq(expectedDelayAmt);
    });
  });

  context('when user timezone is behind server', () => {
    timezone = 'America/Los_Angeles';

    it('adds twenty-four hours to server time', () => {
      expect(roundTimestampToDay(input, timezone)).to.eq(expectedDelayAmt);
    });
  });

  context('when user timezone is ahead of server', () => {
    timezone = 'Asia/Tokyo';

    it('adds twenty-four hours to server time', () => {
      expect(roundTimestampToDay(input, timezone)).to.eq(expectedDelayAmt);
    });
  });
});
