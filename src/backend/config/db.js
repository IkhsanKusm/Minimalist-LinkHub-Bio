/* eslint-disable no-undef */
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGO_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGO_URI environment variable inside .env');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    // console.log("Using cached DB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable buffering if not connected
      // useNewUrlParser: true, // Deprecated
      // useUnifiedTopology: true, // Deprecated
    };

    console.log("Creating new DB connection promise");
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log(`MongoDB Connected: ${mongooseInstance.connection.host}`);
      return mongooseInstance;
    }).catch(error => {
        console.error(`DB Connection Error: ${error.message}`);
        cached.promise = null; // Reset promise on error
        throw error; // Rethrow or handle as needed
    });
  }

  try {
      console.log("Awaiting DB connection promise");
      cached.conn = await cached.promise;
  } catch (e) {
      cached.promise = null; // Ensure promise is reset on failed connection attempt
      throw e;
  }

  return cached.conn;
}

export default connectDB; // Use ES module export