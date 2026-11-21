'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { ButtonPets } from './buttonPets'

const Pets = dynamic(() => import('./Pets'), { ssr: false })

export function Settings() {
  const [petsEnabled, setPetsEnabled] = useState(true)
  const [petsReady, setPetsReady] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setPetsReady(true), 1250)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <>
      <div className="fixed bottom-6 left-6 z-20 hidden md:flex">
        <button
          type="button"
          onClick={() => setPetsEnabled((e) => !e)}
          aria-label={petsEnabled ? 'Hide pixel pets' : 'Show pixel pets'}
          title={petsEnabled ? 'Hide pixel pets' : 'Show pixel pets'}
          aria-pressed={petsEnabled}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-gold bg-gold text-bg shadow-soft transition-transform hover:rotate-12"
        >
          <ButtonPets isEnable={petsEnabled} />
        </button>
      </div>
      {petsReady && petsEnabled && <Pets />}
    </>
  )
}
