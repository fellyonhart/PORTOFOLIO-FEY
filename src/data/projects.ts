import type { Project } from './types'

export const projects: Project[] = [
  {
    title: 'HBD-V2',
    description:
      'An interactive birthday website with photo and video galleries, digital letters, wishes, an interactive cake, and confetti animations.',
    type: 'Web',
    tech: ['React', 'TypeScript', 'GSAP'],
    featured: true,
    year: 2026,
    repo: 'https://github.com/fellyonhart/HBD-V2',
  },
  {
    title: 'HBD-web — Digital Birthday Letter',
    description:
      'An interactive birthday-letter site with a password gate, animated envelope, story timeline, photo lightbox, message in a bottle, and a CSS cake.',
    type: 'Web',
    tech: ['React', 'GSAP', 'Lenis', 'Vite'],
    featured: true,
    repo: 'https://github.com/fellyonhart/HBD-web',
  },
  {
    title: 'Pinnaz',
    description:
      'A personal page for keeping shared stories, photos, and letters, with a timeline, lightbox gallery, and interactive envelopes.',
    type: 'Web',
    tech: ['HTML', 'CSS', 'JavaScript', 'GSAP', 'Lenis'],
    featured: true,
    repo: 'https://github.com/fellyonhart/Finrk-Web',
  },
  {
    title: 'To-do List',
    description:
      'A dependency-free task list with categories, priorities, reminders while the page is open, and JSON import/export.',
    type: 'Web',
    tech: ['HTML', 'CSS', 'JavaScript'],
    featured: true,
    repo: 'https://github.com/fellyonhart/TDO-LIST-cenah',
  },
  {
    title: 'duit.io',
    description:
      'A lightweight personal finance app for tracking income, expenses, and balance, with data saved in browser localStorage.',
    type: 'Web',
    tech: ['HTML', 'CSS', 'JavaScript'],
    featured: true,
    year: 2026,
    demo: 'https://expense-tracker-nfy.vercel.app',
    repo: 'https://github.com/fellyonhart/Expanse-tracker-duit',
  },
  {
    title: 'Scuba Dance',
    description:
      'An interactive hand-tracking experience built with Canvas 2D and MediaPipe.',
    type: 'Web',
    tech: ['JavaScript', 'MediaPipe', 'Canvas 2D'],
    featured: true,
    year: 2026,
    demo: 'https://kicawz.vercel.app',
    repo: 'https://github.com/fellyonhart/scuba-dance',
  },
  {
    title: 'Nilai Cek',
    description:
      'A lightweight vanilla JavaScript app for recording exam scores and calculating averages, with localStorage persistence.',
    type: 'Web',
    tech: ['JavaScript'],
    featured: false,
    year: 2026,
    repo: 'https://github.com/fellyonhart/NILAI-CEKKK',
  },
  {
    title: 'Hand Love',
    description: 'A hand-tracking project with a blue-themed interface.',
    type: 'Web',
    tech: ['JavaScript', 'MediaPipe', 'OpenCV'],
    featured: false,
    year: 2026,
    repo: 'https://github.com/fellyonhart/hand-love',
  },
  {
    title: 'PPLG Virtual Lab',
    description:
      'An interactive JavaScript learning lab with loop simulations, visual traces, quizzes, and XP-based progress.',
    type: 'Web',
    tech: ['JavaScript'],
    featured: true,
    year: 2026,
    demo: 'https://pplglab.vercel.app/labvirtual.html?view=lab',
  },
  {
    title: 'Kelompok 3 — Hasil Pembelajaran',
    description:
      'A group learning portal for Mathematics, PAIBP, and Islamic history, with class data lookup and member profiles.',
    type: 'Web',
    tech: ['HTML', 'CSS', 'JavaScript'],
    featured: true,
    year: 2026,
    demo: 'https://klompoktilu.vercel.app/index.html',
  },
]
