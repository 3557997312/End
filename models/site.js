/* 站点数据模型 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Site = sequelize.define('Site', {
  SiteID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  SiteName: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  VoltageLevel: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  GeographicInfo: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
    field: 'CreateTime',
  },
}, {
  timestamps: false,
});

module.exports = Site;
