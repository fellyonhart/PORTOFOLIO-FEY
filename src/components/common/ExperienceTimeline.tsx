'use client'

import { useState } from 'react'
import type { Experience } from '@/data/types'

// ── Icons ─────────────────────────────────────────────────────────────────────
function WorkIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      className="h-5 w-5"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M184 48H328c4.4 0 8 3.6 8 8V96H176V56c0-4.4 3.6-8 8-8zm-56 8V96H64C28.7 96 0 124.7 0 160v96H192 320 512V160c0-35.3-28.7-64-64-64H384V56c0-30.9-25.1-56-56-56H184c-30.9 0-56 25.1-56 56zM512 288H320v32c0 17.7-14.3 32-32 32H224c-17.7 0-32-14.3-32-32V288H0V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V288z" />
    </svg>
  )
}

function EduIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 640 512"
      className="h-5 w-5"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M320 32c-8.1 0-16.1 1.4-23.7 4.1L15.8 137.4C6.3 140.9 0 149.9 0 160s6.3 19.1 15.8 22.6l57.9 20.9C57.3 229.3 48 259.8 48 291.9v28.1c0 28.4-10.8 57.7-22.3 80.8-6.5 13-13.9 25.8-22.5 37.6C0 442.7-.9 448.3.9 453.4s6 8.9 11.2 10.2l64 16c4.2 1.1 8.7.3 12.4-2s6.3-6.1 7.1-10.4c8.6-42.8 4.3-81.2-2.1-108.7C90.3 344.3 86 329.8 80 316.5V291.9c0-30.2 10.2-58.7 27.9-81.5 12.9-15.5 29.6-28 49.2-35.7l157-61.7c8.2-3.2 17.5.8 20.7 9s-.8 17.5-9 20.7l-157 61.7c-12.4 4.9-23.3 12.4-32.2 21.6l159.6 57.6c7.6 2.7 15.6 4.1 23.7 4.1s16.1-1.4 23.7-4.1L624.2 182.6c9.5-3.4 15.8-12.5 15.8-22.6s-6.3-19.1-15.8-22.6L343.7 36.1C336.1 33.4 328.1 32 320 32zM128 408c0 35.3 86 72 192 72s192-36.7 192-72L496.7 262.6 354.5 314c-11.1 4-22.8 6-34.5 6s-23.5-2-34.5-6L143.3 262.6 128 408z" />
    </svg>
  )
}

function ExternalLinkIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      className="h-3.5 w-3.5"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z" />
    </svg>
  )
}

// ── Dot + vertical line connector ────────────────────────────────────────────
function TimelineDot({
  type,
  isLast,
}: {
  type?: 'work' | 'education'
  isLast: boolean
}) {
  const isWork = type === 'work'
  return (
    <div className="relative flex flex-col items-center">
      {/* Dot */}
      <div
        className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 shadow-soft transition-transform duration-300 group-hover:scale-110 ${
          isWork
            ? 'border-ice bg-card text-ice'
            : 'border-lembayung bg-card text-lembayung'
        }`}
      >
        {isWork ? <WorkIcon /> : <EduIcon />}
      </div>
      {/* Vertical line below dot */}
      {!isLast && (
        <div className="mt-1 h-full w-0.5 grow bg-gradient-to-b from-line to-transparent" />
      )}
    </div>
  )
}

// ── Single experience card ────────────────────────────────────────────────────
function ExperienceCard({
  title,
  company,
  date,
  description,
  type,
  uri,
}: Experience) {
  const [hovered, setHovered] = useState(false)
  const isWork = type === 'work'

  return (
    <article
      className="gradient-frame group relative flex flex-col gap-2 rounded-2xl border border-line bg-card p-5 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top row: type badge + date */}
      <div className="flex items-center justify-between gap-2">
        <span
          className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 font-mono text-xs font-semibold uppercase tracking-widest ${
            isWork ? 'bg-ice/10 text-ice' : 'bg-lembayung/10 text-lembayung'
          }`}
        >
          {isWork ? <WorkIcon /> : <EduIcon />}
          {isWork ? 'Work' : 'Education'}
        </span>
        <span className="font-mono text-xs text-muted">{date}</span>
      </div>

      {/* Title */}
      <h2 className="text-base font-bold text-ink md:text-xl">{title}</h2>

      {/* Company with optional link indicator */}
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold text-muted">{company}</h3>
        {uri && (
          <span
            className={`inline-flex items-center gap-1.5 font-mono text-xs text-gold-deep transition-opacity duration-200 ${
              hovered ? 'opacity-100' : 'md:opacity-0'
            }`}
          >
            <ExternalLinkIcon />
            website
          </span>
        )}
      </div>

      {/* Description */}
      {description && (
        <p className="text-sm leading-relaxed text-muted md:text-base">
          {description}
        </p>
      )}

      {/* Visit Website button — slides in on hover when uri exists */}
      {uri && (
        <div
          className={`mt-1 overflow-hidden transition-all duration-300 ${
            hovered
              ? 'max-h-12 opacity-100'
              : 'max-h-12 opacity-100 md:max-h-0 md:opacity-0'
          }`}
        >
          <a
            href={uri}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-2 rounded-lg border border-gold-deep bg-pearl px-3 py-1.5 font-mono text-xs font-semibold text-ink transition-all hover:bg-gold hover:text-ink"
          >
            <ExternalLinkIcon />
            Visit Website
          </a>
        </div>
      )}

      {/* Gradient accent line on the left */}
      <span
        className={`absolute inset-y-3 left-0 w-1 rounded-full transition-opacity duration-300 ${
          hovered ? 'opacity-100' : 'opacity-40'
        } ${isWork ? 'bg-ice' : 'bg-lembayung'}`}
      />
    </article>
  )
}

// ── Main export — vertical timeline layout ───────────────────────────────────
export default function ExperienceTimeline(
  props: Experience & { position: boolean; isLast: boolean },
) {
  const { isLast, ...rest } = props

  return (
    <div className="group flex gap-4">
      <TimelineDot type={props.type} isLast={isLast} />
      <div className="mb-6 flex-1 pt-1">
        <ExperienceCard {...rest} />
      </div>
    </div>
  )
}
