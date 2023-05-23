/* 连接 */

const express = require('express');
const router = express.Router();

// 导入站点控制器
const connectionController = require('../controllers/connectionController');

// 获取所有连接信息
router.get('/', connectionController.getAllConnections);

// 根据参数获取所有连接信息
router.get('/:BoxID1', connectionController.getConnection);
router.get('/:BoxID2', connectionController.getConnection);

// 根据参数获取指定的一个连接
router.get('/:BoxID1/:BoxID2', connectionController.getConnection)

// 创建连接
router.post('/', connectionController.createConnection);

// 根据参数更新连接信息
router.put('/:BoxID1/:BoxID2', connectionController.updateConnection);

// 根据参数删除连接信息
router.delete('/:BoxID1/:BoxID2', connectionController.deleteConnection);

module.exports = router;