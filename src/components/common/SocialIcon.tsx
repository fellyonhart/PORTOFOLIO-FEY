export default function SocialIcon({ name }: { name: string }) {
  const iconByName: Record<string, string> = {
    github: 'fa-brands fa-github',
    linkedin: 'fa-brands fa-linkedin',
    instagram: 'fa-brands fa-instagram',
    twitter: 'fa-brands fa-x-twitter',
    gmail: 'fa-solid fa-envelope',
    discord: 'fa-brands fa-discord',
    telegram: 'fa-brands fa-telegram',
  }

  return (
    <i
      className={iconByName[name.toLowerCase()] ?? 'fa-solid fa-link'}
      aria-hidden="true"
    />
  )
}
