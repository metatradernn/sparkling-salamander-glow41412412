import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, ShieldCheck, UsersRound } from "lucide-react";

type TelegramJoinDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupUrl: string;
  onContinue: () => void;
};

export default function TelegramJoinDialog({
  open,
  onOpenChange,
  groupUrl,
  onContinue,
}: TelegramJoinDialogProps) {
  const inviteCode = useMemo(() => {
    const match = groupUrl.match(/t\.me\/\+(.+)$/);
    return match?.[1] ? String(match[1]) : "";
  }, [groupUrl]);

  const tgDeepLink = inviteCode ? `tg://join?invite=${inviteCode}` : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl border-border bg-background p-0 shadow-xl">
        <div className="relative overflow-hidden rounded-2xl">
          <div className="border-b border-border bg-primary/10 p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl border border-primary/20 bg-primary/15">
                <UsersRound className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <DialogTitle className="text-left text-lg font-semibold tracking-tight">
                    Вступите в закрытую Telegram-группу
                  </DialogTitle>
                  <Badge className="border-primary/25 bg-primary/10 text-primary">
                    Access OK
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 p-5 sm:p-6">
            <div className="flex items-start gap-3 rounded-2xl border border-border bg-card/50 p-4">
              <div className="grid h-10 w-10 place-items-center rounded-2xl border border-border bg-background/60">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold tracking-tight">
                  Доступ подтверждён
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Теперь вступите в группу, чтобы получать всё в одном месте.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <a href={tgDeepLink || groupUrl} target="_blank" rel="noreferrer">
                <Button className="h-11 w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90">
                  <ExternalLink className="h-4 w-4" />
                  Вступить в группу
                </Button>
              </a>

              <div className="grid gap-2">
                <Button
                  type="button"
                  className="h-11 w-full rounded-xl bg-accent text-accent-foreground hover:bg-accent/90"
                  onClick={onContinue}
                >
                  Перейти к сигналам
                </Button>
              </div>
            </div>

            <Separator className="bg-border/70" />

            <p className="text-xs text-muted-foreground">
              Если Telegram не открылся автоматически — используйте кнопку
              «Вступить» или «Скопировать ссылку».
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}