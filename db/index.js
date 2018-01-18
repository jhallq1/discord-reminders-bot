const { Client } = require('pg');
const keys = require('./../api/keys.json');

module.exports = new Client({
  host: keys.db_host,
  port: keys.db_port,
  user: keys.db_user,
  password: keys.db_password,
  database: keys.db_database
});
