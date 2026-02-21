const ACCESS_KEY = "ai_trade_access_v1";

export type AccessState = {
  traderId: string;
  sumdep?: number | null;
  verifiedAt: number;
};

export function getAccess(): AccessState | null {
  const raw = localStorage.getItem(ACCESS_KEY);
  if (!raw) return null;
  return JSON.parse(raw) as AccessState;
}

export function setAccess(state: AccessState) {
  localStorage.setItem(ACCESS_KEY, JSON.stringify(state));
}

export function clearAccess() {
  localStorage.removeItem(ACCESS_KEY);
}