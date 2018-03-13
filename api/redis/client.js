const redis = require('redis');
const keys = require('../keys.json');

const connection = {
  port: keys.redisPort,
  host: keys.redisHost,
  password: keys.redisKey
};

module.exports = redis.createClient([connection]);
