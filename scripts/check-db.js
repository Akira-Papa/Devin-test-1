const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function checkDatabase() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    const client = new MongoClient(uri);
    await client.connect();

    console.log('Connected to MongoDB');
    const db = client.db();
    const users = await db.collection('users').find({}).toArray();

    console.log('Users in database:');
    console.log(JSON.stringify(users, null, 2));

    await client.close();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkDatabase();
