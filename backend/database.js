/**
 * =============================================================================
 * LINGUAVERSE - DATABASE SERVICE (FINAL REPAIR)
 * =============================================================================
 * File: /backend/database.js
 * * Update: The service now explicitly selects the database by name using a
 * new DB_NAME environment variable, removing ambiguity from the connection.
 * =============================================================================
 */

import { MongoClient } from 'mongodb';

let db;

export async function connectToDatabase() {
  const uri = process.env.MONGO_URI;
  // --- THIS IS THE REPAIR ---
  // We get the database name from a dedicated environment variable.
  const dbName = process.env.DB_NAME;

  if (!uri) {
    console.error('CRITICAL ERROR: MONGO_URI not found. Check your .env file.');
    process.exit(1);
  }
  // Add a check for the new variable.
  if (!dbName) {
    console.error('CRITICAL ERROR: DB_NAME not found. Please add it to your .env file.');
    process.exit(1);
  }
  // --- END REPAIR ---

  const client = new MongoClient(uri);

  try {
    await client.connect();
    // --- THIS IS THE REPAIR ---
    // We now explicitly select the database by name.
    db = client.db(dbName); 
    // --- END REPAIR ---
    console.log(`Successfully connected to MongoDB Atlas! Database: ${dbName}`);
  } catch (error) {
    console.error('Failed to connect to MongoDB Atlas:', error);
    process.exit(1);
  }
}

export function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call connectToDatabase first.');
  }
  return db;
}
