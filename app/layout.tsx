import type { Metadata } from 'next'
import localFont from 'next/font/local'
import Providers from '@/providers/providers'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { BASE_URL } from '@/lib/constants'
import { Toaster } from '@/components/ui/sonner'
import 'react-tweet/theme.css'
import './globals.css'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export function generateMetadata(): Metadata {
  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: 'Shrijal Acharya',
      template: '%s • Shrijal Acharya',
    },
    twitter: {
      card: 'summary_large_image',
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
    // We suppress the Hydration warning because of the next-themes package.
    // It requires this to be set since, we don't really know the user theme
    // preference on the server side.
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} mx-auto flex min-h-screen max-w-3xl flex-col px-4 antialiased`}
      >
        <Providers>
          <Navbar />
          <main className='mt-40 grow'>{children}</main>

          {/* Toaster for notifications from shadcn/ui sonner */}
          <Toaster />

          <Footer />
        </Providers>
      </body>
    </html>
  )
}
