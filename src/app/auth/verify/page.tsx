'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Box, Container, Typography, Paper, CircularProgress } from '@mui/material'

export default function VerifyEmail() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [verifying, setVerifying] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setError('無効な認証トークンです')
        setVerifying(false)
        return
      }

      try {
        const response = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'メール認証に失敗しました')
        }

        // 認証成功後、ログインページにリダイレクト
        router.push('/auth/login?verified=true')
      } catch (error) {
        setError(error instanceof Error ? error.message : 'メール認証に失敗しました')
        setVerifying(false)
      }
    }

    verifyEmail()
  }, [token, router])

  if (verifying) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Paper elevation={3} sx={{ p: 4, width: '100%', textAlign: 'center' }}>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography>メールアドレスを認証中...</Typography>
          </Paper>
        </Box>
      </Container>
    )
  }

  if (error) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
            <Typography variant="h4" component="h1" align="center" gutterBottom color="error">
              認証エラー
            </Typography>
            <Typography align="center" color="error">
              {error}
            </Typography>
          </Paper>
        </Box>
      </Container>
    )
  }

  return null
}
