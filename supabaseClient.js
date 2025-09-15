import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
const supabaseUrl = 'https://gnwfzjdmocorcbyewdcj.supabase.co';
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdud2Z6amRtb2NvcmNieWV3ZGNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNjY1MjQsImV4cCI6MjA3Mjc0MjUyNH0.V2j0e-DcWBswTaZnYgtDHMfCHpnBtwlJFWLHKsL25PY";   // <-- paste anon key here

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'implicit'  // Changed from 'pkce' for password reset
  }
});
