module.exports = {
  subject: (message, target, content, datetime) => {
    return new Promise((resolve, reject) => {
      if (true) {
        resolve(1);
      }

      reject(0);
    });
  }
};
