const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config/config');

const authMiddleware = (req, res, next) => {
  // 从请求头中获取授权令牌
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Missing authorization token' });
  }

  // 检查授权令牌格式是否为 Bearer Token
  const tokenParts = authHeader.split(' ');

  if (tokenParts.length !== 2 || tokenParts[0].toLowerCase() !== 'bearer') {
    return res.status(401).json({ message: 'Invalid authorization token' });
  }

  // 提取令牌
  const token = tokenParts[1];

  try {
    // 验证令牌
    const decoded = jwt.verify(token, SECRET_KEY, { algorithm: 'HS256' });

    // 将用户信息存储在请求对象中
    req.user = decoded;

    // console.log(req.user.UserID);

    // 检查用户是否为管理员
    if (req.user.Role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized12' });
    }

    // 继续处理下一个中间件或路由处理函数
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token expired' });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid authorization token' });
    } else if (error instanceof jwt.NotBeforeError) {
      return res.status(401).json({ message: 'Token not yet valid' });
    } else {
      return res.status(401).json({ message: 'Invalid authorization token' });
    }
  }
};

module.exports = authMiddleware;
