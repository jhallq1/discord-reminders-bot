const chrono = require('chrono-node');
const moment = require('moment-timezone');

module.exports = (input, timezone) => {
  let date = new Date();
  let time_in_zone = moment(date).tz(timezone);
  let zone         = time_in_zone.zoneAbbr();
  let ref          = time_in_zone.format();

  let parsedDate

  if (timezone != 'UTC') {
    parsedDate = chrono.parseDate(input + " " + zone, ref)
  } else {
    parsedDate = chrono.parseDate(input)
  }
  

  let delayAmt = 
    parsedDate.getTime() - time_in_zone.valueOf();

  return {
    "delayAmt": delayAmt,
    "parsed"  : moment(parsedDate)
                .tz(timezone)
                .format("M/D/YYYY h:mm a"),
    "input"   : input,
    "offset"  : time_in_zone.format('Z')
  };
}
