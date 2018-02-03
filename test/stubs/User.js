const User = {
  send: (msg) => {
    this.msg = msg;
    return User;
  }
};

module.exports = User;
