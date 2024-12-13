require('dotenv').config({ path: '.env.local' });
const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');

async function createTestUser() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        throw new Error('MONGODB_URI is not defined');
    }

    console.log('Connecting to MongoDB...');
    const client = await MongoClient.connect(uri);
    const db = client.db();
    const users = db.collection('users');

    const password = 'test123';
    const hashedPassword = await bcrypt.hash(password, 12);

    await users.insertOne({
        name: 'Test Simple',
        email: 'test123@example.com',
        password: hashedPassword,
        createdAt: new Date()
    });

    console.log('Test user created successfully');
    console.log('Email: test123@example.com');
    console.log('Password: test123');

    await client.close();
}

createTestUser().catch(console.error);
