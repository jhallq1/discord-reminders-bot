let db      = require('./index.js');
let fs      = require('fs');
let resolve = require('path').resolve;
let path    = resolve('db/schema.sql');

let schema = fs.readFileSync(path).toString();

db.connect(err => {
  if (err) {
    console.error('DB connection failed!', err.stack);
  }
})
.then(res => {
  return db.query(schema)
  .then(res => {
    console.log('DB Schema Loaded');
    db.end();
  })
})
.catch(err => {
  console.error(err.stack)
  db.end();
});


