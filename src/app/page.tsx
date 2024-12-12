'use client'

import { Box, Button, Container, Typography, Paper } from '@mui/material'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
          }}
        >
          <Typography variant="h1" component="h1" align="center" gutterBottom>
            ようこそ
          </Typography>
          <Typography variant="body1" align="center" paragraph>
            会員登録またはログインしてください。
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => router.push('/auth/register')}
            >
              新規登録
            </Button>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              onClick={() => router.push('/auth/login')}
            >
              ログイン
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}
