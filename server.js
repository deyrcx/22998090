const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 中间件
app.use(cors());
app.use(express.json()); // 解析 JSON 请求体

// 数据库连接
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio')
  .then(() => console.log('MongoDB 数据库连接成功'))
  .catch(err => console.error('MongoDB 连接失败:', err.message));

// 路由
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/blog', require('./routes/blog'));
app.use('/api/contact', require('./routes/contact'));

// 测试路由
app.get('/api', (req, res) => {
  res.json({ message: 'Portfolio API 运行正常!' });
});

// 404 错误处理
app.use((req, res) => {
  res.status(404).json({ message: '请求的路由不存在' });
});

// 500 错误处理中间件
app.use((error, req, res, next) => {
  console.error('服务器错误:', error); // 打印错误详情到控制台（方便调试）
  res.status(500).json({ message: error.message || '服务器内部错误' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});