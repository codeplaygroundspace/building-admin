import { createClient } from "@supabase/supabase-js";

// Get environment variables with fallbacks for development
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Make sure we have the required configuration
if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Missing Supabase environment variables. Check your .env.local file."
  );
}

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);
