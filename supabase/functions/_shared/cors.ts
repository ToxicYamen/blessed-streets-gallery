// Reusable CORS headers for Supabase Edge Functions.
// Locked down to the production domain + localhost dev ports.
const ALLOWED_ORIGINS = new Set([
  "https://blessedstreets.de",
  "https://www.blessedstreets.de",
  "http://localhost:8081",
  "http://localhost:8080",
  "http://localhost:5173",
]);

export function corsHeaders(req: Request): HeadersInit {
  const origin = req.headers.get("origin") ?? "";
  const allowOrigin = ALLOWED_ORIGINS.has(origin) ? origin : "https://blessedstreets.de";
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}
