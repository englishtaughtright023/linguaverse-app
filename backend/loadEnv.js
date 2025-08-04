/**
 * =============================================================================
 * LINGUAVERSE - ENVIRONMENT LOADER
 * =============================================================================
 * File: /backend/loadEnv.js
 * * Mission: To load all environment variables from the .env file before any
 * other application code runs. This is the most reliable method.
 * =============================================================================
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Determine the absolute path to the current directory.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Construct an absolute path to the .env file.
const envPath = path.resolve(__dirname, '.env');

// Load the .env file from that explicit path.
const configResult = dotenv.config({ path: envPath });

if (configResult.error) {
  console.error('--- [DOTENV] CRITICAL FAILURE ---');
  console.error('Could not find or read the .env file at the specified path:', envPath);
  console.error('Error details:', configResult.error);
  process.exit(1); // Halt execution if the config is missing.
}

console.log('[ENV]: Environment variables loaded successfully.');
