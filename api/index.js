const path = require('path');
const bot = require('./bot.js');
const keys = require('./keys.json');

bot.registry
    .registerGroups([
      ['reminders', 'Reminders']
    ])
    .registerDefaults()
    .registerCommandsIn(path.join(__dirname, 'commands'));


bot.once('ready', () => {
  console.log('I am ready!');
  bot.user.setGame('Reminding');
});

bot.login(keys.token);
