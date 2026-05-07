import express from "express";
import { config } from "dotenv";
import { stripPiiFields } from "./lib/pii.js";
config();

const app = express();
const PORT = process.env.PROXY_PORT || 3001;
const SEARCH_API_URL = "https://candidate-search-api.ajt.my";
const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const MAX_SUMMARIZE_CANDIDATES = 50;

app.use(express.json({ limit: "1mb" }));

// Security headers for all responses
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  next();
});

// CORS — dev proxy is localhost-only
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// Simple in-memory rate limiter: max 30 requests per minute per IP
const rateLimitMap = new Map();
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 30;

function rateLimit(req, res, next) {
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const now = Date.now();
  const entry = rateLimitMap.get(ip) || { count: 0, windowStart: now };
  if (now - entry.windowStart > RATE_WINDOW_MS) {
    entry.count = 0;
    entry.windowStart = now;
  }
  entry.count++;
  rateLimitMap.set(ip, entry);
  if (entry.count > RATE_MAX) {
    return res.status(429).json({ error: "Too many requests" });
  }
  next();
}

function parseSummaries(raw) {
  try {
    const json = raw
      .replace(/^```(?:json)?\n?/m, "")
      .replace(/\n?```$/m, "")
      .trim();
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (s) => s && typeof s.id === "string" && Array.isArray(s.bullets)
    );
  } catch {
    return [];
  }
}

app.post("/api/search", rateLimit, async (req, res) => {
  const API_KEY = process.env.CANDIDATE_SEARCH_API_KEY;
  if (!API_KEY) return res.status(500).json({ error: "Service misconfigured" });

  const body = req.body;
  if (!body || typeof body !== "object") {
    return res.status(400).json({ error: "Request body must be a JSON object" });
  }
  if (body.size !== undefined && (typeof body.size !== "number" || body.size > 500)) {
    return res.status(400).json({ error: "size must be a number ≤ 500" });
  }

  try {
    const upstream = await fetch(`${SEARCH_API_URL}/api/v2/search`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!upstream.ok) {
      return res.status(502).json({ error: "Search service unavailable" });
    }
    const data = await upstream.json();
    res.json(stripPiiFields(data));
  } catch {
    res.status(502).json({ error: "Service temporarily unavailable" });
  }
});

app.post("/api/summarize", rateLimit, async (req, res) => {
  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_API_KEY || ANTHROPIC_API_KEY === "your_key_here") {
    return res.json({ summaries: [] });
  }

  const { candidates } = req.body || {};
  if (!Array.isArray(candidates) || candidates.length === 0) {
    return res.json({ summaries: [] });
  }
  if (candidates.length > MAX_SUMMARIZE_CANDIDATES) {
    return res.status(400).json({ error: `Too many candidates; max ${MAX_SUMMARIZE_CANDIDATES} per request` });
  }

  const model = process.env.ANTHROPIC_MODEL || "claude-haiku-4-5-20251001";

  const SYSTEM_PROMPT = `You summarize Malaysian job candidates for a B2B sales catalogue used by account managers during sales calls.

For each candidate, extract 2-3 tight bullet points from their description. Rules:
- Write in English regardless of input language (descriptions may be in Malay or mixed)
- Lead with quantified achievements where possible (numbers, scope, tenure, results)
- Keep each bullet under 15 words
- Omit vague filler: "responsible for", "assisted with", "involved in"
- If the description is empty, too short, or too vague to extract real achievements, return an empty bullets array

Return ONLY a valid JSON array with no markdown fences:
[{"id":"...","bullets":["...","..."]}]`;

  const userContent = `Candidates:\n${JSON.stringify(
    candidates.map(({ id, description }) => ({ id, description })),
    null,
    2
  )}`;

  try {
    const upstream = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model,
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userContent }],
      }),
    });

    if (!upstream.ok) {
      console.warn(`[summarize] Anthropic returned ${upstream.status}`);
      return res.json({ summaries: [] });
    }

    const data = await upstream.json();
    const raw = data.content?.[0]?.text || "[]";
    const summaries = parseSummaries(raw);
    res.json({ summaries });
  } catch {
    res.json({ summaries: [] });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy running on http://localhost:${PORT}`);
  if (!process.env.CANDIDATE_SEARCH_API_KEY) {
    console.warn("WARNING: CANDIDATE_SEARCH_API_KEY is not set. Add it to .env");
  }
});
