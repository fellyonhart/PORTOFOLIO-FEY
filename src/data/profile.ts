import type { Profile } from './types'

export const profile: Profile = {
  name: 'Fitra Pradipta',
  greeting: 'Hi, I’m Fitra Pradipta',
  roleLead: "I'm",
  roles: ['Software Developer', 'Full-Stack Developer'],
  location: 'Indonesia',
  startYear: 2025,
  introduction: [
    { text: 'PPLG student and ' },
    { text: 'software developer', emphasis: true },
    { text: ' based in Indonesia. I build accessible, responsive web experiences and enjoy turning ideas into practical products with clean code.' },
  ],
  biography: [
    [
      { text: 'I am a PPLG student at ' },
      { text: 'SMK Wikrama Bogor', emphasis: true },
      { text: ' who focuses on software and web development. I learn by building complete projects, starting from interface design and implementation through to testing and deployment.' },
    ],
  ],
  actions: { about: 'See More About Me' },
  repository: {
    name: 'feylxs',
    href: 'https://github.com/feylxs',
  },
  headings: {
    about: "it's More About Me.",
    experience: 'My Experience',
    skills: 'Tech Stack That I Use.',
    education: 'My Education',
    projects: "it's My Projects.",
    contact: 'Find Me On.',
  },
}
