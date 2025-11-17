const express = require('express');
const Contact = require('../models/Contact');

const router = express.Router();

// 提交联系表单
router.post('/', async (req, res) => {
  try {
    const contact = await Contact.create(req.body);
    res.status(201).json({ 
      message: '消息发送成功！', 
      data: contact 
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 获取所有联系消息 (需要认证)
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;