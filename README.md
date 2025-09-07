# Engineer's Day - ICT Department Website

A modern, interactive website for the ICT Department's Engineer's Day celebration, featuring club information, events, and seamless navigation.

## Project info

**URL**: https://lovable.dev/projects/6f7a5d9a-7341-4da9-b998-853e18d02b06

## Project Overview

This website serves as the central hub for the ICT Department's Engineer's Day festivities, showcasing various technical clubs, their activities, and upcoming events. The platform provides detailed information about each club including their vision, mission, core committee, and hosted events.

## Features

- **Smooth Navigation**: Seamless scrolling between sections (Events, About ICT, Contact)
- **Interactive Club Cards**: Click on any club to view detailed information
- **Club Detail Pages**: Comprehensive pages for each club featuring:
  - Club Vision & Mission
  - Core Committee Information
  - Events hosted on Engineer's Day
  - Contact details (Convener, Deputy Convener, Faculty)
- **Responsive Design**: Optimized for all device sizes
- **Modern UI**: Clean, professional interface with custom club logos

## Featured Clubs

1. **Competitive Programming Club** - Master algorithms, data structures, and problem-solving skills
2. **Data Science Club** - Dive into AI, ML, and data analytics
3. **Circuitology Club** - Explore hardware, circuits, and embedded systems
4. **Cloud Computing and DevOps Club** - Learn cybersecurity and network technologies

## Technologies Used

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Routing**: React Router v6
- **Icons**: Lucide React

### Installation

\`\`\`bash

# Clone the repository

git clone <https://github.com/Ansh0308/engiday-connect>

# Navigate to project directory

cd engidayconnect

# Install dependencies

npm install

# Start development server

npm run dev
\`\`\`

### Available Scripts

\`\`\`bash
npm run dev # Start development server
npm run build # Build for production
npm run preview # Preview production build
npm run lint # Run ESLint
\`\`\`

## Project Structure

\`\`\`
src/
├── components/
│ ├── events/ # Event-related components
│ ├── layout/ # Navigation and layout components
│ └── sections/ # Page sections (About, Contact, etc.)
├── data/
│ └── clubsData.ts # Club information and data
├── pages/
│ ├── Index.tsx # Main homepage
│ └── ClubDetail.tsx # Individual club pages
└── App.tsx # Main application component
\`\`\`

## Navigation

- **Home**: Main landing page with hero section
- **Events**: Information about Engineer's Day events
- **About ICT**: Details about the ICT Department and clubs
- **Contact**: Department and club contact information
- **Club Pages**: Individual pages accessible by clicking club cards

**Developed by Competitive Programming Club, Marwadi University**
