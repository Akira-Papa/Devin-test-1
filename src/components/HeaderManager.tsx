'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import MainHeader from './MainHeader';
import AuthHeader from './AuthHeader';
import Box from '@mui/material/Box';
import AppSidebar from './AppSidebar';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Theme } from '@mui/material/styles';

interface HeaderManagerProps {
  children: React.ReactNode;
}

export default function HeaderManager({ children }: HeaderManagerProps) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/auth');
  const isTopPage = pathname === '/';
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {!isTopPage && (isAuthPage ? <AuthHeader /> : <MainHeader onMenuClick={handleDrawerToggle} />)}
      {!isTopPage && !isAuthPage && <AppSidebar isOpen={mobileOpen} onClose={handleDrawerToggle} />}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: !isTopPage ? ['48px', '56px', '64px'] : 0,
          pl: !isTopPage && !isAuthPage && !isMobile ? '240px' : 0,
          width: '100%',
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
