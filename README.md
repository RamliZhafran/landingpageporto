# ramlizhafran's space

A personal portfolio website for Ramli Zhafran. The site presents a quiet, desktop-inspired space with draggable windows, social links, a photo gallery, Discord presence, and Spotify activity.

Live site: https://ramlizhafran.vercel.app/

## Website Overview

This website is built as a modern single-page React application. The interface uses an OS-style layout where content is opened through interactive windows such as:

- `about.txt` for a short personal introduction
- `links.html` for social profiles
- `gallery.jpg` for personal photos
- `discord.exe` for live Discord and Spotify presence

The design focuses on a minimal dark theme, responsive layouts, smooth animation, and small interactive details such as window dragging, sound feedback, image previews, and animated background stars.

## Main Features

- Desktop-style draggable windows
- Mobile-friendly bottom-sheet window layout
- Personal profile and social links
- Responsive image gallery with full-size preview
- Discord status display using the Lanyard WebSocket API
- Spotify listening card through Discord/Lanyard activity data
- Decrypted text animation for the main heading
- Canvas-based animated star background with mouse interaction
- Simple sound effects with a mute toggle
- Deployment-ready static frontend hosted on Vercel

## Tech Stack

### Core

- React 19
- TypeScript
- Vite
- Tailwind CSS v4

### UI and Interaction

- Framer Motion
- Motion for React
- Lucide React
- CSS utility classes through Tailwind CSS
- HTML Canvas API for the animated background

### Live Presence

- Lanyard API
- Discord Presence data
- Spotify activity data from Discord connections

### Deployment

- Vercel

## Stack Documentation and Learning Sources

### React

React is used to build the user interface with reusable components and state-based rendering.

- Official React documentation: https://react.dev/
- React learning guide: https://react.dev/learn
- React hooks reference: https://react.dev/reference/react/hooks

### TypeScript

TypeScript adds static typing to JavaScript, making components, props, state, and API data safer and easier to maintain.

- Official TypeScript documentation: https://www.typescriptlang.org/docs/
- TypeScript handbook: https://www.typescriptlang.org/docs/handbook/intro.html
- TypeScript for React: https://react.dev/learn/typescript

### Vite

Vite is the frontend build tool used for fast development and optimized production builds.

- Official Vite documentation: https://vite.dev/guide/
- Vite React plugin: https://github.com/vitejs/vite-plugin-react
- Vite deployment guide: https://vite.dev/guide/static-deploy

### Tailwind CSS

Tailwind CSS is used for styling the layout, spacing, colors, responsive behavior, and visual states directly through utility classes.

- Official Tailwind CSS documentation: https://tailwindcss.com/docs
- Tailwind CSS installation with Vite: https://tailwindcss.com/docs/installation/using-vite
- Tailwind responsive design: https://tailwindcss.com/docs/responsive-design

### Framer Motion and Motion

Framer Motion and Motion are used for animated windows, transitions, and text effects.

- Motion documentation: https://motion.dev/docs/react
- Framer Motion examples: https://www.framer.com/motion/examples/
- Animation concepts for React: https://motion.dev/docs/react-animation

### Lucide React

Lucide React provides lightweight icon components used in the interface buttons and controls.

- Lucide React documentation: https://lucide.dev/guide/packages/lucide-react
- Lucide icon library: https://lucide.dev/icons/

### Lanyard API

Lanyard provides real-time Discord presence data through an API and WebSocket connection. This website uses it to display Discord status, activities, and Spotify listening information.

- Lanyard website: https://lanyard.rest/
- Lanyard GitHub repository: https://github.com/Phineas/lanyard
- Lanyard API documentation: https://github.com/Phineas/lanyard/blob/main/README.md

### Discord Presence and Spotify Activity

Discord Rich Presence and connected Spotify activity are used as live data sources through Lanyard.

- Discord developer documentation: https://discord.com/developers/docs
- Discord Rich Presence overview: https://discord.com/developers/docs/rich-presence/overview
- Spotify for Developers: https://developer.spotify.com/documentation/web-api

### HTML Canvas

The animated star background is drawn using the HTML Canvas API.

- MDN Canvas API documentation: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
- Canvas tutorial: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial
- requestAnimationFrame: https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame

### Vercel

Vercel is used to host and deploy the static frontend website.

- Vercel documentation: https://vercel.com/docs
- Vercel frontend frameworks guide: https://vercel.com/docs/frameworks
- Deploying Vite on Vercel: https://vercel.com/docs/frameworks/vite

## Project Structure

```text
public/
  assets/
    img/        Static gallery images
  sfx/          Interface sound effects
src/
  components/  Reusable React components
  App.tsx      Main application layout and window logic
  index.css    Global styles and Tailwind CSS imports
vite.config.ts Vite and plugin configuration
```

## Purpose

This project is a personal web space and portfolio experiment. It combines frontend development, UI animation, live presence data, responsive design, and simple creative interaction into one website.
