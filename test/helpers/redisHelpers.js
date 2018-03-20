const redis = require('fakeredis');
const bluebird = require('bluebird');

bluebird.promisifyAll(redis.RedisClient.prototype);

const remindersClient = redis.createClient();
const timezonesClient = redis.createClient();

before(() => {
  remindersClient.on('connect', () => {
    remindersClient.select(0);
  });

  timezonesClient.on('connect', () => {
    timezonesClient.select(1);
  });
});

after(() => {
  remindersClient.quit();

  timezonesClient.quit();
});
