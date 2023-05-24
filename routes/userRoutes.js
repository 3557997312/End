/* 账户 */

const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

// 创建用户
router.post('/', userController.createUser);
// 用户登录
router.post('/login', userController.login);

// 获取所有用户
router.get('/', userController.getUsers);

// 根据用户名获取用户信息
router.get('/:UserName', userController.getUser);

// 根据用户名更新用户信息
router.put('/', userController.updateUser);

// 根据用户名删除用户信息
router.delete('/:UserName', userController.deleteUser);

module.exports = router;
