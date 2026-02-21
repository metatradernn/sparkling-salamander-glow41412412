import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { setAccess } from "@/lib/access";
import { showError, showSuccess } from "@/utils/toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  ExternalLink,
  MessageCircle,
  ShieldCheck,
  Wallet,
} from "lucide-react";

const RU_LINK = "https://po-ru4.click/smart/SLjZBE1edTSNUa";
const CIS_LINK = "https://u3.shortink.io/smart/SLjZBE1edTSNUa";
const TG_SUPPORT = "https://t.me/max_supportTraide";

type Step = 1 | 2 | 3;

type PpTraderRow = {
  trader_id: string;
  registered: boolean | null;
  ftd: boolean | null;
  sumdep: number | null;
};

function StepPill({ step, active }: { step: number; active: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={[
          "grid h-7 w-7 place-items-center rounded-full border text-xs font-semibold",
          active
            ? "border-primary/40 bg-primary/15 text-primary"
            : "border-border bg-card/50 text-muted-foreground",
        ].join(" ")}
      >
        {step}
      </div>
    </div>
  );
}

export default function OnboardingWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [traderId, setTraderId] = useState("");
  const [checking, setChecking] = useState(false);

  const progress = useMemo(() => {
    if (step === 1) return 22;
    if (step === 2) return 62;
    return 100;
  }, [step]);

  async function verify() {
    const id = traderId.trim();
    if (!id) {
      showError("Введите ID аккаунта Pocket Option.");
      return;
    }

    setChecking(true);
    const { data, error } = await supabase
      .from("pp_traders")
      .select("trader_id, registered, ftd, sumdep")
      .eq("trader_id", id)
      .maybeSingle<PpTraderRow>();

    setChecking(false);

    if (error) {
      throw error;
    }

    const ok = Boolean(data?.ftd) || (data?.sumdep ?? 0) > 0;

    if (!ok) {
      showError(
        "Доступ отклонён: вы не зарегистрированы по нашей ссылке или не пополнили баланс.",
      );
      window.open(TG_SUPPORT, "_blank", "noopener,noreferrer");
      return;
    }

    setAccess({
      traderId: data!.trader_id,
      sumdep: data?.sumdep ?? null,
      verifiedAt: Date.now(),
    });

    showSuccess("Доступ открыт. Добро пожаловать в AI TRADE.");
    navigate("/signals");
  }

  return (
    <Card className="overflow-hidden rounded-2xl border-border bg-card/70 shadow-sm backdrop-blur">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <StepPill step={1} active={step === 1} />
              <div className="h-[2px] w-8 bg-border" />
              <StepPill step={2} active={step === 2} />
              <div className="h-[2px] w-8 bg-border" />
              <StepPill step={3} active={step === 3} />
            </div>
            <Badge className="border-primary/25 bg-primary/10 text-primary">
              Secure Access
            </Badge>
          </div>

          <Progress
            value={progress}
            className="h-2 rounded-full bg-secondary"
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {step === 1 && (
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl border border-border bg-card/60">
                <ExternalLink className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold tracking-tight">
                  Шаг 1 — Регистрация
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Выберите вашу ссылку и зарегистрируйтесь в Pocket Option. После
                  регистрации вернитесь сюда и нажмите «Продолжить».
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <a href={RU_LINK} target="_blank" rel="noreferrer">
                <Button
                  className="h-12 w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
                  type="button"
                >
                  Регистрация (Россия)
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </a>

              <a href={CIS_LINK} target="_blank" rel="noreferrer">
                <Button
                  className="h-12 w-full rounded-xl border border-border bg-background/40 text-foreground hover:bg-accent"
                  variant="outline"
                  type="button"
                >
                  Регистрация (СНГ)
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </a>
            </div>

            <Separator className="bg-border/70" />

            <Alert className="rounded-xl border-primary/30 bg-primary/10">
              <CircleAlert className="h-4 w-4 text-primary" />
              <AlertTitle className="text-foreground">
                Важно: регистрируйтесь именно по нашей ссылке
              </AlertTitle>
              <AlertDescription className="text-muted-foreground">
                Иначе система постбека не сможет подтвердить ваш доступ к
                сигналам.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl border border-border bg-card/60">
                <Wallet className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold tracking-tight">
                  Шаг 2 — Пополнение баланса
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Чтобы продолжить, нужно пополнить баланс на любую сумму.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <Card className="rounded-2xl border-border bg-background/40">
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">Минимум</p>
                  <p className="mt-1 text-lg font-semibold tracking-tight">
                    Любая сумма
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-primary/30 bg-primary/10">
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">Рекомендация</p>
                  <p className="mt-1 text-lg font-semibold tracking-tight">
                    от 100$
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-border bg-background/40">
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">Комфортно</p>
                  <p className="mt-1 text-lg font-semibold tracking-tight">
                    500$
                  </p>
                </CardContent>
              </Card>
            </div>

            <Alert className="rounded-xl border-border bg-background/40">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <AlertTitle className="text-foreground">
                После депозита переходите к проверке
              </AlertTitle>
              <AlertDescription className="text-muted-foreground">
                На следующем шаге вы введёте ID аккаунта и система проверит ваш
                статус.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl border border-border bg-card/60">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold tracking-tight">
                  Шаг 3 — Проверка доступа
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Введите ваш <span className="text-foreground">Trader ID</span>{" "}
                  (ID аккаунта Pocket Option). Доступ откроется, если постбек
                  подтвердит регистрацию и депозит.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <Input
                value={traderId}
                onChange={(e) => setTraderId(e.target.value)}
                placeholder="Например: 123456789"
                className="h-12 rounded-xl border-border bg-background/40 text-base"
                inputMode="numeric"
              />
              <Button
                onClick={verify}
                disabled={checking}
                className="h-12 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {checking ? "Проверяем..." : "Проверить"}
              </Button>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground">
                Если возникли вопросы — напишите в поддержку.
              </p>
              <a href={TG_SUPPORT} target="_blank" rel="noreferrer">
                <Button
                  variant="outline"
                  className="h-10 rounded-xl border-border bg-background/40"
                >
                  <MessageCircle className="h-4 w-4" />
                  @max_supportTraide
                </Button>
              </a>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          variant="outline"
          className="h-11 w-full rounded-xl border-border bg-background/40 sm:w-auto"
          onClick={() => setStep((s) => (s === 1 ? 1 : ((s - 1) as Step)))}
          disabled={step === 1 || checking}
        >
          Назад
        </Button>

        <Button
          className="h-11 w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto"
          onClick={() => setStep((s) => (s === 3 ? 3 : ((s + 1) as Step)))}
          disabled={step === 3 || checking}
        >
          Продолжить
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}