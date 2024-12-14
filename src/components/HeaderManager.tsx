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
  const isTopPage = pathname === '/';

  return (
    <Box sx={{ display: 'flex' }}>
      {!isTopPage && (isAuthPage ? <AuthHeader /> : <MainHeader />)}
      {!isTopPage && !isAuthPage && <AppSidebar />}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: !isTopPage ? ['48px', '56px', '64px'] : 0,
          pl: !isTopPage && !isAuthPage ? '240px' : 0,
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
