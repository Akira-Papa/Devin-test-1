'use client'

import React from 'react'
import { Suspense } from 'react'
import { Box, Container, Typography, Paper, Link } from '@mui/material'
import { useSearchParams } from 'next/navigation'

function ErrorContent() {
    const searchParams = useSearchParams()
    const error = searchParams.get('error')

    const getErrorMessage = (errorType: string | null) => {
        switch (errorType) {
            case 'Verification':
                return 'メール認証に失敗しました。再度メール認証を行ってください。'
            case 'AccessDenied':
                return 'アクセスが拒否されました。ログインが必要です。'
            case 'Configuration':
                return 'システムの設定エラーが発生しました。管理者にお問い合わせください。'
            case 'CredentialsSignin':
                return 'メールアドレスまたはパスワードが正しくありません。'
            default:
                return 'エラーが発生しました。もう一度お試しください。'
        }
    }

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
                    <Typography
                        variant="h4"
                        component="h1"
                        align="center"
                        gutterBottom
                    >
                        エラーが発生しました
                    </Typography>
                    <Typography align="center" color="error" paragraph>
                        {getErrorMessage(error)}
                    </Typography>
                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                        <Link
                            href="/auth/login"
                            sx={{ textDecoration: 'none' }}
                        >
                            ログインページに戻る
                        </Link>
                    </Box>
                </Paper>
            </Box>
        </Container>
    )
}

export default function ErrorPage() {
    return (
        <Suspense
            fallback={
                <Container maxWidth="sm">
                    <Box
                        sx={{
                            minHeight: '100vh',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Typography>読み込み中...</Typography>
                    </Box>
                </Container>
            }
        >
            <ErrorContent />
        </Suspense>
    )
}
