/* 配线单元盒 */

const ODF = require('../models/odf');
const Site = require('../models/site');
const FiberPanel = require('../models/fiberPanel');

// 获取所有配线单元盒
exports.getAllOdfs = async (req, res) => {
  try {
    const boxes = await ODF.findAll({ include: Site });

    res.json({ boxes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 根据参数获取满足条件的所有配线单元盒信息
exports.getOdf = async (req, res) => {
  const { BoxName,SiteID } = req.params;

  // const { parameter, value } = req.params;

  try {
    let condition = {};

    if (BoxName) {
      condition.BoxName = BoxName;
    }

    if (SiteID) {
      const site = await Site.findByPk(SiteID);
      if (!site) {
        return res.status({ message: 'Site not found' });
      }
      condition.SiteID = SiteID;
    }

    // condition[parameter] = value;

    const odfs = await ODF.findAll({ where: condition });

    if (!odfs) {
      return res.status(404).json({ message: 'Odf not found' });
    }

    res.json({ odfs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 创建配线单元盒
exports.createBox = async (req, res) => {
  const { SiteID, BoxName, MaxDiscCount } = req.body;

  try {
    // 检查 SiteID 对应的站点是否存在
    const site = await Site.findByPk(SiteID);
    if (!site) {
      return res.status(404).json({ message: 'Site not found' });
    }

    // 创建新的配线单元盒
    await ODF.create({
      SiteID,
      BoxName,
      MaxDiscCount,
    });

    // 返回创建成功的配线单元盒信息
    res.status(201).json({ message: 'Odf created successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 根据参数更新配线单元盒信息
exports.updateOdf = async (req, res) => {
  const { parameter, updatedData } = req.body;

  try {
    let condition = {};

    if (parameter.BoxName) {
      condition.BoxName = parameter.BoxName;
    }

    if (parameter.SiteID) {
      const site = await Site.findByPk(parameter.SiteID);
      if (!site) {
        return res.status(404).json({ message: 'Site not found' });
      }
      condition.SiteID = parameter.SiteID;
    }

    const boxs = await ODF.findAll({ where: condition });

    if (boxs.length === 0) {
      return res.status(404).json({ message: 'Odf not found' });
    }

    if (boxs.length > 1) {
      const odfList = boxs.map(odf => ({
        BoxID: odf.BoxID,
        SiteID: odf.SiteID,
        BoxName: odf.BoxName,
        MaxDiscCount: odf.MaxDiscCount,
      }));

      return res.json({ odfList });
    }

    const box = boxs[0];

    if (updatedData.BoxName) {
      box.BoxName = updatedData.BoxName;
    }

    if (updatedData.SiteID) {
      const site = await Site.findByPk(updatedData.SiteID);
      if (!site) {
        return res.status(404).json({ message: 'Site not found' });
      }
      box.SiteID = updatedData.SiteID;
    }

    if (updatedData.MaxDiscCount) {
      box.MaxDiscCount = updatedData.MaxDiscCount;
    }

    await box.save();

    res.json({ message: 'Odf update successful' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 根据参数删除对应的配线单元盒信息
exports.deleteOdf = async (req, res) => {
  const { BoxName, SiteID } = req.params;

  // const { parameter, value } = req.params;

  try {
    let condition = {};

    if (BoxName) {
      condition.BoxName = BoxName;
    }

    if (SiteID) {
      const site = await Site.findByPk(SiteID);
      if (!site) {
        return res.status(404).json({ message: 'Site not found' });
      }
      condition.SiteID = SiteID;
    }

    // condition[parameter] = value;

    const boxs = await ODF.findAll({ where: condition });

    if (boxs.length === 0) {
      return res.status(404).json({ message: 'Odf not found' });
    }

    if (boxs.length > 1) {
      const boxList = boxs.map(box => ({
        SiteID: box.SiteID,
        BoxName: box.BoxName,
        MaxDiscCount: box.MaxDiscCount,
      }));

      return res.json({ boxList });
    }

    const box = boxs[0];
    
    const BoxID = box.BoxID;

    const panels = await FiberPanel.count({ where: { BoxID: BoxID } });

    if (panels > 0) {
      return res.status(400).json({ message: 'fiberPanel in the odf and it cannot be deleted' });
    }

    await box.destroy();
    
    res.json({ message: 'Odf deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};