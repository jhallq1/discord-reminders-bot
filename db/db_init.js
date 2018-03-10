const { resolve } = require('path');

const path    = resolve('db/schema.sql');
const db      = require('./index.js');
const fs      = require('fs');

let schema = fs.readFileSync(path).toString();

db.connect((err) => {
  if (err) {
    console.error('DB connection failed!', err.stack);
  }

  schema = schema.replace(/postgres/g, db.user);

  return db.query(schema)
  .then(() => {
    console.log('DB Schema Loaded');
    db.end();
  })
  .catch(() => {
    if (err) {
      console.error(err.stack);
    }
    db.end();
  });
});
