const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      // 提取 token（格式：Bearer <token>）
      token = req.headers.authorization.split(' ')[1];
      
      // 验证 token 并解码（注意：ID 在 decoded.user.id 中）
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallbacksecret');
      
      // 根据解码后的用户 ID 查找用户（排除密码）
      req.user = await User.findById(decoded.user.id).select('-password');
      
      // 检查用户是否存在（防止 token 有效但用户已被删除的情况）
      if (!req.user) {
        return res.status(401).json({ message: '用户不存在' });
      }
      
      next(); // 认证通过，继续执行后续路由
    } else {
      res.status(401).json({ message: '未授权访问（请提供 Bearer 令牌）' });
    }
  } catch (error) {
    // 细化错误提示（可选，方便调试）
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: '令牌无效' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: '令牌已过期' });
    }
    res.status(401).json({ message: '认证失败' });
  }
};

module.exports = { protect };