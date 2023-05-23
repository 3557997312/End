/* 连接 */

const Connection = require('../models/connection');
const ODF = require('../models/odf');
const { Sequelize } = require('sequelize');

// 获取所有连接
exports.getAllConnections = async (req, res) => {
  try {
    const connections = await Connection.findAll({
      include: [
        {
          model: ODF,
          as: 'ODF1',
          where: {
            BoxID: Sequelize.literal('`Connection`.`BoxID1`')
          },
          required: false
        },
        {
          model: ODF,
          as: 'ODF2',
          where: {
            BoxID: Sequelize.literal('`Connection`.`BoxID2`')
          },
          required: false
        }
      ]
    });
    
    res.json(connections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 获取指定ID的连接
exports.getConnectionById = async (req, res) => {
  try {
    const { ConnectionID } = req.params;

    const connection = await Connection.findByPk(ConnectionID);

    if (!connection) {
      return res.status(404).json({ message: 'Connection not found' });
    }

    res.json(connection);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 创建连接
exports.createConnection = async (req, res) => {
  try {
    const { BoxID1, BoxID2 } = req.body;

    // 验证 BoxID1 是否存在
    const odf1 = await ODF.findByPk(BoxID1);
    if (!odf1) {
      return res.status(404).json({ message: 'ODF with BoxID1 not found' });
    }

    // 验证 BoxID2 是否存在
    const odf2 = await ODF.findByPk(BoxID2);
    if (!odf2) {
      return res.status(404).json({ message: 'ODF with BoxID2 not found' });
    }

    const connection = await Connection.create({ BoxID1, BoxID2 });

    res.status(201).json(connection);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 更新指定ID的连接
exports.updateConnectionByID = async (req, res) => {
  try {
    const { ConnectionID } = req.params;
    const { BoxID1, BoxID2 } = req.body;

    const connection = await Connection.findByPk(ConnectionID);

    if (!connection) {
      return res.status(404).json({ message: 'Connection not found' });
    }

    await connection.update({ BoxID1, BoxID2 });

    res.json({ message: 'Connection updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 删除指定ID的连接
exports.deleteConnectionByID = async (req, res) => {
  try {
    const { ConnectionID } = req.params;

    const connection = await Connection.findByPk(ConnectionID);

    if (!connection) {
      return res.status(404).json({ message: 'Connection not found' });
    }
    
    await connection.destroy();

    res.json({ message: 'Connection deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
