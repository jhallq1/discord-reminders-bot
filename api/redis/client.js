const redis          = require('redis');
const { port, host } = require('../keys.json');
const bluebird       = require('bluebird');

bluebird.promisifyAll(redis.RedisClient.prototype);

module.exports = {
  timezones: redis.createClient(port, host),
  reminders: redis.createClient(port, host)
};
