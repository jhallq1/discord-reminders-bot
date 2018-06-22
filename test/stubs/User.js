const User = {
  send: (msg) => {
    this.msg = msg;
    return msg;
  }
};

module.exports = User;
