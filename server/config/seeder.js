const mongoose = require('mongoose');
const Service = require('../models/Service');
require('dotenv').config();

const services = [
  {
    name: 'Plumbing Services',
    pageUrl: '/plumbing',
    description: 'Professional plumbing services for all your water, pipe, and drainage needs. 24/7 emergency service available.',
    icon: '🔧',
    color: '#1E40AF',
    keywords: ['plumber', 'pipe', 'leak', 'water', 'drain', 'toilet', 'faucet', 'sink', 'bathroom', 'kitchen'],
    featured: true,
    rating: 4.8,
    reviews: 127,
    subSections: [
      {
        name: 'Leaky Faucet Repair',
        sectionId: '#faucets',
        description: 'Fix dripping faucets and water taps',
        keywords: ['faucet', 'drip', 'tap', 'dripping', 'water tap']
      },
      {
        name: 'Toilet Installation & Repair',
        sectionId: '#toilets',
        description: 'Complete toilet services and installations',
        keywords: ['toilet', 'bathroom', 'flush', 'clogged', 'installation']
      },
      {
        name: 'Pipe & Drain Services',
        sectionId: '#pipes',
        description: 'Pipe installation, repair, and drain cleaning',
        keywords: ['pipe', 'drain', 'clogged', 'blockage', 'sewer']
      }
    ]
  },
  {
    name: 'Tutoring Services',
    pageUrl: '/tutoring',
    description: 'Expert tutoring services for students of all ages. Math, Science, English, and more.',
    icon: '📚',
    color: '#059669',
    keywords: ['tutor', 'education', 'learning', 'study', 'homework', 'math', 'science', 'english', 'student', 'teaching'],
    featured: true,
    rating: 4.9,
    reviews: 89,
    subSections: [
      {
        name: 'Math Tutoring',
        sectionId: '#math',
        description: 'Algebra, Calculus, Geometry, and Statistics',
        keywords: ['math', 'algebra', 'calculus', 'geometry', 'statistics', 'numbers']
      },
      {
        name: 'Science Tutoring',
        sectionId: '#science',
        description: 'Physics, Chemistry, Biology, and Earth Science',
        keywords: ['science', 'physics', 'chemistry', 'biology', 'lab', 'experiment']
      },
      {
        name: 'Language Arts',
        sectionId: '#english',
        description: 'English, Writing, Literature, and Reading',
        keywords: ['english', 'writing', 'literature', 'reading', 'essay', 'grammar']
      }
    ]
  },
  {
    name: 'Landscaping Services',
    pageUrl: '/landscaping',
    description: 'Transform your outdoor space with professional landscaping and garden design services.',
    icon: '🌿',
    color: '#16A34A',
    keywords: ['landscaping', 'garden', 'lawn', 'grass', 'tree', 'plant', 'outdoor', 'yard', 'hedge', 'flower'],
    featured: false,
    rating: 4.7,
    reviews: 156,
    subSections: [
      {
        name: 'Lawn Care & Maintenance',
        sectionId: '#lawn',
        description: 'Regular lawn mowing, fertilizing, and care',
        keywords: ['lawn', 'grass', 'mowing', 'fertilizer', 'maintenance']
      },
      {
        name: 'Garden Design',
        sectionId: '#garden',
        description: 'Custom garden design and installation',
        keywords: ['garden', 'design', 'flower', 'plant', 'bed', 'landscaping']
      },
      {
        name: 'Tree Services',
        sectionId: '#trees',
        description: 'Tree trimming, removal, and planting',
        keywords: ['tree', 'trimming', 'removal', 'pruning', 'branches']
      }
    ]
  },
  {
    name: 'House Cleaning',
    pageUrl: '/cleaning',
    description: 'Reliable and thorough house cleaning services. Regular or one-time cleaning available.',
    icon: '🧽',
    color: '#DC2626',
    keywords: ['cleaning', 'house', 'maid', 'vacuum', 'dust', 'kitchen', 'bathroom', 'floor', 'window', 'deep clean'],
    featured: false,
    rating: 4.6,
    reviews: 203,
    subSections: [
      {
        name: 'Regular House Cleaning',
        sectionId: '#regular',
        description: 'Weekly or monthly cleaning services',
        keywords: ['regular', 'weekly', 'monthly', 'maintenance', 'routine']
      },
      {
        name: 'Deep Cleaning',
        sectionId: '#deep',
        description: 'Intensive deep cleaning service',
        keywords: ['deep', 'intensive', 'thorough', 'spring', 'detailed']
      },
      {
        name: 'Move-in/Move-out Cleaning',
        sectionId: '#moving',
        description: 'Special cleaning for moving situations',
        keywords: ['move', 'moving', 'relocation', 'empty', 'new home']
      }
    ]
  },
  {
    name: 'Electrical Services',
    pageUrl: '/electrical',
    description: 'Licensed electricians for all electrical installations, repairs, and maintenance needs.',
    icon: '⚡',
    color: '#EA580C',
    keywords: ['electrician', 'electrical', 'wiring', 'outlet', 'switch', 'light', 'power', 'circuit', 'installation'],
    featured: true,
    rating: 4.8,
    reviews: 94,
    subSections: [
      {
        name: 'Outlet Installation',
        sectionId: '#outlets',
        description: 'New outlet installation and repair',
        keywords: ['outlet', 'socket', 'plug', 'power', 'electrical']
      },
      {
        name: 'Lighting Installation',
        sectionId: '#lighting',
        description: 'Indoor and outdoor lighting solutions',
        keywords: ['lighting', 'light', 'fixture', 'lamp', 'chandelier', 'led']
      },
      {
        name: 'Electrical Repairs',
        sectionId: '#repairs',
        description: 'Troubleshooting and electrical repairs',
        keywords: ['repair', 'fix', 'broken', 'troubleshoot', 'electrical problem']
      }
    ]
  },
  {
    name: 'HVAC Services',
    pageUrl: '/hvac',
    description: 'Heating, ventilation, and air conditioning services. Installation, repair, and maintenance.',
    icon: '🌡️',
    color: '#7C3AED',
    keywords: ['hvac', 'heating', 'cooling', 'air conditioning', 'furnace', 'ac', 'temperature', 'ventilation'],
    featured: false,
    rating: 4.5,
    reviews: 78,
    subSections: [
      {
        name: 'Air Conditioning',
        sectionId: '#ac',
        description: 'AC installation, repair, and maintenance',
        keywords: ['air conditioning', 'ac', 'cooling', 'cold', 'refrigeration']
      },
      {
        name: 'Heating Systems',
        sectionId: '#heating',
        description: 'Furnace and heating system services',
        keywords: ['heating', 'furnace', 'warm', 'hot', 'boiler', 'radiator']
      },
      {
        name: 'Ventilation',
        sectionId: '#ventilation',
        description: 'Air quality and ventilation services',
        keywords: ['ventilation', 'air quality', 'vent', 'duct', 'airflow']
      }
    ]
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing services
    await Service.deleteMany({});
    console.log('Cleared existing services');

    // Insert new services
    await Service.insertMany(services);
    console.log('Sample services inserted successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
