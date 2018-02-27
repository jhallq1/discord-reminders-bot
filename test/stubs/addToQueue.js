const queue = require('./Queue.js');

module.exports = (target, content, parsedTime) => {
  const data = {
    target_id: target.id,
    content
  };

  const options = {
    delay: parsedTime.delayAmt
  };

  queue.add(data, options);
};
