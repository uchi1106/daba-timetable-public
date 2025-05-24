'use client';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ReactNode } from 'react';

// TypeScriptの型定義を拡張
declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: false; // デフォルトのブレイクポイントを無効化
    sm: false;
    md: false;
    lg: false;
    xl: false;
    mobile: true; // カスタムブレイクポイントを追加
    tablet: true;
    laptop: true;
    desktop: true;
  }
}
// TypeScriptの型定義を拡張 - タイポグラフィ
declare module '@mui/material/styles' {
  interface TypographyVariants {
    'xx-small'?: React.CSSProperties;
    'x-small': React.CSSProperties;
    small: React.CSSProperties;
    medium: React.CSSProperties;
    large: React.CSSProperties;
    'x-large': React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    'xx-small'?: React.CSSProperties;
    'x-small'?: React.CSSProperties;
    small?: React.CSSProperties;
    medium?: React.CSSProperties;
    large?: React.CSSProperties;
    'x-large'?: React.CSSProperties;
  }
}

// Typographyコンポーネントで使用できるようにする
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    'xx-small': true;
    'x-small': true;
    small: true;
    medium: true;
    large: true;
    'x-large': true;
  }
}

const baseTheme = createTheme({
  breakpoints: {
    // 以下、カスタムブレイクポイント。必要に応じて変更、追加する
    values: {
      mobile: 0, // 0~800px
      tablet: 800, // 800~1200px
      laptop: 1200, // 1200~1600px
      desktop: 1600, // 1600px~
    },
  },
});
// カスタムテーマの作成
const theme = createTheme({
  ...baseTheme,
  typography: {
    'xx-small': {
      fontSize: '8px',
      [baseTheme.breakpoints.up('tablet')]: {
        fontSize: '12px',
      },
      [baseTheme.breakpoints.up('laptop')]: {
        fontSize: '14px',
      },
    },
    'x-small': {
      fontSize: '10px',
      [baseTheme.breakpoints.up('tablet')]: {
        fontSize: '14px',
      },
      [baseTheme.breakpoints.up('laptop')]: {
        fontSize: '16px',
      },
    },
    small: {
      fontSize: '12px',
      [baseTheme.breakpoints.up('tablet')]: {
        fontSize: '16px',
      },
      [baseTheme.breakpoints.up('laptop')]: {
        fontSize: '18px',
      },
    },
    medium: {
      fontSize: '14px',
      [baseTheme.breakpoints.up('tablet')]: {
        fontSize: '18px',
      },
      [baseTheme.breakpoints.up('laptop')]: {
        fontSize: '20px',
      },
    },
    large: {
      fontSize: '16px',
      [baseTheme.breakpoints.up('tablet')]: {
        fontSize: '24px',
      },
      [baseTheme.breakpoints.up('laptop')]: {
        fontSize: '24px',
      },
      [baseTheme.breakpoints.up('desktop')]: {
        fontSize: '32px',
      },
    },
    'x-large': {
      fontSize: '20px',
      [baseTheme.breakpoints.up('tablet')]: {
        fontSize: '28px',
      },
      [baseTheme.breakpoints.up('laptop')]: {
        fontSize: '32px',
      },
      [baseTheme.breakpoints.up('desktop')]: {
        fontSize: '36px',
      },
    },
  },
  components: {
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          fontSize: '22px',
          [baseTheme.breakpoints.up('laptop')]: {
            fontSize: '32px',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: '4px',
          [baseTheme.breakpoints.up('laptop')]: {
            padding: '8px',
          },
        },
      },
    },
  },
});

// ThemeProviderコンポーネント
export function CustomThemeProvider({ children }: { children: ReactNode }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
