# ZKVote

Privacy-by-design voting app for the Midnight Network. Voters prove eligibility with zero-knowledge style proofs and one-vote-per-user is enforced via nullifiers. The demo is stateless and anonymous: identity is never stored and ballots remain private while integrity is preserved.

- Built with React, Vite, Tailwind, Radix UI, shadcn/ui, and TypeScript
- Backend: Express (mounted in dev and production, Netlify Functions in deploys)
- ZK flow (mocked): credential -> proof -> vote -> live results, with regional tallies and a 5-day rotating poll

## Features

- Anonymous, one-vote-per-user via cryptographic nullifiers
- Stateless credential and proof generation (no server-side identity storage)
- Rotating 5-day polls with countdown on the homepage
- Region heatmap/tallies in results
- Client-side routes: `/` (Vote), `/results`, `/about`, `/privacy`, `/terms`
- Resilient API client with base fallbacks (local, Netlify function path, production)

## Tech Stack

- Frontend: React 18, Vite 7, Tailwind CSS, Radix UI, shadcn/ui, React Router
- Backend: Express 5, TypeScript, serverless-http (for Netlify)
- Tooling: Vitest, Prettier, pnpm

## Project Structure

```
.
├��� client/                # React app (pages, components, hooks, lib)
│  ├─ pages/              # Index, Results, About, Privacy, Terms
│  ├─ components/         # UI and layout (Header, Footer, VoteCard, charts)
│  └─ lib/api.ts          # fetchJson helper with base fallbacks
├─ server/                # Express API (used locally/prod and in Netlify functions)
│  ├─ routes/zk.ts        # Poll, credential, proof, vote, results endpoints
│  ├─ zk/mock.ts          # Stateless ZK mock (nullifiers, proof, tallies)
│  └─ node-build.ts       # Serves built SPA + API for `pnpm start`
├─ netlify/functions/api.ts  # Netlify function mounting the Express app
├─ netlify.toml           # Build, function bundling, SPA fallback, API redirects
├─ vite.config.ts         # Vite dev server + Express middleware during `pnpm dev`
├─ vite.config.server.ts  # Server build to dist/server
└─ package.json
```

## Getting Started (Local)

Prerequisites:

- Node.js 22+
- pnpm (repo is configured for pnpm)

Install dependencies:

```
pnpm install
```

Start the dev server (frontend + API via middleware):

```
pnpm dev
```

- App: http://localhost:8080
- API base: http://localhost:8080/api

Build for production:

```
pnpm build
```

Run the production server locally (serves dist/spa and API):

```
pnpm start
```

- App: http://localhost:3000
- API base: http://localhost:3000/api

Environment variables (optional):

- `PING_MESSAGE`: overrides `/api/ping` response text
- `PORT`: port for `pnpm start` (defaults to 3000)

## API Overview

Base URL (local dev): `/api`

- `GET /api/poll` — current poll id and end time
- `POST /api/credential` — issue a stateless credential
  - body: `{ "region"?: "NA"|"SA"|"EU"|"AF"|"AS"|"OC" }`
- `POST /api/prove` — generate a stateless proof for an option
  - body: `{ "token": string, "option": "climate"|"health"|"space"|"ai"|"freedom", "pollId"?: string }`
- `POST /api/vote` — submit a vote (one per nullifier)
  - body: `{ "proof": string, "nullifier": string, "option": OptionId, "pollId"?: string, "tokenHash": string, "region": Region }`
- `GET /api/results?pollId=...` — tallies and regional breakdown for the poll
- `GET /api/ping` — simple health check

Typical flow (cURL):

```bash
# 1) Get the current poll
curl -s http://localhost:8080/api/poll

# 2) Issue a credential (optional region provided)
cred=$(curl -s -X POST http://localhost:8080/api/credential -H 'content-type: application/json' -d '{"region":"EU"}')
TOKEN=$(echo "$cred" | node -pe 'JSON.parse(fs.readFileSync(0,"utf8")).token')
REGION=$(echo "$cred" | node -pe 'JSON.parse(fs.readFileSync(0,"utf8")).region')

# 3) Generate a proof for an option (e.g., "ai")
prove=$(curl -s -X POST http://localhost:8080/api/prove -H 'content-type: application/json' -d '{"token":"'"$TOKEN"'","option":"ai"}')
PROOF=$(echo "$prove" | node -pe 'JSON.parse(fs.readFileSync(0,"utf8")).proof')
NULLIFIER=$(echo "$prove" | node -pe 'JSON.parse(fs.readFileSync(0,"utf8")).nullifier')
TOKEN_HASH=$(echo "$prove" | node -pe 'JSON.parse(fs.readFileSync(0,"utf8")).tokenHash')

# 4) Cast the vote
curl -s -X POST http://localhost:8080/api/vote -H 'content-type: application/json' -d '{"proof":"'"$PROOF"'","nullifier":"'"$NULLIFIER"'","option":"ai","tokenHash":"'"$TOKEN_HASH"'","region":"'"$REGION"'"}'

# 5) Fetch results
curl -s http://localhost:8080/api/results | jq .

# 6) Try to vote again (expect 400: "Nullifier already used")
curl -i -s -X POST http://localhost:8080/api/vote -H 'content-type: application/json' -d '{"proof":"'"$PROOF"'","nullifier":"'"$NULLIFIER"'","option":"ai","tokenHash":"'"$TOKEN_HASH"'","region":"'"$REGION"'"}'
```

Notes:

- A second vote with the same nullifier returns `400 { "error": "Nullifier already used" }`.
- The demo is cryptographically inspired but intentionally simplified and stateless for clarity.

## UI Usage

- Click "Credential Ready" on the homepage to prepare a credential
- Choose an option (Climate Tech, Health, Space, Ethical AI, Digital Freedom)
- Submit your vote; if you attempt to vote twice, you’ll see an "Already voted" message
- Visit `/results` to see tallies, regional breakdowns, and the total count

## Testing & Linting

- Run tests: `pnpm test`
- Format code: `pnpm format.fix`
- Type-check: `pnpm typecheck`

## Deployment (Netlify)

- `netlify.toml` configures build to `dist/spa`, functions in `netlify/functions`, API redirects (`/api/*` -> `/.netlify/functions/api/*`), and SPA fallback
- Function handler mounts the Express app at `/.netlify/functions/api` so the same routes work in production
- The frontend detects environment and tries bases in order (local `/api`, `/.netlify/functions/api`, production URL)

## Security & Privacy

- This repository demonstrates ZK concepts with a mock, stateless flow. It is not a production ZK implementation
- No secrets are stored client-side or committed; avoid adding secrets to the repo. Use environment variables if needed

## License

Apache-2.0

See LICENSE for full terms.
