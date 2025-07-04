import mongoose from 'mongoose';

const MONGODB_URI = process.env.DATABASE_URL || process.env.MONGODB_URI;

// Only log warning during build, don't throw error
if (!MONGODB_URI) {
  console.warn('⚠️ Warning: DATABASE_URL or MONGODB_URI environment variable not defined');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  // Return null if no URI is provided instead of throwing error
  if (!MONGODB_URI) {
    console.warn('⚠️ Database connection skipped - no URI provided');
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 30000, // Increased timeout
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      // Removed deprecated options
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ MongoDB Atlas Connected Successfully');
      return mongoose;
    }).catch((error) => {
      console.error('❌ MongoDB Connection Failed:', error.message);
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('❌ MongoDB Connection Failed:', e.message);
    throw e;
  }

  return cached.conn;
}

export default connectDB;
