const commandoMsg = {
  say: msg => msg,
  direct: msg => msg,
  message: {
    author: {
      username: 'test_user',
      discriminator: '1234'
    }
  }
};

module.exports = commandoMsg;
