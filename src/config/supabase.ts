import { createClient, SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://sqttehzyiacxmmiqsovw.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxdHRlaHp5aWFjeG1taXFzb3Z3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3Nzg4ODcsImV4cCI6MjA1OTM1NDg4N30.jC8mUsHoL_skI8uPGqGvYckvWr7fkYmJpJbXFwMsoM8";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    "Missing Supabase configuration. Please check your environment variables."
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
