const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const MAX_CANDIDATES = 50;

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "";
const PROXY_API_SECRET = process.env.PROXY_API_SECRET || "";

const SYSTEM_PROMPT = `You summarize Malaysian job candidates for a B2B sales catalogue used by account managers during sales calls.

For each candidate, extract 2-3 tight bullet points from their description. Rules:
- Write in English regardless of input language (descriptions may be in Malay or mixed)
- Lead with quantified achievements where possible (numbers, scope, tenure, results)
- Keep each bullet under 15 words
- Omit vague filler: "responsible for", "assisted with", "involved in"
- If the description is empty, too short, or too vague to extract real achievements, return an empty bullets array

Return ONLY a valid JSON array with no markdown fences:
[{"id":"...","bullets":["...","..."]}]`;

const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "no-referrer",
};

function setSecurityHeaders(res, origin) {
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) res.setHeader(k, v);
  const allowed = ALLOWED_ORIGIN || origin || "";
  if (allowed) res.setHeader("Access-Control-Allow-Origin", allowed);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

function isAuthorized(req) {
  if (!PROXY_API_SECRET) return true;
  const auth = req.headers["authorization"] || "";
  return auth === `Bearer ${PROXY_API_SECRET}`;
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

export default async function handler(req, res) {
  const origin = req.headers["origin"] || "";
  setSecurityHeaders(res, origin);

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  if (!isAuthorized(req)) return res.status(401).json({ error: "Unauthorized" });

  const API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!API_KEY || API_KEY === "your_key_here") return res.status(200).json({ summaries: [] });

  const { candidates } = req.body || {};
  if (!Array.isArray(candidates) || candidates.length === 0) {
    return res.status(200).json({ summaries: [] });
  }
  if (candidates.length > MAX_CANDIDATES) {
    return res.status(400).json({ error: `Too many candidates; max ${MAX_CANDIDATES} per request` });
  }

  const model = process.env.ANTHROPIC_MODEL || "claude-haiku-4-5-20251001";

  const userContent = `Candidates:\n${JSON.stringify(
    candidates.map(({ id, description }) => ({ id, description })),
    null,
    2
  )}`;

  try {
    const upstream = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "x-api-key": API_KEY,
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
      return res.status(200).json({ summaries: [] });
    }

    const data = await upstream.json();
    const raw = data.content?.[0]?.text || "[]";
    const summaries = parseSummaries(raw);
    return res.status(200).json({ summaries });
  } catch {
    return res.status(200).json({ summaries: [] });
  }
}
