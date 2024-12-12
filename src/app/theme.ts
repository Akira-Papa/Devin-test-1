import { createTheme } from '@mui/material';
import { Noto_Sans_JP } from 'next/font/google';

const notoSansJP = Noto_Sans_JP({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const theme = createTheme({
  typography: {
    fontFamily: notoSansJP.style.fontFamily,
  },
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  components: {
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          h1: 'h1',
          h2: 'h2',
          h3: 'h3',
          h4: 'h4',
          h5: 'h5',
          h6: 'h6',
          subtitle1: 'h6',
          subtitle2: 'h6',
          body1: 'p',
          body2: 'p',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        fullWidth: true,
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
  },
});

export { notoSansJP };
