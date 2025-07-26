// -----------------------------------------------------------------------------
// FILE: backend/database.js (Database Connection)
// -----------------------------------------------------------------------------
// This file handles our connection to MongoDB Atlas. It is now a separate module.
// -----------------------------------------------------------------------------
import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.MONGO_URI;
if (!uri) {
  console.error("MONGO_URI not found in .env file. Server cannot start.");
  process.exit(1);
}

const client = new MongoClient(uri, {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true }
});

let db;

export async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Successfully connected to MongoDB Atlas!");
    db = client.db("linguaverse");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  }
}

export const getDb = () => db;