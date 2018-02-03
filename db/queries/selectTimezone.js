const db = require('../index.js');

module.exports = function selectTimezone(values) {
  return db.query(
    'SELECT * FROM users WHERE username = $1 ' +
    'AND username_discriminator = $2',
    values
  )
  .then(res => res.rows[0].timezone)
  .catch(err => console.error(err.stack));
};
