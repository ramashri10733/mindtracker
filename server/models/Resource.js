const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  url: {
    type: String,
    required: [true, 'URL is required'],
    trim: true,
    validate: {
      validator: function(v) {
        return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(v);
      },
      message: props => `${props.value} is not a valid URL!`
    }
  },
  type: {
    type: String,
    required: [true, 'Type is required'],
    enum: {
      values: ['video', 'article', 'pdf', 'link', 'other'],
      message: '{VALUE} is not a valid type'
    }
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    maxlength: [100, 'Category cannot be more than 100 characters']
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Tag cannot be more than 50 characters']
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create indexes for better query performance
resourceSchema.index({ user: 1, createdAt: -1 });
resourceSchema.index({ user: 1, category: 1 });
resourceSchema.index({ user: 1, type: 1 });

// Pre-save middleware to trim strings
resourceSchema.pre('save', function(next) {
  if (this.title) this.title = this.title.trim();
  if (this.description) this.description = this.description.trim();
  if (this.url) this.url = this.url.trim();
  if (this.category) this.category = this.category.trim();
  if (this.tags) {
    this.tags = this.tags.map(tag => tag.trim());
  }
  next();
});

module.exports = mongoose.model('Resource', resourceSchema); 