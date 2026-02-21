import * as React from "react";
import { Fingerprint, LoaderCircle, TrendingDown, TrendingUp } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Badge } from "@/components/ui/badge";
import { dismissToast, showLoading, showSuccess } from "@/utils/toast";

type AssetBankCardProps = {
  name: string;
  tone?: "indigo" | "teal" | "amber" | "rose" | "slate";
  className?: string;
  selected?: boolean;
  onSelect?: () => void;
};

type TimeframeValue = "1m" | "2m" | "3m" | "5m";
type ResultDirection = "BUY" | "SELL";
type SignalLevel = 1 | 2 | 3 | 4;

const tones: Record<NonNullable<AssetBankCardProps["tone"]>, string> = {
  indigo:
    "border-primary/20 bg-primary/5 text-foreground shadow-[0_10px_30px_-18px] shadow-primary/35",
  teal: "border-emerald-500/20 bg-emerald-500/5 text-foreground shadow-[0_10px_30px_-18px] shadow-emerald-500/35",
  amber:
    "border-amber-500/20 bg-amber-500/5 text-foreground shadow-[0_10px_30px_-18px] shadow-amber-500/35",
  rose: "border-rose-500/20 bg-rose-500/5 text-foreground shadow-[0_10px_30px_-18px] shadow-rose-500/35",
  slate:
    "border-border/70 bg-background/40 text-foreground shadow-[0_10px_30px_-22px] shadow-black/20",
};

const tfLabel: Record<TimeframeValue, string> = {
  "1m": "1м",
  "2m": "2м",
  "3m": "3м",
  "5m": "5м",
};

function randomResult(): ResultDirection {
  return Math.random() > 0.5 ? "BUY" : "SELL";
}

function hashString(input: string) {
  let h = 0;
  for (let i = 0; i < input.length; i += 1) {
    h = (h << 5) - h + input.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function levelFor(name: string, timeframe: TimeframeValue, slotMs = 30_000): SignalLevel {
  const base = hashString(`${name}::${timeframe}`);
  const slot = Math.floor(Date.now() / slotMs);
  const seed = base + slot * 97;

  const x = Math.sin(seed) * 10_000;
  const frac = x - Math.floor(x);
  const n = 1 + Math.floor(frac * 4); // 1..4
  return (Math.min(4, Math.max(1, n)) as SignalLevel);
}

const levelMeta: Record<
  SignalLevel,
  { label: string; activeDotClass: string; subtleGlowClass: string }
> = {
  4: {
    label: "Уверенный",
    activeDotClass: "bg-emerald-400/80",
    subtleGlowClass: "shadow-[0_0_0_3px] shadow-emerald-500/10",
  },
  3: {
    label: "Хороший",
    activeDotClass: "bg-sky-400/80",
    subtleGlowClass: "shadow-[0_0_0_3px] shadow-sky-500/10",
  },
  2: {
    label: "Нейтрально",
    activeDotClass: "bg-amber-400/80",
    subtleGlowClass: "shadow-[0_0_0_3px] shadow-amber-500/10",
  },
  1: {
    label: "Плохой",
    activeDotClass: "bg-rose-400/80",
    subtleGlowClass: "shadow-[0_0_0_3px] shadow-rose-500/10",
  },
};

export default function AssetBankCard({
  name,
  tone = "slate",
  className,
  selected = false,
  onSelect,
}: AssetBankCardProps) {
  const [timeframe, setTimeframe] = React.useState<TimeframeValue>("1m");
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [result, setResult] = React.useState<ResultDirection | null>(null);
  const [signalLevel, setSignalLevel] = React.useState<SignalLevel>(() =>
    levelFor(name, "1m"),
  );

  React.useEffect(() => {
    setSignalLevel(levelFor(name, timeframe));
    const id = window.setInterval(() => {
      setSignalLevel(levelFor(name, timeframe));
    }, 30_000);

    return () => window.clearInterval(id);
  }, [name, timeframe]);

  const analyze = React.useCallback(() => {
    if (isAnalyzing) return;

    setIsAnalyzing(true);
    setResult(null);

    const toastId = showLoading(`Анализ: ${name} • ${tfLabel[timeframe]}`);
    const durationMs = 1100 + Math.floor(Math.random() * 1100);

    window.setTimeout(() => {
      const next = randomResult();
      setResult(next);
      setIsAnalyzing(false);
      dismissToast(String(toastId));
      showSuccess(
        `${name} • ${tfLabel[timeframe]} — ${next === "BUY" ? "Покупать" : "Продавать"}`,
      );
    }, durationMs);
  }, [isAnalyzing, name, timeframe]);

  const isBuy = result === "BUY";

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect?.()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onSelect?.();
      }}
      className={cn(
        "group relative overflow-hidden rounded-3xl border p-4 sm:p-5",
        "backdrop-blur supports-[backdrop-filter]:bg-background/35",
        "transition-transform duration-200 hover:-translate-y-0.5",
        selected
          ? "ring-2 ring-primary/40 shadow-[0_18px_45px_-26px] shadow-primary/45"
          : "ring-1 ring-transparent",
        tones[tone],
        className,
      )}
    >
      {/* ambient blobs */}
      <div className="pointer-events-none absolute -right-14 -top-14 h-44 w-44 rounded-full bg-foreground/5 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-16 h-52 w-52 rounded-full bg-foreground/5 blur-2xl" />

      {/* always-on "tech analysis" animation */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 opacity-[0.55]">
          <div className="absolute left-5 top-6 h-10 w-16 rounded-2xl border border-foreground/10 bg-foreground/5">
            <div className="absolute left-2 top-2 h-1.5 w-5 rounded-full bg-foreground/15" />
            <div className="absolute left-2 top-6 h-1.5 w-9 rounded-full bg-foreground/10" />
          </div>

          <div className="absolute -right-10 top-10 h-24 w-24 rounded-full bg-foreground/5 blur-2xl" />
        </div>

        <div className="absolute left-0 top-0 h-[2px] w-28 bg-primary/35 blur-[0.5px] animate-ai-scan" />
        <div className="absolute bottom-7 left-7 h-1.5 w-1.5 rounded-full bg-primary/35 animate-ai-ping-soft" />
        <div className="absolute bottom-11 left-11 h-1 w-1 rounded-full bg-foreground/25 animate-ai-ping-soft [animation-delay:600ms]" />
      </div>

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Asset
          </p>
          <p
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              const text = name.replace(/\s*OTC\s*$/i, "");
              void navigator.clipboard.writeText(text).then(() => {
                showSuccess(`Скопировано: ${text}`);
              });
            }}
            onKeyDown={(e) => {
              if (e.key !== "Enter" && e.key !== " ") return;
              e.stopPropagation();
              const text = name.replace(/\s*OTC\s*$/i, "");
              void navigator.clipboard.writeText(text).then(() => {
                showSuccess(`Скопировано: ${text}`);
              });
            }}
            title="Нажмите, чтобы скопировать"
            className={cn(
              "mt-2 break-words text-base font-semibold leading-tight tracking-tight sm:text-[17px]",
              "cursor-copy select-none rounded-lg outline-none transition-colors",
              "hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/35",
            )}
          >
            {name}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <ToggleGroup
              type="single"
              value={timeframe}
              onValueChange={(v) => {
                if (!v) return;
                setTimeframe(v as TimeframeValue);
                setResult(null);
              }}
              className="justify-start"
            >
              {(["1m", "2m", "3m", "5m"] as const).map((v) => (
                <ToggleGroupItem
                  key={v}
                  value={v}
                  className={cn(
                    "h-8 rounded-xl px-3 text-xs",
                    "border border-foreground/10 bg-foreground/5 text-foreground/90",
                    "data-[state=on]:border-primary/25 data-[state=on]:bg-primary/10 data-[state=on]:text-primary",
                    "hover:bg-foreground/10",
                  )}
                >
                  {tfLabel[v]}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>

            <Badge className="rounded-full border border-foreground/10 bg-foreground/5 text-foreground/80">
              OTC
            </Badge>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <Button
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              analyze();
            }}
            disabled={isAnalyzing}
            className={cn(
              "h-10 w-10 rounded-2xl",
              "bg-primary text-primary-foreground hover:bg-primary/90",
              "shadow-[0_14px_30px_-20px] shadow-primary/60",
            )}
            aria-label="Анализировать"
          >
            {isAnalyzing ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <Fingerprint className="h-4 w-4" />
            )}
          </Button>

          <div className="relative grid h-10 w-14 place-items-center rounded-2xl border border-foreground/10 bg-foreground/5">
            <div className="h-6 w-10 rounded-xl bg-foreground/10" />
            <div className="absolute -right-2 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-foreground/10" />
          </div>
        </div>
      </div>

      <div className="relative mt-5 flex items-center justify-between gap-3">
        {result ? (
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "grid h-8 w-8 place-items-center rounded-2xl border",
                isBuy
                  ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-300"
                  : "border-rose-500/25 bg-rose-500/10 text-rose-300",
              )}
            >
              {isBuy ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
            </div>
            <div className="leading-tight">
              <p className="text-xs text-muted-foreground">Сигнал</p>
              <p
                className={cn(
                  "text-sm font-semibold tracking-tight",
                  isBuy ? "text-emerald-200" : "text-rose-200",
                )}
              >
                {isBuy ? "Покупать" : "Продавать"}
              </p>
            </div>
          </div>
        ) : (
          <div
            className="flex items-center gap-2"
            aria-label={`Уровень сигнала: ${signalLevel}/4 • ${levelMeta[signalLevel].label}`}
            title={`Уровень сигнала: ${signalLevel}/4 • ${levelMeta[signalLevel].label}`}
          >
            <div
              className={cn(
                "flex items-center gap-1.5 rounded-full border border-foreground/10 bg-foreground/5 px-2 py-1",
                levelMeta[signalLevel].subtleGlowClass,
              )}
            >
              {Array.from({ length: 4 }).map((_, idx) => {
                const active = idx < signalLevel;
                return (
                  <div
                    key={idx}
                    className={cn(
                      "h-2.5 w-2.5 rounded-full transition-colors duration-300",
                      active ? levelMeta[signalLevel].activeDotClass : "bg-foreground/15",
                      active ? "shadow-[0_0_0_2px] shadow-white/5" : "",
                    )}
                  />
                );
              })}
            </div>
          </div>
        )}

        {isAnalyzing ? (
          <p className="text-xs font-medium text-muted-foreground">Анализ…</p>
        ) : (
          <p className="text-xs font-medium text-muted-foreground">
            {selected ? "Выбрано" : "Готово"}
          </p>
        )}
      </div>

      {isAnalyzing ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14">
          <div className="absolute inset-x-0 bottom-0 h-full bg-foreground/5" />
          <div className="absolute bottom-4 left-4 right-4 h-[2px] overflow-hidden rounded-full bg-foreground/10">
            <div className="h-full w-1/2 rounded-full bg-primary/45 animate-ai-progress" />
          </div>
        </div>
      ) : null}
    </div>
  );
}