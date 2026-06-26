const axios = require('axios');

const BASE_URL = 'REACT_APP_API_URL/api';

async function testEndpoints() {
  console.log('🧪 Testing API endpoints...\n');

  try {
    // Test 1: Register a new user
    console.log('1. Testing user registration...');
    const registerData = {
      email: `test${Date.now()}@example.com`, // Unique email
      password: 'password123',
      firstName: 'Test',
      lastName: 'User'
    };

    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, registerData);
    console.log('✅ Registration successful');
    console.log('User created:', registerResponse.data.user);
    
    const token = registerResponse.data.token;
    console.log('Token received:', token ? 'Yes' : 'No');

    // Test 2: Login with the same user
    console.log('\n2. Testing user login...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: registerData.email,
      password: registerData.password
    });
    
    console.log('✅ Login successful');
    console.log('User logged in:', loginResponse.data.user.email);

    // Test 3: Get user profile
    console.log('\n3. Testing profile retrieval...');
    const profileResponse = await axios.get(`${BASE_URL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Profile retrieved');
    console.log('Profile data:', profileResponse.data.user);

    console.log('\n🎉 All API tests passed! Database is working correctly.');
    
  } catch (error) {
    console.error('❌ API test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testEndpoints();
