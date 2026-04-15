# Cognitive Distortion Checker — Project Spec

## What this is

A React web app that helps users identify cognitive distortions in their
negative thoughts. The user types a thought; the AI analyzes it against
the 10 distortions from Burns' CBT framework and suggests reframing
techniques. Users can also browse distortions as a reference. All
session history is saved to localStorage.

## Architecture

Monorepo with two packages:

```
distortion-helper/
├── CLAUDE.md
├── package.json              ← root; dev, build, start scripts
├── client/                   ← Vite + React + Tailwind
│   ├── src/
│   │   ├── components/
│   │   │   ├── LoginForm.jsx
│   │   │   ├── ThoughtInput.jsx
│   │   │   ├── AnalysisResult.jsx
│   │   │   ├── DistortionCard.jsx
│   │   │   ├── DistortionModal.jsx
│   │   │   ├── HistoryPanel.jsx
│   │   │   └── ReflectResult.jsx
│   │   ├── hooks/
│   │   │   ├── useAnalysis.js
│   │   │   ├── useHistory.js
│   │   │   └── useReflect.js
│   │   ├── data/
│   │   │   └── distortions.js
│   │   └── App.jsx
└── server/
    ├── .env                  ← gitignored
    ├── .env.example
    ├── index.js
    └── prompts.js
```

## Running locally

**Dev mode** (Vite + Express with live reload):
```bash
npm run dev
```
Client at `https://localhost:5173`, server at `https://localhost:3001`.
Both use HTTPS via `https-localhost` / mkcert. First run may prompt for
sudo to install the local CA.

**Production build** (Express serves built client):
```bash
npm run build        # builds client/dist/
node server/index.js # serves everything on https://localhost:3001
```
No `NODE_ENV` flag needed — static file serving is triggered by the
presence of `client/dist/`.

## Tech stack

- **Frontend**: React (Vite), Tailwind CSS
- **Styling direction**: Warm and friendly — soft but not saccharine.
  Think: muted warm neutrals (stone/amber/rose tones), rounded corners,
  generous padding, friendly readable typography. Avoid clinical whites
  and cold blues. The app should feel like a kind journal, not a medical tool.
- **Backend**: Express.js; `/api/ping` and `/api/analyze` endpoints
- **AI**: Anthropic `claude-sonnet-4-20250514` via server-side API call
- **Persistence**: localStorage via custom hook
- **Testing**: Vitest + React Testing Library (client), Vitest + Supertest (server)

## The 10 cognitive distortions (source of truth)

Each entry in `data/distortions.js` must include:
`id`, `name`, `shortDescription`, `example`, `reframeTechnique`, `reframeTechniqueDescription`

1. **All-or-Nothing Thinking** — seeing things in black and white
2. **Overgeneralization** — one negative event as a never-ending pattern
3. **Mental Filter** — dwelling on negatives, ignoring positives
4. **Disqualifying the Positive** — positive experiences "don't count"
5. **Jumping to Conclusions** — Mind Reading or Fortune Telling
6. **Magnification or Minimization** — blowing things out of proportion or shrinking them
7. **Emotional Reasoning** — "I feel it, therefore it must be true"
8. **Should Statements** — rigid rules that generate guilt or frustration
9. **Labeling** — attaching a global negative label to yourself or others
10. **Personalization and Blame** — taking excessive responsibility, or blaming others

Reframe techniques (map to distortions in order above):
1. Examine the Evidence
2. Examine the Evidence
3. The Friend Technique (self-compassionate perspective)
4. The Behavioral Experiment
5. Thinking in Shades of Grey
6. The Survey Method
7. Define Your Terms
8. The Semantic Method
9. Reattribution
10. Cost-Benefit Analysis

## API endpoints

```
GET  /api/ping        → 200 { ok: true }   (auth check)
POST /api/analyze
  Body:    { thought: string }
  Response: {
    distortions: [{ id, name, explanation, severity: "primary"|"secondary" }],
    reframe: string,
    disclaimer: string
  }
POST /api/reflect
  Body:    { entries: Array }
  Response: { rankedDistortions: [{ id, name, count }], theme, topDistortion, practicePrompt }
POST /api/practice
  Body:    { distortionName, practicePrompt, userAttempt }
  Response: { feedback: string }
```

All endpoints require Basic Auth. `/api/reflect` is rate-limited to 10 req/IP/hour;
`/api/practice` to 15 req/IP/hour.

## System prompts (defined in server/prompts.js)

### ANALYZE_PROMPT
```
You are a compassionate CBT-informed assistant helping users recognize
cognitive distortions in their thoughts. Analyze the user's thought and:

1. Identify which of the following 10 Burns cognitive distortions are present.
   Use only these distortions — do not introduce others.
   Label each as "primary" (clearly present) or "secondary" (possibly present).
   It is fine to identify only one, or none at all.

   Available distortions (use the exact id and name values in your response):
   - id: "all-or-nothing",               name: "All-or-Nothing Thinking"
   - id: "overgeneralization",            name: "Overgeneralization"
   - id: "mental-filter",                name: "Mental Filter"
   - id: "disqualifying-the-positive",   name: "Disqualifying the Positive"
   - id: "jumping-to-conclusions",       name: "Jumping to Conclusions"
   - id: "magnification-or-minimization", name: "Magnification or Minimization"
   - id: "emotional-reasoning",          name: "Emotional Reasoning"
   - id: "should-statements",            name: "Should Statements"
   - id: "labeling",                     name: "Labeling"
   - id: "personalization-and-blame",    name: "Personalization and Blame"

2. For each distortion found, write a brief warm, non-judgmental explanation
   of why it applies to this specific thought.
3. Suggest a compassionate reframe for the thought in 2-3 sentences.
4. Always include this exact disclaimer as the "disclaimer" field:
   "This tool is for self-reflection only and is not a substitute for
   support from a qualified mental health professional."

Respond ONLY with valid JSON matching this schema — no preamble, no markdown:
{
  "distortions": [{ "id": string, "name": string, "explanation": string, "severity": "primary"|"secondary" }],
  "reframe": string,
  "disclaimer": string
}
```

## Component responsibilities

| Component / Hook | Responsibility |
|---|---|
| `LoginForm` | Shown before main UI; verifies credentials via `GET /api/ping`; lifts credentials to App on success |
| `ThoughtInput` | Textarea + submit button; handles loading state; disabled during fetch; clears on success |
| `AnalysisResult` | Renders loading skeleton, distortions list, reframe, disclaimer, or empty state; result-mode cards have a "Learn more" link that opens `DistortionModal` |
| `DistortionCard` | Single distortion — used in results (`mode="result"`) AND the reference browser (`mode="reference"`); accepts optional `onInfoClick` prop in result mode |
| `DistortionModal` | Overlay showing full reference card for a distortion; closes on Escape, backdrop click, or ✕ button |
| `HistoryPanel` | Collapsible sidebar; renders past entries from localStorage; click to re-view |
| `ReflectResult` | Renders pattern analysis: theme, ranked distortions bar chart (names are clickable → `DistortionModal`), practice prompt + submission form + feedback |
| `useAnalysis(credentials)` | POST to `/api/analyze` with Authorization header; manages `loading`, `error`, `result` state |
| `useHistory` | Read/write localStorage; exposes `entries`, `addEntry`, `clearHistory` |
| `useReflect(credentials)` | POST to `/api/reflect` and `/api/practice`; manages reflect/practice loading, error, and result state |

## Environment

Server reads credentials from `server/.env` (gitignored; path is resolved
relative to `index.js` so it works regardless of working directory):
- `ANTHROPIC_API_KEY` — Anthropic API key
- `BASIC_AUTH_USER` — Basic Auth username
- `BASIC_AUTH_PASSWORD` — Basic Auth password

In dev, the Vite dev server proxies `/api` to `https://localhost:3001`.

## Security

- **HTTPS** (`https-localhost`) — dev only; locally-trusted mkcert cert;
  Railway terminates TLS in production
- **Security headers** (`helmet`) — CSP configured explicitly for the app's
  needs (Google Fonts, no `unsafe-eval`); applied to all responses
- **Basic Auth** (`express-basic-auth`) — scoped to `/api` routes only;
  static files are intentionally public so the React login form can load
- **Rate limiting** (`express-rate-limit`) — 20 req/IP/hour on `/api/analyze`;
  returns `429` with `{ error: "Too many requests — please try again later." }`

## Deployment (Railway)

- Connect GitHub repo; Railway runs `npm run build` then `npm start`
- Set environment variables in Railway dashboard:
  `ANTHROPIC_API_KEY`, `BASIC_AUTH_USER`, `BASIC_AUTH_PASSWORD`
- `NODE_ENV=production` is set automatically by Railway
- Railway provides HTTPS via its proxy — no cert config needed

## Build phases

Each phase has a paired test phase. Complete the build step, review the
output, then do the test step before moving on.

| Phase | Build | Test |
|---|---|---|
| 1 | Scaffold monorepo, install all deps, confirm `npm run dev` starts both | Manual smoke test only |
| 2 | Build `distortions.js` data file | Unit tests: all 10 entries exist, required fields present, IDs are unique |
| 3 | Build Express server + `/api/analyze` endpoint | Supertest: mock Anthropic SDK, test response shape, test error handling |
| 4 | Build React components (ThoughtInput → AnalysisResult → DistortionCard → HistoryPanel) | RTL: each component renders expected content, disclaimer present in AnalysisResult |
| 5 | Wire up `useAnalysis` and `useHistory` hooks | Vitest: hook state transitions (loading → success, loading → error); localStorage read/write |
| 6 | Tailwind styling pass — warm/friendly, mobile-friendly | Visual review only |
| 7 | Polish: error states, loading skeletons, empty states | RTL: error message renders, loading state disables input |

## Testing conventions

- Test files live alongside source: `ComponentName.test.jsx`, `hookName.test.js`
- Server tests in `server/index.test.js`
- Mock the Anthropic SDK in server tests — never hit the real API in tests
- Mock `fetch` in hook tests — never hit the real server in tests
- Use `@testing-library/user-event` for interaction tests, not `.click()` directly
- Each test file should have a descriptive `describe` block matching the unit under test

## What to avoid

- No TypeScript (keep it simple for this learning project)
- No Redux or heavy state management — React state + custom hooks only
- No external component libraries (MUI, Chakra, shadcn, etc.) — Tailwind only
- Keep `server/index.js` under ~120 lines
- Don't add features not in this spec without checking first
