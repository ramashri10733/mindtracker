const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  content: {
    type: String,
    required: [true, 'Please provide goal content'],
    trim: true,
    minlength: [1, 'Goal content cannot be empty'],
    maxlength: [500, 'Goal content cannot exceed 500 characters']
  },
  completed: {
    type: Boolean,
    default: false
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

// Create compound index for user and content to prevent duplicates
goalSchema.index({ user: 1, content: 1 }, { unique: true });

// Add validation for content
goalSchema.pre('save', function(next) {
  if (this.isModified('content')) {
    this.content = this.content.trim();
  }
  next();
});

module.exports = mongoose.model('Goal', goalSchema); 