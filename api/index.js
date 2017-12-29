const { CommandoClient } = require('discord.js-commando');
const path = require('path');
const config = require('./config.json');

const bot = new CommandoClient({
    owner: config.owner,
    commandPrefix: 'rbot',
    disableEveryone: true
});

bot.registry
    .registerGroups([
      ['reminders', 'Reminders']
    ])
    .registerDefaults()
    .registerCommandsIn(path.join(__dirname, 'commands'));


bot.on('ready', () => {
  console.log('I am ready!');
  bot.user.setGame('Game');
});

bot.login(config.token);
