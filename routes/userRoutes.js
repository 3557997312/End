/* 账户 */

const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

// 创建用户
router.post('/', userController.createUser);

// 获取所有用户
router.get('/', userController.getUsers);

// 获取指定ID的用户
router.get('/:UserID', userController.getUserById);

// 更新指定ID的用户
router.put('/:UserID', userController.updateUserById);

// 删除指定ID的用户
router.delete('/:UserID', userController.deleteUserById);

module.exports = router;
