/* 用户 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { generateToken } = require('../utils/tokenUtils');

// 创建用户
exports.createUser = async (req, res) => {
  const { UserName, Password, Role } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(Password, salt);

    await User.create({
      UserName,
      Password: hashedPassword,
      Role,
    });

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 用户登录
exports.login = async (req, res) => {
  const { UserName, Password } = req.body;
  try {
    const user = await User.findOne({ where: { UserName } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(Password, user.Password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = generateToken(user.UserID, user.Role);

    res.json({ token: `Bearer ${token}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 获取所有用户
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll();

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 根据用户名获取用户信息
exports.getUser = async (req, res) => {
  const { UserName } = req.params;

  try {
    const user = await User.findOne({ where: { UserName } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 根据用户名更新用户信息
exports.updateUser = async (req, res) => {
  const { UserName, updateData } = req.body;

  try {
    const user = await User.findOne({ where: { UserName } });

    if (!user) {
      return res.status(404).json({ messaeg: 'User not found' });
    }
    
    if (updateData.Password) {
      user.Password = updateData.Password;
    }

    if (updateData.Role) {
      user.Role = updateData.Role;
    }

    await user.save();

    res.json({ message: 'User update successful' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 根据用户名删除用户信息
exports.deleteUser = async (req, res) => {
  const { UserName } = req.params;

  try {
    const user = await User.findOne({ where: { UserName } });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.destroy();

    res.json({ message: 'User delete successful' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
