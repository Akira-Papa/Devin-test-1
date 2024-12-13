import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default function AuthHeader() {
  return (
    <AppBar position="fixed" sx={{ zIndex: 2000, backgroundColor: 'white', color: 'text.primary', boxShadow: 1 }}>
      <Toolbar>
        <Typography variant="h6" component="h1" sx={{ flexGrow: 1, textAlign: 'center' }}>
          認証システム
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
