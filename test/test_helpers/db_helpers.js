const db = require('../../db/index.js');

before(() => {
  db.connect((err) => {
    if (err) {
      console.error('DB connection failed!', err.stack);
    }
  });
});

beforeEach(() => {
  return db.query('TRUNCATE USERS')
  .then(res => {return res.rowCount;})
  .catch(err => console.error(err.stack));
});

after(() => { db.end(); });
