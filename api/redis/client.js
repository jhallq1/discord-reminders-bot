const redis = require('redis');
const keys = require('../keys.json');
const bluebird = require('bluebird');

bluebird.promisifyAll(redis.RedisClient.prototype);

const connection = {
  port: keys.redisPort,
  host: keys.redisHost,
  password: keys.redisKey
};

module.exports = {
  timezones: redis.createClient([connection]),
  reminders: redis.createClient([connection])
};
