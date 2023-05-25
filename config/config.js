const crypto = require('crypto');
const Sequelize = require('sequelize');

const databaseConfig = {
  database: 'fiber_db',
  username: 'root',
  password: 'zaq123',
  host: 'localhost',
  dialect: 'mysql',
};

const sequelize = new Sequelize(databaseConfig.database, databaseConfig.username, databaseConfig.password, {
  host: databaseConfig.host,
  dialect: databaseConfig.dialect,
});

module.exports = {
  sequelize,
  SECRET_KEY: 'hhhhh',
};
