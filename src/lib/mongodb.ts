import { MongoClient } from 'mongodb'

if (!process.env.MONGODB_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const uri = process.env.MONGODB_URI
const options = {}

let client
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
    let globalWithMongo = global as typeof globalThis & {
        _mongoClientPromise?: Promise<MongoClient>
    }
    if (!globalWithMongo._mongoClientPromise) {
        client = new MongoClient(uri, options)
        globalWithMongo._mongoClientPromise = client.connect()
    }
    clientPromise = globalWithMongo._mongoClientPromise
} else {
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
}

// Initialize database
initializeDatabase().catch(console.error)

export default clientPromise

// Initialize database function
export async function initializeDatabase() {
    try {
        console.log('Initializing database...')
        const client = await clientPromise
        const db = client.db()
        const users = db.collection('users')

        // Drop all indexes first
        await users.dropIndexes()

        // Remove any documents with null email
        await users.deleteMany({ email: null })

        // Create new indexes
        await users.createIndex({ email: 1 }, { unique: true })
        console.log('Database initialized successfully')
    } catch (error) {
        console.error('Failed to initialize database:', error)
        throw error
    }
}
