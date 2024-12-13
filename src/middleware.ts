import { withAuth } from 'next-auth/middleware'
import { NextResponse, NextRequest } from 'next/server'
import { JWT } from 'next-auth/jwt'

export default withAuth(
  function middleware(req: NextRequest) {
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ req, token }: {
        req: NextRequest
        token: JWT | null
      }) => {
        // Allow access to top page and auth-related pages
        if (
          req.nextUrl.pathname === '/' ||
          req.nextUrl.pathname.startsWith('/auth') ||
          req.nextUrl.pathname.startsWith('/api/auth')
        ) {
          return true
        }
        // Require authentication for all other pages
        return !!token
      },
    },
  }
)

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
