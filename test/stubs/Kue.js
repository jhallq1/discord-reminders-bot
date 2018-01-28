const kue = {
  createQueue: secrets => {
    return kue;
  },
  create: (key, msg) => {
    return { key: key, msg: msg };
  },
  delay: milliseconds => {
    return milliseconds;
  },
  save: fn => {
    return fn();
  },
  process: (key, cb) => {
    cb();
    return { key: key, cb: cb };
  }
}

module.exports = kue;
