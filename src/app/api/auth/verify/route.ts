import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function POST(request: Request) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { error: '認証トークンが必要です' },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db()
    const usersCollection = db.collection('users')

    // Find user by verification token
    const user = await usersCollection.findOne({
      verificationToken: token,
      verificationExpires: { $gt: new Date() },
      emailVerified: null,
    })

    if (!user) {
      return NextResponse.json(
        { error: '無効な認証トークンか、有効期限が切れています' },
        { status: 400 }
      )
    }

    // Update user verification status
    await usersCollection.updateOne(
      { _id: user._id },
      {
        $set: {
          emailVerified: new Date(),
          verificationToken: null,
          verificationExpires: null,
        },
      }
    )

    return NextResponse.json(
      { message: 'メールアドレスの認証が完了しました' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.json(
      { error: 'メール認証に失敗しました' },
      { status: 500 }
    )
  }
}
