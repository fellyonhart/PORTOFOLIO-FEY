'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export default function SectionRevealObserver() {
  const pathname = usePathname()

  useEffect(() => {
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !('IntersectionObserver' in window)
    ) {
      return
    }

    // Sections already on screen are left alone so above-the-fold content is
    // never hidden after hydration; only the ones below the fold get a reveal.
    const belowFold = Array.from(
      document.querySelectorAll<HTMLElement>('[data-section-reveal]'),
    ).filter(
      (section) =>
        section.getBoundingClientRect().top >= window.innerHeight * 0.85,
    )

    if (belowFold.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('section-reveal-visible')
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.12 },
    )

    belowFold.forEach((section) => {
      section.classList.add('section-reveal-pending')
      observer.observe(section)
    })

    return () => observer.disconnect()
  }, [pathname])

  return null
}
