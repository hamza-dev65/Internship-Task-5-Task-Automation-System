const cron = require('node-cron');
const Task = require('../models/Task');
const Intern = require('../models/Intern');
const Reminder = require('../models/Reminder');

const REMINDER_HOURS = 4;

function startReminderJobs() {
  // Every 4 hours: send reminders for tasks due within 24h
  cron.schedule(`0 */${REMINDER_HOURS} * * *`, async () => {
    console.log(`[Cron] Checking for tasks due within 24 hours...`);
    const now = new Date();
    const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const tasks = await Task.find({
      dueDate: { $gte: now, $lte: in24h },
      status: { $ne: 'completed' },
    });

    for (const task of tasks) {
      const existing = await Reminder.findOne({
        task: task._id,
        intern: task.assignedTo,
        message: { $regex: /due within 24 hours/i },
      });
      if (!existing) {
        await Reminder.create({
          task: task._id,
          intern: task.assignedTo,
          message: `Task "${task.title}" is due within 24 hours!`,
        });
      }
    }
    console.log(`[Cron] Created ${tasks.length} reminders.`);
  });

  // Daily at 9 AM: create routine tasks for all interns
  cron.schedule('0 9 * * *', async () => {
    console.log(`[Cron] Creating daily routine tasks...`);
    const interns = await Intern.find();
    const today = new Date();
    const dueDate = new Date(today);
    dueDate.setDate(dueDate.getDate() + 1);

    for (const intern of interns) {
      await Task.create({
        title: `Daily check-in: ${today.toDateString()}`,
        description: 'Complete your daily status report and tasks.',
        dueDate,
        priority: 'medium',
        assignedTo: intern._id,
      });
    }
    console.log(`[Cron] Created tasks for ${interns.length} interns.`);
  });

  // Daily at 6 PM: deadline alerts for overdue tasks
  cron.schedule('0 18 * * *', async () => {
    console.log(`[Cron] Checking for overdue tasks...`);
    const now = new Date();
    const tasks = await Task.find({
      dueDate: { $lt: now },
      status: { $ne: 'completed' },
    });

    for (const task of tasks) {
      const existing = await Reminder.findOne({
        task: task._id,
        intern: task.assignedTo,
        message: { $regex: /overdue/i },
      });
      if (!existing) {
        await Reminder.create({
          task: task._id,
          intern: task.assignedTo,
          message: `Task "${task.title}" is overdue!`,
        });
      }
    }
    console.log(`[Cron] Alerted ${tasks.length} overdue tasks.`);
  });

  console.log('[Cron] Reminder jobs registered.');
}

module.exports = { startReminderJobs };
