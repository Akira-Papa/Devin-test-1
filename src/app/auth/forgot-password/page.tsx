'use client'

import { useState } from 'react'
import { Box, Button, Container, TextField, Typography, Paper, Link } from '@mui/material'
import { useRouter } from 'next/navigation'

export default function ForgotPassword() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.get('email'),
        }),
      })

      if (response.ok) {
        setSuccess(true)
        setError('')
      } else {
        const data = await response.json()
        setError(data.error || 'パスワードリセットメールの送信に失敗しました')
      }
    } catch (error) {
      setError('パスワードリセットメールの送信に失敗しました')
    }
  }

  if (success) {
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
            <Typography variant="h6" align="center" gutterBottom>
              パスワードリセットメールを送信しました
            </Typography>
            <Typography align="center" sx={{ mt: 2 }}>
              メールに記載されたリンクからパスワードの再設定を行ってください。
            </Typography>
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Link href="/auth/login" variant="body2">
                ログインページに戻る
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
          <Typography variant="h1" component="h1" align="center" gutterBottom>
            パスワードを忘れた方
          </Typography>
          <Typography variant="body1" align="center" sx={{ mt: 2 }}>
            登録したメールアドレスを入力してください。
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="メールアドレス"
              name="email"
              autoComplete="email"
              autoFocus
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
              パスワードリセットメールを送信
            </Button>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Link href="/auth/login" variant="body2">
                ログインページに戻る
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}
