const path = require('path');
const bot = require('./bot.js');
const config = require('./config.json');

bot.registry
    .registerGroups([
      ['reminders', 'Reminders']
    ])
    .registerDefaults()
    .registerCommandsIn(path.join(__dirname, 'commands'));


bot.on('ready', () => {
  console.log('I am ready!');
  bot.user.setGame('Reminding');
});

bot.login(config.token);