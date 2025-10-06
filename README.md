# WhatsX – Advanced WhatsApp Messaging & Automation

A production-ready, full-stack web app for WhatsApp bulk messaging, scheduling, templates with variables, and admin analytics.

## Tech Stack
- Frontend: React + TypeScript + Vite, TailwindCSS, Chart.js, React Router, Firebase SDK
- Backend: Node.js + Express, Firebase Admin SDK, Firestore, node-cron

## Monorepo Structure

```
frontend/
backend/
```

## Prerequisites
- Node.js 18+
- Firebase project with Firestore + Auth enabled
- (Optional) WhatsApp Cloud API token + phone number id

## Setup

1) Clone env examples

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

2) Fill environment variables
- Backend `.env`: Firebase Admin credentials; WhatsApp API credentials; CORS origin
- Frontend `.env`: Backend URL and Firebase web config

3) Install dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

4) Run locally (two terminals)

```bash
# Backend
cd backend && npm run dev

# Frontend
cd frontend && npm run dev
```

Open http://localhost:5173.

## Deployment
- Frontend: Deploy `frontend` to Vercel/Netlify. Ensure env vars are set.
- Backend: Deploy `backend` to Render/Fly/Cloud Run. Ensure env vars and port are configured. `npm start` runs the server.

## Notes
- If WhatsApp credentials are not provided, backend simulates send operations for development.
- Scheduler runs every minute to deliver due scheduled messages.
