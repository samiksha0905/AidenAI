const mockServices = [
  {
    _id: '1',
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
        _id: '1a',
        name: 'Leaky Faucet Repair',
        sectionId: '#faucets',
        description: 'Fix dripping faucets and water taps',
        keywords: ['faucet', 'drip', 'tap', 'dripping', 'water tap']
      },
      {
        _id: '1b',
        name: 'Toilet Installation & Repair',
        sectionId: '#toilets',
        description: 'Complete toilet services and installations',
        keywords: ['toilet', 'bathroom', 'flush', 'clogged', 'installation']
      },
      {
        _id: '1c',
        name: 'Pipe & Drain Services',
        sectionId: '#pipes',
        description: 'Pipe installation, repair, and drain cleaning',
        keywords: ['pipe', 'drain', 'clogged', 'blockage', 'sewer']
      }
    ]
  },
  {
    _id: '2',
    name: 'Tutoring Services',
    pageUrl: '/tutoring',
    description: 'Expert tutoring services for students of all ages. Math, Science, English, and more.',
    icon: '📚',
    color: '#059669',
    keywords: ['tutor', 'education', 'learning', 'study', 'homework', 'math', 'science', 'english', 'student', 'teaching','teach'],
    featured: true,
    rating: 4.9,
    reviews: 89,
    subSections: [
      {
        _id: '2a',
        name: 'Math Tutoring',
        sectionId: '#math',
        description: 'Algebra, Calculus, Geometry, and Statistics',
        keywords: ['math', 'algebra', 'calculus', 'geometry', 'statistics', 'numbers']
      },
      {
        _id: '2b',
        name: 'Science Tutoring',
        sectionId: '#science',
        description: 'Physics, Chemistry, Biology, and Earth Science',
        keywords: ['science', 'physics', 'chemistry', 'biology', 'lab', 'experiment']
      },
      {
        _id: '2c',
        name: 'Language Arts',
        sectionId: '#english',
        description: 'English, Writing, Literature, and Reading',
        keywords: ['english', 'writing', 'literature', 'reading', 'essay', 'grammar']
      }
    ]
  },
  {
    _id: '3',
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
        _id: '3a',
        name: 'Lawn Care & Maintenance',
        sectionId: '#lawn',
        description: 'Regular lawn mowing, fertilizing, and care',
        keywords: ['lawn', 'grass', 'mowing', 'fertilizer', 'maintenance']
      },
      {
        _id: '3b',
        name: 'Garden Design',
        sectionId: '#garden',
        description: 'Custom garden design and installation',
        keywords: ['garden', 'design', 'flower', 'plant', 'bed', 'landscaping']
      },
      {
        _id: '3c',
        name: 'Tree Services',
        sectionId: '#trees',
        description: 'Tree trimming, removal, and planting',
        keywords: ['tree', 'trimming', 'removal', 'pruning', 'branches']
      }
    ]
  },
  {
    _id: '4',
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
        _id: '4a',
        name: 'Regular House Cleaning',
        sectionId: '#regular',
        description: 'Weekly or monthly cleaning services',
        keywords: ['regular', 'weekly', 'monthly', 'maintenance', 'routine']
      },
      {
        _id: '4b',
        name: 'Deep Cleaning',
        sectionId: '#deep',
        description: 'Intensive deep cleaning service',
        keywords: ['deep', 'intensive', 'thorough', 'spring', 'detailed']
      },
      {
        _id: '4c',
        name: 'Move-in/Move-out Cleaning',
        sectionId: '#moving',
        description: 'Special cleaning for moving situations',
        keywords: ['move', 'moving', 'relocation', 'empty', 'new home']
      }
    ]
  },
  {
    _id: '5',
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
        _id: '5a',
        name: 'Outlet Installation',
        sectionId: '#outlets',
        description: 'New outlet installation and repair',
        keywords: ['outlet', 'socket', 'plug', 'power', 'electrical']
      },
      {
        _id: '5b',
        name: 'Lighting Installation',
        sectionId: '#lighting',
        description: 'Indoor and outdoor lighting solutions',
        keywords: ['lighting', 'light', 'fixture', 'lamp', 'chandelier', 'led']
      },
      {
        _id: '5c',
        name: 'Electrical Repairs',
        sectionId: '#repairs',
        description: 'Troubleshooting and electrical repairs',
        keywords: ['repair', 'fix', 'broken', 'troubleshoot', 'electrical problem']
      }
    ]
  },
  {
    _id: '6',
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
        _id: '6a',
        name: 'Air Conditioning',
        sectionId: '#ac',
        description: 'AC installation, repair, and maintenance',
        keywords: ['air conditioning', 'ac', 'cooling', 'cold', 'refrigeration']
      },
      {
        _id: '6b',
        name: 'Heating Systems',
        sectionId: '#heating',
        description: 'Furnace and heating system services',
        keywords: ['heating', 'furnace', 'warm', 'hot', 'boiler', 'radiator']
      },
      {
        _id: '6c',
        name: 'Ventilation',
        sectionId: '#ventilation',
        description: 'Air quality and ventilation services',
        keywords: ['ventilation', 'air quality', 'vent', 'duct', 'airflow']
      }
    ]
  }
];

module.exports = { mockServices };
