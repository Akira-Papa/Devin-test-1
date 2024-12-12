import type { Metadata } from 'next';
import ThemeRegistry from '@/components/ThemeRegistry';
import './globals.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';

export const metadata: Metadata = {
  title: 'Next.js ドキュメント',
  description: 'Next.jsフレームワークの包括的な日本語ドキュメント',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <AppRouterCacheProvider>
          <ThemeRegistry key="mui-theme">
            {children}
          </ThemeRegistry>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
