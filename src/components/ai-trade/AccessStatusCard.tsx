import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { clearAccess, getAccess } from "@/lib/access";
import { showSuccess } from "@/utils/toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, LogOut, Lock, ShieldCheck } from "lucide-react";

export default function AccessStatusCard() {
  const navigate = useNavigate();
  const access = getAccess();

  const verifiedLabel = useMemo(() => {
    if (!access) return "Доступ закрыт";
    return "Доступ открыт";
  }, [access]);

  const dateLabel = useMemo(() => {
    if (!access) return "—";
    return new Date(access.verifiedAt).toLocaleString();
  }, [access]);

  return (
    <Card className="rounded-2xl border-border bg-background/40 backdrop-blur">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div
              className={[
                "grid h-11 w-11 place-items-center rounded-2xl border",
                access
                  ? "border-primary/30 bg-primary/10 text-primary"
                  : "border-border bg-card/60 text-muted-foreground",
              ].join(" ")}
            >
              {access ? (
                <ShieldCheck className="h-5 w-5" />
              ) : (
                <Lock className="h-5 w-5" />
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold tracking-tight">
                  Статус доступа
                </p>
                <Badge
                  className={[
                    "rounded-full border px-2.5 py-1 text-xs",
                    access
                      ? "border-primary/30 bg-primary/10 text-primary"
                      : "border-border bg-card/60 text-foreground",
                  ].join(" ")}
                >
                  {verifiedLabel}
                </Badge>
              </div>

              <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                <p>
                  Trader ID:{" "}
                  <span className="text-foreground">
                    {access?.traderId ?? "—"}
                  </span>
                </p>
                <p>
                  Последняя проверка:{" "}
                  <span className="text-foreground">{dateLabel}</span>
                </p>
                <p>
                  Депозит (если передан):{" "}
                  <span className="text-foreground">
                    {access?.sumdep ?? "—"}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {access ? (
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Button
              className="h-11 flex-1 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => navigate("/signals")}
            >
              Перейти к сигналам
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-11 rounded-xl border-border bg-background/40"
              onClick={() => {
                clearAccess();
                showSuccess("Доступ сброшен.");
                navigate("/");
              }}
            >
              <LogOut className="h-4 w-4" />
              Сбросить
            </Button>
          </div>
        ) : (
          <p className="mt-4 text-xs text-muted-foreground">
            Пройдите шаги ниже и подтвердите Trader ID — после этого откроется
            меню сигналов.
          </p>
        )}
      </CardContent>
    </Card>
  );
}