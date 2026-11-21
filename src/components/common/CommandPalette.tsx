'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { sitePages } from '@/data/site'
import { socials } from '@/data/socials'
import { profile } from '@/data/profile'

// Keyboard shortcut display helper
function KbdBadge({ keys }: { keys: string[] }) {
  return (
    <span
      style={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}
    >
      {keys.map((k, i) => (
        <kbd
          key={i}
          style={{
            fontSize: 10,
            padding: '1px 5px',
            background: 'var(--card-2)',
            border: '1px solid var(--line)',
            borderBottomWidth: 2,
            borderRadius: 4,
            color: 'var(--muted)',
            fontFamily: "'Fira Code', monospace",
            lineHeight: '18px',
            userSelect: 'none',
          }}
        >
          {k}
        </kbd>
      ))}
    </span>
  )
}

// Command type
interface Command {
  group: string
  groupIcon: string
  icon: string
  name: string
  desc: string
  shortcut?: string[] | null
  chord?: string | null
  action: () => void
}

// Highlight matching text
function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <span>{text}</span>
  const lower = text.toLowerCase()
  const lowerQ = query.toLowerCase()
  const idx = lower.indexOf(lowerQ)
  if (idx === -1) return <span>{text}</span>
  return (
    <span>
      {text.slice(0, idx)}
      <mark
        style={{
          background: 'var(--tech-tag)',
          color: 'var(--gold-deep)',
          borderRadius: 2,
          padding: '0 1px',
        }}
      >
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </span>
  )
}

// Toast notification
function Toast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 32,
        left: '50%',
        transform: `translateX(-50%) translateY(${visible ? 0 : 12}px)`,
        opacity: visible ? 1 : 0,
        transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
        zIndex: 99999,
        pointerEvents: 'none',
        background: 'var(--card)',
        color: 'var(--gold-deep)',
        border: '1px solid var(--line)',
        borderRadius: 8,
        padding: '8px 16px',
        fontSize: 13,
        fontFamily: "'Fira Code', monospace",
        whiteSpace: 'nowrap',
        boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
      }}
    >
      {message}
    </div>
  )
}

// Main Component
export default function CommandPalette() {
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIdx, setActiveIdx] = useState(0)
  const [chordPending, setChordPending] = useState('')
  const [chordHint, setChordHint] = useState('')
  const [toast, setToast] = useState({ visible: false, message: '' })
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const chordTimer = useRef<NodeJS.Timeout | null>(null)

  // Build commands
  const buildCommands = useCallback((): Command[] => {
    return [
      // Navigate commands
      ...sitePages.map((page) => ({
        group: 'Navigate',
        groupIcon: '🧭',
        icon: page.emoji,
        name: page.name,
        desc: `Go to ${page.name} page`,
        shortcut:
          page.name === 'Home'
            ? (['G', 'H'] as string[])
            : page.name === 'About'
              ? (['G', 'A'] as string[])
              : page.name === 'Project'
                ? (['G', 'P'] as string[])
                : page.name === 'Education'
                  ? (['G', 'E'] as string[])
                  : page.name === 'Contact'
                    ? (['G', 'C'] as string[])
                    : null,
        chord:
          page.name === 'Home'
            ? 'GH'
            : page.name === 'About'
              ? 'GA'
              : page.name === 'Project'
                ? 'GP'
                : page.name === 'Education'
                  ? 'GE'
                  : page.name === 'Contact'
                    ? 'GC'
                    : null,
        action: () => router.push(page.href),
      })),
      // Actions
      {
        group: 'Actions',
        groupIcon: '⚡',
        icon: '💻',
        name: 'Open GitHub',
        desc: `github.com/${profile.repository.name}`,
        shortcut: null,
        chord: null,
        action: () => {
          const github = socials.find((s) => s.name === 'GitHub')
          if (github?.href) window.open(github.href, '_blank')
        },
      },
      {
        group: 'Actions',
        groupIcon: '⚡',
        icon: '💼',
        name: 'Open LinkedIn',
        desc: 'LinkedIn profile',
        shortcut: null,
        chord: null,
        action: () => {
          const linkedin = socials.find((s) => s.name === 'LinkedIn')
          if (linkedin?.href) window.open(linkedin.href, '_blank')
        },
      },
    ]
  }, [router])

  const commands = buildCommands()

  // Filter commands by query
  const filtered = query.trim()
    ? commands.filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.desc.toLowerCase().includes(query.toLowerCase()) ||
          c.group.toLowerCase().includes(query.toLowerCase()),
      )
    : commands

  // Show toast helper
  const showToast = useCallback((msg: string) => {
    setToast({ visible: true, message: msg })
    setTimeout(() => setToast({ visible: false, message: '' }), 1800)
  }, [])

  // Close palette
  const close = useCallback(() => {
    setOpen(false)
    setQuery('')
    setActiveIdx(0)
  }, [])

  // Run a command
  const run = useCallback(
    (cmd: Command) => {
      close()
      cmd.action()
      showToast(`✓ ${cmd.name}`)
    },
    [close, showToast],
  )

  // Chord system
  const triggerChord = useCallback(
    (chord: string) => {
      const cmd = commands.find((c) => c.chord === chord)
      if (cmd) {
        cmd.action()
        showToast(`✓ ${cmd.name}`)
      }
      setChordPending('')
      setChordHint('')
      if (chordTimer.current) clearTimeout(chordTimer.current)
    },
    [commands, showToast],
  )

  // Global keydown handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (document.activeElement as HTMLElement)?.tagName
      const isEditable =
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        (document.activeElement as HTMLElement)?.isContentEditable

      // Ctrl+K or Cmd+K → toggle palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((v) => !v)
        return
      }

      // Palette-open navigation
      if (open) {
        if (e.key === 'Escape') {
          close()
          return
        }
        if (e.key === 'ArrowDown') {
          e.preventDefault()
          setActiveIdx((i) => Math.min(i + 1, filtered.length - 1))
          return
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault()
          setActiveIdx((i) => Math.max(i - 1, 0))
          return
        }
        if (e.key === 'Enter' && filtered[activeIdx]) {
          e.preventDefault()
          run(filtered[activeIdx])
          return
        }
        // Tab cycles through results
        if (e.key === 'Tab') {
          e.preventDefault()
          if (e.shiftKey) {
            setActiveIdx((i) => Math.max(i - 1, 0))
          } else {
            setActiveIdx((i) => Math.min(i + 1, filtered.length - 1))
          }
          return
        }
        return
      }

      // Chord shortcuts (only when palette closed, not in editable)
      if (isEditable) return

      const upper = e.key.toUpperCase()

      if (chordPending === 'G') {
        // Second key of a G-chord
        if (chordTimer.current) clearTimeout(chordTimer.current)
        const chord = 'G' + upper
        triggerChord(chord)
        return
      }

      // First key 'G' starts a chord
      if (upper === 'G' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        setChordPending('G')
        setChordHint('G pressed — H/A/P/E/R/C')
        if (chordTimer.current) clearTimeout(chordTimer.current)
        chordTimer.current = setTimeout(() => {
          setChordPending('')
          setChordHint('')
        }, 1500)
        return
      }

      // '?' → open palette as shortcut hint
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        setOpen(true)
        return
      }
    }

    window.addEventListener('keydown', handler)
    return () => {
      window.removeEventListener('keydown', handler)
      if (chordTimer.current) clearTimeout(chordTimer.current)
    }
  }, [
    open,
    filtered,
    activeIdx,
    close,
    run,
    chordPending,
    triggerChord,
    commands,
    showToast,
  ])

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50)
  }, [open])

  // Reset active index when query changes
  useEffect(() => {
    setActiveIdx(0)
  }, [query])

  // Scroll active item into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-active="true"]`)
    ;(el as HTMLElement)?.scrollIntoView({ block: 'nearest' })
  }, [activeIdx])

  // Group results
  const groups: Record<string, Command[]> = {}
  filtered.forEach((cmd) => {
    if (!groups[cmd.group]) groups[cmd.group] = []
    groups[cmd.group].push(cmd)
  })

  // Theme tokens
  const border = 'var(--line)'
  const bg = 'var(--bg)'
  const bgSub = 'var(--card-2)'
  const bgHov = 'var(--tech-tag)'
  const text = 'var(--ink)'
  const muted = 'var(--muted)'
  const accent = 'var(--gold)'

  return (
    <>
      {/* Chord hint overlay */}
      {chordHint && (
        <div
          style={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            zIndex: 99998,
            background: 'var(--card)',
            color: accent,
            border: `1px solid ${border}`,
            borderRadius: 8,
            padding: '8px 14px',
            fontSize: 13,
            fontFamily: "'Fira Code', monospace",
            pointerEvents: 'none',
            boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
            animation: 'cp-fade-in 0.15s ease',
          }}
        >
          <span style={{ opacity: 0.6 }}>chord → </span>
          <span>{chordHint}</span>
        </div>
      )}

      {/* Toast */}
      <Toast message={toast.message} visible={toast.visible} />

      {/* Trigger button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          title="Open command palette (⌘K or Ctrl+K)"
          aria-label="Open command palette"
          className="fixed bottom-20 right-2 z-50 flex items-center gap-2 rounded-full border border-line bg-card px-4 py-3 text-ink shadow-soft transition-all hover:scale-105 hover:border-gold hover:text-gold-deep md:bottom-16 md:right-16"
        >
          <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
          <span className="hidden text-sm font-medium md:inline">Search</span>
          <kbd className="hidden rounded border border-line bg-bg px-2 py-1 font-mono text-xs text-ink md:inline">
            ⌘K
          </kbd>
        </button>
      )}

      {/* Palette overlay */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
          onClick={(e) => e.target === e.currentTarget && close()}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: 80,
            zIndex: 9999,
            animation: 'cp-backdrop 0.15s ease',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 580,
              margin: '0 16px',
              background: bg,
              border: `1px solid ${border}`,
              borderRadius: 14,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              boxShadow: '0 24px 64px rgba(0,0,0,0.28)',
              animation: 'cp-slide-in 0.18s cubic-bezier(0.34,1.56,0.64,1)',
            }}
          >
            {/* Search input row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '12px 16px',
                borderBottom: `1px solid ${border}`,
              }}
            >
              <i
                className="fa-solid fa-magnifying-glass"
                aria-hidden="true"
                style={{ flexShrink: 0, color: muted }}
              />

              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search commands…"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontFamily: "'Fira Code', monospace",
                  fontSize: 14,
                  color: text,
                  caretColor: accent,
                }}
              />

              {query && (
                <span
                  style={{
                    fontSize: 11,
                    color: muted,
                    fontFamily: "'Fira Code', monospace",
                    flexShrink: 0,
                  }}
                >
                  {filtered.length} result{filtered.length !== 1 ? 's' : ''}
                </span>
              )}

              <button
                onClick={close}
                style={{
                  fontSize: 11,
                  padding: '2px 7px',
                  background: bgSub,
                  border: `1px solid ${border}`,
                  borderRadius: 5,
                  color: muted,
                  cursor: 'pointer',
                  fontFamily: "'Fira Code', monospace",
                  flexShrink: 0,
                  lineHeight: '18px',
                }}
              >
                ESC
              </button>
            </div>

            {/* Results list */}
            <div
              ref={listRef}
              style={{ overflowY: 'auto', maxHeight: 400 }}
              role="listbox"
            >
              {filtered.length === 0 ? (
                <div
                  style={{
                    padding: '2.5rem',
                    textAlign: 'center',
                    color: muted,
                    fontSize: 13,
                    fontFamily: "'Fira Code', monospace",
                  }}
                >
                  <div style={{ fontSize: 28, marginBottom: 8 }}>🔍</div>
                  No results for{' '}
                  <span style={{ color: accent }}>&quot;{query}&quot;</span>
                </div>
              ) : (
                Object.entries(groups).map(([grpName, items]) => (
                  <div key={grpName}>
                    {/* Group header */}
                    <div
                      style={{
                        padding: '10px 16px 4px',
                        fontSize: 10,
                        color: muted,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        fontFamily: "'Fira Code', monospace",
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        borderTop: `1px solid ${border}`,
                        marginTop: 4,
                      }}
                    >
                      <span>{items[0].groupIcon}</span>
                      <span>{grpName}</span>
                    </div>

                    {/* Group items */}
                    {items.map((cmd) => {
                      const globalIdx = filtered.indexOf(cmd)
                      const isActive = globalIdx === activeIdx

                      return (
                        <div
                          key={cmd.name}
                          data-active={isActive}
                          role="option"
                          aria-selected={isActive}
                          onClick={() => run(cmd)}
                          onMouseEnter={() => setActiveIdx(globalIdx)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            padding: '9px 16px',
                            cursor: 'pointer',
                            background: isActive ? bgHov : 'transparent',
                            borderLeft: `3px solid ${isActive ? accent : 'transparent'}`,
                            transition: 'background 0.1s ease',
                          }}
                        >
                          {/* Icon */}
                          <div
                            style={{
                              width: 34,
                              height: 34,
                              borderRadius: 8,
                              border: `1px solid ${isActive ? accent : border}`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 15,
                              background: isActive ? bgHov : bgSub,
                              flexShrink: 0,
                              transition: 'all 0.1s ease',
                            }}
                          >
                            {cmd.icon}
                          </div>

                          {/* Text */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                              style={{
                                fontSize: 13,
                                color: text,
                                fontFamily: "'Fira Code', monospace",
                                fontWeight: isActive ? 500 : 400,
                              }}
                            >
                              <Highlight text={cmd.name} query={query} />
                            </div>
                            <div
                              style={{
                                fontSize: 11,
                                color: muted,
                                marginTop: 1,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              <Highlight text={cmd.desc} query={query} />
                            </div>
                          </div>

                          {/* Shortcut badge */}
                          {cmd.shortcut && <KbdBadge keys={cmd.shortcut} />}
                          {cmd.chord && !cmd.shortcut && (
                            <KbdBadge keys={cmd.chord.split('')} />
                          )}
                        </div>
                      )
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div
              style={{
                borderTop: `1px solid ${border}`,
                padding: '8px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 8,
              }}
            >
              {/* Key hints */}
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                {[
                  { keys: ['↑', '↓'], label: 'navigate' },
                  { keys: ['↵'], label: 'select' },
                  { keys: ['Tab'], label: 'cycle' },
                  { keys: ['ESC'], label: 'close' },
                ].map(({ keys, label }) => (
                  <div
                    key={label}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: 11,
                      color: muted,
                    }}
                  >
                    <KbdBadge keys={keys} />
                    <span>{label}</span>
                  </div>
                ))}
              </div>

              {/* Chord hint */}
              <div
                style={{
                  fontSize: 10,
                  color: muted,
                  fontFamily: "'Fira Code', monospace",
                }}
              >
                <span style={{ color: accent }}>G</span> + H/A/P/E/R/C =
                navigate
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS animations */}
      <style>{`
        @keyframes cp-backdrop {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes cp-slide-in {
          from { opacity: 0; transform: scale(0.97) translateY(-8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes cp-fade-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  )
}
