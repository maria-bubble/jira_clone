# Base44 Dev Environment — Jira Clone

A React/webpack client + TypeScript/Express/TypeORM API backed by PostgreSQL.

## Architecture
- **API** (`api/`): Express server using TypeORM with `synchronize: true` (auto-creates schema). Listens on port 3000 internally. On first request to `POST /authentication/guest` it auto-creates a guest user and seeds a project with issues/users/comments. No manual migrations or seeds needed.
- **Client** (`client/`): React 16 app bundled with webpack 4 + webpack-dev-server. Dev server runs on port 8080 internally.
- **DB**: PostgreSQL 14 (compose service `db`).

## How it runs here (docker-compose.base44.yml)
- `client` (webpack-dev-server, internal 8080) → host port **3000** (the preview).
- `api` (Express, internal 3000) → host port **8000** (separate origin; reached by the browser via its public URL).
- The client's API base URL is injected at build time via `webpack.DefinePlugin` from the `API_URL` env var (`https://8000-$BASE44_PUBLIC_HOST_SUFFIX`). The API uses `cors()` (allow all origins), and auth is a Bearer token in a header (no cookies), so cross-origin works without credentials.
- DB credentials are local infra, generated inline in compose `environment:`.

## Secrets
- `JWT_SECRET` — signing key for guest-account JWTs. A development placeholder is generated automatically and delivered via `/run/base44/app.env`; a fallback also lives in `.env.base44-defaults`. No external-service credentials are required.

## Verifying it works
- `docker compose -f docker-compose.base44.yml ps` — all three services should be healthy.
- `curl -sf http://localhost:3000/` — client HTML.
- `curl -sf -X POST http://localhost:8000/authentication/guest` — returns an `authToken` (seeds the DB on first call).

## Notes / quirks
- Old 2019-era packages (webpack 4, typeorm 0.2.20, ts-node 8). Use `npm install` (not `npm ci`) — the committed lockfiles are old format.
- Node 16 is used (Node 17+ breaks webpack 4's md4 hash).
- webpack-dev-server uses `disableHostCheck: true` and `watchOptions.poll` because the source is bind-mounted.
- The API starts listening even if the DB connection fails (it catches and logs), so check `docker compose logs api` if data is missing.
