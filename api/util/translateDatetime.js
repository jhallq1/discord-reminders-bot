const chrono = require('chrono-node');
const moment = require('moment');

module.exports = (input, offset) => {
  let parsedDate = chrono.parse(input, moment().utcOffset(offset))[0].start;
  parsedDate.assign('timezoneOffset', offset);

  let timeWithOffset = moment(parsedDate.date())
    .utcOffset(offset)
    .toISOString();

  let delayAmt = moment(timeWithOffset).valueOf() - moment().valueOf();

  let translation = moment(chrono.parseDate(timeWithOffset))
    .calendar(moment.now(), "M/D/YYYY h:mm a");

  return {
    "timeWithOffset": timeWithOffset,
    "delayAmt": delayAmt,
    "translation": translation,
    "input": input,
    "offset": offset
  };
}
