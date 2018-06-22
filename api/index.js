const path = require('path');
const bot  = require('./bot.js');
const remindersClient = require('./redis/client.js').reminders;
const timezonesClient = require('./redis/client.js').timezones;
const keys = require('./keys.json');

const initializeBot = () => {
  bot.registry
  .registerGroups([
    ['reminders', 'Reminders'],
    ['misc', 'Miscellaneous']
  ])
  .registerDefaults()
  .registerCommandsIn(path.join(__dirname, 'commands'));


  bot.once('ready', () => {
    console.log('I am ready!');
    bot.user.setGame('Reminding');
  });

  bot.login(keys.token);
};

remindersClient.on('connect', () => {
  remindersClient.select(0);
  initializeBot();
  require('./redis/processReminders.js');
});

timezonesClient.on('connect', () => {
  timezonesClient.select(1);
});
