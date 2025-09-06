const mongoose = require('mongoose');

const contactFormSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return !v || /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
    }
  },
  phone: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || v.replace(/[^0-9]/g, '').length >= 3;
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  serviceInterest: {
    type: String,
    trim: true
  },
  originalQuery: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'resolved'],
    default: 'new'
  }
}, {
  timestamps: true
});

// Index for better query performance
contactFormSchema.index({ email: 1, phone: 1 });
contactFormSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('ContactForm', contactFormSchema);
