const { Client } = require('pg');
const keys = require('./../api/keys.json');

module.exports = new Client({
  host: keys.dbHost,
  port: keys.dbPort,
  user: keys.dbUser,
  password: keys.dbPassword,
  database: keys.dbDatabase
});
