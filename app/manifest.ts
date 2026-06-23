import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Shrijal Acharya',
    short_name: 'Shrijal',
    description: 'Personal website of Shrijal Acharya.',
    start_url: '/',
    display: 'standalone',
    // default theme is dark (zinc-950), so keep the browser UI consistent
    background_color: '#09090b',
    theme_color: '#09090b',
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
