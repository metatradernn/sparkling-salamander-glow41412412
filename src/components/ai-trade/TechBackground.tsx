import { cn } from "@/lib/utils";

type TechBackgroundProps = {
  className?: string;
};

export default function TechBackground({ className }: TechBackgroundProps) {
  return (
    <div className={cn("pointer-events-none absolute inset-0", className)}>
      <div className="absolute inset-0 opacity-[0.12] [background-size:32px_32px] [background-image:linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary))_0%,transparent_42%)] opacity-[0.10]" />
      <div className="absolute inset-0 opacity-[0.10] [background-image:linear-gradient(115deg,transparent_0%,hsl(var(--primary))_50%,transparent_100%)] blur-3xl" />
    </div>
  );
}