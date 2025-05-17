import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client - should be used in API routes and server components
export function getServerSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Missing Supabase environment variables. Check your .env.local file."
    );
  }

  return createClient(supabaseUrl, supabaseKey);
}
