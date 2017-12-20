'use strict';
module.exports = (sequelize, DataTypes) => {
  var Reminder = sequelize.define('Reminder', {
    target: DataTypes.STRING,
    content: DataTypes.STRING,
    datetime: DataTypes.DATE
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Reminder;
};