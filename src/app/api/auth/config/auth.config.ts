import NextAuth, {
    type NextAuthOptions,
    type Account,
    type Session,
    type User
} from 'next-auth'
import { type JWT } from 'next-auth/jwt'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import EmailProvider from 'next-auth/providers/email'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import clientPromise from '@/lib/mongodb'
import bcrypt from 'bcryptjs'
import { MongoClient } from 'mongodb'

export const authOptions: NextAuthOptions = {
    adapter: MongoDBAdapter(clientPromise),
    providers: [
        EmailProvider({
            server: {
                host: process.env.EMAIL_SERVER_HOST,
                port: Number(process.env.EMAIL_SERVER_PORT),
                auth: {
                    user: process.env.EMAIL_SERVER_USER,
                    pass: process.env.EMAIL_SERVER_PASSWORD,
                },
            },
            from: process.env.EMAIL_FROM,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'メールアドレス', type: 'email' },
                password: { label: 'パスワード', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error(
                        'メールアドレスとパスワードを入力してください'
                    )
                }

                try {
                    const client = await clientPromise
                    const usersCollection = client.db().collection('users')

                    const user = await usersCollection.findOne({
                        email: credentials.email,
                    })

                    if (!user) {
                        throw new Error('ユーザーが見つかりません')
                    }

                    const isPasswordValid = await bcrypt.compare(
                        credentials.password,
                        user.password
                    )

                    if (!isPasswordValid) {
                        throw new Error('パスワードが正しくありません')
                    }

                    return {
                        id: user._id.toString(),
                        email: user.email,
                        name: user.name,
                    }
                } catch (error) {
                    throw new Error('認証に失敗しました')
                }
            },
        }),
    ],
    pages: {
        signIn: '/auth/login',
        verifyRequest: '/auth/verify-request',
        error: '/auth/error',
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    callbacks: {
        async signIn({ account, profile }: {
            account: Account | null
            profile?: any
        }) {
            if (account?.provider === 'google') {
                return true
            }
            return true
        },
        async jwt({ token, user, account }: {
            token: JWT
            user: User | null
            account: Account | null
        }) {
            if (user) {
                token.id = user.id
                token.provider = account?.provider
            }
            return token
        },
        async session({ session, token }: {
            session: Session
            token: JWT
        }) {
            if (session.user) {
                session.user.id = token.id
                session.user.provider = token.provider as string
            }
            return session
        },
    },
}
