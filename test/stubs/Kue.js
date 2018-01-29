const kue = {
  data: {
    target_id: null,
    content:   null
  },
  createQueue: secrets => {
    this.secrets = secrets;
    return kue;
  },
  create: (key, msg) => {
    kue.data.target_id = key;
    kue.data.content = msg;
    return kue;
  },
  delay: milliseconds => {
    kue.delayInMilliseconds = milliseconds;
    return kue;
  },
  save: fn => {
    fn();
    return kue;
  },
  process: (key, cb) => {
    kue.process_data = { key: key, cb: cb };
    cb(kue, ()=>{ kue.processed = true; });
    return kue;
  },
  processed: false
}

module.exports = kue;
