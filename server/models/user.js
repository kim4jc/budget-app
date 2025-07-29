// This is a test model for a simple User table
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 

// User table includes username and password fields
const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});

module.exports = User;
