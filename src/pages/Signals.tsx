import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { clearAccess, getAccess } from "@/lib/access";
import { showSuccess } from "@/utils/toast";
import { useSignals } from "@/hooks/use-signals";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import SignalCard from "@/components/ai-trade/SignalCard";
import {
  Bot,
  LogOut,
  Radar,
  ShieldCheck,
  TriangleAlert,
  Zap,
} from "lucide-react";

export default function Signals() {
  const navigate = useNavigate();
  const access = getAccess();
  const { signals, history, runAnalysis } = useSignals();

  const traderLabel = useMemo(() => {
    if (!access) return "—";
    return access.traderId;
  }, [access]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl border border-border bg-card/60">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  AI TRADE — Сигналы
                </h1>
                <Badge className="border-primary/25 bg-primary/10 text-primary">
                  Verified
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Trader ID: <span className="text-foreground">{traderLabel}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              onClick={() => {
                runAnalysis();
                showSuccess("Анализ завершён — новые сигналы готовы.");
              }}
              className="h-11 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Radar className="h-4 w-4" />
              Запустить анализ
            </Button>

            <Button
              variant="outline"
              className="h-11 rounded-xl border-border bg-background/40"
              onClick={() => {
                clearAccess();
                navigate("/");
              }}
            >
              <LogOut className="h-4 w-4" />
              Выйти
            </Button>
          </div>
        </div>

        <Separator className="my-6 bg-border/70" />

        <Tabs defaultValue="signals" className="w-full">
          <TabsList className="h-11 rounded-xl bg-secondary/60 p-1">
            <TabsTrigger value="signals" className="rounded-lg">
              <Zap className="h-4 w-4" />
              Сигналы
            </TabsTrigger>
            <TabsTrigger value="history" className="rounded-lg">
              <ShieldCheck className="h-4 w-4" />
              История
            </TabsTrigger>
            <TabsTrigger value="rules" className="rounded-lg">
              <TriangleAlert className="h-4 w-4" />
              Правила
            </TabsTrigger>
          </TabsList>

          <TabsContent value="signals" className="mt-4">
            <div className="grid gap-4 lg:grid-cols-3">
              {signals.length === 0 ? (
                <Card className="rounded-2xl border-border bg-background/40 lg:col-span-3">
                  <CardHeader className="pb-2">
                    <h2 className="text-lg font-semibold tracking-tight">
                      Сигналов пока нет
                    </h2>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    Нажмите «Запустить анализ», чтобы получить свежие сигналы.
                  </CardContent>
                </Card>
              ) : (
                signals.map((s) => <SignalCard key={s.id} signal={s} />)
              )}
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <div className="grid gap-3">
              {history.length === 0 ? (
                <Card className="rounded-2xl border-border bg-background/40">
                  <CardContent className="p-4 text-sm text-muted-foreground">
                    История появится после первого анализа.
                  </CardContent>
                </Card>
              ) : (
                history.map((s) => (
                  <SignalCard key={s.id} signal={s} compact />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="rules" className="mt-4">
            <Card className="rounded-2xl border-border bg-background/40">
              <CardContent className="space-y-3 p-5 text-sm text-muted-foreground">
                <p className="text-foreground font-semibold tracking-tight">
                  Дисклеймер
                </p>
                <p>
                  Сигналы являются информационными и не являются финансовой
                  рекомендацией. Вы принимаете решения и риски самостоятельно.
                </p>
                <p>
                  Для комфортной работы обычно рекомендуем депозит{" "}
                  <span className="text-foreground font-medium">от 100$</span>,
                  а максимально комфортно —{" "}
                  <span className="text-foreground font-medium">500$</span>.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}