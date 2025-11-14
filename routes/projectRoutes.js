const express = require('express');
const Project = require('../models/Project');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// PUBLIC: 获取所有项目
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) { res.status(500).json({ message: '服务器错误' }); }
});

// PROTECTED: 创建新项目
router.post('/', protect, async (req, res) => {
  try {
    const newProject = new Project(req.body);
    const project = await newProject.save();
    res.status(201).json(project);
  } catch (err) { res.status(400).json({ message: '创建失败' }); }
});

// PROTECTED: 更新项目
router.put('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!project) return res.status(404).json({ message: '未找到项目' });
    res.json(project);
  } catch (err) { res.status(400).json({ message: '更新失败' }); }
});

// PROTECTED: 删除项目
router.delete('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: '未找到项目' });
    res.json({ message: '项目删除成功' });
  } catch (err) { res.status(500).json({ message: '服务器错误' }); }
});

module.exports = router;