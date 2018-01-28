const { Client } = require('pg');
const keys = require('./../api/keys.json');

let ev = process.env.NODE_ENV = 'test' ? keys.dbDatabase_test : keys.dbDatabase;

let db;

module.exports = {
  connection: () => {
    db =  new Client({
      host: keys.dbHost,
      port: keys.dbPort,
      user: keys.dbUser,
      password: keys.dbPassword,
      database: ev
    });
  },
  connect: () => {
    db.connect((err) => {
      if (err) {
        console.error('DB connection failed!', err.stack);
      } else {
        console.log('Connected to db');
      }
    });
  }
}



// new Client({
//   host: keys.dbHost,
//   port: keys.dbPort,
//   user: keys.dbUser,
//   password: keys.dbPassword,
//   database: ev
// }).connect((err) => {
//   if (err) {
//     console.error('DB connection failed!', err.stack);
//   } else {
//     console.log('Connected to db');
//   }
// });
