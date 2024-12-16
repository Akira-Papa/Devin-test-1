'use client'

import React from 'react'
import { Box, Container, Typography, Paper } from '@mui/material'

export default function VerifyRequest() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            メールを確認してください
          </Typography>
          <Typography align="center" paragraph>
            認証用のメールを送信しました。メールに記載されたリンクをクリックして、認証を完了してください。
          </Typography>
          <Typography align="center" variant="body2" color="text.secondary">
            メールが届かない場合は、迷惑メールフォルダをご確認ください。
          </Typography>
        </Paper>
      </Box>
    </Container>
  )
}
