# Architectural Decisions

## Decision: Clean Architecture in the backend

### Context

The backend needs to keep domain rules, use cases, infrastructure, and HTTP
exposure separated.

### Decision

The backend is organized into `domain`, `application`, `infrastructure`, and
`presentation`, with Next.js routes in `backend/app/api`.

### Rationale

This separation keeps the domain independent from Next.js, PostgreSQL, JWT,
bcrypt, and Gemini.

### Consequences

Route handlers stay thin and delegate to use cases. New endpoints must respect
the existing layers.

## Decision: PostgreSQL as persistence and critical-rule source

### Context

Messaging requires consistency, channel authorization, and transactional
operations.

### Decision

PostgreSQL stores users, channels, members, messages, read states, and refresh
tokens. Existing SQL functions handle sending, history, search, copilot context,
and logical deletion.

### Rationale

Keeping critical rules in PostgreSQL reduces duplication in TypeScript and keeps
security close to the data.

### Consequences

The backend must call existing functions and views instead of duplicating
permission or search logic.

## Decision: RLS for data isolation

### Context

No user should read, search, or send content in channels where they are not a
member.

### Decision

Row Level Security is used on channels and messages. The backend sets
`app.current_user_id` per transaction from the authenticated actor.

### Rationale

RLS makes PostgreSQL the final enforcement layer for user and channel isolation.

### Consequences

Every protected operation must run with the actor obtained from JWT, never from
the client.

## Decision: `rw_app` runtime role

### Context

The API must not run with administrative privileges.

### Decision

Runtime connections use `rw_app`. Configuration validates that `DATABASE_URL`
uses this user.

### Rationale

A role without superuser or BYPASSRLS prevents bypassing security policies.

### Consequences

Inside Docker, `DATABASE_URL` points to
`postgresql://rw_app:...@postgres:5432/...`.

## Decision: JWT and refresh token rotation

### Context

The application needs secure web sessions with short-lived tokens.

### Decision

The backend issues JWT access tokens and rotating refresh tokens. Refresh tokens
are stored as SHA-256 hashes in PostgreSQL.

### Rationale

Short-lived access tokens reduce exposure, and rotation enables session
revocation.

### Consequences

The frontend stores the JSON session and asks for a refresh when a response
returns 401.

## Decision: Gemini behind `AiProvider`

### Context

The assistant must answer using permitted context without exposing secrets to the
frontend.

### Decision

Gemini lives in the backend behind the `AiProvider` contract, and the frontend
only uses `POST /api/copilot`.

### Rationale

This keeps the API key on the server and allows provider replacement without
coupling use cases to the UI.

### Consequences

`AI_API_KEY` must be configured as a backend environment variable. There is no
`NEXT_PUBLIC_AI_API_KEY`.

## Decision: Frontend separated from backend

### Context

The project must run backend and frontend as independent applications.

### Decision

The frontend lives in `frontend/` with its own `package.json`, App Router,
Tailwind, i18n, components, features, types, and API client.

### Rationale

Separating projects avoids mixing responsibilities and allows the frontend to run
on 3001 while the backend runs on 3000.

### Consequences

The frontend consumes the backend through `NEXT_PUBLIC_API_URL`.

## Decision: Docker Compose for the demo

### Context

The evaluation expects PostgreSQL, backend, and frontend to start from the root.

### Decision

`docker-compose.yml` defines `postgres`, `backend`, and `frontend` services.

### Rationale

One command simplifies the demo and reduces machine-to-machine differences.

### Consequences

`docker compose up --build` exposes PostgreSQL on 5433, backend on 3000, and
frontend on 3001.

## Decision: Environment variables for secrets

### Context

JWT, PostgreSQL, and Gemini require sensitive credentials.

### Decision

Secrets are configured through `.env`, and `.env.example` files contain only
variable names and empty placeholders.

### Rationale

This avoids leaking real credentials into Git.

### Consequences

A clean machine must create `.env` before starting the full stack.

## Decision: Simple ES/EN i18n

### Context

The interface must be available in Spanish and English without a heavy solution.

### Decision

The frontend uses JSON dictionaries in `frontend/i18n` and a visible `ES | EN`
selector.

### Rationale

This is enough for the demo, keeps text centralized, and avoids unnecessary
dependencies.

### Consequences

Components receive a dictionary and do not duplicate pages per language.
