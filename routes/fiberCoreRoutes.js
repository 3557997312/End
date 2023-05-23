/* 纤芯 */

const express = require('express');
const router = express.Router();

// 导入站点控制器
const fiberCoreController = require('../controllers/fiberCoreController');

// 获取所有纤芯
router.get('/', fiberCoreController.getAllFiberCores);

// 获取指定ID的纤芯
router.get('/:CoreID', fiberCoreController.getFiberCoreById);

// 创建纤芯
router.post('/', fiberCoreController.createFiberCore);

// 更新指定ID的纤芯
router.put('/:CoreID', fiberCoreController.updateFiberCore);

// 删除指定ID的纤芯
router.delete('/:CoreID', fiberCoreController.deleteFiberCore);

module.exports = router;
