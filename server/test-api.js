// Simple API test script
const axios = require('axios');

const BASE_URL = `${process.env.REACT_APP_API_URL}/api`;

async function testAPI() {
  console.log('🧪 Testing API endpoints...\n');

  try {
    // Test user registration
    console.log('1. Testing user registration...');
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User'
    });
    
    console.log('✅ Registration successful:', registerResponse.data.message);
    const token = registerResponse.data.token;
    
    // Test user login
    console.log('\n2. Testing user login...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'test@example.com',
      password: 'password123'
    });
    
    console.log('✅ Login successful:', loginResponse.data.message);
    
    // Test profile retrieval
    console.log('\n3. Testing profile retrieval...');
    const profileResponse = await axios.get(`${BASE_URL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Profile retrieved:', profileResponse.data.user);
    
    console.log('\n🎉 All API tests passed!');
    
  } catch (error) {
    console.error('❌ API test failed:', error.response?.data || error.message);
  }
}

// Run tests
testAPI();
