const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  pageUrl: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  icon: {
    type: String,
    default: '🔧'
  },
  color: {
    type: String,
    default: '#3B82F6'
  },
  keywords: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  subSections: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    sectionId: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    keywords: [{
      type: String,
      lowercase: true,
      trim: true
    }]
  }],
  featured: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 4.5,
    min: 0,
    max: 5
  },
  reviews: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for better search performance
ServiceSchema.index({ keywords: 1 });
ServiceSchema.index({ 'subSections.keywords': 1 });
ServiceSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Service', ServiceSchema);
