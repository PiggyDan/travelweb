import { Plus } from "lucide-react";
import type { FaqItem } from "@/types/common";

/**
 * Accessible accordion built on native <details>/<summary>: keyboard and
 * screen-reader support for free, and it works without JavaScript.
 */
export function FaqList({ items }: { items: readonly FaqItem[] }) {
  return (
    <div className="divide-y divide-sand-300/70 border-y border-sand-300/70">
      {items.map((item) => (
        <details key={item.id} className="group">
          <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 text-left font-display text-lg text-sky-950 sm:text-xl [&::-webkit-details-marker]:hidden">
            {item.question}
            <Plus
              aria-hidden
              className="size-5 shrink-0 text-copper-600 transition-transform duration-300 group-open:rotate-45"
            />
          </summary>
          <p className="max-w-3xl pb-6 leading-relaxed text-charcoal-600">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
