import React from 'react'
import type { Metadata } from 'next'
import ThemeRegistry from '@/components/ThemeRegistry'
import HeaderManager from '@/components/HeaderManager'
import './globals.css'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

export const metadata: Metadata = {
    title: '認証システム',
    description: 'NextAuth.jsとMongoDBを使用した会員認証システム',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="ja">
            <body>
                <ThemeRegistry>
                    <HeaderManager>
                        {children}
                    </HeaderManager>
                </ThemeRegistry>
            </body>
        </html>
    )
}
