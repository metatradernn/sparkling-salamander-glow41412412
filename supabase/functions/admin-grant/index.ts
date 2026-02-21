import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { Pool } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-admin-password",
};

const ADMIN_PASSWORD = "AK5917906";

type Body = {
  traderId?: string;
  sumdep?: number | null;
};

async function ensurePpTradersTable() {
  const dbUrl = Deno.env.get("SUPABASE_DB_URL");
  if (!dbUrl) {
    console.warn("[admin-grant] SUPABASE_DB_URL missing");
    return;
  }

  const pool = new Pool(dbUrl, 1, true);
  const client = await pool.connect();
  try {
    console.log("[admin-grant] ensuring pp_traders table");

    await client.queryArray(`
      CREATE TABLE IF NOT EXISTS public.pp_traders (
        trader_id TEXT PRIMARY KEY,
        registered BOOLEAN,
        ftd BOOLEAN,
        sumdep NUMERIC,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await client.queryArray(`
      ALTER TABLE public.pp_traders ENABLE ROW LEVEL SECURITY;
    `);

    // Нужен для чтения из фронта (OnboardingWizard делает select через anon key).
    await client.queryArray(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_policies
          WHERE schemaname = 'public'
            AND tablename = 'pp_traders'
            AND policyname = 'pp_traders_public_read'
        ) THEN
          CREATE POLICY "pp_traders_public_read"
          ON public.pp_traders
          FOR SELECT
          USING (true);
        END IF;
      END
      $$;
    `);

    console.log("[admin-grant] pp_traders ensured");
  } finally {
    client.release();
    await pool.end();
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    console.warn("[admin-grant] invalid method", { method: req.method });
    return new Response("Method not allowed", {
      status: 405,
      headers: corsHeaders,
    });
  }

  const pass = req.headers.get("x-admin-password") || "";
  if (pass !== ADMIN_PASSWORD) {
    console.warn("[admin-grant] unauthorized");
    return new Response("Unauthorized", { status: 401, headers: corsHeaders });
  }

  // Само-чинит проблему с отсутствующей таблицей (и нужной policy для чтения)
  await ensurePpTradersTable();

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl) {
    console.error("[admin-grant] SUPABASE_URL missing");
    return new Response("Server misconfigured: SUPABASE_URL missing", {
      status: 500,
      headers: corsHeaders,
    });
  }

  if (!serviceRoleKey) {
    console.error("[admin-grant] SUPABASE_SERVICE_ROLE_KEY missing");
    return new Response("Server misconfigured: SUPABASE_SERVICE_ROLE_KEY missing", {
      status: 500,
      headers: corsHeaders,
    });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const body = (await req.json().catch(() => ({}))) as Body;
  const traderId = (body.traderId || "").trim();

  if (!traderId) {
    console.warn("[admin-grant] missing traderId");
    return new Response("Missing traderId", { status: 400, headers: corsHeaders });
  }

  const sumdep =
    body.sumdep === null || body.sumdep === undefined ? null : Number(body.sumdep);

  console.log("[admin-grant] granting access", { traderId, sumdep });

  const { error } = await supabase.from("pp_traders").upsert(
    {
      trader_id: traderId,
      registered: true,
      ftd: true,
      sumdep: sumdep,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "trader_id" },
  );

  if (error) {
    console.error("[admin-grant] upsert error", { message: error.message });
    return new Response(error.message, { status: 500, headers: corsHeaders });
  }

  console.log("[admin-grant] OK", { traderId });
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { ...corsHeaders, "content-type": "application/json" },
  });
});