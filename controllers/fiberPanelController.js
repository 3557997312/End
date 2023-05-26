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
    res.json({ fiberPanels });
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
      const site = await Site.findByPk(SiteID);
      if (!site) {
        return res.status(404).json({ message: 'SiteID with Site not found' });
      }
      condition.SiteID = SiteID;
    }

    if (BoxID) {
      const box = await ODF.findByPk(BoxID);
      if (!box) {
        return res.status(404).json({ message: 'BoxID with Odf not found' });
      }
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

    res.json({ panels });
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
      return res.status(404).json({ message: 'SiteID with Site not found' });
    }

    const box = await ODF.findByPk(BoxID);
    if (!box) {
      return res.status(404).json({ message: 'BoxID with Odf not found' });
    }

    // 判断该纤盘所属配线单元盒内的纤盘数是否超出最大容量
    const MaxDiscCount = box.MaxDiscCount;
    const fiberPanelCount = await FiberPanel.count({ where: { BoxID } });
    if (fiberPanelCount >= MaxDiscCount) {
      return res.status(400).json({ message: 'The number of pannel  in the wiring unit box is full' });
    }

    await FiberPanel.create({
      SiteID,
      BoxID,
      PanelName,
    });

    res.status(201).json({ message: 'Panel created successfully' });
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
      const site = await Site.findByPk(parameter.SiteID);
      if (!site) {
        return res.status(404).json({message:'SiteID with Site not found'})
      }
      condition.SiteID = parameter.SiteID;
    }

    if (parameter.BoxID) {
      const box = await ODF.findByPk(parameter.BoxID);
      if (!box) {
        return res.status(404).json({ message: 'BoxID with Odf not found' });
      }
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
        SiteID: panel.SiteID,
        BoxID:panel.BoxID,
        PanelName: panel.PanelName,
      }));

      return res.json({ panelList });
    }

    const panel = panels[0];
    if (updatedData.SiteID) {
      const site = await Site.findByPk(updatedData.SiteID);
      if (!site) {
        return res.status(404).json({ message: 'SiteID with Site not found' });
      }
      panel.SiteID = updatedData.SiteID;
    }

    if (updatedData.BoxID) {
      const box = await ODF.findByPk(updatedData.BoxID);
      if (!box) {
        return res.status(404).json({ message: 'BoxID with Odf not found' });
      }
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

// 根据参数删除纤盘的信息
exports.deleteFiberPanel = async (req, res) => {
  const { SiteID, BoxID, PanelName } = req.params;

  try {
    let condition = {};

    if (SiteID) {
      const site = await Site.findByPk(SiteID);
      if (!site) {
        return res.status(404).json({ message: 'SiteID with Site not found' });
      }
      condition.SiteID = SiteID;
    }

    if (BoxID) {
      const box = await ODF.findByPk(BoxID);
      if (!box) {
        return res.satus(404).json({ message: 'BoxID with Odf not found' });
      }
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

    const panel = panels[0];

    const core = await FiberCore.findByPk(panel.PanelID)
    if (!core) {
      return res.status(400).json({ message: 'cores in the Panel and cannot be deleted' });
    }

    await panel.destroy();

    res.json({ message: 'Panel deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
