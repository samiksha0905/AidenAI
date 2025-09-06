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
    const serviceList = services.map(s => `- ${s.name} (${s.pageUrl})`).join('\n');
    const prompt = `
You are a routing assistant for a services web app.

Internal services:
${serviceList}

For any user query:
1. Identify the best matching internal service (if any).
2. Always provide external reference links (search-style links).
3. Return JSON strictly like this:
{
  "internal": { "match": "<service|null>", "route": "<path|null>" },
  "external": ["link1","link2"]
}

User query: "${query}"
`;

    try {
      // Use Gemini API to get response
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      );

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
      
      // Clean up the response to extract JSON
      let cleanText = text.trim();
      if (cleanText.includes('```json')) {
        cleanText = cleanText.split('```json')[1].split('```')[0].trim();
      } else if (cleanText.includes('```')) {
        cleanText = cleanText.split('```')[1].split('```')[0].trim();
      }
      
      try {
        const parsedResponse = JSON.parse(cleanText);
        res.json(parsedResponse);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        // Fallback response
        res.json({
          internal: { match: null, route: null },
          external: [
            `https://www.google.com/search?q=${encodeURIComponent(query)}`,
            `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(query)}`
          ]
        });
      }

    } catch (geminiError) {
      console.error('Gemini API error:', geminiError);
      
      // Fallback logic - simple keyword matching
      const lowerCaseQuery = query.toLowerCase();
      let matchedService = null;
      
      for (const service of services) {
        if (service.keywords.some(k => lowerCaseQuery.includes(k.toLowerCase()))) {
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
          `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(query)}`
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
