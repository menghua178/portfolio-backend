// ==========================================================
//           后端文件: authRoutes.js (完整修改版)
// ==========================================================
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // 确保你的 User model 引入路径正确
const router = express.Router();

// @route   POST /api/users/register
// @desc    注册新用户
router.post('/register', async (req, res) => {
  // 1. 从请求体中解构出 email
  const { username, email, password } = req.body;

  // 2. 增强输入验证，确保 email 不为空
  if (!username || !email || !password) {
    return res.status(400).json({ message: '用户名、邮箱和密码均不能为空' });
  }

  try {
    // 3. 同时检查用户名和邮箱是否已存在
    let userByUsername = await User.findOne({ username });
    if (userByUsername) {
      return res.status(400).json({ message: '该用户名已被使用' });
    }
    
    let userByEmail = await User.findOne({ email });
    if (userByEmail) {
      return res.status(400).json({ message: '该邮箱已被注册' });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // 4. 创建新用户时，包含所有三个字段
    user = new User({ 
      username, 
      email, 
      password: hashedPassword 
    });
    await user.save();
    
    res.status(201).json({ message: '用户注册成功' });

  } catch (error) {
    console.error('注册过程中发生错误:', error);
    
    // 检查是否是 MongoDB 的重复键错误，可以返回更友好的提示
    if (error.code === 11000) {
        return res.status(400).json({ message: '用户名或邮箱已存在。' });
    }
    
    res.status(500).json({ 
        message: '服务器内部错误，请稍后再试',
        error: error.message
    });
  }
});

// @route   POST /api/users/login
// @desc    用户登录并获取 Token
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: '用户名和密码不能为空' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: '无效的凭证' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: '无效的凭证' });
    }
    
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    res.json({ token, user: { username: user.username } });

  } catch (error) {
    console.error('登录过程中发生错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router;