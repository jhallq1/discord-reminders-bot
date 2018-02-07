const commandoMsg = {
  say: msg => msg,
  direct: () => {
    commandoMsg.processed = true;
    return commandoMsg;
  },
  processed: false
};

module.exports = commandoMsg;
