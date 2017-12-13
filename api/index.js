const Commando = require('discord.js-commando');
const Client = require('pg');
const path = require('path');

const config = require('./config.json');

const bot = new Commando.Client({
    owner: config.owner,
    commandPrefix: 'rbot'
});

bot.on('ready', () => {
  console.log('I am ready!');
});

bot.on('message', message => {
  if (message.content === 'ping') {
    message.reply('pong');
  }
});

bot.registry
    .registerDefaults()
    .registerCommandsIn(path.join(__dirname, 'commands'));

bot.login(config.token);
