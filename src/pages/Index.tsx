import TechBackground from "@/components/ai-trade/TechBackground";
import TechHeader from "@/components/ai-trade/TechHeader";
import OnboardingWizard from "@/components/ai-trade/OnboardingWizard";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useRef } from "react";

const Index = () => {
  const verifyRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <TechBackground />

      <div className="relative mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <TechHeader
          onGoToVerify={() =>
            verifyRef.current?.scrollIntoView({ behavior: "smooth" })
          }
        />

        <Separator className="my-7 bg-border/70" />

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div ref={verifyRef}>
            <OnboardingWizard />
          </div>

          <div className="space-y-4">
            <Card className="rounded-2xl border-border bg-card/70 backdrop-blur">
              <CardContent className="p-5">
                <p className="text-sm font-semibold tracking-tight">
                  Что вы получаете
                </p>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                    Сигналы (CALL/PUT) с таймфреймом и уверенностью.
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                    Быстрый доступ через проверку Trader ID.
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                    Поддержка в Telegram: @max_supportTraide.
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border bg-background/40">
              <CardContent className="p-5 text-sm text-muted-foreground">
                <p className="text-foreground font-semibold tracking-tight">
                  Как работает доступ
                </p>
                <p className="mt-2">
                  Pocket Partners отправляет события (регистрация/FTD) на наш
                  постбек. После этого ваш Trader ID появляется в базе, и вы
                  получаете доступ к меню сигналов.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-10 text-center text-xs text-muted-foreground">
          AI TRADE — high-tech interface for Pocket Option signals.
        </div>
      </div>
    </div>
  );
};

export default Index;