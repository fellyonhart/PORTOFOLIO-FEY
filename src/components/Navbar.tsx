'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import type { Social } from '@/data/types'
import LyricsTicker from '@/components/common/LyricsTicker'
import SocialIcon from '@/components/common/SocialIcon'

type NavbarProps = {
  socials: Pick<Social, 'name' | 'href'>[]
}

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/project', label: 'Projects' },
  { href: '/education', label: 'Education' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar({ socials }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [compactNavVisible, setCompactNavVisible] = useState(false)
  const pathname = usePathname()
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    let previousScrollY = window.scrollY

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (window.innerWidth < 1024 || currentScrollY <= 96) {
        setCompactNavVisible(false)
      } else if (currentScrollY > previousScrollY) {
        setCompactNavVisible(true)
      } else if (currentScrollY < previousScrollY) {
        setCompactNavVisible(false)
      }
      previousScrollY = currentScrollY
    }

    const handleResize = () => {
      setCompactNavVisible(window.innerWidth >= 1024 && window.scrollY > 96)
      previousScrollY = window.scrollY
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const isDark = mounted && resolvedTheme !== 'light'

  return (
    <>
      <nav
        className={`navbar-surface sticky top-0 z-50 flex flex-wrap items-center justify-between gap-y-2 px-3 py-3 transition-all duration-300 motion-reduce:transition-none md:px-8 md:py-4 ${
          compactNavVisible
            ? 'lg:pointer-events-none lg:-translate-y-full lg:opacity-0'
            : 'lg:translate-y-0 lg:opacity-100'
        }`}
      >
        {/* Logo */}
        <Link
          href="/"
          className="rounded border border-line bg-card px-2.5 py-1 font-mono text-sm font-semibold text-gold transition-opacity hover:opacity-70"
          aria-label="Home"
        >
          Feyy.Dev
        </Link>

        {/* Desktop nav links */}
        <ul className="order-1 hidden items-center gap-1 lg:absolute lg:left-1/2 lg:top-1/2 lg:flex lg:-translate-x-1/2 lg:-translate-y-1/2">
          {navLinks.map(({ href, label }) => {
            const active = pathname === href
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`relative rounded px-3 py-1.5 text-sm font-semibold transition-colors duration-150 ${
                    active ? 'text-ink' : 'text-muted hover:text-gold-deep'
                  }`}
                >
                  {active && (
                    <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-md bg-shift" />
                  )}
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Right controls */}
        <div className="order-2 ml-auto flex items-center gap-2 lg:contents">
          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-card text-ink shadow-soft transition-transform hover:rotate-90 lg:hidden"
          >
            <i
              className={`fa-solid text-sm ${menuOpen ? 'fa-xmark' : 'fa-bars'}`}
            />
          </button>

          {/* Theme toggle — Font Awesome CDN */}
          <button
            type="button"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-pearl text-ink shadow-soft transition-transform hover:rotate-12"
          >
            {mounted &&
              (isDark ? (
                <i
                  className="fa-solid fa-sun text-sm"
                  style={{ color: '#e0c46c' }}
                />
              ) : (
                <i
                  className="fa-solid fa-moon text-sm"
                  style={{ color: '#5b7488' }}
                />
              ))}
          </button>
        </div>

        {!compactNavVisible && (
          <div className="order-3 flex w-full basis-full justify-center py-1 lg:absolute lg:left-[77.5%] lg:top-1/2 lg:w-auto lg:-translate-x-1/2 lg:-translate-y-1/2 lg:py-0">
            <LyricsTicker />
          </div>
        )}
      </nav>

      <div
        aria-label="Compact navigation"
        className={`bg-card/90 fixed left-1/2 top-3 z-[60] hidden max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center gap-3 rounded-full border border-line px-4 py-2 shadow-soft backdrop-blur-xl transition-all duration-300 motion-reduce:transition-none lg:flex ${
          compactNavVisible
            ? 'translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-4 opacity-0'
        }`}
      >
        <Link
          href="/"
          className="shrink-0 font-mono text-xs font-semibold text-gold"
          aria-label="Home"
        >
          Feyy.Dev
        </Link>
        <ul className="flex items-center gap-1">
          {navLinks.map(({ href, label }) => {
            const active = pathname === href
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={`rounded-full px-2 py-1 text-xs font-semibold transition-colors ${
                    active
                      ? 'bg-tech-tag text-ink'
                      : 'text-muted hover:text-gold-deep'
                  }`}
                >
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>
        <LyricsTicker />
        <button
          type="button"
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line bg-pearl text-ink transition-transform hover:rotate-12"
        >
          {mounted &&
            (isDark ? (
              <i
                className="fa-solid fa-sun text-sm"
                style={{ color: '#e0c46c' }}
              />
            ) : (
              <i
                className="fa-solid fa-moon text-sm"
                style={{ color: '#5b7488' }}
              />
            ))}
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-300 lg:hidden ${
          menuOpen ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />
        <div
          className={`absolute right-0 top-0 h-full w-72 border-l border-line bg-bg transition-transform duration-300 ${
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex h-full flex-col px-6 py-8">
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="mb-8 self-end text-muted hover:text-ink"
              aria-label="Close menu"
            >
              <i className="fa-solid fa-xmark text-lg" />
            </button>

            <ul className="flex flex-col gap-1">
              {navLinks.map(({ href, label }) => {
                const active = pathname === href
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition-colors ${
                        active
                          ? 'bg-tech-tag text-ink'
                          : 'text-muted hover:bg-card hover:text-ink'
                      }`}
                    >
                      {active && (
                        <span className="h-1.5 w-1.5 rounded-full bg-shift" />
                      )}
                      {label}
                    </Link>
                  </li>
                )
              })}
            </ul>

            <div className="my-6 h-px bg-line" />

            {/* Socials */}
            <div className="flex gap-3">
              {socials
                .filter((s) => s.href)
                .slice(0, 4)
                .map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.name}
                    className="text-muted transition-colors hover:text-gold-deep"
                  >
                    <SocialIcon name={social.name} />
                  </a>
                ))}
            </div>

            <p className="mt-auto font-mono text-xs text-muted">
              © {new Date().getFullYear()} Fitra Pradipta
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
