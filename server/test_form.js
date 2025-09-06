const fetch = require('node-fetch');

const testCases = [
  {
    name: "Your example",
    query: 'Myself Aarya, My email is abc@gmail.com and my contact info is 7834129871 and message is "You are looking good"'
  },
  {
    name: "Simple name and phone",
    query: 'Myself hemanth and contact number is 87091'
  },
  {
    name: "Name and email only",
    query: 'My name is John Smith, email john@example.com'
  },
  {
    name: "Phone only",
    query: 'My contact is +1-555-123-4567'
  },
  {
    name: "No contact info - should go to normal flow",
    query: 'I need plumbing services'
  }
];

async function testFormDetection() {
  console.log('🧪 Testing automatic form detection...\n');
  
  for (const testCase of testCases) {
    console.log(`📝 Test: ${testCase.name}`);
    console.log(`Query: "${testCase.query}"`);
    
    try {
      const response = await fetch('http://localhost:5001/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: testCase.query })
      });
      
      const result = await response.json();
      
      if (result.specialAction === 'fill_form') {
        console.log('✅ Auto-detected as form submission');
        console.log('📋 Extracted data:', result.formData);
        console.log('💬 Message:', result.message);
      } else {
        console.log('🔄 Normal service matching flow');
        console.log('🎯 Matched service:', result.internal?.match || 'None');
      }
      
    } catch (error) {
      console.error('❌ Error:', error.message);
    }
    
    console.log('---\n');
  }
}

testFormDetection();
