import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';

const mockCreate = vi.fn();

vi.mock('@anthropic-ai/sdk', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      messages: { create: mockCreate },
    })),
  };
});

// Must be set before import so basicAuth middleware picks them up at construction time
process.env.BASIC_AUTH_USER = 'testuser';
process.env.BASIC_AUTH_PASSWORD = 'testpass';

const { default: app } = await import('./index.js');

const AUTH = { user: 'testuser', pass: 'testpass' };

const VALID_RESPONSE = {
  distortions: [
    {
      id: 'all-or-nothing',
      name: 'All-or-Nothing Thinking',
      explanation: 'You are viewing the situation in absolute terms.',
      severity: 'primary',
    },
  ],
  reframe: 'Try to consider the nuance in the situation.',
  disclaimer:
    'This tool is for self-reflection only and is not a substitute for support from a qualified mental health professional.',
};

function mockSuccess(payload = VALID_RESPONSE) {
  mockCreate.mockResolvedValueOnce({
    content: [{ text: JSON.stringify(payload) }],
  });
}

describe('Basic Auth', () => {
  it('returns 401 when no credentials are provided', async () => {
    const res = await request(app).post('/api/analyze').send({ thought: 'test' });
    expect(res.status).toBe(401);
  });

  it('returns 401 when credentials are wrong', async () => {
    const res = await request(app)
      .post('/api/analyze')
      .auth('wrong', 'credentials')
      .send({ thought: 'test' });
    expect(res.status).toBe(401);
  });

  it('allows requests with correct credentials', async () => {
    mockSuccess();
    const res = await request(app)
      .post('/api/analyze')
      .auth(AUTH.user, AUTH.pass)
      .send({ thought: 'I always mess everything up.' });
    expect(res.status).toBe(200);
  });
});

describe('GET /api/ping', () => {
  it('returns 200 with correct credentials', async () => {
    const res = await request(app).get('/api/ping').auth(AUTH.user, AUTH.pass);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });

  it('returns 401 without credentials', async () => {
    const res = await request(app).get('/api/ping');
    expect(res.status).toBe(401);
  });
});

describe('POST /api/analyze', () => {
  beforeEach(() => {
    mockCreate.mockReset();
  });

  it('returns 400 when thought is missing', async () => {
    const res = await request(app).post('/api/analyze').auth(AUTH.user, AUTH.pass).send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 400 when thought is an empty string', async () => {
    const res = await request(app).post('/api/analyze').auth(AUTH.user, AUTH.pass).send({ thought: '   ' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 400 when thought is not a string', async () => {
    const res = await request(app).post('/api/analyze').auth(AUTH.user, AUTH.pass).send({ thought: 42 });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('returns correct response shape on success', async () => {
    mockSuccess();
    const res = await request(app)
      .post('/api/analyze')
      .auth(AUTH.user, AUTH.pass)
      .send({ thought: 'I always mess everything up.' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('distortions');
    expect(res.body).toHaveProperty('reframe');
    expect(res.body).toHaveProperty('disclaimer');
    expect(Array.isArray(res.body.distortions)).toBe(true);
  });

  it('distortion entries have id, name, explanation, severity', async () => {
    mockSuccess();
    const res = await request(app)
      .post('/api/analyze')
      .auth(AUTH.user, AUTH.pass)
      .send({ thought: 'I always mess everything up.' });

    const distortion = res.body.distortions[0];
    expect(distortion).toHaveProperty('id');
    expect(distortion).toHaveProperty('name');
    expect(distortion).toHaveProperty('explanation');
    expect(distortion).toHaveProperty('severity');
  });

  it('returns 502 when Anthropic SDK throws', async () => {
    mockCreate.mockRejectedValueOnce(new Error('Network error'));
    const res = await request(app)
      .post('/api/analyze')
      .auth(AUTH.user, AUTH.pass)
      .send({ thought: 'I always mess everything up.' });

    expect(res.status).toBe(502);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 502 when model returns malformed JSON', async () => {
    mockCreate.mockResolvedValueOnce({
      content: [{ text: 'not valid json {{{' }],
    });
    const res = await request(app)
      .post('/api/analyze')
      .auth(AUTH.user, AUTH.pass)
      .send({ thought: 'I always mess everything up.' });

    expect(res.status).toBe(502);
    expect(res.body).toHaveProperty('error');
  });
});
