const { Client } = require('pg');
const keys = require('./../api/keys.json');

let envKeys;

if (process.env.NODE_ENV === 'test') {
  envKeys = keys.testDatabase;
} else {
  envKeys = keys.prodDatabase;
}

module.exports = new Client({
  host: envKeys.dbHost,
  port: envKeys.dbPort,
  user: envKeys.dbUser,
  password: envKeys.dbPassword,
  database: envKeys.dbDatabase
});
