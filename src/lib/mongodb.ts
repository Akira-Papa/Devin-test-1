import { MongoClient } from 'mongodb'

if (!process.env.MONGODB_URI_MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI_MONGODB_URI"')
}

const uri = process.env.MONGODB_URI_MONGODB_URI
const options = {}

let client
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }
  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect().then(async (client) => {
      const db = client.db()
      // Drop the problematic username index if it exists
      try {
        await db.collection('users').dropIndex('username_1')
      } catch (error) {
        // Ignore error if index doesn't exist
      }
      // Ensure email index
      await db.collection('users').createIndex({ email: 1 }, { unique: true })
      return client
    })
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  client = new MongoClient(uri, options)
  clientPromise = client.connect().then(async (client) => {
    const db = client.db()
    // Ensure email index in production
    await db.collection('users').createIndex({ email: 1 }, { unique: true })
    return client
  })
}

export default clientPromise
