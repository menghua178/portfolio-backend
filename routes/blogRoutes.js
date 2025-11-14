const express = require('express');
const BlogPost = require('../models/BlogPost');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// PUBLIC: 获取所有博客文章
router.get('/', async (req, res) => {
  try {
    const posts = await BlogPost.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) { res.status(500).json({ message: '服务器错误' }); }
});

// PUBLIC: 获取单篇博客文章
router.get('/:id', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: '未找到文章' });
    res.json(post);
  } catch (err) { res.status(500).json({ message: '服务器错误' }); }
});

// PROTECTED: 创建新文章
router.post('/', protect, async (req, res) => {
  try {
    const newPost = new BlogPost(req.body);
    const post = await newPost.save();
    res.status(201).json(post);
  } catch (err) { res.status(400).json({ message: '创建失败' }); }
});

// PROTECTED: 更新文章
router.put('/:id', protect, async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!post) return res.status(404).json({ message: '未找到文章' });
    res.json(post);
  } catch (err) { res.status(400).json({ message: '更新失败' }); }
});

// PROTECTED: 删除文章
router.delete('/:id', protect, async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: '未找到文章' });
    res.json({ message: '文章删除成功' });
  } catch (err) { res.status(500).json({ message: '服务器错误' }); }
});

// PUBLIC (或 PROTECTED, 根据需求): 添加评论
router.post('/:postId/comments', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: '未找到文章' });
    
    // 这里简化为直接接收用户名，也可以改为从登录状态获取
    const newComment = { user: req.body.user, text: req.body.text };
    post.comments.push(newComment);
    await post.save();
    res.status(201).json(post.comments);
  } catch (err) { res.status(400).json({ message: '评论失败' }); }
});

module.exports = router;