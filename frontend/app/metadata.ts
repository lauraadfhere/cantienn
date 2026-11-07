import { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.wappil.com'),
  title: {
    default: 'WIPPEL - From Idea to Production-Ready Web Platforms',
    template: '%s | WIPPEL'
  },
  description: 'Design, build, and launch fast, secure websites and web apps with a clean UI and scalable foundations. Professional web development services for startups and businesses.',
  keywords: [
    'web development',
    'web design',
    'web applications',
    'SaaS development',
    'startup development',
    'production-ready websites',
    'scalable web platforms',
    'Algeria web development',
    'professional web services',
    'custom web solutions'
  ],
  authors: [{ name: 'WIPPEL Team' }],
  creator: 'WIPPEL',
  publisher: 'WIPPEL',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['fr_FR', 'ar_DZ'],
    url: 'https://www.wappil.com',
    siteName: 'WIPPEL',
    title: 'WIPPEL - From Idea to Production-Ready Web Platforms',
    description: 'Design, build, and launch fast, secure websites and web apps with a clean UI and scalable foundations.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'WIPPEL - Web Development Services',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WIPPEL - From Idea to Production-Ready Web Platforms',
    description: 'Design, build, and launch fast, secure websites and web apps with a clean UI and scalable foundations.',
    images: ['/og-image.png'],
    creator: '@wippel',
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
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
  alternates: {
    canonical: 'https://www.wappil.com',
    languages: {
      'en-US': 'https://www.wappil.com/en',
      'fr-FR': 'https://www.wappil.com/fr',
      'ar-DZ': 'https://www.wappil.com/ar',
    },
  },
  category: 'technology',
}
