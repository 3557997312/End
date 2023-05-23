/* 纤芯 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Site = require('./site');
const ODF = require('./odf');
const FiberPanel = require('./fiberPanel');

const FiberCore = sequelize.define('FiberCore', {
  CoreID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  CoreNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  Status: {
    type: DataTypes.STRING(45),
    allowNull: false,
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
  PanelID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: FiberPanel,
      key: 'PanelID',
    },
  },
}, {
  timestamps: false,
});

// 建立与 Site 的关联关系
FiberCore.belongsTo(Site, { foreignKey: 'SiteID' });

// 建立与 ODF 的关联关系
FiberCore.belongsTo(ODF, { foreignKey: 'BoxID' });

// 建立与 FiberPanel 的关联关系
FiberCore.belongsTo(FiberPanel, { foreignKey: 'PanelID' });

module.exports = FiberCore;
