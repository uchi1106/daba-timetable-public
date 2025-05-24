import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'だばの時間割',
  description:
    '群馬大学の学生のための履修支援アプリ「だばの時間割」。履修管理・時間割作成・教室管理もこれひとつで完結！',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import { CssBaseline } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { Suspense } from 'react';

import GoogleAnalytics from '@/components/GoogleAnalytics';

import { CustomThemeProvider } from './theme';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <Suspense>
          <GoogleAnalytics />
        </Suspense>
        <AppRouterCacheProvider>
          <CustomThemeProvider>
            <CssBaseline />
            {children}
          </CustomThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
