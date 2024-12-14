'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import MainHeader from './MainHeader';
import AuthHeader from './AuthHeader';
import Box from '@mui/material/Box';
import AppSidebar from './AppSidebar';

interface HeaderManagerProps {
  children: React.ReactNode;
}

export default function HeaderManager({ children }: HeaderManagerProps) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/auth');

  return (
    <Box sx={{ display: 'flex' }}>
      {isAuthPage ? <AuthHeader /> : <MainHeader />}
      {!isAuthPage && <AppSidebar />}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: ['48px', '56px', '64px'],
          pl: !isAuthPage ? '240px' : 0,
          ...(isAuthPage && {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh'
          })
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
