const user = require('./User.js');

const client = {
  fetchUser: id => {
    this.id = id;
    return new Promise((resolve, reject) => {
      resolve(user);
    });
  }
};

module.exports = module.exports = {
  CommandoClient: class CommandoClient {
    constructor(_) {
      return client;
    }
  }
};
