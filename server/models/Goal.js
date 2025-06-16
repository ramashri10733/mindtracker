const mongoose = require('mongoose');

const timelineEventSchema = new mongoose.Schema({
  type: { type: String, required: true }, // e.g., 'created', 'updated', 'completed', 'deadline_changed'
  message: { type: String },
  date: { type: Date, default: Date.now }
}, { _id: false });

const goalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  deadline: {
    type: Date,
    required: [true, 'Deadline is required']
  },
  completed: {
    type: Boolean,
    default: false
  },
  timeline: {
    type: [timelineEventSchema],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Drop any existing indexes
goalSchema.pre('save', async function(next) {
  try {
    const collection = this.constructor.collection;
    await collection.dropIndexes();
    next();
  } catch (error) {
    next(error);
  }
});

// Create the correct indexes
goalSchema.index({ user: 1 });
goalSchema.index({ user: 1, title: 1 }, { unique: true });

// Add validation for title and description
goalSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.title = this.title.trim();
  }
  if (this.isModified('description')) {
    this.description = this.description.trim();
  }
  next();
});

module.exports = mongoose.model('Goal', goalSchema); 