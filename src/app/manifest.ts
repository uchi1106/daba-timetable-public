import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'だばの時間割',
    short_name: 'だばの時間割',
    description:
      '群馬大学の学生のための履修支援アプリ「だばの時間割」。履修管理・時間割作成・教室管理もこれひとつで完結！',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ffffff',
    lang: 'ja',
    orientation: 'portrait',
    scope: '/',
    icons: [
      {
        src: '/Icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/Icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
