const db = require('../index.js');

module.exports = function selectTimezone(values) {
  return db.query(
    "SELECT * FROM users WHERE username = $1 " +
    "AND username_discriminator = $2",
    values
  )
  .then(res => {
    if (res.rowCount > 0) {
      return res.fields;
    } else {
      return false;
    }
  })
  .catch(err => console.error(err.stack));
}
