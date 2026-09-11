# RideFlex

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-backend-3ECF8E?logo=supabase&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-tests-6E9F18?logo=vitest&logoColor=white)

**RideFlex** is a web application for flexible ride sharing. It brings drivers and passengers together around trips, requests, profiles, messaging, notifications, ratings, payments and identity verification.

The current codebase is an interactive product prototype with authentication and a Supabase-oriented backend architecture.

## What is implemented

- User authentication and onboarding
- Passenger and driver flows
- Trip search and trip details
- Trip publishing and trip requests
- Driver dashboard and trip management
- Booking confirmation
- In-app messaging and chat
- Notifications and push-notification hook
- Public user profiles and profile editing
- Ratings after trips
- Payment-method management UI
- Identity-verification flow
- Settings and responsive layouts
- Error boundary to recover from UI crashes

## Main application flows

The application is a single-page experience with internal page state rather than a URL route for every product screen. Current screens include:

`home` · `search` · `publish` · `messages` · `profile` · `auth` · `onboarding` · `driver-dashboard` · `trip-detail` · `booking-confirmation` · `chat` · `notifications` · `my-trips` · `settings` · `rating` · `payment-methods` · `identity-verification` · `booking-requests` · `publish-request` · `trip-requests` · `user-profile`

## Tech stack

- **React 18 + TypeScript** for the application UI
- **Vite 5** for development and builds
- **Supabase** for backend integration
- **TanStack Query** for server-state handling
- **React Hook Form + Zod** for form handling and validation
- **Tailwind CSS + Radix UI** for the interface
- **Framer Motion** for motion and interaction
- **Mapbox GL** for map-oriented experiences
- **Vitest + Testing Library + Playwright** for the available test tooling

## Project structure

```text
src/
├── components/rideflex/   # RideFlex-specific UI components
├── components/ui/         # Shared UI primitives
├── contexts/              # Authentication and user-mode state
├── hooks/                 # Application hooks
├── pages/                 # Product screens
├── integrations/          # Backend/integration code
└── lib/                   # Shared utilities
```

## Local development

### Requirements

- Node.js
- npm

### Install

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

### Tests

```bash
npm run test
```

For continuous test execution:

```bash
npm run test:watch
```

## Status

RideFlex is currently an actively developed product prototype. The UI already covers a broad ride-sharing workflow, while backend behavior and production-readiness should be evaluated separately from the presence of the corresponding screens.

## License

No explicit license file was identified in the current repository. Treat the project as **all rights reserved** unless a license is added.