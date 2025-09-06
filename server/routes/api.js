const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { mockServices } = require('../data/mockData');
const fetch = require('node-fetch');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'demo-key');

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
    let services;
    if (useMockData) {
      services = mockServices;
    } else {
      services = await Service.find({});
    }

    // Create the prompt for Gemini API
    const serviceList = services.map(s => `- ${s.name} (${s.pageUrl}) - Keywords: ${s.keywords.join(', ')}`).join('\n');
    const prompt = `You are a smart routing assistant for a services web application.

Available internal services:
${serviceList}

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
  ]
}

Examples:
- Query "I need plumbing" → match: "Plumbing Services", route: "/plumbing"
- Query "math help" → match: "Tutoring Services", route: "/tutoring"
- Query "random topic" → match: null, route: null

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
