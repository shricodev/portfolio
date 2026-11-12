import type { Metadata } from 'next'
import localFont from 'next/font/local'
import Providers from '@/providers/providers'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { BASE_URL, SITE_DESCRIPTION } from '@/lib/constants'
import type { Viewport } from 'next'
import { ScrollReset } from '@/components/scroll-reset'
import 'react-tweet/theme.css'
import 'react-medium-image-zoom/dist/styles.css'
import './globals.css'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
  display: 'swap',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
  display: 'swap',
  preload: false,
})

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  colorScheme: 'dark light',
}

export function generateMetadata(): Metadata {
  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: 'Shrijal Acharya',
      template: '%s • Shrijal Acharya',
    },
    description: SITE_DESCRIPTION,
    openGraph: {
      type: 'website',
      siteName: 'Shrijal Acharya',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      creator: '@shricodev',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // suppressHydrationWarning is needed by next-themes, it sets the theme
    // class on <html> before React hydrates.
    <html
      lang='en'
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className='mx-auto flex min-h-screen max-w-3xl flex-col px-4 antialiased sm:px-6'>
        {/* here instead of metadata.alternates, which every page overrides
            with its own canonical. React hoists this into <head>. */}
        <link
          rel='alternate'
          type='application/rss+xml'
          title='Shrijal Acharya'
          href='/rss.xml'
        />
        <a
          href='#main-content'
          className='bg-background sr-only z-[100] rounded-md px-4 py-2 font-semibold focus:not-sr-only focus:fixed focus:top-4 focus:left-4'
        >
          Skip to main content
        </a>
        <Providers>
          <ScrollReset />
          <Navbar />
          <main id='main-content' className='grow pt-12 sm:pt-16'>
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
