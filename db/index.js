const { Client } = require('pg');
const keys = require('./../api/keys.json');

let env_keys;

if (process.env.NODE_ENV == 'test') {
    env_keys = keys.testDatabase
} else {
    env_keys = keys.prodDatabase
}

module.exports = new Client({
  host: env_keys.dbHost,
  port: env_keys.dbPort,
  user: env_keys.dbUser,
  password: env_keys.dbPassword,
  database: env_keys.dbDatabase
});
