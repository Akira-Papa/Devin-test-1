'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import MainHeader from './MainHeader';
import AuthHeader from './AuthHeader';
import Box from '@mui/material/Box';

interface HeaderManagerProps {
  children: React.ReactNode;
}

export default function HeaderManager({ children }: HeaderManagerProps) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/auth');

  return (
    <>
      {isAuthPage ? <AuthHeader /> : <MainHeader />}
      <Box component="main" sx={{ pt: isAuthPage ? 0 : ['48px', '56px', '64px'] }}>
        {children}
      </Box>
    </>
  );
}
