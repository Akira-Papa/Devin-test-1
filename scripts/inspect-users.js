require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function inspectUsers() {
    try {
        console.log('Connecting to MongoDB...');
        const client = await MongoClient.connect(process.env.MONGODB_URI);
        const db = client.db();
        const users = db.collection('users');

        console.log('\nCollection Info:');
        const stats = await db.command({ collStats: 'users' });
        console.log('Total documents:', stats.count);
        console.log('Size:', stats.size, 'bytes');

        console.log('\nIndexes:');
        const indexes = await users.indexes();
        console.log(JSON.stringify(indexes, null, 2));

        console.log('\nSample User Document:');
        const sampleUser = await users.findOne({ email: 'test123@example.com' });
        if (sampleUser) {
            // Mask sensitive data
            const maskedUser = {
                ...sampleUser,
                password: sampleUser.password ? '***[MASKED]***' : undefined,
                _id: sampleUser._id.toString()
            };
            console.log(JSON.stringify(maskedUser, null, 2));
        } else {
            console.log('Test user not found');
        }

        await client.close();
    } catch (error) {
        console.error('Error:', error);
    }
}

inspectUsers();
