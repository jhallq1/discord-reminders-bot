const remindersClient = require('./fakeRedis.js').reminders;
const timezonesClient = require('./fakeRedis.js').timezones;

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
