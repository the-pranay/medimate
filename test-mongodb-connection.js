// Test MongoDB Connection
const mongoose = require('mongoose');

async function testConnection() {
  console.log('🔄 Testing MongoDB connection...');
  
  try {
    // Load environment variables
    require('dotenv').config({ path: '.env.local' });
    
    const mongoUri = process.env.MONGODB_URI || process.env.DATABASE_URL;
    console.log('📍 MongoDB URI:', mongoUri ? 'Found' : 'Not found');
    
    if (!mongoUri) {
      console.error('❌ No MongoDB URI found in environment variables');
      return;
    }
    
    // Try to connect
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    });
    
    console.log('✅ MongoDB connected successfully');
    
    // Test a simple query
    const User = mongoose.model('User', new mongoose.Schema({
      name: String,
      email: String,
      role: String
    }));
    
    const userCount = await User.countDocuments();
    console.log('📊 Total users in database:', userCount);
    
    // Test create a simple user
    const testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      role: 'patient'
    });
    
    const savedUser = await testUser.save();
    console.log('✅ Test user created:', savedUser._id);
    
    // Clean up test user
    await User.deleteOne({ _id: savedUser._id });
    console.log('✅ Test user cleaned up');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 MongoDB disconnected');
  }
}

testConnection();
