import type { Profile } from './types'

export const profile: Profile = {
  name: 'Fitra Pradipta',
  greeting: 'Hi, Folks',
  roleLead: "I'm",
  roles: ['Junior Web Developer', 'Fullstack Developer'],
  location: 'Indonesia',
  startYear: 2025,
  introduction: [
    { text: 'I am a ' },
    { text: 'Student', emphasis: true },
    {
      text: ' from Indonesia, I have a strong understanding of programming languages and have experience in ',
    },
    { text: 'aspiring full-stack developer', emphasis: true },
    { text: ' projects.' },
  ],
  biography: [
    [
      { text: 'I am a new Student ' },
      { text: 'Informatics Engineering', emphasis: true },
      {
        text: ' At SMK Wikrama Bogor ',
      },
      { text: 'software development', emphasis: true },
      {
        text: ' projects. My current focus is on deepening my knowledge in the field of ',
      },
      { text: 'web & android development', emphasis: true },
      { text: '.' },
    ],
    [
      { text: 'I have hands-on experience with ' },
      { text: 'ReactJS', emphasis: true },
      { text: ' and ' },
      { text: 'NextJS', emphasis: true },
      { text: ' for the frontend. and using ' },
      { text: 'Node JS', emphasis: true },
      { text: ', ' },
      { text: 'SQLITE', emphasis: true },
      { text: ' for backend development.'}
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
