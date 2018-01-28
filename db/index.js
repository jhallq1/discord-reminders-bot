const { Client } = require('pg');
const keys = require('./../api/keys.json');

let ev = process.env.NODE_ENV = 'test' ? keys.dbDatabase_test : keys.dbDatabase;

module.exports = new Client({
  host: keys.dbHost,
  port: keys.dbPort,
  user: keys.dbUser,
  password: keys.dbPassword,
  database: ev
});
