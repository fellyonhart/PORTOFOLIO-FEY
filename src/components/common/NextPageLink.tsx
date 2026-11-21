'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { sitePages } from '@/data/site'

export default function NextPageLink() {
  const pathname = usePathname()
  const currentPageIndex = sitePages.findIndex(
    (page) => page.href === pathname,
  )

  if (currentPageIndex < 0) return null

  const nextPage = sitePages[(currentPageIndex + 1) % sitePages.length]

  return (
    <Link
      href={nextPage.href}
      aria-label={`Next page: ${nextPage.name}`}
      className="next-page group mx-auto mt-14 flex w-full max-w-5xl flex-col items-start border-t border-line py-6 text-ink"
    >
      <span className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-muted">
        Next Page
      </span>
      <span className="mt-2 flex items-center gap-3 text-2xl font-semibold md:text-3xl">
        {nextPage.name}
        <span className="next-page-arrow" aria-hidden="true">
          →
        </span>
      </span>
    </Link>
  )
}
