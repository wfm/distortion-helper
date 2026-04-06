# Distortion Helper

A React web app that helps users identify cognitive distortions in their negative thoughts, based on David Burns' CBT framework. Type a thought, get an AI-powered analysis identifying which of the 10 distortions are present, and receive a compassionate reframe.

## Features

- Analyzes thoughts against the 10 Burns cognitive distortions
- Warm, friendly UI — feels like a kind journal, not a medical tool
- Session history saved to localStorage
- Distortion reference browser
- Basic Auth protected API

## Prerequisites

- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com/)

## Setup

```bash
# Install all dependencies
npm run install:all

# Copy and fill in environment variables
cp server/.env.example server/.env
# Edit server/.env and set ANTHROPIC_API_KEY, BASIC_AUTH_USER, BASIC_AUTH_PASSWORD
```

## Running locally

**Dev mode** (Vite + Express with live reload):

```bash
npm run dev
```

Client at `https://localhost:5173`, server at `https://localhost:3001`. Both use HTTPS via `https-localhost`/mkcert. The first run may prompt for sudo to install the local CA.

**Production build:**

```bash
npm run build
node server/index.js
```

Visit `https://localhost:3001`. Express serves the built client directly.

## Running tests

```bash
# Server tests
npm test --prefix server

# Client tests
npm test --prefix client
```

## Environment variables

Set in `server/.env` (dev) or your hosting dashboard (production):

| Variable | Description |
|---|---|
| `ANTHROPIC_API_KEY` | Anthropic API key |
| `BASIC_AUTH_USER` | Basic Auth username |
| `BASIC_AUTH_PASSWORD` | Basic Auth password |

## Deployment (Railway)

1. Push to GitHub
2. Create a new Railway project → Deploy from GitHub repo
3. Set the three environment variables above in Railway's dashboard
4. Railway runs `npm run build` then `npm start` automatically and provides a public HTTPS URL

## Tech stack

- **Frontend**: React (Vite), Tailwind CSS
- **Backend**: Express.js
- **AI**: Anthropic claude-sonnet-4-20250514
- **Security**: Helmet (CSP), Basic Auth, rate limiting (20 req/IP/hour on `/api/analyze`)

## Disclaimer

This tool is for self-reflection only and is not a substitute for support from a qualified mental health professional.
