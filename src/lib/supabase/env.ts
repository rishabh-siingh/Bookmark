/**
 * Reads and validates the two public Supabase env vars every client
 * factory (browser, server, middleware) needs. Throws a single,
 * consistent error message instead of each call site failing on its own
 * `undefined` in a different way.
 */
export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
        "Set them in .env.local (local dev) or your hosting provider's " +
        "environment variables (production)."
    );
  }

  return { url, anonKey };
}
