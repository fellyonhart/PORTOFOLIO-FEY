import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import AmbientBackground from '@/components/AmbientBackground'
import { Settings } from '@/components/common/Settings'
import { ThemeProvider } from '@/provider/themesProvider'
import LoadingScreenWrapper from '@/components/common/LoadingScreenWrapper'
import CommandPalette from '@/components/common/CommandPalette'
import RandomMusicPlayer from '@/components/common/RandomMusicPlayer'
import GithubStar from '@/components/common/GithubStar'
import SectionRevealObserver from '@/components/common/SectionRevealObserver'
import PageTransitions from '@/components/common/PageTransitions'
import NextPageLink from '@/components/common/NextPageLink'
import { MusicProvider } from '@/contexts/MusicContext'
import { profile } from '@/data/profile'
import { socials } from '@/data/socials'

// Plus Jakarta Sans — satu font, satu request, compile cepat
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter', // pakai variable yang sama supaya CSS tetap work
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: `${profile.name} | Portfolio`,
  description: `${profile.name} — Software Developer and PPLG student from Indonesia.`,
  keywords: ['Fitra Pradipta', 'software developer', 'full-stack developer', 'PPLG', 'Indonesia'],
  authors: [{ name: profile.name }],
  openGraph: {
    title: `${profile.name} | Portfolio`,
    description: 'Software Developer and PPLG student building accessible web experiences.',
    type: 'website',
    siteName: 'Feyy.Dev',
    locale: 'en_US',
    images: [{ url: '/me.png', width: 300, height: 300, alt: profile.name }],
  },
  twitter: {
    card: 'summary',
    title: `${profile.name} | Portfolio`,
    description: 'Software Developer and PPLG student from Indonesia.',
  },
  icons: {
    icon: '/favicon.svg',
  },
}

const navbarSocials = socials
  .filter((s) => s.href)
  .slice(0, 5)
  .map(({ name, href }) => ({ name, href }))

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={plusJakartaSans.variable}
      suppressHydrationWarning
    >
      <head>
        {/* Font Awesome via CDN — untuk icons di Navbar & UI */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          crossOrigin="anonymous"
        />
      </head>
      <body className="overflow-x-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <MusicProvider>
            <LoadingScreenWrapper>
              <AmbientBackground />
              <a className="skip-link" href="#main-content">
                Skip to content
              </a>
              <Navbar socials={navbarSocials} />
              <SectionRevealObserver />
              <main
                id="main-content"
                tabIndex={-1}
                className="mx-auto mb-16 max-w-6xl px-3 pb-20 outline-none md:px-8 md:pb-0"
              >
                {children}
                <NextPageLink />
              </main>
              <footer className="border-t border-line py-6">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-5 md:px-8">
                  <p className="font-mono text-xs text-muted">
                    Designed &amp; built by{' '}
                    <span className="text-gold">{profile.name}</span> ·{' '}
                    {new Date().getFullYear()}
                  </p>
                  <p className="font-mono text-xs text-muted">v2.0.0</p>
                </div>
              </footer>
              <Settings />
              <RandomMusicPlayer />
              <CommandPalette />
              <GithubStar />
              <PageTransitions />
            </LoadingScreenWrapper>
          </MusicProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
