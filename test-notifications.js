import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
let token = '';

async function login() {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@edutracker.com',
      password: 'admin123'
    });
    token = response.data.data.accessToken;
    console.log('✅ Logged in successfully');
  } catch (error) {
    console.error('❌ Login failed. Make sure the backend is running and seeded.');
    process.exit(1);
  }
}

async function testNotifications() {
  await login();
  
  const headers = { Authorization: `Bearer ${token}` };

  console.log('\n--- 1. Triggering a notification via Marks Lock ---');
  // We'll call an endpoint that triggers a notification
  // Based on controllers/marks.controller.ts: lockMarks
  try {
    await axios.post(`${API_URL}/marks/lock`, {
      className: 'Class 10',
      subject: 'Mathematics',
      examType: 'Final'
    }, { headers });
    console.log('✅ Marks locked (Notification should be triggered)');
  } catch (error) {
    console.error('❌ Failed to trigger notification:', error.response?.data?.message || error.message);
  }

  console.log('\n--- 2. Fetching Notifications ---');
  try {
    const response = await axios.get(`${API_URL}/notifications`, { headers });
    const notifications = response.data.data;
    console.log(`✅ Fetched ${notifications.length} notifications`);
    if (notifications.length > 0) {
      const latest = notifications[0];
      console.log(`   Latest: [${latest.type}] ${latest.title}: ${latest.message}`);
      
      console.log('\n--- 3. Marking Latest as Read ---');
      await axios.put(`${API_URL}/notifications/${latest.id}/read`, {}, { headers });
      console.log(`✅ Notification ${latest.id} marked as read`);
    }
  } catch (error) {
    console.error('❌ Notification fetch/update failed:', error.response?.data?.message || error.message);
  }
}

testNotifications();
