const redis = require('redis-mock');

module.exports = {
  timezones: redis.createClient(),
  reminders: redis.createClient()
};
