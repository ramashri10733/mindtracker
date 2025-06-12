const express = require('express');
const router = express.Router();
const Goal = require('../models/Goal');
const auth = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(auth);

// Get all goals for a user
router.get('/', async (req, res) => {
  try {
    console.log('Fetching goals for user:', req.user.id);
    const goals = await Goal.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    console.log(`Found ${goals.length} goals`);
    res.json(goals);
  } catch (error) {
    console.error('Error fetching goals:', error);
    res.status(500).json({ message: 'Error fetching goals' });
  }
});

// Create a new goal
router.post('/', async (req, res) => {
  try {
    console.log('Creating goal for user:', req.user.id);
    console.log('Goal data:', req.body);
    
    const { content } = req.body;
    
    if (!content || content.trim() === '') {
      console.log('Validation error: Empty goal content');
      return res.status(400).json({ message: 'Goal content is required' });
    }

    const goal = await Goal.create({
      user: req.user.id,
      content: content.trim()
    });

    console.log('Created goal:', goal);
    res.status(201).json(goal);
  } catch (error) {
    console.error('Error creating goal:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    if (error.name === 'MongoError' && error.code === 11000) {
      return res.status(400).json({ message: 'Duplicate goal content' });
    }
    res.status(500).json({ message: 'Error creating goal' });
  }
});

// Update goal completion status
router.put('/:id', async (req, res) => {
  try {
    console.log('Updating goal:', req.params.id);
    const goal = await Goal.findById(req.params.id);
    
    if (!goal) {
      console.log('Goal not found:', req.params.id);
      return res.status(404).json({ message: 'Goal not found' });
    }

    if (goal.user.toString() !== req.user.id) {
      console.log('Unauthorized access attempt:', req.user.id);
      return res.status(401).json({ message: 'Not authorized' });
    }

    goal.completed = !goal.completed;
    await goal.save();
    console.log('Updated goal:', goal);
    res.json(goal);
  } catch (error) {
    console.error('Error updating goal:', error);
    res.status(500).json({ message: 'Error updating goal' });
  }
});

// Delete a goal
router.delete('/:id', async (req, res) => {
  try {
    console.log('Deleting goal:', req.params.id);
    const goal = await Goal.findById(req.params.id);
    
    if (!goal) {
      console.log('Goal not found:', req.params.id);
      return res.status(404).json({ message: 'Goal not found' });
    }

    if (goal.user.toString() !== req.user.id) {
      console.log('Unauthorized delete attempt:', req.user.id);
      return res.status(401).json({ message: 'Not authorized' });
    }

    await goal.deleteOne();
    console.log('Deleted goal:', req.params.id);
    res.json({ message: 'Goal removed' });
  } catch (error) {
    console.error('Error deleting goal:', error);
    res.status(500).json({ message: 'Error deleting goal' });
  }
});

module.exports = router; 