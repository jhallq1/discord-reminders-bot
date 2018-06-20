const redis = require('redis');

module.exports = {
  timezones: redis.createClient(),
  reminders: redis.createClient()
};
