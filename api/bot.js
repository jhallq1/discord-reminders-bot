const { CommandoClient } = require('discord.js-commando');
const keys = require('./keys.json');

module.exports = new CommandoClient({
  owner: keys.owner,
  commandPrefix: 'rbot',
  disableEveryone: true
});
