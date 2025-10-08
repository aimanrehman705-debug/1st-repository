# WhatsX Viva Guide

## Demo Flow (5–7 minutes)
1. Login/Register
   - Show registration and login.
   - Explain roles (admin vs user).
2. Dashboard (Admin)
   - Show KPIs and chart; mention data comes from Firestore.
3. Templates (Admin)
   - Create/edit/delete a template with variables `{{name}}`.
4. Messages
   - Manual Entry: add recipients, choose template, variables render preview, send now.
   - CSV Upload: upload `name,phone` file, duplicates auto-removed.
   - Schedule for later using date-time picker.
   - Show optional image attachment placeholder.
5. Logs
   - Live logs list; search, filter, CSV export.
   - Admin sees all; user sees their own.
6. Users (Admin)
   - Add user, change role, delete.
7. Dark Mode
   - Toggle theme to show polished UI.

## Talking Points
- Clean modular architecture (React TS + Express + Firebase).
- Template variable system per recipient.
- Scheduler with `node-cron` and Firestore polling.
- Security: role-based claims; backend verifies ID tokens.

## Q&A Prep
- How are duplicates handled? (normalized phone, Set-based dedupe).
- How to enable WhatsApp real sends? (set token and phone number ID).
- Scaling? (paginate queries, limit snapshot size, add worker/queue).
