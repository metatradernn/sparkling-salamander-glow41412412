import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

type PpTraderRow = {
  trader_id: string;
  registered?: boolean | null;
  ftd?: boolean | null;
  sumdep?: number | null;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function normalizeEvent(raw: string) {
  return (raw || "").trim().toLowerCase();
}

function isRegistrationEvent(event: string) {
  return (
    event.includes("reg") ||
    event.includes("registration") ||
    event.includes("signup")
  );
}

function isEmailConfirmEvent(event: string) {
  return (
    event.includes("email") ||
    event.includes("confirm") ||
    event.includes("confirmed")
  );
}

function isDepositEvent(event: string) {
  return (
    event.includes("ftd") ||
    event.includes("dep") ||
    event.includes("deposit") ||
    event.includes("redep") ||
    event.includes("re-dep") ||
    event.includes("repeat")
  );
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const url = new URL(req.url);

  const event = normalizeEvent(
    url.searchParams.get("event") || url.searchParams.get("ev") || "unknown",
  );

  const traderId =
    url.searchParams.get("trader_id") ||
    url.searchParams.get("traderid") ||
    url.searchParams.get("tid") ||
    "";

  const sumdepRaw = url.searchParams.get("sumdep") || url.searchParams.get("sum");
  const sumdep = sumdepRaw ? Number(sumdepRaw) : null;

  console.log("[pocket-postback] incoming", { event, traderId, sumdepRaw });

  if (!traderId) {
    console.warn("[pocket-postback] missing trader_id");
    return new Response("Missing trader_id", { status: 400, headers: corsHeaders });
  }

  const patch: PpTraderRow = { trader_id: traderId };

  if (isRegistrationEvent(event) || isEmailConfirmEvent(event)) {
    patch.registered = true;
  }

  if (isDepositEvent(event)) {
    patch.ftd = true;
  }

  if (sumdep !== null && Number.isFinite(sumdep)) {
    patch.sumdep = sumdep;
    if (sumdep > 0) patch.ftd = true;
  }

  const { error } = await supabase.from("pp_traders").upsert(patch, {
    onConflict: "trader_id",
  });

  if (error) {
    console.error("[pocket-postback] upsert error", { message: error.message });
    return new Response(error.message, { status: 500, headers: corsHeaders });
  }

  console.log("[pocket-postback] OK", { traderId, patch });
  return new Response("OK", { status: 200, headers: corsHeaders });
});