const queue = require('./queue.js');

module.exports = (target, content, parsedTime, author, jobID) => {
  const data = {
    target_id: target.id,
    content,
    author
  };

  const options = {
    delay: parsedTime.delayAmt,
    removeOnComplete: true,
    removeOnFail: true,
    jobId: jobID
  };

  queue.add(data, options);
};
