import * as React from "react";

export type TradeDirection = "CALL" | "PUT";
export type TradeTimeframe = "1m" | "3m" | "5m";

export type TradeSignal = {
  id: string;
  pair: string;
  direction: TradeDirection;
  timeframe: TradeTimeframe;
  confidence: number;
  createdAt: number;
};

const PAIRS = ["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD", "USD/CHF", "XAU/USD"];

function rand<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function genId() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function generateSignal(): TradeSignal {
  const direction: TradeDirection = Math.random() > 0.5 ? "CALL" : "PUT";
  const timeframe: TradeTimeframe = rand(["1m", "3m", "5m"]);
  const confidence = Math.max(58, Math.min(92, Math.round(60 + Math.random() * 35)));

  return {
    id: genId(),
    pair: rand(PAIRS),
    direction,
    timeframe,
    confidence,
    createdAt: Date.now(),
  };
}

export function useSignals() {
  const [signals, setSignals] = React.useState<TradeSignal[]>([]);
  const [history, setHistory] = React.useState<TradeSignal[]>([]);

  const runAnalysis = React.useCallback(() => {
    const next = Array.from({ length: 3 }, () => generateSignal());
    setSignals(next);
    setHistory((h) => [...next, ...h].slice(0, 30));
    return next;
  }, []);

  return { signals, history, runAnalysis };
}