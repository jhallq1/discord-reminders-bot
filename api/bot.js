const { CommandoClient } = require('discord.js-commando');
const config = require('./config.json');

module.exports = new CommandoClient({
    owner: config.owner,
    commandPrefix: 'rbot',
    disableEveryone: true
});