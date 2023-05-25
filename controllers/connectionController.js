/* 连接 */

const Connection = require('../models/connection');
const ODF = require('../models/odf');
const { Sequelize } = require('sequelize');
const json2csv = require('json2csv').parse;
const xmlbuilder = require('xmlbuilder');
const ExcelJS = require('exceljs');

// 导出CSV格式
exports.exportCSV = async (req, res) => {
  const { BoxID } = req.params;

  try {
    const connections = await Connection.findAll({
      where: { BoxID },
      include: [
        {
          model: ODF,
          as: 'ODF1',
          where: {
            BoxID: Sequelize.literal('`Connection`.`BoxID`')
          },
          required: false
        },
        {
          model: ODF,
          as: 'ODF2',
          where: {
            BoxID: Sequelize.literal('`Connection`.`BoxID`')
          },
          required: false
        }
      ]
    });

    const csv = json2csv(connections);

    res.attachment('connections.csv');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 导出XML格式
exports.exportXML = async (req, res) => {
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
    
    const xml = xmlbuilder.create('connections', {}, {}, { headless: true });
    connections.forEach(connection => {
      const connectionXML = xml.ele('connection');
      connectionXML.att('id', connection.id);
      connectionXML.ele('name', {}, connection.name);
      connectionXML.ele('description', {}, connection.description);
      const odf1XML = connectionXML.ele('odf1');
      odf1XML.ele('id', {}, connection.ODF1.id);
      odf1XML.ele('name', {}, connection.ODF1.name);
      odf1XML.ele('box_id', {}, connection.ODF1.BoxID);
      const odf2XML = connectionXML.ele('odf2');
      odf2XML.ele('id', {}, connection.ODF2.id);
      odf2XML.ele('name', {}, connection.ODF2.name);
      odf2XML.ele('box_id', {}, connection.ODF2.BoxID);
    });
    
    res.attachment('connections.xml');
    res.send(xml.end());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 导出XLS格式
exports.exportXLS = async (req, res) => {
  try {
    const connections = await Connection.findAll({
      include: [
        {
          model: ODF,
          as: 'ODF1',
          where: {
            BoxID: Sequelize.literal('Connection.BoxID1')
          },
          required: false
        },
        {
          model: ODF,
          as: 'ODF2',
          where: {
            BoxID: Sequelize.literal('Connection.BoxID2')
          },
          required: false
        }
      ]
    });

    // 创建一个新的 Excel 工作簿
    const workbook = new ExcelJS.Workbook();
    
    // 添加一个名为 "Connections" 的工作表
    const worksheet = workbook.addWorksheet('Connections');
    
    // 添加表头
    worksheet.addRow(['Connection ID', 'ODF1 Name', 'ODF2 Name']);
    
    // 循环添加每行数据
    connections.forEach(connection => {
      worksheet.addRow([connection.id, connection.ODF1.Name, connection.ODF2.Name]);
    });
    
    // 将工作簿转换为二进制流
    const buffer = await workbook.xlsx.writeBuffer();
    
    // 设置文件响应头
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=connections.xlsx',
      'Content-Length': buffer.length
    });

    // 将 XLS 文件写入响应流并发送到客户端
    res.end(buffer, 'binary');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

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
