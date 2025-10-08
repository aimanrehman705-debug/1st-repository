# WhatsX Deployment Guide

This guide covers deploying the WhatsX frontend and backend.

## Prerequisites
- Node.js 18+
- Firebase project with Authentication and Firestore enabled
- (Optional) WhatsApp Cloud API credentials

## Backend (Render/other Node host)
1. Create a new Web Service, point to `/backend`, command: `node src/server.js`.
2. Set env vars from `backend/.env.example`:
   - `PORT` (Render provides)
   - `CORS_ORIGIN` (your frontend URL)
   - `FIREBASE_SERVICE_ACCOUNT_B64` (base64 of service account JSON)
   - Optional `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`
3. Enable persistent instance so `node-cron` can run.

## Frontend (Vercel/Netlify)
1. Build command: `npm run build`, output dir: `dist`.
2. Env vars:
   - `VITE_API_BASE_URL` (backend URL)
   - `VITE_FIREBASE_*` (web config from Firebase console)
3. Set cache headers as desired.

## Firebase Rules
See `firestore.rules.example` and apply via Firebase console or CLI.

## WhatsApp Cloud API
Set backend env `WHATSAPP_TOKEN` and `WHATSAPP_PHONE_NUMBER_ID`. When omitted, sends are simulated.
