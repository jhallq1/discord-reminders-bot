const timezones    = require('../redis/client.js').timezones;
const reminders    = require('../redis/client.js').reminders;

afterEach(() => {
  timezones.flushallAsync();
  reminders.flushallAsync();
});
