const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 从请求头中获取 Token
      token = req.headers.authorization.split(' ')[1];
      // 验证 Token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // 你可以将用户信息附加到请求对象上，方便后续使用
      // req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401).json({ message: '未授权，token 验证失败' });
    }
  }
  if (!token) {
    res.status(401).json({ message: '未授权，没有 token' });
  }
};

module.exports = { protect };