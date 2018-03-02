const queue = require('./queue.js');

module.exports = (target, content, parsedTime, author, jobID) => {
  const data = {
    target: {
      id: target.target_id,
      username: target.username
    },
    content,
    parsedTime,
    author
  };

  const options = {
    delay: parsedTime.delayAmt,
    removeOnComplete: false,
    removeOnFail: false,
    jobId: jobID
  };

  queue.add(data, options);
};
