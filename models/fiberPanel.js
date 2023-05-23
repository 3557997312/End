/* 纤盘 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Site = require('./site');
const ODF = require('./odf');

const FiberPanel = sequelize.define('FiberPanel', {
  PanelID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  SiteID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Site,
      key: 'SiteID',
    },
  },
  BoxID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: ODF,
      key: 'BoxID',
    },
  },
  PanelName: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  FiberCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 12,
  },
}, {
  timestamps: false,
});

// 建立与 Site 的关联关系
FiberPanel.belongsTo(Site, { foreignKey: 'SiteID' });

// 建立与 ODF 的关联关系
FiberPanel.belongsTo(ODF, { foreignKey: 'BoxID' });

module.exports = FiberPanel;
