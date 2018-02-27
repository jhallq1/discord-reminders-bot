const Queue = require('bull');
const keys = require('../keys.json');

module.exports = new Queue(
  'reminders',
  {
    redis: {
      port: keys.redisPort,
      host: keys.redisHost,
      password: keys.redisKey
    }
  }
);
