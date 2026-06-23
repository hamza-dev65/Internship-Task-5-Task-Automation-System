const express = require('express');
const router = express.Router();
const Reminder = require('../models/Reminder');

router.get('/', async (req, res) => {
  const filter = {};
  if (req.query.intern) filter.intern = req.query.intern;
  if (req.query.admin) filter.isAdmin = true;
  if (req.query.unread) filter.read = false;
  const reminders = await Reminder.find(filter).populate('task', 'title dueDate').sort({ sentAt: -1 });
  res.json(reminders);
});

router.patch('/:id/read', async (req, res) => {
  const reminder = await Reminder.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
  res.json(reminder);
});

module.exports = router;
