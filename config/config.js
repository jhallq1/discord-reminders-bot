const config = require('../api/config.json');

module.exports = {
  development: {
    username: config.db.user,
    password: config.db.password,
    database: 'reminders_bot_development',
    host: 'localhost',
    dialect: 'postgres'
  },
  test: {
    username: config.db.user,
    password: config.db.password,
    database: 'reminders_bot_test',
    host: 'localhost',
    dialect: 'postgres'
  },
  production: {
    username: config.db.user,
    password: config.db.password,
    database: 'reminders_bot_production',
    host: 'localhost',
    dialect: 'postgres'
  }
};
