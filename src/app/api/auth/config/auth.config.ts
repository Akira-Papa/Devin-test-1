import NextAuth, {
    type NextAuthOptions,
    type Account,
    type Session,
    type User
} from 'next-auth'
import { type JWT } from 'next-auth/jwt'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import clientPromise from '@/lib/mongodb'

export const authOptions: NextAuthOptions = {
    debug: true,
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    providers: [
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
                    console.log('Missing credentials')
                    throw new Error('メールアドレスとパスワードを入力してください')
                }

                try {
                    console.log('Connecting to MongoDB...')
                    const client = await clientPromise
                    console.log('MongoDB connected successfully')

                    const usersCollection = client.db().collection('users')
                    console.log('Attempting login for email:', credentials.email)

                    const user = await usersCollection.findOne({
                        email: credentials.email,
                    })

                    if (!user) {
                        console.log('User not found:', credentials.email)
                        throw new Error('メールアドレスまたはパスワードが正しくありません')
                    }

                    console.log('User found, comparing passwords')
                    const isPasswordValid = await bcrypt.compare(
                        credentials.password,
                        user.password
                    )

                    if (!isPasswordValid) {
                        console.log('Password invalid for user:', credentials.email)
                        throw new Error('メールアドレスまたはパスワードが正しくありません')
                    }

                    console.log('Login successful for user:', credentials.email)
                    return {
                        id: user._id.toString(),
                        email: user.email,
                        name: user.name,
                    }
                } catch (error) {
                    console.error('Login error:', error)
                    throw error
                }
            },
        }),
    ],
    pages: {
        signIn: '/auth/login',
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
