/* 站点 */

const Site = require('../models/site');
const Odf = require('../models/odf');
const { Op } = require('sequelize');

// 获取所有站点
exports.getAllSites = async (req, res) => {
  try {
    const sites = await Site.findAll();  // 使用 Sequelize 的 findAll 方法获取所有站点
    
    res.status(200).json(sites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 根据关键字搜索显示站点信息
exports.searchSites = async (req, res) => {
  const { keyword } = req.query;

  try {
    // 构建查询条件
    let condition = {
      [Op.or]: [
        { SiteName: { [Op.like]: `%${keyword}%` } },
        { GeographicInfo: { [Op.like]: `%${keyword}%` } },
      ],
    };

    const sites = await Site.findAll({ where: condition });

    res.json(sites)
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 根据参数获取满足条件的所有站点信息
exports.getSite = async (req, res) => {
  const { SiteName, VoltageLevel,GeographicInfo } = req.params;

  // const { parameter, value } = req.params;

  try {
    let condition = {}; // 初始化查询条件对象

    if (SiteName) {
      condition.SiteName = SiteName;
    }

    if (VoltageLevel) {
      condition.VoltageLevel = VoltageLevel;
    }

    if (GeographicInfo) {
      condition.GeographicInfo = GeographicInfo;
    }

    // condition[parameter] = value;

    const sites = await Site.findAll({ where: condition });

    if (!sites) {
      return res.status(404).json({ message: 'Site not found' });
    }

    res.json(sites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 创建新站点
exports.createSite = async (req, res) => {
  const { SiteName, VoltageLevel, GeographicInfo } = req.body;

  if (!SiteName || !VoltageLevel || !GeographicInfo) {
    return res.status(400).json({ message: '必填字段不能为空' });
  }

  try {
    // 创建新的站点对象
    const newSite = new Site({
      SiteName,
      VoltageLevel,
      GeographicInfo,
    });

    // 将新站点保存到数据库
    const savedSite = await newSite.save();

    // 返回创建成功的站点信息
    res.status(201).json(savedSite);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 根据参数更新对应的站点信息
exports.updateSite = async (req, res) => {
  const { parameter, updatedData } = req.body;

  try {
    let condition = {};

    if (parameter.SiteName) {
      condition.SiteName = parameter.SiteName;
    }

    if (parameter.VoltageLevel) {
      condition.VoltageLevel = parameter.VoltageLevel;
    }

    if (parameter.GeographicInfo) {
      condition.GeographicInfo = parameter.GeographicInfo;
    }

    const sites = await Site.findAll({ where: condition });

    if (sites.length === 0) {
      return res.status(404).json({ message: 'Site not found' });
    }

    if (sites.length > 1) {
      const siteList = sites.map(site => ({
        SiteName: site.SiteName,
        VoltageLevel: site.VoltageLevel,
        GeographicInfo: site.GeographicInfo,
      }));

      return res.json({ siteList });
    }

    const site = sites[0];
    if (updatedData.SiteName) {
      site.SiteName = updatedData.SiteName;
    }

    if (updatedData.VoltageLevel) {
      site.VoltageLevel = updatedData.VoltageLevel;
    }

    if (updatedData.GeographicInfo) {
      site.GeographicInfo = updatedData.GeographicInfo;
    }

    await site.save();

    res.json({ message: 'Site update successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// 根据参数删除对应的站点
exports.deleteSite = async (req, res) => {
  const { SiteName, VoltageLevel, GeographicInfo } = req.params;

  // const { parameter, value } = req.params;

  try {
    let condition = {};

    if (SiteName) {
      condition.SiteName = SiteName;
    }

    if (VoltageLevel) {
      condition.VoltageLevel = VoltageLevel;
    }

    if (GeographicInfo) {
      condition.GeographicInfo = GeographicInfo;
    }

    // condition[parameter] = value;

    const sites = await Site.findAll({ where: condition });

    if (sites.length === 0) {
      return res.status(404).json({ messgae: 'Site not found' });
    }

    if (sites.length > 1) {
      const siteList = sites.map(site => ({
        SiteName: site.SiteName,
        VoltageLevel: site.VoltageLevel,
        GeographicInfo: site.GeographicInfo,
      }));

      return res.json({ siteList });
    }

    const site = sites[0];

    const SiteID = site.SiteID;

    const odfs = await Odf.count({ where: { SiteID: SiteID } });

    if (odfs > 0) {
      return res.status(400).json({ message: 'box in the site and it cannot be deleted' });
    }

    await site.destroy();

    res.json({ message: 'Site delete successful' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};