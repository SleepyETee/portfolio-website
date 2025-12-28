# Long Nguyen - Portfolio Website

🌐 **Live Demo:** [portfolio-website-beta-ten-31.vercel.app](https://portfolio-website-beta-ten-31.vercel.app/)

A modern, responsive portfolio website built with React, TypeScript, and Styled Components. Features smooth animations, dark/light theme toggle, and GitHub integration.

![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-3178C6?logo=typescript)
![Styled Components](https://img.shields.io/badge/Styled_Components-6.1.19-DB7093?logo=styled-components)

## Features

- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **Dark/Light Theme** - Toggle between themes with smooth transitions
- **GitHub Integration** - Automatically fetches and displays GitHub repositories
- **Smooth Animations** - Page transitions and micro-interactions using Framer Motion
- **Custom Cursor** - Interactive cursor effect on desktop devices
- **Contact Form** - EmailJS integration for direct messaging
- **SEO Optimized** - Meta tags and semantic HTML for better search visibility

## Tech Stack

- **Frontend:** React 19, TypeScript
- **Styling:** Styled Components, CSS-in-JS
- **Animations:** Framer Motion, VANTA.js (bird animation)
- **Routing:** React Router DOM v7
- **Icons:** Font Awesome
- **Email:** EmailJS
- **API:** GitHub REST API

## Project Structure

```
portfolio-website/
├── public/
│   ├── index.html          # HTML template with SEO meta tags
│   ├── manifest.json       # PWA manifest
│   └── Logo3.png           # Site logo & favicon
├── src/
│   ├── components/
│   │   ├── effects/        # Visual effects & animations
│   │   │   ├── Particles.tsx
│   │   │   ├── DarkThemeParticles.tsx
│   │   │   ├── ThemeBackground.tsx
│   │   │   └── VantaBirds.tsx
│   │   ├── layout/         # Layout components
│   │   │   ├── Navbar.tsx
│   │   │   └── PageNavigation.tsx
│   │   ├── pages/          # Page components
│   │   │   ├── Home.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Projects.tsx
│   │   │   └── Contact.tsx
│   │   └── ui/             # UI components
│   │       └── CustomCursor.tsx
│   ├── hooks/              # Custom React hooks
│   │   └── useGitHub.ts
│   ├── services/           # API services
│   │   └── github.ts
│   ├── styles/             # Theme & styling
│   │   ├── theme.ts
│   │   └── ThemeContext.tsx
│   ├── App.tsx             # Main app component
│   └── index.tsx           # Entry point
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore rules
├── CONTRIBUTING.md         # Contribution guidelines
├── LICENSE                 # MIT License
├── README.md               # Project documentation
├── package.json            # Dependencies & scripts
└── tsconfig.json           # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/sleepyetee/portfolio-website.git
cd portfolio-website
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Configuration

### GitHub Integration

The portfolio automatically fetches data from GitHub. Update your username in:
- `src/services/github.ts` (line 147)
- `src/hooks/useGitHub.ts` (line 10)

### Email Contact Form

To enable the contact form, create an account at [EmailJS](https://emailjs.com) and update:
- `src/components/Contact.tsx` (lines 201-205)

```typescript
await emailjs.sendForm(
  'YOUR_SERVICE_ID',
  'YOUR_TEMPLATE_ID',
  formRef.current,
  'YOUR_PUBLIC_KEY'
);
```

### Personal Information

Update your details in:
- `src/components/About.tsx` - Profile info, skills, experience, education
- `src/components/Home.tsx` - Name and headline
- `public/index.html` - Page title and meta tags

## Build

Create a production build:
```bash
npm run build
```

The build folder contains optimized static files ready for deployment.

## Deployment

This project can be deployed to:
- **Vercel** (Recommended) - [vercel.com](https://vercel.com)
- **Netlify** - [netlify.com](https://netlify.com)
- **GitHub Pages** - Using gh-pages package

## License

This project is open source and available under the [MIT License](LICENSE).

## Author

**Long Nguyen**
- GitHub: [@sleepyetee](https://github.com/sleepyetee)
- LinkedIn: [long-nguyen](https://linkedin.com/in/long-nguyen)

---

If you found this project helpful, please give it a star!
