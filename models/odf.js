const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/config');
const Site = require('./site');

const ODF = sequelize.define('ODF', {
  BoxID: {
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
  BoxName: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  MaxDiscCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: false,
});

ODF.belongsTo(Site, { foreignKey: 'SiteID' });

module.exports = ODF;
