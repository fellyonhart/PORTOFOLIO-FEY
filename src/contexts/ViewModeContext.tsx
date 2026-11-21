'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type ViewMode = 'multipage' | 'spa'

interface ViewModeContextType {
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
  toggleViewMode: () => void
  isSpaMode: boolean
  isMultipageMode: boolean
}

const ViewModeContext = createContext<ViewModeContextType | undefined>(undefined)

export function ViewModeProvider({ children }: { children: React.ReactNode }) {
  const [viewMode, setViewModeState] = useState<ViewMode>('multipage')
  const [mounted, setMounted] = useState(false)

  // Load view mode from localStorage on mount
  useEffect(() => {
    setMounted(true)
    const savedMode = localStorage.getItem('portfolio-view-mode') as ViewMode
    if (savedMode) {
      setViewModeState(savedMode)
    }
  }, [])

  // Save to localStorage whenever it changes
  useEffect(() => {
    if (!mounted) return
    localStorage.setItem('portfolio-view-mode', viewMode)
  }, [viewMode, mounted])

  const setViewMode = (mode: ViewMode) => {
    setViewModeState(mode)
  }

  const toggleViewMode = () => {
    setViewModeState(viewMode === 'multipage' ? 'spa' : 'multipage')
  }

  const value: ViewModeContextType = {
    viewMode,
    setViewMode,
    toggleViewMode,
    isSpaMode: viewMode === 'spa',
    isMultipageMode: viewMode === 'multipage',
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return <div suppressHydrationWarning>{children}</div>
  }

  return (
    <ViewModeContext.Provider value={value}>
      {children}
    </ViewModeContext.Provider>
  )
}

export function useViewMode() {
  const context = useContext(ViewModeContext)
  if (context === undefined) {
    throw new Error('useViewMode must be used within a ViewModeProvider')
  }
  return context
}
