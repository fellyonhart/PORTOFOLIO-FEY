'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import type { KeyboardEvent, PointerEvent } from 'react'
import type { Project } from '@/data/types'
import styles from './ProjectCarousel.module.css'

function getOffset(index: number, activeIndex: number, count: number) {
  const offset = (index - activeIndex + count) % count
  return offset > count / 2 ? offset - count : offset
}

function getOpenHref(project: Project) {
  if (project.demo && project.demo !== 'none') return project.demo
  if (project.repo && project.repo !== 'none') return project.repo
  return undefined
}

function formatNumber(number: number) {
  return String(number).padStart(2, '0')
}

export default function ProjectCarousel({
  projects,
}: {
  projects: Project[]
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const dragStart = useRef<number | null>(null)
  const count = projects.length

  const move = (direction: -1 | 1) => {
    setActiveIndex((current) => (current + direction + count) % count)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      move(-1)
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      move(1)
    }
  }

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return
    if (
      event.target instanceof Element &&
      event.target.closest('a, button')
    ) {
      return
    }
    dragStart.current = event.clientX
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = dragStart.current
    dragStart.current = null
    if (start === null) return

    const distance = event.clientX - start
    if (Math.abs(distance) >= 48) move(distance < 0 ? 1 : -1)
  }

  if (count === 0) return null

  return (
    <section aria-label="Featured projects" className="mx-auto max-w-5xl">
      <div
        className={styles.stage}
        role="region"
        aria-roledescription="carousel"
        aria-label="Featured project carousel"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => {
          dragStart.current = null
        }}
      >
        {projects.map((project, index) => {
          const offset = getOffset(index, activeIndex, count)
          const distance = Math.abs(offset)
          const isActive = offset === 0
          const openHref = getOpenHref(project)

          if (distance > 2) return null

          return (
            <article
              key={`${project.title ?? 'project'}-${index}`}
              className={styles.slide}
              data-offset={offset}
              data-distance={distance}
              aria-hidden={!isActive}
              onClick={() => {
                if (!isActive) setActiveIndex(index)
              }}
            >
              <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-card shadow-soft">
                <div className="relative h-[44%] shrink-0 overflow-hidden bg-bg-3">
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={`${project.title ?? 'Project'} preview`}
                      fill
                      sizes="(max-width: 640px) 82vw, 430px"
                      unoptimized
                      className="object-cover object-top"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col justify-between bg-[radial-gradient(ellipse_at_75%_25%,rgba(202,187,142,0.28),transparent_42%),linear-gradient(145deg,var(--bg-3),var(--bg))] p-6 md:p-8">
                      <span className="font-mono text-xs uppercase tracking-[0.2em] text-gold">
                        {project.type ?? 'Project'} / {project.year ?? 'Selected'}
                      </span>
                      <span className="max-w-[12ch] text-4xl font-black leading-[0.95] tracking-tight text-ink md:text-5xl">
                        {project.title}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/5 to-transparent" />
                  {isActive && openHref && (
                    <a
                      href={openHref}
                      target="_blank"
                      rel="noreferrer"
                      className="absolute bottom-5 right-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-pearl px-5 font-mono text-xs font-bold uppercase tracking-wider text-ink shadow-lg transition-transform hover:scale-105"
                    >
                      Open Project <span aria-hidden="true">↗</span>
                    </a>
                  )}
                </div>

                <div className="flex min-h-0 flex-1 flex-col p-5 md:p-6">
                  <div className="mb-3 flex items-baseline justify-between gap-3 border-b border-line pb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                    <span>{project.type ?? 'Project'}</span>
                    {project.year && <span>{project.year}</span>}
                  </div>
                  <h2 className="mb-2 text-xl font-bold text-ink md:text-2xl">
                    {project.title}
                  </h2>
                  {project.description && (
                    <p className="line-clamp-3 text-sm leading-relaxed text-muted">
                      {project.description}
                    </p>
                  )}
                  {isActive && (project.contribution || project.result) && (
                    <dl className="mt-3 grid grid-cols-2 gap-3 border-t border-line pt-3">
                      {project.contribution && (
                        <div>
                          <dt className="font-mono text-[9px] uppercase tracking-widest text-ice">
                            Contribution
                          </dt>
                          <dd className="mt-1 line-clamp-2 text-[10px] leading-relaxed text-muted">
                            {project.contribution}
                          </dd>
                        </div>
                      )}
                      {project.result && (
                        <div>
                          <dt className="font-mono text-[9px] uppercase tracking-widest text-ice">
                            Result
                          </dt>
                          <dd className="mt-1 line-clamp-2 text-[10px] leading-relaxed text-muted">
                            {project.result}
                          </dd>
                        </div>
                      )}
                    </dl>
                  )}
                  {((project.tech?.length ?? 0) > 0 ||
                    (isActive && Boolean(project.demo && project.repo))) && (
                    <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-3">
                      {project.tech?.slice(0, 4).map((technology) => (
                        <span key={technology} className="tech-badge">
                          {technology}
                        </span>
                      ))}
                      {isActive && project.demo && project.repo && (
                        <a
                          href={project.repo}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex min-h-7 items-center rounded-full border border-line px-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-muted transition-colors hover:border-gold hover:text-gold"
                        >
                          Source Code ↗
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </article>
          )
        })}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 font-mono text-xs text-muted sm:gap-6">
        <button
          type="button"
          onClick={() => move(-1)}
          aria-label="Previous project"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-card text-xl text-ink shadow-soft transition-colors hover:border-gold hover:text-gold"
        >
          <span aria-hidden="true">←</span>
        </button>
        <p aria-live="polite" className="min-w-16 text-center">
          <span className="text-ink">{formatNumber(activeIndex + 1)}</span>
          {' / '}
          {formatNumber(count)}
        </p>
        <button
          type="button"
          onClick={() => move(1)}
          aria-label="Next project"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-card text-xl text-ink shadow-soft transition-colors hover:border-gold hover:text-gold"
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  )
}
