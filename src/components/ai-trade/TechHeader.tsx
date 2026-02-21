import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ShieldCheck, Sparkles } from "lucide-react";

type TechHeaderProps = {
  onGoToVerify: () => void;
  className?: string;
};

export default function TechHeader({ onGoToVerify, className }: TechHeaderProps) {
  return (
    <header className={cn("w-full", className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl border border-border bg-card/60 shadow-sm">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                AI TRADE
              </h1>
              <Badge className="border-primary/25 bg-primary/10 text-primary">
                Pocket Option
              </Badge>
            </div>
            <p className="mt-1 max-w-[52ch] text-sm text-muted-foreground sm:text-base">
              Система сигналов на основе анализа рынка. Доступ открывается только
              после регистрации по нашей ссылке и депозита.
            </p>
          </div>
        </div>

        <Button
          onClick={onGoToVerify}
          className="h-11 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <ShieldCheck className="h-4 w-4" />
          Проверить доступ
        </Button>
      </div>
    </header>
  );
}