'use client'

import { useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import Image from 'next/image'
import EndOfLine from '@/components/common/EndOfLine'
import type { Education } from '@/data/types'

const EASE: [number, number, number, number] = [0.21, 0.47, 0.32, 0.98]

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

// Must be rendered inside <SectionReveal>: the items take their
// hidden/visible state (and the stagger delay) from it.
export default function EducationSection({ items }: { items: Education[] }) {
  const reduceMotion = useReducedMotion()
  const itemTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.5, ease: EASE }

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4 border-b border-line pb-3 font-mono text-xs font-medium tracking-[0.12em] text-muted">
        <h2 className="uppercase tracking-[0.18em]">Learning timeline</h2>
        <p>2024—2026</p>
      </div>
      <ol>
        {items.map((item) => (
          <m.li
            key={item.year ?? item.title ?? 'education'}
            variants={itemVariants}
            transition={itemTransition}
            className="grid gap-x-10 gap-y-3 border-b border-line py-8 md:grid-cols-[9rem_minmax(0,1fr)]"
          >
            <div className="md:pt-1">
              {item.year && (
                <p className="text-3xl font-semibold text-ink">
                  {item.year}
                </p>
              )}
            </div>
            <div className="min-w-0">
              <h3 className="break-words text-xl font-semibold text-ink md:text-2xl">
                {item.title}
              </h3>
              <hr className="my-3 border-line" />
              <p className="font-mono text-xs capitalize text-muted">
                {[item.company, item.type].filter(Boolean).join(' — ')}
              </p>
              {item.description && (
                <p className="mt-3 leading-relaxed text-muted">
                  {item.description}
                </p>
              )}
              {(item.image || item.href) && (
                <div className="mt-4 flex items-center gap-3">
                  {item.image && (
                    <a href={item.image} target="_blank" rel="noreferrer">
                      <Image
                        src={item.image}
                        alt={item.title ?? ''}
                        width={36}
                        height={36}
                      />
                    </a>
                  )}
                  {item.href && (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Open ${item.title ?? 'certificate'}`}
                      className="font-mono text-xs font-semibold text-ink transition-colors hover:text-gold-deep"
                    >
                      View ↗
                    </a>
                  )}
                </div>
              )}
            </div>
          </m.li>
        ))}
      </ol>
      <EndOfLine />
    </div>
  )
}
