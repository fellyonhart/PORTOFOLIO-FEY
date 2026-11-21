'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type ThemeMode = 'light' | 'dark' | 'vscode-dark'
type ThemePreset = 'default' | 'vscode' | 'custom'

interface ThemeContextType {
  theme: ThemeMode
  preset: ThemePreset
  setTheme: (theme: ThemeMode) => void
  setPreset: (preset: ThemePreset) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeContextProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [theme, setThemeState] = useState<ThemeMode>('dark')
  const [preset, setPresetState] = useState<ThemePreset>('default')
  const [mounted, setMounted] = useState(false)

  // Load theme from localStorage on mount
  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('portfolio-theme') as ThemeMode
    const savedPreset = localStorage.getItem('portfolio-preset') as ThemePreset

    if (savedTheme) setThemeState(savedTheme)
    if (savedPreset) setPresetState(savedPreset)
  }, [])

  // Apply theme to document
  useEffect(() => {
    if (!mounted) return

    const root = document.documentElement

    // Remove all theme classes
    root.classList.remove('light', 'dark', 'vscode-dark')
    root.classList.add(theme)

    // Apply CSS variables based on theme
    if (theme === 'vscode-dark') {
      root.style.setProperty('--vscode-bg', '#011627')
      root.style.setProperty('--vscode-bg-secondary', '#011221')
      root.style.setProperty('--vscode-border', '#1E2D3D')
      root.style.setProperty('--vscode-text', '#E5E9F0')
      root.style.setProperty('--vscode-muted', '#607B96')
      root.style.setProperty('--vscode-accent-teal', '#43D9AD')
      root.style.setProperty('--vscode-accent-blue', '#4D5BCE')
      root.style.setProperty('--vscode-accent-pink', '#E06C75')
      root.style.setProperty('--vscode-accent-orange', '#E5C07B')
    }

    localStorage.setItem('portfolio-theme', theme)
  }, [theme, mounted])

  useEffect(() => {
    if (!mounted) return
    localStorage.setItem('portfolio-preset', preset)
  }, [preset, mounted])

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme)
  }

  const setPreset = (newPreset: ThemePreset) => {
    setPresetState(newPreset)

    // Auto-apply theme based on preset
    if (newPreset === 'vscode') {
      setThemeState('vscode-dark')
    } else if (newPreset === 'default') {
      setThemeState('light')
    }
  }

  const toggleTheme = () => {
    if (preset === 'vscode') {
      setThemeState('vscode-dark')
    } else {
      setThemeState(theme === 'light' ? 'dark' : 'light')
    }
  }

  const value: ThemeContextType = {
    theme,
    preset,
    setTheme,
    setPreset,
    toggleTheme,
  }

  // Prevent flash of wrong theme
  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useThemeContext() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error(
      'useThemeContext must be used within a ThemeContextProvider',
    )
  }
  return context
}
