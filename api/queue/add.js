const queue = require('./queue.js');

module.exports = (target, content, parsedTime) => {
  const data = {
    target_id: target.id,
    content
  };

  const options = {
    delay: parsedTime.delayAmt,
    removeOnComplete: true,
    removeOnFail: true
  };

  queue.add(data, options);
};
