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
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 获取参数获取满足条件的所有纤芯信息
exports.getFiberCore = async (req, res) => {
  const { SiteID, BoxID, PanelID, CoreNumber, Status } = req.params;

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
        return res.status(404).json({ message: 'Odf not found' });
      }
      condition.BoxID = BoxID;
    }

    if (PanelID) {
      const panel = await FiberPanel.findByPk(PanelID);
      if (!panel) {
        return res.status(404).json({ message: 'Panel not found' });
      }
      condition.PanelID = PanelID;
    }

    if (CoreNumber) {
      condition.CoreNumber = CoreNumber;
    }

    if (Status) {
      condition.Status = Status
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

  // 检查当前用户的权限
  if (req.user.Role !== 'admin') {
    return res.status(403).json({ message: 'no permission' });
  }
  

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

    await FiberCore.create({
      SiteID,
      BoxID,
      PanelID,
      CoreNumber,
      Status,
    });

    res.status(201).json({ message: 'Core created successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 根据参数更新对应纤芯信息
exports.updateFiberCore = async (req, res) => {
  const { parameter, updatedData } = req.body;
  
  // 检查当前用户的权限
  if (req.user.Role !== 'admin') {
    return res.status(403).json({ message: 'no permission' });
  }
  

  try {
    let condition = {};

    if (parameter.SiteID) {
      const site = await Site.findByPk(parameter.SiteID);
      if (!site) {
        return res.status(404).json({ message: 'SiteID with Site not found' });
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

    if (parameter.PanelID) {
      const panel = await findByPk(parameter.PanelID);
      if (!panel) {
        return res.status(404).json({ message: 'PanelID with FiberPanel not found' });
      }
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

    if (updatedData.SiteID) {
      const site = await Site.findByPk(updatedData.SiteID);
      if (!site) {
        return res.status(404).json({ message: 'SiteID with Site not found' });
      }
      core.SiteID = updatedData.SiteID;
    }

    if (updatedData.BoxID) {
      const box = await ODF.findByPk(updatedData.BoxID);
      if (!box) {
        return res.status(404).json({ message: 'BoxID with Odf not found' });
      }
      core.BoxID = updatedData.BoxID;
    }

    if (updatedData.PanelID) {
      const panel = await findByPk(updatedData.PanelID);
      if (!panel) {
        return res.status(404).json({ message: 'PanelID with FiberPanel not found' });
      }
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

  // 检查当前用户的权限
  if (req.user.Role !== 'admin') {
    return res.status(403).json({ message: 'no permission' });
  }
  

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

    if (PanelID) {
      const panel = await FiberPanel.findByPk(PanelID);
      if (!panel) {
        return res.status(404).json({ message: 'PanelID with FiberPanel not found' });
      }
      condition.PanelID = PanelID;
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