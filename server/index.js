import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import https from 'https';
import rateLimit from 'express-rate-limit';
import basicAuth from 'express-basic-auth';
import helmet from 'helmet';
import Anthropic from '@anthropic-ai/sdk';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(
  basicAuth({
    users: {
      [process.env.BASIC_AUTH_USER]: process.env.BASIC_AUTH_PASSWORD,
    },
    challenge: false,
  })
);

app.get('/api/ping', (_req, res) => res.json({ ok: true }));

app.use(
  '/api/analyze',
  rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests — please try again later.' },
  })
);

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are a compassionate CBT-informed assistant helping users recognize
cognitive distortions in their thoughts. Analyze the user's thought and:

1. Identify which of the 10 Burns cognitive distortions are present.
   Label each as "primary" (clearly present) or "secondary" (possibly present).
   It is fine to identify only one, or none at all.
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
}`;

app.post('/api/analyze', async (req, res) => {
  const { thought } = req.body;

  if (!thought || typeof thought !== 'string' || thought.trim() === '') {
    return res.status(400).json({ error: 'thought is required and must be a non-empty string' });
  }

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: thought.trim() }],
    });

    const raw = message.content[0].text;
    const result = JSON.parse(raw);
    res.json(result);
  } catch (err) {
    if (err instanceof SyntaxError) {
      console.error('Failed to parse model response as JSON:', err.message);
      return res.status(502).json({ error: 'Invalid response from AI service' });
    }
    console.error('Anthropic API error:', err.message);
    res.status(502).json({ error: 'AI service unavailable' });
  }
});

const PORT = process.env.PORT || 3001;

if (process.argv[1] === new URL(import.meta.url).pathname) {
  const { default: createHttpsLocalhost } = await import('https-localhost');
  const certs = await createHttpsLocalhost().getCerts();
  https.createServer(certs, app).listen(PORT, () => {
    console.log(`Server running on https://localhost:${PORT}`);
  });
}

export default app;
