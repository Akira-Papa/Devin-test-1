#!/usr/bin/env node
import { MongoClient } from 'mongodb'
import * as dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const uri = process.env.MONGODB_URI_MONGODB_URI
if (!uri) {
  console.error('MongoDB URI is not set')
  process.exit(1)
}

async function cleanup() {
  try {
    const client = new MongoClient(uri)
    await client.connect()

    const db = client.db()
    const users = db.collection('users')

    // Delete documents with null email
    const deleteResult = await users.deleteMany({ email: null })
    console.log(`Deleted ${deleteResult.deletedCount} documents with null email`)

    // Drop username index if exists
    try {
      await users.dropIndex('username_1')
      console.log('Dropped username index')
    } catch (error) {
      console.log('Username index not found or already dropped')
    }

    // Create unique email index
    await users.createIndex({ email: 1 }, { unique: true })
    console.log('Created unique email index')

    await client.close()
    console.log('Database cleanup completed')
    process.exit(0)
  } catch (error) {
    console.error('Cleanup error:', error)
    process.exit(1)
  }
}

cleanup()
