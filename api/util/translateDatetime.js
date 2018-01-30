const chrono = require('chrono-node');
const moment = require('moment-timezone');

module.exports = (input, timezone) => {
  let time_in_zone = moment(new Date()).tz(timezone);
  let zone         = time_in_zone.zoneAbbr();
  let ref          = time_in_zone.format();
  let parsedDate = chrono.parseDate(input + " " + zone, ref)
  
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
