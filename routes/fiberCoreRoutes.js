/* 纤芯 */

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// 导入站点控制器
const fiberCoreController = require('../controllers/fiberCoreController');

// 获取所有纤芯
router.get('/', fiberCoreController.getAllFiberCores);

// 根据参数获取满足条件的所有纤芯信息
router.get('/SiteID/:SiteID', fiberCoreController.getFiberCore);
router.get('/BoxID/:BoxID', fiberCoreController.getFiberCore);
router.get('/PanelID/:PanelID', fiberCoreController.getFiberCore);
router.get('/number/:CoreNumber', fiberCoreController.getFiberCore);
router.get('/status/:Status', fiberCoreController.getFiberCore);

// 创建纤芯
router.post('/', authMiddleware, fiberCoreController.createFiberCore);

// 根据参数更新对应纤芯的信息
router.put('/', authMiddleware, fiberCoreController.updateFiberCore);

// 根据参数删除对应纤芯的信息
router.delete('/SiteID/:SiteID', authMiddleware, fiberCoreController.deleteFiberCore);
router.delete('/BoxID/:BoxID', authMiddleware, fiberCoreController.deleteFiberCore);
router.delete('/PanelID/:PanelID', authMiddleware, fiberCoreController.deleteFiberCore);
router.delete('/number/:CoreNumber', authMiddleware, fiberCoreController.deleteFiberCore);
router.delete('/status/:Status', authMiddleware, fiberCoreController.deleteFiberCore);

module.exports = router;
