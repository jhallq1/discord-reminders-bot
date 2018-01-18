module.exports = {
  createQueue: secrets => {
    return secrets;
  },
  create: (key, msg) => {
    return { key: key, msg: msg };
  },
  delay: milliseconds => {
    return milliseconds;
  },
  save: fn => {
    return fn;
  },
  process: (key, cb) => {
    return { key: key, cb: cb };
  }
}

