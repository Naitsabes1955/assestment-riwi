# Riwi Messaging Platform

RIWI Messaging is a fullstack internal messaging platform built with a separated
Next.js backend, a separated Next.js frontend, PostgreSQL, JWT authentication,
Row Level Security, search, and a Gemini-powered assistant.

## Features

- User registration and login.
- JWT access tokens and rotating refresh tokens.
- Password hashing with bcrypt.
- PostgreSQL persistence with schema `rw`.
- Row Level Security for channel and message isolation.
- Runtime database access through the `rw_app` role.
- Channel list, message history, message sending, soft deletion, and search.
- Gemini assistant through the backend only.
- Web frontend with Spanish and English UI.
- Docker Compose for PostgreSQL, backend, and frontend.

## Architecture

The backend follows Clean Architecture:

```text
Frontend
  -> Backend / API
  -> Application
  -> Infrastructure
  -> PostgreSQL
```

The backend domain contains contracts and models. Application use cases
orchestrate behavior. Infrastructure implements PostgreSQL, JWT, bcrypt, and
Gemini adapters. Presentation exposes HTTP route handlers.

Gemini is accessed only by the backend through an `AiProvider` abstraction. The
frontend never receives the Gemini API key.

## Technologies

- Next.js
- React
- TypeScript
- Tailwind CSS
- PostgreSQL 16
- Docker Compose
- JWT with `jose`
- bcrypt
- Zod
- Google Gemini SDK

## Project Structure

```text
riwi-messaging/
├── backend/
├── frontend/
├── database/
├── docker-compose.yml
├── README.md
├── DECISIONS.md
└── DECISIONS.en.md
```

## Requirements

- Docker
- Docker Compose
- Node.js and npm for local development without Docker

## Environment Setup

Create the root environment file:

```bash
cp .env.example .env
```

Configure the required values. Do not commit real secrets.

Important variables:

```text
POSTGRES_DB=
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_PORT=5433
RW_APP_PASSWORD=

DATABASE_URL=
PG_SCHEMA=rw

JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
BCRYPT_ROUNDS=12

AI_PROVIDER=gemini
AI_API_KEY=
GEMINI_MODEL=gemini-2.0-flash

NEXT_PUBLIC_API_URL=http://localhost:3000
FRONTEND_ORIGIN=http://localhost:3001
```

`NEXT_PUBLIC_*` values are visible in the browser. Never expose `AI_API_KEY` as
a public frontend variable. The RIWI-inspired UI uses local CSS tokens in
`frontend/app/globals.css`; the palette is a blue, neutral adaptation for the
demo interface, not an official brand guide.

## Run with Docker

From the repository root:

```bash
docker compose up --build
```

Services:

- Frontend: http://localhost:3001
- Backend: http://localhost:3000
- PostgreSQL: localhost:5433 -> container port 5432

Inside Docker, the backend connects to PostgreSQL through:

```text
postgres:5432
```

The runtime database user is `rw_app`, not the PostgreSQL administrator.

## Run Locally

Start PostgreSQL with Docker Compose:

```bash
docker compose up postgres
```

Backend:

```bash
cd backend
npm install
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev -- -p 3001
```

For local backend development, `DATABASE_URL` normally points to
`localhost:5433`. For Docker backend runtime, it points to `postgres:5432`.

## API

Auth:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`

Users:

- `GET /api/users`
- `PATCH /api/users/:id`
- `DELETE /api/users/:id`

Channels:

- `GET /api/channels`
- `GET /api/channels/:channelId/access`

Messages:

- `GET /api/channels/:channelId/messages`
- `POST /api/channels/:channelId/messages`
- `DELETE /api/channels/:channelId/messages/:messageId`

Search:

- `GET /api/messages/search`

Copilot:

- `POST /api/copilot`

## Security

- JWT access tokens are used for protected endpoints.
- Refresh tokens rotate and are stored only as SHA-256 hashes in PostgreSQL.
- Passwords are hashed with bcrypt.
- The actor is read from the JWT, never from request body user IDs.
- PostgreSQL RLS enforces channel and message isolation.
- `app.current_user_id` is set per transaction before protected database work.
- The API runtime uses `rw_app`, which must not be superuser and must not bypass RLS.
- Presentation never builds SQL. Database access is centralized in backend
  infrastructure repositories and existing PostgreSQL functions/views.
- Secrets are provided through environment variables.
- The Gemini API key belongs only in backend environment variables.

## i18n

The frontend supports Spanish and English through JSON dictionaries in
`frontend/i18n`. Users can switch with the visible `ES | EN` control.

## Testing and Quality

Backend:

```bash
cd backend
npm run typecheck
npm run lint
npm test
npm run build
```

Frontend:

```bash
cd frontend
npm run typecheck
npm run lint
npm run build
```

The frontend package does not currently define an `npm test` script.

## Demo Flow

1. Open http://localhost:3001.
2. Register or log in.
3. Select an existing channel.
4. Read messages.
5. Send a message.
6. Search messages.
7. Ask Gemini about the selected channel.
8. Log out.

A newly registered user does not automatically belong to a channel. For the demo,
use existing seeded data or prepare channel membership separately through existing
database data.

## Troubleshooting

- If a port is busy, stop the process using that port or adjust the local command.
- If the backend fails at startup, check missing environment variables.
- If PostgreSQL is unavailable, verify Docker is running and the postgres service is healthy.
- If the frontend cannot call the backend, verify `NEXT_PUBLIC_API_URL` and CORS origin.
- If Gemini fails, verify `AI_PROVIDER`, `AI_API_KEY`, and `GEMINI_MODEL`.
- If Docker reports port `3000` or `3001` busy, stop the local Next.js process
  using that port before starting Compose.
