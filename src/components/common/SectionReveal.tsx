'use client'

import {
  domAnimation,
  LazyMotion,
  useInView,
  useReducedMotion,
} from 'motion/react'
import * as m from 'motion/react-m'
import { useRef } from 'react'
import type { ReactNode } from 'react'

const EASE: [number, number, number, number] = [0.21, 0.47, 0.32, 0.98]

type SectionRevealProps = {
  children: ReactNode
  className?: string
}

// Fades and slides a whole section up once it is 100px inside the viewport.
// Motion children without their own `animate` prop (e.g. EducationSection
// items) inherit the "hidden"/"visible" state and are staggered by it.
export default function SectionReveal({
  children,
  className,
}: SectionRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -100px 0px' })
  const reduceMotion = useReducedMotion()

  const variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: reduceMotion
        ? { duration: 0 }
        : {
            duration: 0.6,
            ease: EASE,
            delayChildren: 0.15,
            staggerChildren: 0.1,
          },
    },
  }

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        ref={ref}
        className={className}
        variants={variants}
        initial="hidden"
        animate={inView || reduceMotion ? 'visible' : 'hidden'}
      >
        {children}
      </m.div>
    </LazyMotion>
  )
}
