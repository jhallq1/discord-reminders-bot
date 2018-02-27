const queue = {
  data: {
    target_id: null,
    content: null
  },
  createQueue: (secrets) => {
    this.secrets = secrets;
    return queue;
  },
  add: (data, options) => {
    queue.delayInMilliseconds = options.delay;
    return queue;
  },
  save: (fn) => {
    fn();
    return queue;
  },
  // Cannot fire callback due to stubbing singleton
  process: (key, cb) => {
    queue.process_data = { key, cb };
    return queue;
  },
  delayInMilliseconds: null
};

module.exports = queue;
