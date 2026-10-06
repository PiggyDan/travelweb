import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeTone = "glass" | "sand" | "steppe" | "sky" | "copper" | "muted";

const tones: Record<BadgeTone, string> = {
  glass: "bg-sky-950/55 text-white backdrop-blur-sm",
  sand: "bg-sand-100 text-sand-700",
  steppe: "bg-steppe-100 text-steppe-700",
  sky: "bg-sky-100 text-sky-800",
  copper: "bg-copper-300/30 text-copper-700",
  muted: "bg-charcoal-900/5 text-charcoal-600",
};

export function Badge({ tone = "sand", className, children }: { tone?: BadgeTone; className?: string; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.6875rem] font-semibold tracking-[0.12em] uppercase",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
