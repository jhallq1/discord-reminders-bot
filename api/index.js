const config = require('./config.json')
const Commando = require('discord.js-commando');
const Client = require('pg');

const bot = new Commando.Client({
    owner: '388398975516016640'
});

bot.on('ready', () => {
  console.log('I am ready!');
});

bot.login(config.token);
