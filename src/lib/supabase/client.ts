import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Force every read to bypass Next.js's Data Cache. Without this, Supabase's GET
// requests get cached in production and the pages serve stale scores even though
// the database has been updated (locally this never shows because dev disables
// caching). This keeps public pages in sync with admin edits and API syncs.
export const supabase = createClient(url, anonKey, {
  auth: { persistSession: false },
  global: {
    fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }),
  },
});
