const queue = require('./queue.js');

module.exports = (target, content, parsedTime, author) => {
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
    removeOnFail: false
  };

  queue.add(data, options);
};
