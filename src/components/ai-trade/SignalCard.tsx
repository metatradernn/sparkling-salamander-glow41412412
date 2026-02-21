import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { TradeSignal } from "@/hooks/use-signals";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

type SignalCardProps = {
  signal: TradeSignal;
  compact?: boolean;
};

export default function SignalCard({ signal, compact = false }: SignalCardProps) {
  const isCall = signal.direction === "CALL";

  return (
    <Card className="rounded-2xl border-border bg-background/40 backdrop-blur">
      <CardContent className={cn("p-4", compact ? "sm:p-4" : "sm:p-5")}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold tracking-tight sm:text-base">
                {signal.pair}
              </p>
              <Badge
                className={cn(
                  "rounded-full border px-2 py-0.5 text-[11px]",
                  isCall
                    ? "border-primary/30 bg-primary/10 text-primary"
                    : "border-border bg-card/60 text-foreground",
                )}
              >
                {signal.timeframe}
              </Badge>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Confidence:{" "}
              <span className="text-foreground">{signal.confidence}%</span>
            </p>
          </div>

          <div
            className={cn(
              "grid h-10 w-10 place-items-center rounded-xl border",
              isCall
                ? "border-primary/30 bg-primary/10 text-primary"
                : "border-border bg-card/60 text-foreground",
            )}
          >
            {isCall ? (
              <ArrowUpRight className="h-5 w-5" />
            ) : (
              <ArrowDownRight className="h-5 w-5" />
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <Badge
            className={cn(
              "rounded-full border px-2.5 py-1 text-xs",
              isCall
                ? "border-primary/30 bg-primary/10 text-primary"
                : "border-border bg-card/60 text-foreground",
            )}
          >
            {signal.direction}
          </Badge>

          <p className="text-xs text-muted-foreground">
            {new Date(signal.createdAt).toLocaleString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}