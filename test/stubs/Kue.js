const kue = {
  data: {
    target_id: null,
    content: null
  },
  createQueue: (secrets) => {
    this.secrets = secrets;
    return kue;
  },
  create: (key, msg) => {
    kue.data.target_id = key;
    kue.data.content = msg;
    return kue;
  },
  delay: (milliseconds) => {
    kue.delayInMilliseconds = milliseconds;
    return kue;
  },
  save: (fn) => {
    fn();
    return kue;
  },
  // Cannot fire callback due to stubbing singleton
  process: (key, cb) => {
    kue.process_data = { key, cb };
    return kue;
  },
  delayInMilliseconds: null
};

module.exports = kue;
