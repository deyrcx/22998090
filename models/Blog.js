const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  author: String,
  content: {
    type: String,
    required: true
  },
  email: String
}, {
  timestamps: true
});

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  excerpt: String,
  author: {
    type: String,
    default: 'Admin'
  },
  tags: [String],
  imageUrl: String,
  comments: [commentSchema],
  published: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Blog', blogSchema);