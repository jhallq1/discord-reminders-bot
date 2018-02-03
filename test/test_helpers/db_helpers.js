const db = require('../../db/index.js');

before(() => {
  db.connect((err) => {
    if (err) {
      console.error('DB connection failed!', err.stack);
    }
  });
});

beforeEach(() => db.query('TRUNCATE USERS')
.then(res => res.rowCount)
.catch(err => console.error(err.stack)));

after(() => { db.end(); });
