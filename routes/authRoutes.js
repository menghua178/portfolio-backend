const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// @route   POST /api/users/register
// @desc    注册新用户
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // --- 1. 添加输入验证 ---
  if (!username || !password) {
    // 如果用户名或密码为空，立即返回 400 错误
    return res.status(400).json({ message: '用户名和密码不能为空' });
  }

  try {
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: '用户已存在' });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    user = new User({ username, password: hashedPassword });
    await user.save();
    
    res.status(201).json({ message: '用户注册成功' });

  } catch (error) {
    // --- 2. 添加详细的错误日志 ---
    console.error('注册过程中发生错误:', error); // 在服务器日志中打印完整错误
    
    res.status(500).json({ 
        message: '服务器内部错误，请稍后再试',
        error: error.message // 也可以选择性地将错误信息返回给前端
    });
  }
});

// @route   POST /api/users/login
// @desc    用户登录并获取 Token
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // --- 同样为登录添加输入验证 ---
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
    // --- 同样为登录添加详细日志 ---
    console.error('登录过程中发生错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router;