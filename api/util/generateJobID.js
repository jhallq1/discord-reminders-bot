const crypto = require('crypto');

module.exports = crypto.randomBytes(4, (error, buf) => {
  if (error) throw error;
  return buf.toString('hex');
});
