/* 连接 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const ODF = require('./odf');

const Connection = sequelize.define('Connection', {
  ConnectionID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  BoxID1: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: ODF,
      key: 'BoxID',
    },
  },
  BoxID2: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: ODF,
      key: 'BoxID',
    },
  },
}, {
  timestamps: false,
});

// 建立与 ODF 的关联关系
Connection.belongsTo(ODF, { as: 'ODF1', foreignKey: 'BoxID1' });
Connection.belongsTo(ODF, { as: 'ODF2', foreignKey: 'BoxID2' });

module.exports = Connection;
