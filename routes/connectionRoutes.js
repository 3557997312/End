/* 连接 */

const express = require('express');
const router = express.Router();

// 导入站点控制器
const connectionController = require('../controllers/connectionController');

// 获取所有连接
router.get('/', connectionController.getAllConnections);

// 获取指定ID的连接
router.get('/:ConnectionID', connectionController.getConnectionById);

// 创建连接
router.post('/', connectionController.createConnection);

// 更新指定ID的连接
router.put('/:ConnectionID', connectionController.updateConnectionByID);

// 删除指定ID的连接
router.delete('/:ConnectionID', connectionController.deleteConnectionByID);

module.exports = router;