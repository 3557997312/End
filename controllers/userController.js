/* 用户 */

const User = require('../models/user');

// 创建用户
exports.createUser = async (req, res) => {
  try {
    const { Username, Password, Role } = req.body;
    const user = await User.create({ Username, Password, Role });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 获取所有用户
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 获取指定ID的用户
exports.getUserById = async (req, res) => {
  try {
    const { UserID } = req.params;
    const user = await User.findByPk(UserID);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 更新指定ID的用户
exports.updateUserById = async (req, res) => {
  try {
    const { UserID } = req.params;
    const { Username, Password, Role } = req.body;
    const user = await User.findByPk(UserID);
    if (user) {
      await user.update({ Username, Password, Role });
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 删除指定ID的用户
exports.deleteUserById = async (req, res) => {
  try {
    const { UserID } = req.params;
    const user = await User.findByPk(UserID);
    if (user) {
      await user.destroy();
      res.json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
