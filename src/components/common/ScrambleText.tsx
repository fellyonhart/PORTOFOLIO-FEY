'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const scrambleCharacters =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+-=[]{}|;:,.<>?/\\'

export default function ScrambleText({ children }: { children: string }) {
  const [text, setText] = useState(children)
  const intervalRef = useRef<number | null>(null)

  const stopScramble = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setText(children)
  }, [children])

  const startScramble = useCallback(() => {
    stopScramble()

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let position = 0
    intervalRef.current = window.setInterval(() => {
      const nextText = children
        .split('')
        .map((character, index) => {
          if (position / 3 > index) return character
          const randomIndex = Math.floor(
            Math.random() * scrambleCharacters.length,
          )
          return scrambleCharacters[randomIndex]
        })
        .join('')

      setText(nextText)
      position += 1

      if (position >= children.length * 3 && intervalRef.current !== null) {
        window.clearInterval(intervalRef.current)
        intervalRef.current = null
        setText(children)
      }
    }, 75)
  }, [children, stopScramble])

  useEffect(() => {
    setText(children)
    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [children])

  return (
    <span
      onMouseEnter={startScramble}
      onMouseLeave={stopScramble}
      onFocus={startScramble}
      onBlur={stopScramble}
    >
      {text}
    </span>
  )
}
