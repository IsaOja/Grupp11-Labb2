import dotenv from 'dotenv';
import { Client } from 'pg';

// const dotenv = require('dotenv'),
//   { Client } = require('pg');
dotenv.config();

export async function getClient() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) return null;
  const client = new Client({ connectionString: databaseUrl });
  await client.connect();
  return client;
}

async function ensureTables() {
  const client = await getClient();
  if (!client) {
    console.warn("No DATABASE_URL provided; cannot ensure tables");
    return;
  }
  // Create users table if it doesn't exist
  await client.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(150) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
  await client.end();
}

module.exports = { getClient, ensureTables };
