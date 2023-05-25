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
    
    res.json({ connections });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 根据参数获取连接
exports.getConnection = async (req, res) => {
  const { BoxID1, BoxID2 } = req.params;

  try {
    let connections;

    if (BoxID1 && BoxID2) {
      if (BoxID1 === BoxID2) {
        return res.status(400).json({ message: 'BoxID1 cannot be the same as BoxID2' });
      }

      const box1 = await ODF.findByPk(BoxID1);
      if (!box1) {
        return res.status(404).json({ message: 'BoxID1 with Odf not found' });
      }

      const box2 = await ODF.findByPk(BoxID2);
      if (!box2) {
        return res.status(404).json({ message: 'BoxID2 with Odf not found' });
      }
      
      connections = await Connection.findAll({
        where: { BoxID1, BoxID2 },
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
      ],
      });
    }
    else if (BoxID1) {
      const box1 = await ODF.findByPk(BoxID1);
      if (!box1) {
        return res.status(404).json({ message: 'BoxID1 with Odf not found' });
      }

      connections = await Connection.findAll({
        where: { BoxID1 },
        include: [
          {
            model: ODF,
            as: 'ODF1',
            where: {
              BoxID: Sequelize.literal('`Connection`.`BoxID1`')
            },
            required: false
          },
        ]
      });
    }
    else if (BoxID2) {
      const box2 = await ODF.findByPk(BoxID2);
      if (!box2) {
        return res.status(404).json({ message: 'BoxID2 with Odf not found' });
      }
      connections = await Connection.findAll({
        where: { BoxID2 },
        include: [
          {
            model: ODF,
            as: 'ODF2',
            where: {
              BoxID: Sequelize.literal('`Connection`.`BoxID2`')
            },
            required: false
          },
        ]
      });
    }
    else {
      return res.status(400).json({ message: 'Missing parameters' });
    }

    res.json({ connections });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 创建连接
exports.createConnection = async (req, res) => {

  try {
    const { BoxID1, BoxID2 } = req.body;

    if (BoxID1 === BoxID2) {
      return res.status(400).json({ message: 'The same box cannot be connected' });
    }

    // 验证 BoxID1 是否存在
    const box1 = await ODF.findByPk(BoxID1);
    if (!box1) {
      return res.status(404).json({ message: 'ODF with BoxID1 not found' });
    }

    // 验证 BoxID2 是否存在
    const box2 = await ODF.findByPk(BoxID2);
    if (!box2) {
      return res.status(404).json({ message: 'ODF with BoxID2 not found' });
    }

    await Connection.create({ BoxID1, BoxID2 });

    res.status(201).json({ message: 'Connection created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 根据参数更新连接信息
exports.updateConnection = async (req, res) => {
  const { updatedData } = req.body;
  const { BoxID1, BoxID2 } = req.params;

  try {

    if (BoxID1 === BoxID2) {
      return res.status(400).json({ message: 'BoxID1 cannot be the same as BoxID2' });
    }

    const box1 =await ODF.findByPk(BoxID1);
    if (!box1) {
      return res.status(404).json({ message: 'BoxID1 with Odf not found' });
    }

    const box2 = await ODF.findByPk(BoxID2);
    if (!box2) {
      return res.status(404).json({ message: 'BoxID2 with Odf not found' });
    }
    const connection = await Connection.findOne({
      where: { BoxID1, BoxID2 },
    });

    if (!connection) {
      return res.status(404).json({ message: 'Connection not found' });
    }

    if (updatedData.BoxID1) {
      const box = await ODF.findByPk(updatedData.BoxID1);
      if (!box) {
        return res.status(404).json({ message: 'BoxID1 with Odf not found' });
      }
      connection.BoxID1 = BoxID1;
    }

    if (updatedData.BoxID2) {
      const box = await ODF.findByPk(updatedData.BoxID2);
      if (!box) {
        return res.status(404).json({ message: 'BoxID2 with Odf not found' });
      }
      connection.BoxID2 = BoxID2;
    }

    await connection.save();

    res.json({ message: 'Connection updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 根据参数删除连接信息
exports.deleteConnection = async (req, res) => {
  const { BoxID1, BoxID2 } = req.params;
  
  try {
    const box1 = await ODF.findByPk(BoxID1);
    if (!box1) {
      return res.status(404).json({ message: 'BoxID1 with Odf not found' });
    }

    const box2 = await ODF.findByPk(BoxID2);
    if (!box2) {
      return res.status(404).json({ message: 'BoxID2 with Odf not found' });
    }

    const connection = await Connection.findOne({
      where: { BoxID1, BoxID2 },
    });

    if (!connection) {
      return res.status(404).json({ message: 'Connection not found' });
    }
    
    await connection.destroy();

    res.json({ message: 'Connection deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
