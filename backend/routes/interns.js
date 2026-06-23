const express = require('express');
const router = express.Router();
const Intern = require('../models/Intern');

router.get('/', async (req, res) => {
  const interns = await Intern.find().sort({ createdAt: -1 });
  res.json(interns);
});

router.post('/', async (req, res) => {
  const intern = await Intern.create(req.body);
  res.status(201).json(intern);
});

router.put('/:id', async (req, res) => {
  const intern = await Intern.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(intern);
});

router.delete('/:id', async (req, res) => {
  await Intern.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;
