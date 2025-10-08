# WhatsX – Advanced WhatsApp Messaging & Automation

Production-ready full-stack app for WhatsApp bulk messaging, scheduling, templates, and admin analytics.

## Tech Stack
- Frontend: React + TypeScript + Vite, TailwindCSS, Recharts, Firebase SDK, lucide-react
- Backend: Node.js + Express, Firebase Admin SDK, node-cron, axios
- Database & Auth: Firebase Authentication + Firestore

## Features
- Firebase Auth (email/password), role-based UI (admin/user)
- Bulk messaging: manual recipients, CSV upload, deduping
- Templates with variables: `Hello {{name}}, your appointment is at {{time}}.`
- Scheduling with cron; automated delivery when due
- Message logs (user-specific and admin all)
- Admin dashboard stats + chart (users, sent today, scheduled pending)
- Dark mode toggle

## Monorepo Layout
```
/backend
  src/
    config/ (env, firebase admin init)
    controllers/ (auth, users, messages, templates)
    middlewares/ (auth, errorHandler)
    routes/ (express routers)
    services/ (whatsapp send, scheduler)
    server.js (express app)
  package.json, .env.example
/frontend
  src/
    components/ (Layout, ThemeToggle, Card)
    hooks/ (useAuth)
    pages/ (Login, Register, Dashboard, Messages, Templates, Users, Logs)
    services/ (api, firebase)
    App.tsx, main.tsx, styles.css
  package.json, tailwind.config.ts, vite.config.ts
```

## Prerequisites
- Node.js 18+
- Firebase project with Authentication and Firestore enabled

## Backend Setup
1. Copy env and fill values:
   ```bash
   cp backend/.env.example backend/.env
   ```
   - Prefer using `FIREBASE_SERVICE_ACCOUNT_B64` (base64 of full JSON service account). Alternatively set `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY` (escape newlines as `\\n`).
   - Optional: set `WHATSAPP_TOKEN` and `WHATSAPP_PHONE_NUMBER_ID` for real sends; otherwise sends are simulated.

2. Install and run:
   ```bash
   cd backend
   npm install
   npm run dev
   # Server on http://localhost:4000
   ```

3. API Endpoints (summary)
   - `POST /auth/register` – server-side create user (admin if allowed)
   - `GET /auth/me` – current user info (requires Authorization)
   - `GET /users` – list users (admin)
   - `POST /users` – create user (admin)
   - `PUT /users/:uid` – update (role, etc.) (admin)
   - `DELETE /users/:uid` – delete (admin)
   - `GET /templates` – list (all)
   - `POST /templates` – create (admin)
   - `PUT /templates/:id` – update (admin)
   - `DELETE /templates/:id` – delete (admin)
   - `GET /messages/me` – my logs
   - `POST /messages/send` – send now
   - `POST /messages/schedule` – schedule later (ISO datetime)
   - `POST /messages/upload-csv` – send from CSV (string body)
   - `GET /messages/admin/all` – all logs (admin)
   - `GET /messages/admin/stats` – dashboard metrics (admin)

## Frontend Setup
1. Create a `.env` file in `frontend` with Firebase and API base URL:
   ```bash
   cat > frontend/.env <<'EOF'
   VITE_API_BASE_URL=http://localhost:4000
   VITE_FIREBASE_API_KEY=your-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
   VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef
   EOF
   ```

2. Install and run dev server:
   ```bash
   cd frontend
   npm install
   npm run dev
   # App on http://localhost:5173
   ```

3. Login/Register
   - Register via frontend. Server default allows open registration; the first admin can be created via `/auth/register` payload `{ role: "admin" }` if `ALLOW_OPEN_REGISTRATION=true`.
   - After login, the frontend acquires an ID token and calls the backend with `Authorization: Bearer <token>`.

## Deployment Notes
- Frontend: Deploy to Vercel/Netlify; set the `.env` VITE_* variables accordingly.
- Backend: Deploy to Render/Fly/your infra. Ensure env variables and service account are set. `PORT` is respected. Enable persistent cron runner (the app's node process hosts `node-cron`).
- Firestore security: Backend uses Admin SDK; ensure least-privilege access to the service account and store credentials securely.

## WhatsApp Cloud API Integration
- To enable real sends, set `WHATSAPP_TOKEN` and `WHATSAPP_PHONE_NUMBER_ID` in backend `.env`.
- Current implementation sends simple text messages; extend `sendWhatsAppMessage` to support media.

## Notes on Templates & Variables
- Use placeholders `{{name}}` and `{{time}}` within template content. Frontend accepts JSON variables; backend replaces placeholders before sending/scheduling.

## Development Tips
- Tailwind dark mode enabled via class; theme toggle persists in `localStorage`.
- The scheduler runs every minute by default; adjust `CRON_SCHEDULE` if needed.
- For Firestore timestamps, UI handles both JS Dates and Firestore Timestamps.
