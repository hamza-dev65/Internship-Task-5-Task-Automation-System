const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  intern: { type: mongoose.Schema.Types.ObjectId, ref: 'Intern', default: null },
  isAdmin: { type: Boolean, default: false },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  sentAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Reminder', reminderSchema);
