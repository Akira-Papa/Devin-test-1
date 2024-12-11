import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import {
  Home,
  Code,
  Route,
  Storage,
  Api,
  Brush,
  CloudUpload,
  Speed,
  BugReport,
  Code as CodeIcon
} from '@mui/icons-material';
import Link from 'next/link';

const drawerWidth = 240;
const menuItems = [
  { title: 'はじめに', path: '/getting-started', icon: Home },
  { title: 'コンポーネント', path: '/components', icon: Code },
  { title: 'ルーティング', path: '/routing', icon: Route },
  { title: 'データフェッチング', path: '/data-fetching', icon: Storage },
  { title: 'APIルート', path: '/api-routes', icon: Api },
  { title: 'スタイリング', path: '/styling', icon: Brush },
  { title: 'デプロイメント', path: '/deployment', icon: CloudUpload },
  { title: '最適化', path: '/optimization', icon: Speed },
  { title: 'テスト', path: '/testing', icon: BugReport },
  { title: '実装例', path: '/examples', icon: CodeIcon },
];

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: 2000,
          backgroundColor: 'white',
          color: 'text.primary',
          boxShadow: 1
        }}
      >
        <Toolbar>
          <Typography variant="h6" component="h1">
            Next.js ドキュメント
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            top: ['48px', '56px', '64px'],
            height: 'auto',
            bottom: 0,
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        <List>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <ListItem
                key={item.path}
                component={Link}
                href={item.path}
                sx={{
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                <ListItemIcon>
                  <Icon />
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  primaryTypographyProps={{
                    sx: { fontWeight: 500 }
                  }}
                />
              </ListItem>
            );
          })}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: `calc(100% - ${drawerWidth}px)`,
          mt: ['48px', '56px', '64px'],
          backgroundColor: 'background.default',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
