import TextSection from '@/components/common/TextSection'

export default function Resume() {
  return (
    <div className="flex min-h-[50svh] flex-col items-center justify-center">
      <TextSection
        eyebrow="Resume"
        icon="🛠️"
        text="Dalam Pembuatan"
      />
      <p className="mt-5 max-w-lg text-center leading-relaxed text-muted">
        Halaman resume sedang disiapkan. Silakan kembali lagi nanti.
      </p>
    </div>
  )
}
