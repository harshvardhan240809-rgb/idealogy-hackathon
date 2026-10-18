# VishPath

VishPath is a demo-first emergency referral intelligence prototype for rural and tribal communities in Madhya Pradesh. It helps users identify facilities that are nearby, verified, and more likely to be suitable for emergency referral scenarios.

This project is intentionally built as a presentation-ready prototype and runs in demo mode by default when MongoDB is not configured.

## What it includes

- Emergency facility map with filters, search, and route previews
- Verification status display with timestamps and trust indicators
- Facility detail views and safety messaging
- Admin dashboard for updating facility data
- MongoDB-backed facility API with localStorage demo fallback
- Demo-mode fallback when external services are unavailable

## Stack

- React + Vite
- React Router
- Leaflet + React Leaflet
- Express + Mongoose
- MongoDB facility collection with browser storage fallback

## Run locally

Install dependencies:

npm install

Start the API:

npm run dev:api

Start the frontend:

npm run dev -- --host 0.0.0.0

### Connect MongoDB facility data

Copy `.env.example` to `.env` and set `MONGODB_URI` to a local MongoDB or MongoDB Atlas connection string. Keep `.env` private; it is ignored by Git. The API reads and writes facility documents in the `facilities` collection. Records should include an `id`, `name`, `district`, coordinates, `status`, verification fields, and any available readiness fields used by the app.

Start the API with `npm run dev:api` and the frontend with `npm run dev`. The homepage identifies whether records came from MongoDB, the demo API, or browser storage. With no MongoDB URI, the API uses demo records. If MongoDB is configured but unavailable, API requests report that failure instead of silently substituting demo records.

The app is available at http://localhost:5174/ in the current environment, and the demo API at http://localhost:4000/api/health.

## Production build

npm run build

## Final judge demo script

1. Open the homepage and introduce the problem: the nearest hospital is not always the most suitable hospital during a time-critical emergency.
2. Move to the emergency map and explain the live filter system, the verified-only filter, and the distance-based ranking.
3. Highlight the status badges and timestamps: users can see when a facility was checked and whether its verification is fresh or aging.
4. Select a facility and explain the verification logic: ASV availability, trained staff, and emergency care readiness.
5. Show the route panel: route preview, distance, and navigation handoff.
6. Open the dashboard and explain how updates are reflected in the map in real time in demo mode.
7. Close with the product value: faster and more informed emergency referral decisions without making medical claims.

## Final handoff notes

- This is a demo prototype for user experience and product validation, not a clinical or production-grade medical system.
- The app intentionally avoids diagnosis, treatment advice, or unverified capability claims.
- MongoDB is optional; without `MONGODB_URI`, the API runs in demo mode. Browser-only mode is used if the API is not running.
- The emergency map is designed to prioritize clarity and trust over raw medical certainty.

## Safety note

This is a prototype for referral visibility and coordination, not a diagnostic or treatment system. It should not be treated as medical advice or a live clinical assurance platform.
