# Fitra Pradipta — Portfolio

Personal portfolio built with Next.js. Profile, projects, education, and other
portfolio content are maintained locally in typed files under `src/data/`.

## Tech Stack

- Next.js App Router, React, and TypeScript
- Tailwind CSS
- Three.js for interactive 3D elements
- LRCLIB for song lyrics

## Run locally

```bash
npm install
npm run dev
```

## Updating content

Portfolio data lives in `src/data/`. Update `projects.ts`, `experience.ts`,
`education.ts`, `profile.ts`, or the corresponding data file. Project images
belong in `public/projects/`; certificates belong in `public/certificates/`.

The music player reads its track list from `src/data/music.ts`. Put audio files
in `public/music/` and add a track entry with the exact filename, title, and
artist. Audio files are ignored by Git; only add files you have permission to
redistribute. Lyrics are requested through the app's `/api/lyrics` route.
