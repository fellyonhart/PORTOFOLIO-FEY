'use client'

import { useState, useEffect } from 'react'
import LoadingScreen from './LoadingScreen'

export default function LoadingScreenWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const [showLoading, setShowLoading] = useState(false)
  const [loadingDone, setLoadingDone] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check if loading screen has been shown in this session
    const seen = sessionStorage.getItem('portfolio_intro_seen')
    if (!seen) {
      setShowLoading(true)
    } else {
      setLoadingDone(true)
      window.setTimeout(
        () => window.dispatchEvent(new Event('portfolio:intro-complete')),
        0,
      )
    }
  }, [])

  const handleLoadingComplete = () => {
    sessionStorage.setItem('portfolio_intro_seen', '1')
    setShowLoading(false)
    setLoadingDone(true)
    window.dispatchEvent(new Event('portfolio:intro-complete'))
  }

  // Prevent flash during SSR
  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>
  }

  return (
    <>
      {showLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
      <div
        style={{
          opacity: loadingDone ? 1 : 0,
          transition: loadingDone ? 'opacity 0.5s ease 0.1s' : 'none',
          pointerEvents: loadingDone ? 'auto' : 'none',
        }}
      >
        {children}
      </div>
    </>
  )
}
