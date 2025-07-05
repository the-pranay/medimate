// Test Messaging System End-to-End
const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// Test data
const patientData = {
  name: 'John MessageTest',
  email: 'message.test@patient.com',
  password: 'password123',
  phone: '5555555555',
  role: 'patient',
  age: 30,
  gender: 'male',
  address: '123 Message Test Street',
  bloodGroup: 'O+'
};

const doctorData = {
  name: 'Dr. MessageTest',
  email: 'message.test@doctor.com',
  password: 'password123',
  phone: '9876543210',
  role: 'doctor',
  age: 40,
  gender: 'female',
  address: '456 Medical Center',
  specialization: 'General Medicine',
  experience: 8,
  licenseNumber: 'LIC123456'
};

let patientToken = '';
let doctorToken = '';
let patientId = '';
let doctorId = '';

async function registerUser(userData, userType) {
  try {
    console.log(`\n📝 Registering ${userType}...`);
    
    const response = await axios.post(`${BASE_URL}/api/auth/register`, userData);
    
    if (response.data.success) {
      console.log(`✅ ${userType} registration successful`);
      console.log(`   User ID: ${response.data.data.user._id}`);
      console.log(`   Token: ${response.data.data.token.substring(0, 20)}...`);
      return {
        token: response.data.data.token,
        userId: response.data.data.user._id
      };
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error(`❌ ${userType} registration failed:`, error.response?.data?.message || error.message);
    throw error;
  }
}

async function testCreateConversation(token, participantId, userType) {
  try {
    console.log(`\n💬 Creating conversation from ${userType} to ${participantId}...`);
    
    const response = await axios.post(`${BASE_URL}/api/messages/conversations`, {
      participantId: participantId,
      initialMessage: `Hello from ${userType}! This is a test message.`
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.data.success) {
      console.log(`✅ Conversation created successfully from ${userType}`);
      console.log(`   Conversation ID: ${response.data.data._id}`);
      return response.data.data;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error(`❌ Conversation creation failed for ${userType}:`, error.response?.data?.message || error.message);
    throw error;
  }
}

async function testSendMessage(token, conversationId, message, userType) {
  try {
    console.log(`\n📤 Sending message from ${userType}...`);
    
    const response = await axios.post(`${BASE_URL}/api/messages/send`, {
      conversationId: conversationId,
      message: message,
      sender: userType.toLowerCase()
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.data.success) {
      console.log(`✅ Message sent successfully from ${userType}`);
      console.log(`   Message: "${message}"`);
      return response.data.data;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error(`❌ Message sending failed for ${userType}:`, error.response?.data?.message || error.message);
    throw error;
  }
}

async function testGetConversations(token, userType) {
  try {
    console.log(`\n📥 Getting conversations for ${userType}...`);
    
    const response = await axios.get(`${BASE_URL}/api/messages/conversations`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.data.success) {
      console.log(`✅ Conversations retrieved successfully for ${userType}`);
      console.log(`   Total conversations: ${response.data.data.length}`);
      
      response.data.data.forEach((conversation, index) => {
        console.log(`   Conversation ${index + 1}:`);
        console.log(`     ID: ${conversation._id}`);
        console.log(`     Participants: ${conversation.participants.length}`);
        console.log(`     Messages: ${conversation.messages ? conversation.messages.length : 0}`);
        console.log(`     Last message: ${conversation.lastMessage ? conversation.lastMessage.content : 'No messages'}`);
      });
      
      return response.data.data;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error(`❌ Get conversations failed for ${userType}:`, error.response?.data?.message || error.message);
    throw error;
  }
}

async function testGetConversationMessages(token, conversationId, userType) {
  try {
    console.log(`\n📋 Getting messages for conversation ${conversationId} from ${userType}...`);
    
    const response = await axios.get(`${BASE_URL}/api/messages/conversations/${conversationId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.data.success) {
      console.log(`✅ Messages retrieved successfully for ${userType}`);
      console.log(`   Total messages: ${response.data.data.length}`);
      
      response.data.data.forEach((message, index) => {
        console.log(`   Message ${index + 1}:`);
        console.log(`     Content: "${message.text}"`);
        console.log(`     Sender: ${message.senderName}`);
        console.log(`     Time: ${message.timestamp}`);
        console.log(`     Read: ${message.read}`);
      });
      
      return response.data.data;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error(`❌ Get messages failed for ${userType}:`, error.response?.data?.message || error.message);
    throw error;
  }
}

async function runMessagingTests() {
  console.log('🧪 TESTING MESSAGING SYSTEM');
  console.log('============================');
  
  try {
    // Test 1: Patient Registration
    console.log('\n📋 PHASE 1: USER REGISTRATION');
    const patientResult = await registerUser(patientData, 'Patient');
    patientToken = patientResult.token;
    patientId = patientResult.userId;
    
    // Test 2: Doctor Registration
    const doctorResult = await registerUser(doctorData, 'Doctor');
    doctorToken = doctorResult.token;
    doctorId = doctorResult.userId;
    
    // Test 3: Patient creates conversation with doctor
    console.log('\n📋 PHASE 2: CONVERSATION CREATION');
    const conversation = await testCreateConversation(patientToken, doctorId, 'Patient');
    const conversationId = conversation._id;
    
    // Test 4: Patient sends message
    console.log('\n📋 PHASE 3: MESSAGE SENDING');
    await testSendMessage(patientToken, conversationId, 'Hello Doctor! I need help with my symptoms.', 'Patient');
    
    // Test 5: Doctor sends reply
    await testSendMessage(doctorToken, conversationId, 'Hello! I can help you. What symptoms are you experiencing?', 'Doctor');
    
    // Test 6: Patient sends another message
    await testSendMessage(patientToken, conversationId, 'I have been experiencing headaches and fatigue for the past week.', 'Patient');
    
    // Test 7: Doctor sends another reply
    await testSendMessage(doctorToken, conversationId, 'I understand. Have you been getting enough sleep? Any recent stress?', 'Doctor');
    
    // Test 8: Patient gets conversations
    console.log('\n📋 PHASE 4: CONVERSATION RETRIEVAL');
    const patientConversations = await testGetConversations(patientToken, 'Patient');
    
    // Test 9: Doctor gets conversations
    const doctorConversations = await testGetConversations(doctorToken, 'Doctor');
    
    // Test 10: Get conversation messages
    console.log('\n📋 PHASE 5: MESSAGE RETRIEVAL');
    await testGetConversationMessages(patientToken, conversationId, 'Patient');
    await testGetConversationMessages(doctorToken, conversationId, 'Doctor');
    
    console.log('\n🎉 MESSAGING SYSTEM TESTS COMPLETED');
    console.log('✅ All messaging functionality working correctly!');
    
    // Summary
    console.log('\n📊 TEST SUMMARY:');
    console.log('✅ Patient registration: SUCCESS');
    console.log('✅ Doctor registration: SUCCESS');
    console.log('✅ Conversation creation: SUCCESS');
    console.log('✅ Message sending (bidirectional): SUCCESS');
    console.log('✅ Conversation retrieval: SUCCESS');
    console.log('✅ Message retrieval: SUCCESS');
    console.log('\n🎯 MESSAGING SYSTEM IS FULLY FUNCTIONAL!');
    
  } catch (error) {
    console.error('\n❌ MESSAGING SYSTEM TESTS FAILED:', error.message);
    process.exit(1);
  }
}

// Run the tests
runMessagingTests();
