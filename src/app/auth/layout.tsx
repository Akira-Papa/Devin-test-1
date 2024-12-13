import React from 'react'
import Box from '@mui/material/Box'

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <Box component="main" sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh'
        }}>
            {children}
        </Box>
    )
}
