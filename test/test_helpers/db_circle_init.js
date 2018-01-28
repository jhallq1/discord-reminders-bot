const db = require('../../db/index.js');
console.log(process.env['CIRCLECI']);
if (process.env['CIRCLECI']) {
  before(() => {
    db.connect(err => {
      if (err) {
        console.error('DB connection failed!', err.stack);
      }
    });

    db.query('../schema.sql')
    .then(res => {
      console.log('DB Schema Loaded');
    })
    .catch(err => console.error(err.stack));
  });
}
