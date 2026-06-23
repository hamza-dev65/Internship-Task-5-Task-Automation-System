const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Reminder = require('../models/Reminder');

router.get('/', async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.intern) filter.assignedTo = req.query.intern;
  const tasks = await Task.find(filter).populate('assignedTo', 'name email').sort({ dueDate: 1 });
  res.json(tasks);
});

router.post('/', async (req, res) => {
  const data = { ...req.body };
  if (data.scheduledAt && new Date(data.scheduledAt) > new Date()) {
    data.status = 'scheduled';
  }
  const task = await Task.create(data);
  const populated = await task.populate('assignedTo', 'name email');
  res.status(201).json(populated);
});

router.put('/:id', async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('assignedTo', 'name email');
  res.json(task);
});

router.patch('/:id/status', async (req, res) => {
  const { status } = req.body;
  const update = { status };
  if (status === 'completed') update.completedAt = new Date();
  if (status !== 'completed') update.completedAt = null;
  const task = await Task.findByIdAndUpdate(req.params.id, update, { new: true }).populate('assignedTo', 'name email');
  res.json(task);
});

router.get('/stats', async (req, res) => {
  const total = await Task.countDocuments();
  const completed = await Task.countDocuments({ status: 'completed' });
  const overdue = await Task.countDocuments({ dueDate: { $lt: new Date() }, status: { $ne: 'completed' } });
  const byStatus = await Task.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);
  const byIntern = await Task.aggregate([
    { $group: { _id: '$assignedTo', total: { $sum: 1 }, completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } } } },
    { $lookup: { from: 'interns', localField: '_id', foreignField: '_id', as: 'intern' } },
    { $unwind: { path: '$intern', preserveNullAndEmptyArrays: true } },
    { $project: { name: '$intern.name', total: 1, completed: 1 } }
  ]);
  res.json({ total, completed, overdue, byStatus, byIntern });
});

module.exports = router;
