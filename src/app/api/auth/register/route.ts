import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import clientPromise, { initializeDatabase } from '@/lib/mongodb'
import { sendVerificationRequest } from '@/lib/auth/NextAuthService'

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

    // Create verification token
    const verificationToken = crypto.randomUUID()
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24時間後

    // Create user
    await usersCollection.insertOne({
      name,
      email,
      password: hashedPassword,
      emailVerified: null,
      verificationToken,
      verificationExpires,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // Send verification email
    await sendVerificationRequest({
      identifier: email,
      token: verificationToken,
      expires: verificationExpires,
      url: `${process.env.NEXTAUTH_URL}/auth/verify?token=${verificationToken}`,
    })

    return NextResponse.json(
      { message: 'ユーザー登録が完了しました。メールを確認してください。' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'ユーザー登録に失敗しました' },
      { status: 500 }
    )
  }
}
