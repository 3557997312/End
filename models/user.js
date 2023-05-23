/* 账户 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  UserID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  UserName: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  Password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  Role: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
}, {
  timestamps: false,
});

module.exports = User;
