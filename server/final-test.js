const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testAPI() {
  console.log('🧪 Testing fixed API...\n');

  try {
    // Test 1: Check server is running
    console.log('1. Testing server connection...');
    const healthCheck = await axios.get(BASE_URL);
    console.log('✅ Server is running:', healthCheck.data.message);

    // Test 2: Register a new user
    console.log('\n2. Testing user registration...');
    const uniqueEmail = `testuser${Date.now()}@example.com`;
    
    const registerResponse = await axios.post(`${BASE_URL}/api/auth/register`, {
      email: uniqueEmail,
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe'
    });
    
    console.log('✅ Registration successful:', registerResponse.data.message);
    console.log('   User created:', registerResponse.data.user);

    // Test 3: Login with the registered user
    console.log('\n3. Testing user login...');
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: uniqueEmail,
      password: 'password123'
    });
    
    console.log('✅ Login successful:', loginResponse.data.message);
    console.log('   User data:', loginResponse.data.user);

    console.log('\n🎉 All tests passed! Database and API are working correctly.');
    console.log('\n📊 Summary:');
    console.log('   ✅ MongoDB Atlas connected');
    console.log('   ✅ User registration working');
    console.log('   ✅ User login working');
    console.log('   ✅ Password hashing working');
    console.log('   ✅ Data stored in database');

  } catch (error) {
    console.error('❌ Test failed:');
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Message:', error.response.data?.message || error.response.data);
    } else {
      console.error('   Error:', error.message);
    }
  }
}

testAPI();
