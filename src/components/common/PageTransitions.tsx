'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { sitePages } from '@/data/site'

type TransitionPhase = 'idle' | 'cover' | 'reveal'

const COVER_MS = 200
const REVEAL_MS = 240
const MAX_TOTAL_MS = 700
const REDUCED_STEP_MS = 75
const REDUCED_MAX_TOTAL_MS = 150

function normalizedPath(pathname: string) {
  return pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function PageTransitions() {
  const pathname = usePathname()
  const router = useRouter()
  const [phase, setPhase] = useState<TransitionPhase>('idle')
  const [destinationLabel, setDestinationLabel] = useState('')
  const [panelDuration, setPanelDuration] = useState(COVER_MS)
  const locked = useRef(false)
  const pendingPath = useRef<string | null>(null)
  const previousPath = useRef(pathname)
  const transitionStartedAt = useRef<number | null>(null)
  const transitionDeadline = useRef(MAX_TOTAL_MS)
  const pushTimer = useRef<number | null>(null)
  const revealTimer = useRef<number | null>(null)
  const recoveryTimer = useRef<number | null>(null)

  const clearTimers = useCallback(() => {
    const timers = [pushTimer, revealTimer, recoveryTimer]
    timers.forEach((timer) => {
      if (timer.current !== null) {
        window.clearTimeout(timer.current)
        timer.current = null
      }
    })
  }, [])

  const finishTransition = useCallback(() => {
    clearTimers()
    setPhase('idle')
    locked.current = false
    pendingPath.current = null
    transitionStartedAt.current = null
    document.getElementById('main-content')?.focus({ preventScroll: true })
  }, [clearTimers])

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return
      }

      if (!(event.target instanceof Element)) return

      const link = event.target.closest<HTMLAnchorElement>('a[href]')
      if (
        !link ||
        link.target === '_blank' ||
        (link.target !== '' && link.target !== '_self') ||
        link.hasAttribute('download')
      ) {
        return
      }

      const destination = new URL(link.href, window.location.href)
      if (
        destination.origin !== window.location.origin ||
        destination.hash ||
        !['http:', 'https:'].includes(destination.protocol)
      ) {
        return
      }

      if (locked.current) {
        event.preventDefault()
        return
      }

      const destinationPath = normalizedPath(destination.pathname)
      if (destinationPath === normalizedPath(pathname)) return

      event.preventDefault()
      locked.current = true
      pendingPath.current = destinationPath

      const pageIndex = sitePages.findIndex(
        (page) => page.href === destinationPath,
      )
      const pageName =
        pageIndex >= 0
          ? sitePages[pageIndex].name
          : destination.pathname.split('/').filter(Boolean).join(' / ')
      const pageNumber = String(pageIndex >= 0 ? pageIndex + 1 : 0).padStart(
        2,
        '0',
      )

      const reducedMotion = prefersReducedMotion()
      const coverDuration = reducedMotion ? REDUCED_STEP_MS : COVER_MS
      transitionDeadline.current = reducedMotion
        ? REDUCED_MAX_TOTAL_MS
        : MAX_TOTAL_MS
      transitionStartedAt.current = performance.now()

      setDestinationLabel(`${pageNumber} — ${pageName || 'Page'}`)
      setPanelDuration(coverDuration)
      setPhase('cover')

      // Route changes only after the panel has fully covered the page, so the
      // old content is never swapped while it is still visible.
      const href = `${destination.pathname}${destination.search}`
      router.prefetch(href)
      pushTimer.current = window.setTimeout(() => {
        pushTimer.current = null
        router.push(href)
      }, coverDuration + 10)

      recoveryTimer.current = window.setTimeout(() => {
        if (locked.current) {
          clearTimers()
          setPhase('idle')
          locked.current = false
          pendingPath.current = null
          transitionStartedAt.current = null
        }
      }, transitionDeadline.current)
    }

    document.addEventListener('click', handleClick, true)
    return () => document.removeEventListener('click', handleClick, true)
  }, [clearTimers, pathname, router])

  useEffect(() => {
    if (previousPath.current === pathname) return
    previousPath.current = pathname

    const isTransitionNavigation =
      locked.current && pendingPath.current === normalizedPath(pathname)

    if (!isTransitionNavigation) {
      finishTransition()
      return
    }

    clearTimers()
    const elapsed =
      transitionStartedAt.current === null
        ? 0
        : performance.now() - transitionStartedAt.current
    const revealDuration = Math.min(
      prefersReducedMotion() ? REDUCED_STEP_MS : REVEAL_MS,
      Math.max(0, transitionDeadline.current - elapsed),
    )

    setPanelDuration(revealDuration)
    setPhase('reveal')
    revealTimer.current = window.setTimeout(finishTransition, revealDuration)
  }, [clearTimers, finishTransition, pathname])

  return (
    <div
      aria-hidden="true"
      className="page-transition-panel"
      data-phase={phase}
      style={{ transitionDuration: `${panelDuration}ms` }}
    >
      <p>{destinationLabel}</p>
    </div>
  )
}
