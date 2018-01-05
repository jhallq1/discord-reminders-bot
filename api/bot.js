const config = require('./config.json');
const { CommandoClient } = require('discord.js-commando');
let bot;

function getBot() {
  if (bot) {
    return bot;
  } else {
    bot = createBot();
    return bot;
  }
}

function createBot() {
  return new CommandoClient({
      owner: config.owner,
      commandPrefix: 'rbot',
      disableEveryone: true
  });
}

module.exports = getBot();
