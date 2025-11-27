const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: { type: String, required: true }, // 简化为用户名
  text: { type: String, required: true },
}, { timestamps: true });

const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, default: 'Admin' },
  comments: [commentSchema],
}, { timestamps: true });

module.exports = mongoose.model('BlogPost', blogPostSchema);