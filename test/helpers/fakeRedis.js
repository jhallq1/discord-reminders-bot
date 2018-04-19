const redis = require('fakeredis');
const bluebird = require('bluebird');

bluebird.promisifyAll(redis.RedisClient.prototype);

module.exports = {
  timezones: redis.createClient(),
  reminders: redis.createClient()
};
