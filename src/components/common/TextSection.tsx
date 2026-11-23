type TextSectionProps = {
  text: string
  icon?: string
  eyebrow?: string
  classNames?: string
  showHighlight?: boolean
}

export default function TextSection({
  classNames,
  text,
  icon,
  eyebrow,
  showHighlight = true,
}: TextSectionProps) {
  return (
    <div
      data-section-reveal
      className={`relative font-semibold xl:text-xl ${classNames ?? ''}`}
    >
      {eyebrow && (
        <p className="mb-2 text-center font-mono text-xs font-medium uppercase tracking-[0.18em] text-muted">
          {eyebrow}
        </p>
      )}
      <p className="relative mx-auto w-fit text-2xl text-ink md:text-4xl">
        {showHighlight && (
          <span className="absolute bottom-0 -z-10 h-6 w-3/4 -translate-x-3 -rotate-2 rounded-md bg-pearl" />
        )}
        {icon && (
          <span className="mr-2 inline-block text-3xl md:text-[48px]">
            {icon}
          </span>
        )}
        {text}
      </p>
    </div>
  )
}
