const db = require('../index.js');

module.exports = values => db.query(
  `UPDATE users
   SET job_ids = array_append(job_ids, $3)
   WHERE username = $1 AND username_discriminator = $2`,
  values
)
.then(res => res.rowCount)
.catch(err => console.error(err.stack));
