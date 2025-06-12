const express = require('express');
const router = express.Router();
const Reflection = require('../models/Reflection');
const auth = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(auth);

// Get all reflections for a user
router.get('/', async (req, res) => {
  try {
    const reflections = await Reflection.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    res.json(reflections);
  } catch (error) {
    console.error('Error fetching reflections:', error);
    res.status(500).json({ message: 'Error fetching reflections' });
  }
});

// Create a new reflection
router.post('/', async (req, res) => {
  try {
    console.log('Received reflection data:', req.body);
    console.log('User ID:', req.user.id);

    const { mood, gratitude, challenges, lessons, goals } = req.body;
    
    // Validate required fields
    if (!mood || !gratitude || !challenges || !lessons || !goals) {
      return res.status(400).json({ 
        message: 'All fields are required',
        missingFields: {
          mood: !mood,
          gratitude: !gratitude,
          challenges: !challenges,
          lessons: !lessons,
          goals: !goals
        }
      });
    }

    // Validate mood enum
    const validMoods = ['great', 'good', 'neutral', 'bad', 'terrible'];
    if (!validMoods.includes(mood)) {
      return res.status(400).json({ 
        message: 'Invalid mood value',
        validMoods
      });
    }

    const reflection = await Reflection.create({
      user: req.user.id,
      mood,
      gratitude,
      challenges,
      lessons,
      goals
    });

    console.log('Created reflection:', reflection);
    res.status(201).json(reflection);
  } catch (error) {
    console.error('Error creating reflection:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({ 
      message: 'Error creating reflection',
      error: error.message 
    });
  }
});

// Get reflection by date
router.get('/date/:date', async (req, res) => {
  try {
    const date = new Date(req.params.date);
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    const reflection = await Reflection.findOne({
      user: req.user.id,
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    });

    if (!reflection) {
      return res.status(404).json({ message: 'No reflection found for this date' });
    }

    res.json(reflection);
  } catch (error) {
    console.error('Error fetching reflection by date:', error);
    res.status(500).json({ message: 'Error fetching reflection' });
  }
});

// Delete a reflection
router.delete('/:id', async (req, res) => {
  try {
    const reflection = await Reflection.findById(req.params.id);
    if (!reflection) {
      return res.status(404).json({ message: 'Reflection not found' });
    }

    if (reflection.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await reflection.deleteOne();
    res.json({ message: 'Reflection removed' });
  } catch (error) {
    console.error('Error deleting reflection:', error);
    res.status(500).json({ message: 'Error deleting reflection' });
  }
});

module.exports = router; 