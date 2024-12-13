import React from 'react'
import type { Metadata } from 'next'
import ThemeRegistry from '@/components/ThemeRegistry'
import MainHeader from '@/components/MainHeader'
import Box from '@mui/material/Box'
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
                    <MainHeader />
                    <Box component="main" sx={{ pt: ['48px', '56px', '64px'] }}>
                        {children}
                    </Box>
                </ThemeRegistry>
            </body>
        </html>
    )
}
