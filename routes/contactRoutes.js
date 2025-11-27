const express = require('express');
const router = express.Router();

// @route   POST /api/contact
// @desc    接收联系表单信息
router.post('/', (req, res) => {
  const { name, email, message } = req.body;
  // 在真实应用中，你会在这里处理数据（如发送邮件或存入数据库）
  console.log('收到联系信息:', { name, email, message });
  res.status(200).json({ message: '消息已收到，我们会尽快与您联系！' });
});

module.exports = router;