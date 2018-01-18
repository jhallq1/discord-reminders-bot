const path = require('path');
const bot  = require('./bot.js');
const db   = require('./../db/index.js');
const keys = require('./keys.json');

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

db.connect((err) => {
  if (err) {
    console.error('DB connection failed!', err.stack);
  } else {
    console.log('Connected to db');
  }
});
