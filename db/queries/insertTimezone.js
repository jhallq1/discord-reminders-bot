const db = require('../index.js');

module.exports = function insertTimezone(values) {
  return db.query(
    "INSERT INTO user_timezones(username, username_discriminator, timezone) " +
    "VALUES($1, $2, $3) " +
    "ON CONFLICT (username_discriminator) DO UPDATE " +
    "SET timezone = $3",
    values
  )
  .then(res => {console.log(res); return res.rowCount;})
  .catch(err => console.error(err.stack));
}
