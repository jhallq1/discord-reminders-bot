const chrono = require('chrono-node');
const moment = require('moment');

module.exports = (input, offset) => {
  let parsedDate = chrono.parse(input, moment().utcOffset(offset))[0].start;

  parsedDate.assign('timezoneOffset', offset);

  return moment(parsedDate.date()).utcOffset(offset).toISOString();
}
