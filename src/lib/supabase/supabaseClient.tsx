import { createClient } from "@supabase/supabase-js";

// Direct values from the project
const supabaseUrl = "https://pbfquancorottzibxhpv.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBiZnF1YW5jb3JvdHR6aWJ4aHB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3ODExMzgsImV4cCI6MjA2MjM1NzEzOH0.Wfrx-f9pKfYP1Gv7TIjT5bsruTBsku3HTqhfRIQgTGM";

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);
