const timezones    = require('../api/redis/client.js').timezones;
const reminders    = require('../api/redis/client.js').reminders;

afterEach(() => {
  timezones.flushallAsync();
  reminders.flushallAsync();
});
