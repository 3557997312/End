/* 站点 */

const express = require('express');
const router = express.Router();

// 导入站点控制器
const siteController = require('../controllers/siteController');

// 获取所有站点信息
router.get('/', siteController.getAllSites);

// 根据关键词搜索显示站点信息
router.get('/search', siteController.searchSites);

// 根据参数获取满足条件的所有站点信息
router.get('/name/:SiteName', siteController.getSite);
router.get('/voltage/:VoltageLevel', siteController.getSite);
router.get('/info/:GeographicInfo', siteController.getSite);

// router.get('/:parameter/:value', siteController.getSite);

// 创建新站点
router.post('/', siteController.createSite);

// 根据参数更新对应的站点信息
router.put('/', siteController.updateSite);

// 根据参数删除对应的站点信息
router.delete('/name/:SiteName', siteController.deleteSite);
router.delete('/voltage/:VoltageLevel', siteController.deleteSite);
router.delete('/info/:GeographicInfo', siteController.deleteSite);

// router.delete('/:parameter/:value', siteController.deleteSite);

module.exports = router;
