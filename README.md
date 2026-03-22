# ResqLine Frontend

ResqLine is a mobile emergency reporting app built with Expo and React Native. It enables users to register and verify accounts, submit emergency reports with location and images, track report history, and access hotline information.

## Contents

1. Overview
2. Features
3. Tech Stack
4. Project Structure
5. Getting Started
6. Available Scripts
7. API Integration
8. App Flows
9. Troubleshooting
10. Additional Documentation

## Overview

This repository contains the frontend client for ResqLine. The app uses Expo Router for file-based navigation, React Query for async server state, and an Axios API layer with token handling via Secure Store.

Primary use cases:
- User onboarding with OTP verification
- Emergency report submission
- Recent report viewing and status tracking
- Hotline browsing
- Profile management

## Features

- OTP-based authentication flow
- Emergency report creation with category, description, location, and media
- Location detection utilities and location confirmation modal
- Report listing and filtering helpers
- Real-time report status synchronization via SignalR
- User profile update and account deletion screens
- Reusable UI components for headers, footers, cards, modals, and input fields

## Tech Stack

- React Native 0.81
- React 19
- Expo SDK 54
- Expo Router 6
- TypeScript
- Axios
- @tanstack/react-query
- @microsoft/signalr
- expo-location, expo-image-picker, expo-secure-store

## Project Structure

Key directories:

- app/(screens)/: Feature screens and user flows
- app/(tabs)/: Tab layout configuration
- app/_api/: API clients for auth, users, reports, and health endpoints
- app/_hooks/: Custom hooks such as API and location hooks
- app/_contexts/ and app/_providers/: App-level state and providers
- app/_utils/: Shared utility helpers (auth, camera, logging, notifications, filtering)
- app/components/: Reusable UI building blocks
- assets/: Icons and image assets
- scripts/: Utility scripts
- types/: Shared type declarations

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- Expo Go app (for physical device testing) or emulator/simulator setup

### Install

```bash
npm install
```

### Run

```bash
npm run start
```

Then choose a target from the Expo terminal UI:
- Android emulator/device
- iOS simulator/device
- Web browser

## Available Scripts

- npm run start: Start Expo development server
- npm run android: Start on Android
- npm run ios: Start on iOS
- npm run web: Start on Web

## API Integration

The API client is configured in app/_api/config.ts.

Current base URL:
- https://resqline-backend.onrender.com

Auth behavior:
- JWT is read from expo-secure-store and injected into request headers
- 401 responses clear auth storage and reset request correlation context

Real-time behavior:
- Live status updates are received via securely connected SignalR hubs (`/hub/Notification`).
- Updates instantly seed the React Query caches to keep frontend UI timelines perfectly synchronized with the admin dashboard.

Related API files:
- app/_api/auth.ts
- app/_api/user.ts
- app/_api/reports.ts
- app/_api/health.ts
- app/_hooks/useReportStatusSignalR.ts

## App Flows

Main flow areas in app/(screens)/:

- Welcome and onboarding
- Sign up and verification
- Login and OTP verification
- Home and emergency reporting
- Recent reports and report details
- Hotline screen
- Profile management and account deletion

## Troubleshooting

- Metro cache issues:

```bash
npx expo start -c
```

- Dependency mismatch after upgrades:

```bash
npx expo install --fix
```

- If location or media features do not work, verify runtime permissions on the device/emulator.

## Additional Documentation

- FRONTEND_DOCUMENTATION.md: Detailed architecture and screen/component documentation
- FLOW_CHART.md: Visual flow reference
- GANTT_CHART.md: Planning timeline reference
- app/_api/README.md: API usage details and examples

## Notes

- App metadata and native options are defined in app.json.
- The project is configured with Babel and Metro via babel.config.js and metro.config.js.
