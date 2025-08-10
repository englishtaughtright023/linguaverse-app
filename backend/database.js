/**
 * =============================================================================
 * LINGUAVERSE - DATABASE SERVICE (FINAL REFACTOR)
 * =============================================================================
 * File: /backend/database.js
 * * Update: Refactored to use Mongoose for the connection, resolving a
 * * driver conflict and timeout errors. This is the definitive version.
 * =============================================================================
 */

import mongoose from 'mongoose';

export async function connectToDatabase() {
  const uri = process.env.MONGO_URI;
  const dbName = process.env.DB_NAME;

  if (!uri || !dbName) {
    console.error('CRITICAL ERROR: MONGO_URI or DB_NAME not found. Check your .env file.');
    process.exit(1);
  }

  try {
    // --- THIS IS THE FIX ---
    // We now use Mongoose to connect, which aligns with our models and routes.
    await mongoose.connect(uri, {
      dbName: dbName,
      // These options are recommended for modern Mongoose versions
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    // --- END FIX ---
    
    console.log(`Successfully connected to MongoDB Atlas! Database: ${dbName}`);
  } catch (error) {
    console.error('Failed to connect to MongoDB Atlas with Mongoose:', error);
    process.exit(1);
  }
}

// The getDb function is no longer necessary, as Mongoose manages the connection globally.