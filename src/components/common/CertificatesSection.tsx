import type { Certificate } from '@/data/types'
import CertificatePreview from '@/components/common/CertificatePreview'

export default function CertificatesSection({
  certificates,
}: {
  certificates: Certificate[]
}) {
  return (
    <section className="mt-20 border-t border-line pt-12">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-muted">
            {'// certificates'}
          </p>
          <h2 className="text-2xl font-bold text-ink md:text-3xl">
            Certificates
          </h2>
        </div>
        <p className="font-mono text-xs text-muted">
          {String(certificates.length).padStart(2, '0')} certificates
        </p>
      </div>

      <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {certificates.map((certificate) => (
          <li
            key={certificate.file}
            className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-card/60 transition-colors hover:border-gold/60"
          >
            <CertificatePreview certificate={certificate} />
            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="font-mono text-xs uppercase tracking-wider text-muted">
                  {certificate.issuer}
                </p>
                {certificate.issuedAt && (
                  <span className="shrink-0 font-mono text-[10px] text-muted">
                    {certificate.issuedAt}
                  </span>
                )}
              </div>
              <h3 className="mt-3 flex-1 text-base font-semibold leading-snug text-ink">
                {certificate.title}
              </h3>
              <div className="mt-5 border-t border-line pt-3">
                <a
                  href={certificate.href ?? certificate.file}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 font-mono text-xs font-semibold text-ink transition-colors group-hover:text-gold-deep"
                >
                  View certificate
                  <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" />
                </a>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
