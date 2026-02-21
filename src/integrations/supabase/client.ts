import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Предпочтительно: задавать через env (интеграция Dyad/Supabase обычно делает это сама)
const envUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const envAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// Fallback: чтобы приложение работало даже если env не подтянулись
const FALLBACK_SUPABASE_URL = "https://dldzwusylsaacoqkohel.supabase.co";
const FALLBACK_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsZHp3dXN5bHNhYWNvcWtvaGVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2OTYxNDQsImV4cCI6MjA4NzI3MjE0NH0.dghZTzr1hwSuTzhkpXHa1XSQZGfMDY3wLxVvNZ-zQgA";

const supabaseUrl = envUrl ?? FALLBACK_SUPABASE_URL;
const supabaseAnonKey = envAnonKey ?? FALLBACK_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// supabase всегда доступен: либо из env, либо через fallback
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});