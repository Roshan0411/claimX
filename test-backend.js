const axios = require('axios');

const BACKEND_URL = 'http://localhost:5000';

async function testBackend() {
  console.log('Testing backend PDF generation...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${BACKEND_URL}/health`);
    console.log('✅ Health check:', healthResponse.data);
    console.log('');

    // Test receipt generation
    console.log('2. Testing receipt generation...');
    const receiptResponse = await axios.post(
      `${BACKEND_URL}/api/reports/receipt/test123`,
      { userAccount: '0x123456789abcdef' },
      { headers: { 'Content-Type': 'application/json' } }
    );
    
    console.log('✅ Receipt generated successfully');
    console.log('Response type:', typeof receiptResponse.data);
    console.log('Content length:', receiptResponse.data.length);
    console.log('First 100 characters:', receiptResponse.data.substring(0, 100));
    console.log('');

    // Test PDF export
    console.log('3. Testing PDF export...');
    const pdfResponse = await axios.post(
      `${BACKEND_URL}/api/reports/export/pdf`,
      { userAccount: '0x123456789abcdef', filter: 'all' },
      { headers: { 'Content-Type': 'application/json' } }
    );
    
    console.log('✅ PDF export generated successfully');
    console.log('Response type:', typeof pdfResponse.data);
    console.log('Content length:', pdfResponse.data.length);
    console.log('First 100 characters:', pdfResponse.data.substring(0, 100));
    console.log('');

    // Test CSV export
    console.log('4. Testing CSV export...');
    const csvResponse = await axios.post(
      `${BACKEND_URL}/api/reports/export/csv`,
      { userAccount: '0x123456789abcdef', filter: 'all' },
      { headers: { 'Content-Type': 'application/json' } }
    );
    
    console.log('✅ CSV export generated successfully');
    console.log('Response type:', typeof csvResponse.data);
    console.log('Content length:', csvResponse.data.length);
    console.log('First 200 characters:', csvResponse.data.substring(0, 200));
    console.log('');

    console.log('🎉 All backend tests passed!');

  } catch (error) {
    console.error('❌ Backend test failed:', error.response?.data || error.message);
    if (error.response?.status) {
      console.error('Status:', error.response.status);
    }
  }
}

testBackend();