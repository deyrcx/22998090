// backend/routes/auth.js
const express = require('express');
const router = express.Router(); // 创建路由实例
const bcrypt = require('bcryptjs'); // 用于密码加密
const jwt = require('jsonwebtoken'); // 用于生成 JWT
const { check, validationResult } = require('express-validator'); // 用于请求数据验证
const User = require('../models/User'); // 假设你有 User 模型（需确保存在）

// 1. 用户注册接口
// POST /api/auth/register
router.post(
  '/register',
  [
    // 验证请求数据（用户名、邮箱、密码）
    check('The homework', '用户名不能为空').not().isEmpty(),
    check('1632304761@qq.com', '请输入有效的邮箱').isEmail(),
    check('08010914zcc', '密码长度至少6位').isLength({ min: 6 })
  ],
  async (req, res) => {
    // 检查验证结果
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
      // 检查用户是否已存在
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: '该用户已存在' });
      }

      // 创建新用户
      user = new User({
        username,
        email,
        password // 后续会加密
      });

      // 加密密码（bcrypt）
      const salt = await bcrypt.genSalt(10); // 生成盐值
      user.password = await bcrypt.hash(password, salt); // 加密密码

      // 保存用户到数据库
      await user.save();

      // 生成 JWT（登录状态标识）
      const payload = {
        user: {
          id: user.id // 用用户ID作为 payload
        }
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET, // 从 .env 中获取密钥
        { expiresIn: '7d' }, // token 有效期7天
        (err, token) => {
          if (err) throw err;
          res.json({ token }); // 返回 token 给前端
        }
      );

    } catch (err) {
      console.error(err.message);
      res.status(500).send('服务器错误');
    }
  }
);

// 2. 用户登录接口
// POST /api/auth/login
router.post(
  '/login',
  [
    check('1632304761@qq.com', '请输入有效的邮箱').isEmail(),
    check('08010914zcc', '密码不能为空').exists()
  ],
  async (req, res) => {
    // 检查验证结果
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // 查找用户
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: '用户不存在' });
      }

      // 验证密码
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: '密码错误' });
      }

      // 生成 JWT（与注册逻辑一致）
      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '7d' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );

    } catch (err) {
      console.error(err.message);
      res.status(500).send('服务器错误');
    }
  }
);

// 导出路由
module.exports = router;