import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { showError, showSuccess } from "@/utils/toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { KeyRound, UserCheck } from "lucide-react";

type AdminGrantPanelProps = {
  adminPassword: string;
};

export default function AdminGrantPanel({ adminPassword }: AdminGrantPanelProps) {
  const [traderId, setTraderId] = useState("");
  const [sumdep, setSumdep] = useState<string>("");
  const [sending, setSending] = useState(false);

  const parsedSumdep = useMemo(() => {
    const v = sumdep.trim();
    if (!v) return null;
    const n = Number(v);
    if (!Number.isFinite(n)) return null;
    return n;
  }, [sumdep]);

  async function grant() {
    const id = traderId.trim();
    if (!id) {
      showError("Введите Trader ID пользователя.");
      return;
    }

    if (!adminPassword.trim()) {
      showError("Нет admin-пароля в сессии. Перезайдите как админ.");
      return;
    }

    setSending(true);
    const { error } = await supabase.functions.invoke("admin-grant", {
      body: { traderId: id, sumdep: parsedSumdep },
      headers: {
        "x-admin-password": adminPassword,
      },
    });
    setSending(false);

    if (error) {
      const message = (error as any)?.message ? String((error as any).message) : "";
      const status = (error as any)?.context?.status as number | undefined;
      const body = (error as any)?.context?.body ? String((error as any).context.body) : "";

      console.error("[admin-grant-panel] invoke error", {
        message,
        status,
        body,
      });

      const haystack = `${message}\n${body}`.toLowerCase();

      if (
        haystack.includes("pp_traders") ||
        haystack.includes("could not find the table") ||
        haystack.includes("schema cache")
      ) {
        showError("Не удалось выдать доступ: в Supabase нет таблицы pp_traders.");
        return;
      }

      if (status === 401 || haystack.includes("unauthorized")) {
        showError("Не удалось выдать доступ: неверный admin-пароль.");
        return;
      }

      if (status === 404) {
        showError("Не удалось выдать доступ: функция admin-grant не найдена (404).");
        return;
      }

      showError("Не удалось выдать доступ. Подробности — в консоли браузера.");
      return;
    }

    showSuccess(`Доступ выдан для Trader ID: ${id}`);
    setTraderId("");
    setSumdep("");
  }

  return (
    <Card className="rounded-2xl border-border bg-background/40 backdrop-blur">
      <CardContent className="space-y-3 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl border border-border bg-card/60">
            <UserCheck className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold tracking-tight">Админ-панель</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Принудительно выдать доступ к сигналам по Trader ID (без постбека).
            </p>
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
          <Input
            value={traderId}
            onChange={(e) => setTraderId(e.target.value)}
            placeholder="Trader ID пользователя"
            className="h-11 rounded-xl border-border bg-background/40"
          />
          <Input
            value={sumdep}
            onChange={(e) => setSumdep(e.target.value)}
            placeholder="sumdep (необязательно)"
            inputMode="decimal"
            className="h-11 rounded-xl border-border bg-background/40"
          />
          <Button
            onClick={grant}
            disabled={sending}
            className="h-11 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <KeyRound className="h-4 w-4" />
            {sending ? "Выдаём..." : "Выдать доступ"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}