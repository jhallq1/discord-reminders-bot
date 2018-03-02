const db = require('../index.js');

module.exports = values => db.query(
  `SELECT job_ids
   FROM users
   WHERE username = $1 AND username_discriminator = $2`,
  values
)
.then(res => res.rows[0])
.catch(err => console.error(err.stack));
