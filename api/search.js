import { stripPiiFields } from "../lib/pii.js";

const SEARCH_API_URL = "https://candidate-search-api.ajt.my";

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "";
const PROXY_API_SECRET = process.env.PROXY_API_SECRET || "";

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
  if (!PROXY_API_SECRET) return true; // secret not configured — open (dev only)
  const auth = req.headers["authorization"] || "";
  return auth === `Bearer ${PROXY_API_SECRET}`;
}

function validateSearchBody(body) {
  if (!body || typeof body !== "object") return "Request body must be a JSON object";
  if (body.size !== undefined && (typeof body.size !== "number" || body.size > 500))
    return "size must be a number ≤ 500";
  if (body.from !== undefined && (typeof body.from !== "number" || body.from < 0))
    return "from must be a non-negative number";
  if (body.terms !== undefined && !Array.isArray(body.terms))
    return "terms must be an array";
  return null;
}

export default async function handler(req, res) {
  const origin = req.headers["origin"] || "";
  setSecurityHeaders(res, origin);

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  if (!isAuthorized(req)) return res.status(401).json({ error: "Unauthorized" });

  const validationError = validateSearchBody(req.body);
  if (validationError) return res.status(400).json({ error: validationError });

  const API_KEY = process.env.CANDIDATE_SEARCH_API_KEY;
  if (!API_KEY) return res.status(500).json({ error: "Service misconfigured" });

  try {
    const upstream = await fetch(`${SEARCH_API_URL}/api/v2/search`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });
    if (!upstream.ok) {
      return res.status(502).json({ error: "Search service unavailable" });
    }
    const data = await upstream.json();
    res.status(200).json(stripPiiFields(data));
  } catch {
    res.status(502).json({ error: "Service temporarily unavailable" });
  }
}
