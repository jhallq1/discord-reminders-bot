const user = require('./User.js');

const client = {
  fetchUser: (id) => {
    this.id = id;
    return new Promise((resolve) => {
      resolve(user);
    });
  }
};

module.exports = {
  CommandoClient: class CommandoClient {
    constructor() {
      return client;
    }
  }
};
