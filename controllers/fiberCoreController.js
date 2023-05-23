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
    res.json({ fiberCores });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to get fiber cores' });
  }
};

// 获取参数获取满足条件的所有纤芯信息
exports.getFiberCore = async (req, res) => {
  const {SiteID,BoxID,PanelID,CoreNumber,status} = req.params;

  try {
    let condition = {};

    if (SiteID) {
      const site = Site.SiteID;
      if (!site) {
        return res.status(404).json({ message: 'Site not found' });
      }
      condition.SiteID = SiteID;
    }

    if (BoxID) {
      const box = ODF.BoxID;
      if (!box) {
        return res.status(404).json({ message: 'Odf not found' });
      }
      condition.BoxID = BoxID;
    }

    if (PanelID) {
      const panel = FiberPanel.PanelID;
      if (!panel) {
        return res.status(404).json({ message: 'Panel not found' });
      }
      condition.PanelID = PanelID;
    }

    if (CoreNumber) {
      condition.CoreNumber = CoreNumber;
    }

    if (status) {
      condition.status = status
    }

    const cores = await FiberCore.findAll({ where: condition });

    if (!cores) {
      return res.status(404).json({ message: 'Core not found' });
    }

    res.json({ cores });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 创建纤芯
exports.createFiberCore = async (req, res) => {
  const { SiteID, BoxID, PanelID, CoreNumber, Status } = req.body;

  try {
    const site = await Site.findByPk(SiteID);
    if (!site) {
      return res.status(404).json({ message: 'Site not found' });
    }

    const box = await ODF.findByPk(BoxID);
    if (!box) {
      return res.status(404).json({ message: 'Odf not found' });
    }

    const panel = await FiberPanel.findByPk(PanelID);
    if (!panel) {
      return res.status(404).json({ message: 'Panel not found' });
    }

    const fiberCore = await FiberCore.create({
      SiteID,
      BoxID,
      PanelID,
      CoreNumber,
      Status,
    });

    res.status(201).json({ fiberCore });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 根据参数更新对应纤芯信息
exports.updateFiberCore = async (req, res) => {
  const { parameter,updatedData } = req.body;

  try {
    let condition = {};

    if (parameter.SiteID) {
      condition.SiteID = parameter.SiteID;
    }

    if (parameter.BoxID) {
      condition.BoxID = parameter.BoxID;
    }

    if (parameter.PanelID) {
      condition.PanelID = parameter.PanelID;
    }

    if (parameter.CoreNumber) {
      condition.CoreNumber = parameter.CoreNumber;
    }

    const cores = await FiberCore.findAll({ where: condition });

    if (cores.length === 0) {
      return res.status(404).json({ message: 'Core not found' });
    }

    if (cores.length > 1) {
      const coreList = cores.map(core => ({
        SiteID: core.SiteID,
        BoxID: core.BoxID,
        PanelID: core.PanelID,
        CoreNumber: core.CoreNumber,
        Status: core.Status,
      }));

      return res.json({ coreList });
    }

    const core = cores[0];

    const site = core.SiteID;
    if (!site) {
      return res.status(404).json({ message: 'Site not found' });
    }
    if (updatedData.SiteID) {
      core.SiteID = updatedData.SiteID;
    }

    const box = core.BoxID;
    if (!box) {
      return res.status(404).json({ message: 'Odf not found' });
    }
    if (updatedData.BoxID) {
      core.BoxID = updatedData.BoxID;
    }

    const panel = core.PanelID;
    if (!panel) {
      return res.status(404).json({ message: 'Panel not found' });
    }
    if (updatedData.PanelID) {
      core.PanelID = updatedData.PanelID;
    }

    if (updatedData.CoreNumber) {
      core.CoreNumber = updatedData.CoreNumber;
    }

    if (updatedData.Status) {
      core.Status = updatedData.Status;
    }

    await core.save();

    res.json({ message: 'Core update successful' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 根据参数删除对应纤芯
exports.deleteFiberCore = async (req, res) => {
  const { SiteID, BoxID, PanelID, CoreNumber, Status } = req.params;

  try {
    let condition = {};
    
    if (SiteID) {
      const site = Site.SiteID;
      if (!site) {
        return res.status(404).json({ message: 'Site not found' });
      }
      condition.SiteID = SiteID;
    }

    if (BoxID) {
      const box = ODF.BoxID;
      if (!box) {
        return res.status(404).json({ message: 'Odf not found' });
      }
      condition.BoxID = BoxID;
    }

    if (PanelID) {
      const panel = FiberPanel.PanelID;
      if (!panel) {
        return res.status(404).json({ message: 'Panel not found' });
      }
    }

    if (CoreNumber) {
      condition.CoreNumber = CoreNumber;
    }

    if (Status) {
      condition.Status = Status;
    }

    const cores = await FiberCore.findAll({ where: condition });

    if (cores.length === 0) {
      return res.status(404).json({ message: 'Core not found' });
    }

    if (cores.length > 1) {
      const coreList = cores.map(core => ({
        SiteID: core.SiteID,
        BoxID: core.BoxID,
        PanelID: core.PanelID,
        CoreNumber: core.CoreNumber,
        Status: core.Status,
      }));

      return res.json({ coreList });
    }

    const core = cores[0];
    
    await core.destroy();

    res.json({ message: 'Fiber core deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete fiber core' });
  }
};