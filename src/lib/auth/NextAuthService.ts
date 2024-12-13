import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/config/auth.config'
import { Session } from 'next-auth'
import { NextResponse } from 'next/server'

export class NextAuthService {
  /**
   * Get the current session
   */
  static async getSession(): Promise<Session | null> {
    return await getServerSession(authOptions)
  }

  /**
   * Get the current authenticated user
   */
  static async getCurrentUser() {
    const session = await this.getSession()
    return session?.user
  }

  /**
   * Require authentication and return user data
   * @throws {Error} If user is not authenticated
   */
  static async requireAuth() {
    const user = await this.getCurrentUser()
    if (!user) {
      throw new Error('認証が必要です')
    }
    return user
  }

  /**
   * Create an unauthorized response
   */
  static createUnauthorizedResponse(message: string = '認証が必要です') {
    return new NextResponse(message, { status: 401 })
  }
}
