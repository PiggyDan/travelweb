import { Compass } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed border-sand-400/60 bg-felt-50 px-6 py-16 text-center">
      <Compass aria-hidden className="size-10 text-copper-500" strokeWidth={1.25} />
      <h3 className="mt-5 font-display text-2xl font-light text-sky-950">{title}</h3>
      <p className="mt-3 max-w-md text-charcoal-600">{description}</p>
      {action && <div className="mt-8">{action}</div>}
    </div>
  );
}
