import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import clientPromise, { initializeDatabase } from '@/lib/mongodb'

export async function POST(request: Request) {
  try {
    // Initialize database on first request
    await initializeDatabase()

    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: '必須項目が入力されていません' },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db()
    const usersCollection = db.collection('users')

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { error: 'このメールアドレスは既に登録されています' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    await usersCollection.insertOne({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    })

    return NextResponse.json(
      { message: 'ユーザー登録が完了しました' },
      { status: 201 }
    )
  } catch (error) {
    const errorObj = error as Error
    console.error('Registration error:', {
      name: errorObj.name || 'Unknown',
      message: errorObj.message || 'No message',
      stack: errorObj.stack || 'No stack trace',
      raw: error
    })
    return NextResponse.json(
      { error: 'ユーザー登録に失敗しました' },
      { status: 500 }
    )
  }
}
