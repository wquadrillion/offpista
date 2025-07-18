const express = require('express');
const Task = require('../models/Task');
const auth = require('./authMiddleware');
const router = express.Router();

// Get all tasks for logged-in user, with optional status filter
router.get('/', auth, async (req, res) => {
  const { status } = req.query;
  const filter = { user: req.user.id };
  if (status) filter.status = status;
  const tasks = await Task.find(filter).sort({ createdAt: -1 });
  res.json(tasks);
});

// Create task
router.post('/', auth, async (req, res) => {
  const { title, description, status, extras } = req.body;
  if (!title) return res.status(400).json({ message: 'Title is required.' });
  const task = new Task({ user: req.user.id, title, description, status, extras });
  await task.save();
  res.status(201).json(task);
});

// Update task
router.put('/:id', auth, async (req, res) => {
  const { title, description, status, extras } = req.body;
  const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
  if (!task) return res.status(404).json({ message: 'Task not found.' });
  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (status !== undefined) task.status = status;
  if (extras !== undefined) task.extras = extras;
  await task.save();
  res.json(task);
});

// Delete task
router.delete('/:id', auth, async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  if (!task) return res.status(404).json({ message: 'Task not found.' });
  res.json({ message: 'Task deleted.' });
});

// Insights endpoint: count by status
router.get('/insights/status', auth, async (req, res) => {
  const stats = await Task.aggregate([
    { $match: { user: require('mongoose').Types.ObjectId(req.user.id) } },
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);
  res.json(stats);
});

module.exports = router;
