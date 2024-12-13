'use client'

import { Suspense } from 'react'
import { useState } from 'react'
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Paper,
    Link,
} from '@mui/material'
import { useRouter, useSearchParams } from 'next/navigation'

function ResetPasswordForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [error, setError] = useState('')
    const token = searchParams.get('token')

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)

        if (formData.get('password') !== formData.get('confirmPassword')) {
            setError('パスワードが一致しません')
            return
        }

        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token,
                    password: formData.get('password'),
                }),
            })

            if (response.ok) {
                router.push('/auth/login?reset=true')
            } else {
                const data = await response.json()
                setError(data.error || 'パスワードのリセットに失敗しました')
            }
        } catch (error) {
            setError('パスワードのリセットに失敗しました')
        }
    }

    if (!token) {
        return (
            <Container maxWidth="sm">
                <Box
                    sx={{
                        minHeight: '100vh',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        py: 4,
                    }}
                >
                    <Paper elevation={3} sx={{ p: 4 }}>
                        <Typography variant="h6" align="center" color="error">
                            無効なリセットリンクです
                        </Typography>
                        <Box sx={{ mt: 3, textAlign: 'center' }}>
                            <Link href="/auth/forgot-password" variant="body2">
                                パスワードリセットをやり直す
                            </Link>
                        </Box>
                    </Paper>
                </Box>
            </Container>
        )
    }

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    py: 4,
                }}
            >
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography
                        variant="h1"
                        component="h1"
                        align="center"
                        gutterBottom
                    >
                        新しいパスワードの設定
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{ mt: 3 }}
                    >
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="新しいパスワード"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="confirmPassword"
                            label="新しいパスワード（確認）"
                            type="password"
                            id="confirmPassword"
                            autoComplete="new-password"
                        />
                        {error && (
                            <Typography color="error" sx={{ mt: 2 }}>
                                {error}
                            </Typography>
                        )}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            パスワードを変更
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    )
}

export default function ResetPassword() {
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
            <ResetPasswordForm />
        </Suspense>
    )
}
