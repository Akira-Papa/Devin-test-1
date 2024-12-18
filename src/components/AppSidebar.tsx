import React from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import ChatIcon from '@mui/icons-material/Chat';
import Link from 'next/link';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Theme } from '@mui/material/styles';

const drawerWidth = 240;

interface AppSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function AppSidebar({ isOpen = true, onClose }: AppSidebarProps) {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={isMobile ? isOpen : true}
      onClose={onClose}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#1B2B65',
          color: 'white',
        },
      }}
    >
      <List sx={{ mt: 8 }}>
        <ListItem component={Link} href="/dashboard" sx={{ color: 'white' }}>
          <ListItemIcon>
            <DashboardIcon sx={{ color: 'white' }} />
          </ListItemIcon>
          <ListItemText primary="ダッシュボード" />
        </ListItem>
        <ListItem component={Link} href="/prompts" sx={{ color: 'white' }}>
          <ListItemIcon>
            <ChatIcon sx={{ color: 'white' }} />
          </ListItemIcon>
          <ListItemText primary="プロンプト" />
        </ListItem>
        <ListItem component={Link} href="/settings" sx={{ color: 'white' }}>
          <ListItemIcon>
            <SettingsIcon sx={{ color: 'white' }} />
          </ListItemIcon>
          <ListItemText primary="設定" />
        </ListItem>
      </List>
    </Drawer>
  );
}
