const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');
const auth = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(auth);

// Get all resources for the user
router.get('/', async (req, res) => {
  try {
    console.log('Fetching resources for user:', req.user.id);
    const resources = await Resource.find({ user: req.user.id }).sort({ createdAt: -1 });
    console.log(`Found ${resources.length} resources`);
    res.json(resources);
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({ message: 'Error fetching resources' });
  }
});

// Create a new resource
router.post('/', async (req, res) => {
  try {
    console.log('Creating new resource. User:', req.user.id);
    console.log('Request body:', req.body);

    const { title, description, url, type, category, tags } = req.body;

    // Validate required fields
    if (!title || !url || !type || !category) {
      console.log('Missing required fields:', { title, url, type, category });
      return res.status(400).json({ 
        message: 'Please provide all required fields: title, url, type, and category' 
      });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch (err) {
      console.log('Invalid URL format:', url);
      return res.status(400).json({ message: 'Please provide a valid URL' });
    }

    // Validate type
    const validTypes = ['video', 'article', 'pdf', 'link', 'other'];
    if (!validTypes.includes(type)) {
      console.log('Invalid resource type:', type);
      return res.status(400).json({ 
        message: `Invalid resource type. Must be one of: ${validTypes.join(', ')}` 
      });
    }

    // Create new resource with simplified tag handling
    const resource = new Resource({
      user: req.user.id,
      title: title.trim(),
      description: description ? description.trim() : '',
      url: url.trim(),
      type,
      category: category.trim(),
      tags: [] // Initialize with empty array
    });

    // Add tags if provided
    if (tags) {
      if (typeof tags === 'string') {
        resource.tags = tags.split(',').map(tag => tag.trim()).filter(Boolean);
      } else if (Array.isArray(tags)) {
        resource.tags = tags.map(tag => tag.trim()).filter(Boolean);
      }
    }

    console.log('Attempting to save resource:', resource);

    // Save resource
    const savedResource = await resource.save();
    console.log('Resource created successfully:', savedResource._id);
    res.status(201).json(savedResource);
  } catch (error) {
    console.error('Error creating resource:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      console.log('Validation errors:', messages);
      return res.status(400).json({ 
        message: 'Validation error',
        errors: messages
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      console.log('Duplicate resource error:', error);
      return res.status(400).json({ 
        message: 'A resource with this title already exists' 
      });
    }

    // Handle other errors
    console.error('Unexpected error:', error);
    res.status(500).json({ 
      message: 'Error creating resource',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Update a resource
router.put('/:id', async (req, res) => {
  try {
    console.log('Updating resource:', req.params.id);
    const resource = await Resource.findById(req.params.id);
    
    if (!resource) {
      console.log('Resource not found');
      return res.status(404).json({ message: 'Resource not found' });
    }

    if (resource.user.toString() !== req.user.id) {
      console.log('Unauthorized update attempt');
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { title, description, url, type, category, tags } = req.body;
    const updates = {};

    if (title) updates.title = title.trim();
    if (description !== undefined) updates.description = description.trim();
    if (url) updates.url = url.trim();
    if (type) updates.type = type;
    if (category) updates.category = category.trim();
    
    // Handle tags update
    if (tags !== undefined) {
      if (typeof tags === 'string') {
        updates.tags = tags.split(',').map(tag => tag.trim()).filter(Boolean);
      } else if (Array.isArray(tags)) {
        updates.tags = tags.map(tag => tag.trim()).filter(Boolean);
      }
    }

    const updatedResource = await Resource.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    console.log('Resource updated successfully');
    res.json(updatedResource);
  } catch (error) {
    console.error('Error updating resource:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Validation error',
        errors: messages
      });
    }

    res.status(500).json({ message: 'Error updating resource' });
  }
});

// Delete a resource
router.delete('/:id', async (req, res) => {
  try {
    console.log('Deleting resource:', req.params.id);
    const resource = await Resource.findById(req.params.id);
    
    if (!resource) {
      console.log('Resource not found');
      return res.status(404).json({ message: 'Resource not found' });
    }

    if (resource.user.toString() !== req.user.id) {
      console.log('Unauthorized delete attempt');
      return res.status(401).json({ message: 'Not authorized' });
    }

    await resource.deleteOne();
    console.log('Resource deleted successfully');
    res.json({ message: 'Resource removed' });
  } catch (error) {
    console.error('Error deleting resource:', error);
    res.status(500).json({ message: 'Error deleting resource' });
  }
});

// Get resources by category
router.get('/category/:category', async (req, res) => {
  try {
    console.log('Fetching resources by category:', req.params.category);
    const resources = await Resource.find({
      user: req.user.id,
      category: req.params.category
    }).sort({ createdAt: -1 });
    
    console.log(`Found ${resources.length} resources in category ${req.params.category}`);
    res.json(resources);
  } catch (error) {
    console.error('Error fetching resources by category:', error);
    res.status(500).json({ message: 'Error fetching resources' });
  }
});

// Get resources by type
router.get('/type/:type', async (req, res) => {
  try {
    console.log('Fetching resources by type:', req.params.type);
    const resources = await Resource.find({
      user: req.user.id,
      type: req.params.type
    }).sort({ createdAt: -1 });
    
    console.log(`Found ${resources.length} resources of type ${req.params.type}`);
    res.json(resources);
  } catch (error) {
    console.error('Error fetching resources by type:', error);
    res.status(500).json({ message: 'Error fetching resources' });
  }
});

module.exports = router; 