import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import crypto from 'crypto'
import { sendPasswordResetEmail } from '@/lib/auth/NextAuthService' // 追加

export async function POST(request: Request) {
    try {
        const { email } = await request.json()

        if (!email) {
            return NextResponse.json(
                { error: 'メールアドレスを入力してください' },
                { status: 400 }
            )
        }

        const client = await clientPromise
        const db = client.db()
        const usersCollection = db.collection('users')

        // Check if user exists
        const user = await usersCollection.findOne({ email })
        if (!user) {
            return NextResponse.json(
                { error: 'このメールアドレスは登録されていません' },
                { status: 404 }
            )
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex')
        const hashedToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex')

        // Save token to database
        await usersCollection.updateOne(
            { email },
            {
                $set: {
                    resetToken: hashedToken,
                    resetTokenExpiry: new Date(
                        Date.now() + 24 * 60 * 60 * 1000
                    ), // 24 hours
                },
            }
        )

        // Send password reset email
        await sendPasswordResetEmail({
            identifier: email,
            token: resetToken,
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            url: `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`,
        })

        return NextResponse.json(
            { message: 'パスワードリセットメールを送信しました' },
            { status: 200 }
        )
    } catch (error) {
        console.error('Forgot password error:', error)
        return NextResponse.json(
            { error: 'パスワードリセットメールの送信に失敗しました' },
            { status: 500 }
        )
    }
}
