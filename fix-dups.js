const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });
if (!process.env.MONGODB_URI) require('dotenv').config();

async function run() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('meemstonex'); 
    // Assuming DB name is derived from URI or default. Let's just use the connection's default DB.
    // wait, what is the DB name actually? let's look at lib/mongodb.js later if it fails.
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}
run();
