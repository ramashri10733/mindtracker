const cron = require('node-cron');
const Notification = require('../models/Notification');
const Goal = require('../models/Goal');

// Run every hour
cron.schedule('0 * * * *', async () => {
  const now = new Date();
  const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const in1h = new Date(now.getTime() + 1 * 60 * 60 * 1000);

  // Find goals due in the next 24 hours that are not completed
  const upcomingGoals = await Goal.find({
    completed: false,
    deadline: { $gte: now, $lte: in24h }
  });

  for (const goal of upcomingGoals) {
    const hoursLeft = (goal.deadline - now) / (1000 * 60 * 60);
    let message = '';
    if (hoursLeft <= 1) {
      message = `Your goal "${goal.title}" is due in less than 1 hour!`;
    } else {
      message = `Reminder: Your goal "${goal.title}" is due in less than 24 hours.`;
    }

    // Avoid duplicate notifications for the same goal and user within 24h
    const alreadyNotified = await Notification.findOne({
      user: goal.user,
      relatedGoal: goal._id,
      type: 'goal_reminder',
      createdAt: { $gte: new Date(now.getTime() - 23 * 60 * 60 * 1000) }
    });
    if (!alreadyNotified) {
      await Notification.create({
        user: goal.user,
        message,
        type: 'goal_reminder',
        relatedGoal: goal._id
      });
    }
  }
});

// Function to create a notification
async function createNotification({ user, message, type = 'system', relatedGoal }) {
  return Notification.create({ user, message, type, relatedGoal });
}

// Function to get unread notifications for a user
async function getUnreadNotifications(userId) {
  return Notification.find({ user: userId, read: false }).sort({ createdAt: -1 });
}

// Function to mark a notification as read
async function markNotificationAsRead(notificationId) {
  return Notification.findByIdAndUpdate(notificationId, { read: true }, { new: true });
}

module.exports = {
  createNotification,
  getUnreadNotifications,
  markNotificationAsRead
}; 