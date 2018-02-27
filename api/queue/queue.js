const Queue = require('bull');

module.exports = new Queue('reminders');
