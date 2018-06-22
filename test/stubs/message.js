const commandoMsg = {
  say: msg => msg,
  direct: msg => msg,
  message: {
    author: {
      username: 'test_user',
      discriminator: '1234',
      id: '123456789'
    }
  }
};

module.exports = commandoMsg;
