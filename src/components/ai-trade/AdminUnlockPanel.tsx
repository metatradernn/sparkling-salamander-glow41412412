import { Lock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type AdminUnlockPanelProps = {
  password: string;
  onPasswordChange: (value: string) => void;
  onUnlock: () => void;
  disabled?: boolean;
};

export default function AdminUnlockPanel({
  password,
  onPasswordChange,
  onUnlock,
  disabled = false,
}: AdminUnlockPanelProps) {
  return (
    <Card className="rounded-2xl border-border bg-background/40">
      <CardContent className="space-y-3 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl border border-border bg-card/60">
            <ShieldCheck className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold tracking-tight">Админ-доступ</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Введите пароль администратора, чтобы войти без проверки постбека.
            </p>
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
          <Input
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            placeholder="Пароль администратора"
            type="password"
            className="h-11 rounded-xl border-border bg-background/40"
            autoComplete="current-password"
          />
          <Button
            onClick={onUnlock}
            disabled={disabled}
            className="h-11 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Lock className="h-4 w-4" />
            Войти
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}