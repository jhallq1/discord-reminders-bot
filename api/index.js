const config = require('./config.json')
const Discord = require('discord.js');
const bot = new Discord.Client();

bot.on('ready', () => {
  console.log('I am ready!');
});

bot.on('message', message => {
  if (message.content === 'ping') {
    message.reply('pong');
  }
});

bot.login(config.token);
