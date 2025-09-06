const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const ContactForm = require('../models/ContactForm');
const { mockServices } = require('../data/mockData');
// Note: fetch is globally available in Node.js 18+

// Check if MongoDB is available
const useMockData = !process.env.MONGO_URI || process.env.USE_MOCK_DATA === 'true';

// Get all services
router.get('/services', async (req, res) => {
  try {
    let services;
    if (useMockData) {
      services = mockServices.sort((a, b) => b.featured - a.featured || a.name.localeCompare(b.name));
    } else {
      services = await Service.find({}).sort({ featured: -1, name: 1 });
    }
    res.json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// Get single service by URL
router.get('/services/:url', async (req, res) => {
  try {
    let service;
    if (useMockData) {
      service = mockServices.find(s => s.pageUrl === `/${req.params.url}`);
    } else {
      service = await Service.findOne({ pageUrl: `/${req.params.url}` });
    }
    
    if (!service) {
      return res.status(404).json({
        success: false,
        error: 'Service not found'
      });
    }

    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// New chatbot endpoint with your specified format
router.post('/match', async (req, res) => {
  const { query } = req.body;
  
  if (!query || !query.trim()) {
    return res.status(400).json({
      internal: { match: null, route: null },
      external: []
    });
  }

  try {
    // FIRST: Use AI to extract form data from any query for perfect accuracy
    const extractFormDataWithAI = async (text) => {
      const prompt = `Extract contact information from this text and return ONLY a JSON object with the fields that are present. Do not include fields that are not mentioned.

Rules:
- name: Extract only the person's actual name (not descriptive words)
- email: Extract email addresses
- phone: Extract phone/contact numbers (any length)
- description: Extract any message, description, or additional text that's not name/email/phone

Text: "${text}"

Return only valid JSON with only the fields that exist in the text:`;

      // Check if API key exists
      if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'demo-key') {
        console.log('⚠️ No valid Gemini API key, using fallback extraction');
        return fallbackExtraction(text);
      }
      
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{
                parts: [{ text: prompt }]
              }],
              generationConfig: {
                temperature: 0.1,
                maxOutputTokens: 256,
              }
            })
          }
        );

        if (response.ok) {
          const data = await response.json();
          const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
          
          // Clean up the AI response to extract JSON
          let cleanText = aiText.trim();
          if (cleanText.includes('```json')) {
            cleanText = cleanText.split('```json')[1].split('```')[0].trim();
          } else if (cleanText.includes('```')) {
            cleanText = cleanText.split('```')[1].split('```')[0].trim();
          }
          
          try {
            const extractedData = JSON.parse(cleanText);
            console.log('🤖 AI extracted form data:', extractedData);
            return extractedData;
          } catch (parseError) {
            console.log('⚠️ AI JSON parse failed, using fallback extraction');
            return fallbackExtraction(text);
          }
        } else {
          console.log('⚠️ AI API failed, using fallback extraction');
          return fallbackExtraction(text);
        }
      } catch (error) {
        console.log('⚠️ AI extraction error, using fallback:', error.message);
        return fallbackExtraction(text);
      }
    };
    
    // Fallback extraction using improved patterns
    const fallbackExtraction = (text) => {
      const data = {};
      
      // Name extraction - improved patterns
      let nameMatch = text.match(/(?:my\s+name\s+is|myself|i\s+am)\s+([a-zA-Z]+)/i);
      if (nameMatch) {
        data.name = nameMatch[1];
      }
      
      // Email extraction - find any email
      const emailMatch = text.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i);
      if (emailMatch) {
        data.email = emailMatch[1];
      }
      
      // Phone extraction - improved patterns for comma-separated input
      let phoneMatch = text.match(/contact\s+is\s+([0-9]{3,15})/i);
      if (!phoneMatch) {
        phoneMatch = text.match(/(?:phone\s+is|number\s+is)\s*([0-9]{3,15})/i);
      }
      if (!phoneMatch) {
        phoneMatch = text.match(/contact\s+(?:number|info)\s+is\s+([0-9]{3,15})/i);
      }
      if (!phoneMatch) {
        // Look for patterns like "contact is 123" or just numbers after contact-related words
        const numbers = text.match(/(?:contact|phone|number)\s*[:=]?\s*([0-9]{3,15})/gi);
        if (numbers && numbers.length > 0) {
          const lastMatch = numbers[numbers.length - 1].match(/([0-9]{3,15})/);
          if (lastMatch) {
            phoneMatch = [null, lastMatch[1]];
          }
        }
      }
      if (phoneMatch && phoneMatch[1]) {
        data.phone = phoneMatch[1];
      }
      
      // Description extraction - improved patterns
      let descMatch = text.match(/description\s+is\s*["']([^"']+)["']/i);
      if (!descMatch) {
        descMatch = text.match(/message\s+is\s*["']([^"']+)["']/i);
      }
      if (!descMatch) {
        descMatch = text.match(/description\s+is\s+([^,]+)/i);
      }
      if (descMatch) {
        data.description = descMatch[1].trim();
      }
      
      console.log('🔍 Fallback extraction details:');
      console.log('- Name patterns tried on:', text);
      console.log('- Extracted data:', data);
      
      return data;
    };
    
    // Extract form data from the query FIRST using AI
    const formData = await extractFormDataWithAI(query);
    console.log('\ud83d\udcdd Extracted form data:', formData);
    
    // If we found any contact information, treat this as a form submission and return immediately
    if (Object.keys(formData).length > 0) {
      console.log('\ud83c\udf89 Auto-detected contact information, processing as form submission...');
      
      // Store form data in database if any data was extracted
      try {
        const contactFormEntry = new ContactForm({
          ...formData,
          originalQuery: query
        });
        await contactFormEntry.save();
        console.log('\ud83d\udcbe Form data saved to database with ID:', contactFormEntry._id);
      } catch (saveError) {
        console.error('\u274c Error saving form data:', saveError.message);
      }
      
      return res.json({
        internal: {
          match: null,
          route: null
        },
        external: [],
        specialAction: "fill_form",
        formData: formData,
        message: `Thank you${formData.name ? ', ' + formData.name : ''}! I've captured your information${Object.keys(formData).length > 0 ? ': ' + Object.keys(formData).join(', ') : ''}.`
      });
    }
    
    // If no form data was found, proceed with normal service matching
    let services;
    if (useMockData) {
      services = mockServices;
    } else {
      services = await Service.find({});
    }

    // Check for special navigation commands
    const lowerQuery = query.toLowerCase();
    
    // Home navigation commands
    if (lowerQuery.includes('home') || lowerQuery.includes('main page') || lowerQuery.includes('go back')) {
      return res.json({
        internal: {
          match: "Home Page",
          route: "/"
        },
        external: [],
        specialAction: "navigate_home"
      });
    }
    
    // Create the prompt for Gemini API
    const serviceList = services.map(s => `- ${s.name} (${s.pageUrl}) - Keywords: ${s.keywords.join(', ')}`).join('\n');
    const prompt = `You are a smart routing assistant for a services web application.

Available internal services:
${serviceList}

Special commands:
- If user asks to go "home" or "back" → match: "Home Page", route: "/"

For the user query "${query}", you need to:
1. Analyze if the query matches any of our internal services based on keywords
2. If there's a match, return the service name and route
3. Always provide 2-3 relevant external reference links
4. Respond ONLY with valid JSON in this exact format:

{
  "internal": {
    "match": "exact service name or null",
    "route": "exact route path or null"
  },
  "external": [
    "https://www.google.com/search?q=${encodeURIComponent(query)}",
    "https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(query)}"
  ],
  "askForm": true
}

Examples:
- Query "I need plumbing" → match: "Plumbing Services", route: "/plumbing", askForm: true
- Query "math help" → match: "Tutoring Services", route: "/tutoring", askForm: true
- Query "go home" → match: "Home Page", route: "/", askForm: false
- Query "random topic" → match: null, route: null, askForm: false

User query: "${query}"`;

    try {
      console.log('🤖 Calling Gemini API with query:', query);
      
      // Use Gemini API to get response
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: prompt }]
            }],
            generationConfig: {
              temperature: 0.1,
              maxOutputTokens: 1024,
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('🔍 Gemini API response:', JSON.stringify(data, null, 2));
      
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
      console.log('📝 Raw text response:', text);
      
      // Clean up the response to extract JSON
      let cleanText = text.trim();
      if (cleanText.includes('```json')) {
        cleanText = cleanText.split('```json')[1].split('```')[0].trim();
      } else if (cleanText.includes('```')) {
        cleanText = cleanText.split('```')[1].split('```')[0].trim();
      }
      
      console.log('🧹 Cleaned text:', cleanText);
      
      try {
        const parsedResponse = JSON.parse(cleanText);
        console.log('✅ Parsed response:', parsedResponse);
        res.json(parsedResponse);
      } catch (parseError) {
        console.error('❌ JSON parse error:', parseError);
        console.log('🔧 Using intelligent fallback...');
        
        // Intelligent fallback - try to match keywords manually
        const lowerQuery = query.toLowerCase();
        let matchedService = null;
        
        for (const service of services) {
          if (service.keywords.some(k => lowerQuery.includes(k.toLowerCase()))) {
            matchedService = service;
            break;
          }
        }
        
        res.json({
          internal: {
            match: matchedService ? matchedService.name : null,
            route: matchedService ? matchedService.pageUrl : null
          },
          external: [
            `https://www.google.com/search?q=${encodeURIComponent(query)}`,
            `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(query)}`,
            `https://www.bing.com/search?q=${encodeURIComponent(query)}`
          ]
        });
      }

    } catch (geminiError) {
      console.error('🚨 Gemini API error:', geminiError.message);
      console.log('🔄 Using intelligent fallback matching...');
      
      // Enhanced fallback logic - multiple matching strategies
      const lowerQuery = query.toLowerCase();
      let matchedService = null;
      let confidence = 0;
      
      for (const service of services) {
        let serviceConfidence = 0;
        
        // Check exact keyword matches
        const keywordMatches = service.keywords.filter(k => lowerQuery.includes(k.toLowerCase()));
        serviceConfidence += keywordMatches.length * 2;
        
        // Check service name similarity
        if (lowerQuery.includes(service.name.toLowerCase())) {
          serviceConfidence += 3;
        }
        
        // Check partial matches in service name
        const nameWords = service.name.toLowerCase().split(' ');
        nameWords.forEach(word => {
          if (lowerQuery.includes(word) && word.length > 3) {
            serviceConfidence += 1;
          }
        });
        
        if (serviceConfidence > confidence) {
          confidence = serviceConfidence;
          matchedService = service;
        }
      }
      
      console.log(`🎯 Match found: ${matchedService ? matchedService.name : 'None'} (confidence: ${confidence})`);
      
      res.json({
        internal: {
          match: matchedService ? matchedService.name : null,
          route: matchedService ? matchedService.pageUrl : null
        },
        external: [
          `https://www.google.com/search?q=${encodeURIComponent(query)}`,
          `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(query)}`,
          `https://www.bing.com/search?q=${encodeURIComponent(query)}`
        ]
      });
    }

  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({
      internal: { match: null, route: null },
      external: [
        `https://www.google.com/search?q=${encodeURIComponent(query)}`
      ]
    });
  }
});

// Route to handle direct form submissions
router.post('/contact-form', async (req, res) => {
  try {
    const { name, email, phone, description, serviceInterest, originalQuery } = req.body;
    
    // Only save fields that have values
    const formData = {};
    if (name && name.trim()) formData.name = name.trim();
    if (email && email.trim()) formData.email = email.trim();
    if (phone && phone.trim()) formData.phone = phone.trim();
    if (description && description.trim()) formData.description = description.trim();
    if (serviceInterest && serviceInterest.trim()) formData.serviceInterest = serviceInterest.trim();
    if (originalQuery && originalQuery.trim()) formData.originalQuery = originalQuery.trim();
    
    if (Object.keys(formData).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No valid form data provided'
      });
    }
    
    const contactForm = new ContactForm(formData);
    await contactForm.save();
    
    res.json({
      success: true,
      message: 'Contact information saved successfully!',
      data: {
        id: contactForm._id,
        fields: Object.keys(formData)
      }
    });
    
  } catch (error) {
    console.error('Contact form submission error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save contact information'
    });
  }
});

// Route to get all form submissions (for admin use)
router.get('/contact-forms', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    
    const query = status ? { status } : {};
    
    const forms = await ContactForm.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await ContactForm.countDocuments(query);
    
    res.json({
      success: true,
      data: forms,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('Error fetching contact forms:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch contact forms'
    });
  }
});

// Route to update form status
router.patch('/contact-forms/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['new', 'contacted', 'resolved'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be: new, contacted, or resolved'
      });
    }
    
    const form = await ContactForm.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!form) {
      return res.status(404).json({
        success: false,
        error: 'Form not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Status updated successfully',
      data: form
    });
    
  } catch (error) {
    console.error('Error updating form status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update form status'
    });
  }
});

// Keep the old chat endpoint for backward compatibility
router.post('/chat', async (req, res) => {
  const { query } = req.body;
  
  if (!query || !query.trim()) {
    return res.status(400).json({
      success: false,
      error: 'Query is required'
    });
  }

  try {
    let services;
    if (useMockData) {
      services = mockServices;
    } else {
      services = await Service.find({});
    }

    // Simple keyword matching for backward compatibility
    const lowerCaseQuery = query.toLowerCase();
    let matchedService = null;
    
    for (const service of services) {
      if (service.keywords.some(k => lowerCaseQuery.includes(k.toLowerCase()))) {
        matchedService = service;
        break;
      }
    }
    
    if (matchedService) {
      return res.json({
        success: true,
        data: {
          type: 'navigate',
          url: matchedService.pageUrl,
          message: `I'll take you to our ${matchedService.name} page. Let me navigate you there!`,
          service: matchedService.name
        }
      });
    } else {
      return res.json({
        success: true,
        data: {
          type: 'text',
          message: "I'd be happy to help! While I don't have specific information about that, you might want to search online or contact us directly for more assistance."
        }
      });
    }
    
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      success: false,
      error: 'Sorry, something went wrong with the chatbot. Please try again later.'
    });
  }
});

// Create a new service (for admin use)
router.post('/services', async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
