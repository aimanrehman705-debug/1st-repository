# WhatsX Backend

## Setup

1. Copy `.env.example` to `.env` and fill values.
2. Install deps:

```bash
npm install
npm run dev
```

## Endpoints
- `GET /health`
- `POST /auth/register`
- `GET /auth/me` (requires Bearer token)
- `GET /users` (admin)
- `GET /templates` (auth)
- `POST /templates` (admin)
- `POST /messages/send` (auth)
- `POST /messages/schedule` (auth)
