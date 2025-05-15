import { createClient } from "@supabase/supabase-js";

// Use environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// Log values for debugging (these won't show on client-side)
if (typeof window === "undefined") {
  console.log("Supabase URL:", supabaseUrl ? "set" : "not set");
  console.log("Supabase Key:", supabaseKey ? "set" : "not set");
}

// Explicit fallback values if environment variables are not set
// These are from your environment check earlier
const finalSupabaseUrl =
  supabaseUrl || "https://pbfquancorottzibxhpv.supabase.co";
const finalSupabaseKey =
  supabaseKey ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBiZnF1YW5jb3JvdHR6aWJ4aHB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3ODExMzgsImV4cCI6MjA2MjM1NzEzOH0.Wfrx-f9pKfYP1Gv7TIjT5bsruTBsku3HTqhfRIQgTGM";

// Create the Supabase client
export const supabase = createClient(finalSupabaseUrl, finalSupabaseKey);
