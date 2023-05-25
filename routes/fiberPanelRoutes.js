/* 纤盘 */

const express = require('express');
const router = express.Router();
const authMiddleware  = require('../middleware/authMiddleware.js');

// 导入站点控制器
const fiberPanelController = require('../controllers/fiberPanelController');

// 获取所有纤盘
router.get('/', fiberPanelController.getAllFiberPanels);

// 根据参数获取满足条件的所有纤盘信息
router.get('/SiteID/:SiteID', fiberPanelController.getFiberPanel);
router.get('/BoxID/:BoxID', fiberPanelController.getFiberPanel);
router.get('/name/:PanelName', fiberPanelController.getFiberPanel);

// 创建纤盘
router.post('/', authMiddleware, fiberPanelController.createFiberPanel);

// 根据参数更新对应纤盘的信息
router.put('/', authMiddleware, fiberPanelController.updateFiberPanel);

// 根据参数删除对应纤盘的信息
router.delete('/SiteID/:SiteID', authMiddleware, fiberPanelController.deleteFiberPanel);
router.delete('/BoxID/:BoxID', authMiddleware, fiberPanelController.deleteFiberPanel);
router.delete('/name/:PanelName', authMiddleware, fiberPanelController.deleteFiberPanel);

module.exports = router;