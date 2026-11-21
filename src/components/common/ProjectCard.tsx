'use client'

import {
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'motion/react'
import * as m from 'motion/react-m'
import Image from 'next/image'
import { useRef } from 'react'
import type { PointerEvent } from 'react'
import type { Project } from '@/data/types'

const MAX_TILT = 4
const EASE: [number, number, number, number] = [0.21, 0.47, 0.32, 0.98]
// Same number of shadows in both states so Motion can interpolate between them.
const GLOW_REST =
  '0 0 0 0 rgba(127, 214, 240, 0), 0 0 0 1px rgba(157, 180, 240, 0)'
const GLOW_HOVER =
  '0 18px 40px -14px rgba(127, 214, 240, 0.6), 0 0 0 1px rgba(157, 180, 240, 0.35)'
const metaClass = 'font-mono text-xs text-muted empty:hidden md:empty:block'

type ProjectCardProps = {
  project: Project
  number: string
  openHref?: string
}

// Must be rendered inside <LazyMotion> (SectionReveal provides it).
export default function ProjectCard({
  project,
  number,
  openHref,
}: ProjectCardProps) {
  const ref = useRef<HTMLLIElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -100px 0px' })
  const reduceMotion = useReducedMotion()

  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const smoothX = useSpring(pointerX, { stiffness: 180, damping: 20, mass: 0.4 })
  const smoothY = useSpring(pointerY, { stiffness: 180, damping: 20, mass: 0.4 })
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [MAX_TILT, -MAX_TILT])
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-MAX_TILT, MAX_TILT])

  const handlePointerMove = (event: PointerEvent<HTMLLIElement>) => {
    if (reduceMotion || event.pointerType !== 'mouse') return
    const rect = event.currentTarget.getBoundingClientRect()
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5)
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5)
  }

  const resetTilt = () => {
    pointerX.set(0)
    pointerY.set(0)
  }

  return (
    <m.li
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={inView || reduceMotion ? { opacity: 1, scale: 1 } : undefined}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.5, ease: EASE }}
      whileHover={
        reduceMotion
          ? undefined
          : { boxShadow: GLOW_HOVER, transition: { duration: 0.25 } }
      }
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 900,
        boxShadow: GLOW_REST,
      }}
      className="project-card grid grid-cols-[2rem_minmax(0,1fr)] gap-x-3 gap-y-1 rounded-xl border border-transparent border-b-line px-4 py-6 text-ink hover:border-line hover:bg-card md:grid-cols-[3rem_minmax(0,1.6fr)_minmax(0,0.7fr)_minmax(0,1.5fr)_3rem_auto] md:items-baseline md:gap-x-5 md:px-5"
    >
      <span className="font-mono text-xs text-muted">{number}</span>
      <div className="min-w-0">
        <h3 className="break-words text-xl font-semibold md:text-2xl">
          {project.title}
        </h3>
        {project.description && (
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted">
            {project.description}
          </p>
        )}
        {project.image && (
          <Image
            src={project.image}
            alt=""
            width={160}
            height={100}
            className="mt-3 h-16 w-24 rounded-md border border-line object-cover"
          />
        )}
      </div>
      <p className={`col-start-2 md:col-start-auto ${metaClass}`}>
        {project.type}
      </p>
      <p className={`col-start-2 md:col-start-auto ${metaClass}`}>
        {project.tech?.join(' · ')}
      </p>
      <p className={`col-start-2 md:col-start-auto md:text-right ${metaClass}`}>
        {project.year}
      </p>
      {openHref && (
        <a
          href={openHref}
          target="_blank"
          rel="noreferrer"
          className="col-start-2 mt-1 w-fit font-mono text-xs font-semibold text-ink transition-colors hover:text-gold-deep md:col-start-auto md:mt-0"
        >
          Open Detail ↗
          <span className="sr-only">
            {' '}
            {project.title ? `for ${project.title}` : 'project'}
          </span>
        </a>
      )}
    </m.li>
  )
}
