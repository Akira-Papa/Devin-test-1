import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Link from 'next/link';

export default function MainHeader() {
  return (
    <AppBar position="fixed" sx={{ zIndex: 2000, backgroundColor: '#1B2B65', color: 'white', boxShadow: 1 }}>
      <Toolbar>
        <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
          認証システム
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button component={Link} href="/dashboard" color="inherit">
            ダッシュボード
          </Button>
          <Button component={Link} href="/contact" color="inherit">
            お問い合わせ
          </Button>
          <Button component={Link} href="/prompts" color="inherit">
            プロンプト
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
