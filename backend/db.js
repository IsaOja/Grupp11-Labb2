const dotenv = require("dotenv"),
  { Client } = require("pg");
dotenv.config();

async function getClient() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) return null;
  const client = new Client({ connectionString: databaseUrl });
  await client.connect();
  return client;
}
