'use client'

import Image from 'next/image'
import { useState } from 'react'
import type { Certificate } from '@/data/types'

export default function CertificatePreview({
  certificate,
}: {
  certificate: Certificate
}) {
  const [imageMissing, setImageMissing] = useState(false)

  return (
    <div className="relative aspect-[1.414] overflow-hidden border-b border-line bg-bg-2">
      {imageMissing ? (
        <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center text-muted">
          <i className="fa-regular fa-image text-2xl" aria-hidden="true" />
          <p className="text-sm font-medium">Certificate preview</p>
          <code className="break-all font-mono text-[10px]">
            public{certificate.file}
          </code>
        </div>
      ) : (
        <Image
          src={certificate.file}
          alt={`${certificate.title} certificate`}
          fill
          sizes="(min-width: 640px) 360px, 85vw"
          className="object-contain"
          onError={() => setImageMissing(true)}
        />
      )}
    </div>
  )
}
