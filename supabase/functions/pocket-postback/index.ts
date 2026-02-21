import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

type PpTraderRow = {
  trader_id: string;
  registered?: boolean | null;
  ftd?: boolean | null;
  sumdep?: number | null;
};

Deno.serve(async (req) => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const url = new URL(req.url);

  const event =
    (url.searchParams.get("event") ||
      url.searchParams.get("ev") ||
      "").toLowerCase() || "unknown";

  const traderId =
    url.searchParams.get("trader_id") ||
    url.searchParams.get("traderid") ||
    url.searchParams.get("tid") ||
    "";

  const sumdepRaw = url.searchParams.get("sumdep") || url.searchParams.get("sum");
  const sumdep = sumdepRaw ? Number(sumdepRaw) : null;

  if (!traderId) {
    return new Response("Missing trader_id", { status: 400 });
  }

  const patch: PpTraderRow = { trader_id: traderId };

  if (event.includes("reg") || event.includes("registration")) {
    patch.registered = true;
  }

  if (event.includes("ftd") || event.includes("deposit")) {
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
    return new Response(error.message, { status: 500 });
  }

  return new Response("OK", { status: 200 });
});