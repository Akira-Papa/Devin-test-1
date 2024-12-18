'use client'

import { useState } from 'react'
import { Box, Button, Container, TextField, Typography, Paper, Link, Divider } from '@mui/material'
import GoogleIcon from '@mui/icons-material/Google'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function Login() {
  const router = useRouter()
  const [error, setError] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    try {
      const result = await signIn('credentials', {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        redirect: false,
      })

      if (result?.error) {
        setError('メールアドレスまたはパスワードが正しくありません')
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      setError('ログインに失敗しました')
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      const result = await signIn('google', {
        redirect: false,
        callbackUrl: '/dashboard'
      })

      if (!result?.error) {
        router.push('/dashboard')
      }
    } catch (error) {
      setError('Googleログインに失敗しました')
    }
  }

  return (
    <Container maxWidth="sm" sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
        <Typography variant="h2" component="h2" align="center" gutterBottom>
          ログイン
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleSignIn}
            sx={{ mt: 1, mb: 2 }}
          >
            Googleでログイン
          </Button>
          <Divider sx={{ my: 2 }}>または</Divider>
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
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="パスワード"
            type="password"
            id="password"
            autoComplete="current-password"
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
            ログイン
          </Button>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Link href="/auth/forgot-password" variant="body2">
              パスワードを忘れた方
            </Link>
            <Link href="/auth/register" variant="body2">
              新規登録はこちら
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}
