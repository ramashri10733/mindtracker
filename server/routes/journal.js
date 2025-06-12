const express = require('express');
const router = express.Router();
const Journal = require('../models/Journal');
const auth = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(auth);

// Get all journal entries for a user
router.get('/', async (req, res) => {
  try {
    console.log('Fetching journal entries for user:', req.user.id);
    const entries = await Journal.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    console.log(`Found ${entries.length} entries`);
    res.json(entries);
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    res.status(500).json({ message: 'Error fetching journal entries' });
  }
});

// Create a new journal entry
router.post('/', async (req, res) => {
  try {
    console.log('Creating journal entry for user:', req.user.id);
    console.log('Entry data:', req.body);

    const { content } = req.body;
    
    if (!content || content.trim() === '') {
      console.log('Validation error: Empty journal content');
      return res.status(400).json({ message: 'Journal content is required' });
    }

    const entry = await Journal.create({
      user: req.user.id,
      content: content.trim()
    });

    console.log('Created journal entry:', entry);
    res.status(201).json(entry);
  } catch (error) {
    console.error('Error creating journal entry:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({ message: 'Error creating journal entry' });
  }
});

// Delete a journal entry
router.delete('/:id', async (req, res) => {
  try {
    console.log('Deleting journal entry:', req.params.id);
    const entry = await Journal.findById(req.params.id);
    
    if (!entry) {
      console.log('Entry not found:', req.params.id);
      return res.status(404).json({ message: 'Entry not found' });
    }

    if (entry.user.toString() !== req.user.id) {
      console.log('Unauthorized delete attempt:', req.user.id);
      return res.status(401).json({ message: 'Not authorized' });
    }

    await entry.deleteOne();
    console.log('Deleted journal entry:', req.params.id);
    res.json({ message: 'Entry removed' });
  } catch (error) {
    console.error('Error deleting journal entry:', error);
    res.status(500).json({ message: 'Error deleting journal entry' });
  }
});

module.exports = router; 