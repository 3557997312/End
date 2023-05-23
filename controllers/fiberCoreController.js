/* 纤芯 */

const FiberCore = require('../models/fiberCore');
const FiberPanel = require('../models/fiberPanel');
const Site = require('../models/site');
const ODF = require('../models/odf');

// 获取所有纤芯
exports.getAllFiberCores = async (req, res) => {
  try {
    const fiberCores = await FiberCore.findAll({
      include: [
        { model: Site },
        { model: ODF },
        { model: FiberPanel },
      ]
    });
    res.json(fiberCores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to get fiber cores' });
  }
};

// 获取指定ID的纤芯
exports.getFiberCoreById = async (req, res) => {
  const CoreID = req.params.CoreID;

  try {
    const fiberCore = await FiberCore.findByPk(CoreID, {
      include: [
        { model: Site },
        { model: ODF },
        { model: FiberPanel },
      ]
    });
    if (!fiberCore) {
      return res.status(404).json({ message: 'Fiber core not found' });
    }
    res.json(fiberCore);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to get fiber core' });
  }
};

// 创建纤芯
exports.createFiberCore = async (req, res) => {
  const { CoreNumber, Status, SiteID, BoxID, PanelID } = req.body;

  try {
    const fiberCore = await FiberCore.create({
      CoreNumber,
      Status,
      SiteID,
      BoxID,
      PanelID,
    });
    res.status(201).json(fiberCore);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create fiber core' });
  }
};

// 更新指定ID的纤芯
exports.updateFiberCore = async (req, res) => {
  const CoreID = req.params.CoreID;
  const { CoreNumber, Status, SiteID, BoxID, PanelID } = req.body;

  try {
    const fiberCore = await FiberCore.findByPk(CoreID);
    if (!fiberCore) {
      return res.status(404).json({ message: 'Fiber core not found' });
    }

    await fiberCore.update({
      CoreNumber,
      Status,
      SiteID,
      BoxID,
      PanelID,
    });

    res.json(fiberCore);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update fiber core' });
  }
};

// 删除指定ID的纤芯
exports.deleteFiberCore = async (req, res) => {
  const CoreID = req.params.CoreID;

  try {
    const fiberCore = await FiberCore.findByPk(CoreID);
    if (!fiberCore) {
      return res.status(404).json({ message: 'Fiber core not found' });
    }

    await fiberCore.destroy();
    res.json({ message: 'Fiber core deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete fiber core' });
  }
};