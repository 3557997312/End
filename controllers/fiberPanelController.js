/* 纤盘 */

const FiberPanel = require('../models/fiberPanel');
const Site = require('../models/site');
const ODF = require('../models/odf');
const FiberCore = require('../models/fiberCore');

// 获取所有纤盘
exports.getAllFiberPanels = async (req, res) => {
  try {
    const fiberPanels = await FiberPanel.findAll({
      include: [
        { model: Site },
        { model: ODF }
      ]
    });
    res.json(fiberPanels);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 根据参数获取满足条件的所有纤盘信息
exports.getFiberPanel = async (req, res) => {
  const { SiteID, BoxID, PanelName } = req.params;
  
  // const { parameter, value } = req.params;

  try {
    let condition = {};

    if (SiteID) {
      condition.SiteID = SiteID;
    }

    if (BoxID) {
      condition.BoxID = BoxID;
    }

    if (PanelName) {
      condition.PanelName = PanelName;
    }

    // condition[parameter] = value;

    const panels = await FiberPanel.findAll({ where: condition });
    
    if (!panels) {
      return res.status(404).json({ message: 'Panel not found' });
    }

    res.json(panels);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 创建新纤盘
exports.createFiberPanel = async (req, res) => {
  const { SiteID, BoxID, PanelName } = req.body;

  try {
    // 检查SiteID对应的站点是否存在
    const site = await Site.findByPk(SiteID);
    if (!site) {
      return res.status(404).json({ message: 'Site not found' });
    }

    const box = await ODF.findByPk(BoxID);
    if (!box) {
      return res.status(404).json({ message: 'Odf not found' });
    }

    const fiberPanel = await FiberPanel.create({
      SiteID,
      BoxID,
      PanelName,
    });

    res.status(201).json(fiberPanel);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 根据参数更新对应纤盘信息
exports.updateFiberPanel = async (req, res) => {
  const { parameter, updatedData } = req.body;

  try {
    let condition = {};

    if (parameter.SiteID) {
      condition.SiteID = parameter.SiteID;
    }

    if (parameter.BoxID) {
      condition.BoxID = parameter.BoxID;
    }

    if (parameter.PanelName) {
      condition.PanelName = parameter.PanelName;
    }

    const panels = await FiberPanel.findAll({ where: condition });

    if (panels.length === 0) {
      return res.status(404).json({ message: 'Panel not found' });
    }

    if (panels.length > 1) {
      const panelList = panels.map(panel => ({
        PanelID: panel.PanelID,
        SiteID: panel.SiteID,
        BoxID:panel.BoxID,
        PanelName: panel.PanelName,
      }));

      return res.json({ panelList });
    }

    const panel = panels[0];

    const site = panel.SiteID;
    if (!site) {
      return res.status(404).json({ message: 'Site not found' });
    }

    if (updatedData.SiteID) {
      panel.SiteID = updatedData.SiteID;
    }

    const box = panel.BoxID;
    if (!box) {
      return res.status(404).json({ message: 'Odf not found' });
    }

    if (updatedData.BoxID) {
      panel.BoxID = updatedData.BoxID;
    }

    if (updatedData.PanelName) {
      panel.PanelName = updatedData.PanelName;
    }

    await panel.save();

    res.json({ message: 'Panel update successful' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 删除指定ID的纤盘
exports.deleteFiberPanel = async (req, res) => {
  const { SiteID, BoxID, PanelName } = req.params;

  try {
    let condition = {};

    if (SiteID) {
      condition.SiteID = SiteID;
    }

    if (BoxID) {
      condition.BoxID = BoxID;
    }

    if (PanelName) {
      condition.PanelName = PanelName;
    }

    const panels = await FiberPanel.findAll({ where: condition });

    if (panels.length === 0) {
      return res.status(404).json({ message: 'Panel not found' });
    }

    if (panels.length > 1) {
      const panelList = panels.map(panel => ({
        SiteID: panel.SiteID,
        BoxID: panel.BoxID,
        PanelName: panel.PanelName,
      }));

      return res.json({ panelList });
    }

    res.json({ message: 'Fiber panel deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
