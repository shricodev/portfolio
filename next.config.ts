import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return ['/feed', '/feed.xml', '/rss', '/rss2', '/rss2.xml'].map(source => ({
      source,
      destination: '/rss.xml',
      permanent: true,
    }))
  },
  async headers() {
    const developmentScriptPolicy =
      process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : ''
    const contentSecurityPolicyReportOnly = [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline'${developmentScriptPolicy} https://app.cal.com https://cal.com https://*.cal.com`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://*.cal.com https://*.vercel-insights.com https://vitals.vercel-insights.com",
      'frame-src https://app.cal.com https://cal.com https://*.cal.com https://www.youtube.com https://www.youtube-nocookie.com',
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      'upgrade-insecure-requests',
    ].join('; ')

    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy-Report-Only',
            value: contentSecurityPolicyReportOnly,
          },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          {
            key: 'Permissions-Policy',
            value:
              'camera=(), geolocation=(), microphone=(), payment=(), usb=()',
          },
        ],
      },
    ]
  },
}

export default nextConfig
