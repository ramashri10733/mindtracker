const mongoose = require('mongoose');

const reflectionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mood: {
    type: String,
    required: [true, 'Please provide your mood'],
    enum: ['great', 'good', 'neutral', 'bad', 'terrible']
  },
  gratitude: {
    type: String,
    required: [true, 'Please provide what you are grateful for']
  },
  challenges: {
    type: String,
    required: [true, 'Please provide challenges faced']
  },
  lessons: {
    type: String,
    required: [true, 'Please provide what you learned']
  },
  goals: {
    type: String,
    required: [true, 'Please provide your goals']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Reflection', reflectionSchema); 