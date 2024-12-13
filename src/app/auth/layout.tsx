import React from 'react'
import AuthHeader from '@/components/AuthHeader'
import Box from '@mui/material/Box'

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <AuthHeader />
            <Box component="main" sx={{
                pt: ['48px', '56px', '64px'],
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh'
            }}>
                {children}
            </Box>
        </>
    )
}
