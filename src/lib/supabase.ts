import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/** Server-side client — bypasses RLS via service role key */
export function createServerClient() {
  return createClient(supabaseUrl, supabaseServiceKey);
}

/** Browser client — uses anon key, respects RLS */
export function createBrowserClient() {
  return createClient(supabaseUrl, supabaseAnonKey);
}
