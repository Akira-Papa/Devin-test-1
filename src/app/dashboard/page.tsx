'use client'

import { Box, Button, Container, Typography, Paper, Grid } from '@mui/material'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'

export default function Dashboard() {
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push('/')
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: { xs: 8, sm: 9 }, py: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h2" component="h2">
              ダッシュボード
            </Typography>
            <Button variant="outlined" color="primary" onClick={handleSignOut}>
              ログアウト
            </Button>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                <Typography variant="h6" component="h3">
                  プロンプト管理
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => router.push('/prompts')}
                  fullWidth
                >
                  プロンプト一覧
                </Button>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                <Typography variant="h6" component="h3">
                  ドキュメント
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => router.push('/docs/routing')}
                  fullWidth
                >
                  ルーティング
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => router.push('/docs/testing')}
                  fullWidth
                >
                  テスト
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => router.push('/docs/components')}
                  fullWidth
                >
                  コンポーネント
                </Button>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                <Typography variant="h6" component="h3">
                  その他
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => router.push('/contact')}
                  fullWidth
                >
                  お問い合わせ
                </Button>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                <Typography variant="h6" component="h3">
                  アカウント
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => router.push('/settings')}
                  fullWidth
                >
                  ユーザー設定
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  )
}
