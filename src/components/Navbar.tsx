'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import type { Social } from '@/data/types'
import LyricsTicker from '@/components/common/LyricsTicker'

type NavbarProps = {
  socials: Pick<Social, 'name' | 'href' | 'icon'>[]
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
  const pathname = usePathname()
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const isDark = mounted && resolvedTheme !== 'light'

  return (
    <>
      <nav className="navbar-surface sticky top-0 z-50 flex items-center justify-between px-6 py-4 md:px-10">
        {/* Logo */}
        <Link
          href="/"
          className="rounded border border-line bg-card px-2.5 py-1 font-mono text-sm font-semibold text-gold transition-opacity hover:opacity-70"
          aria-label="Home"
        >
          Feyy.Dev
        </Link>

        {/* Desktop nav links */}
        <ul className="order-1 hidden items-center gap-1 md:flex lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2">
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
        <div className="order-2 flex items-center gap-2 lg:contents">
          {/* Theme toggle — Font Awesome CDN */}
          <button
            type="button"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="order-3 flex h-9 w-9 items-center justify-center rounded-full border border-line bg-pearl text-ink shadow-soft transition-transform hover:rotate-12"
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

          <div className="order-2 translate-x-1 lg:absolute lg:left-[77.5%] lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2">
            <LyricsTicker />
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="order-1 flex h-9 w-9 items-center justify-center rounded-full border border-line bg-card text-ink shadow-soft transition-transform hover:rotate-90 md:hidden"
          >
            <i
              className={`fa-solid text-sm ${menuOpen ? 'fa-xmark' : 'fa-bars'}`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-300 md:hidden ${
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
                    <Image
                      src={social.icon}
                      alt={social.name}
                      width={20}
                      height={20}
                    />
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
