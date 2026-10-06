import { ChevronRight } from "lucide-react";
import { LocaleLink } from "./locale-link";

export interface BreadcrumbItem {
  name: string;
  /** Unlocalized path. The last item is the current page and is not linked. */
  path: string;
}

export function Breadcrumbs({ items }: { items: readonly BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs font-medium tracking-wide text-white/75">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-1.5">
              {isLast ? (
                <span aria-current="page" className="text-white">
                  {item.name}
                </span>
              ) : (
                <>
                  <LocaleLink href={item.path} className="underline-offset-4 hover:text-white hover:underline">
                    {item.name}
                  </LocaleLink>
                  <ChevronRight aria-hidden className="size-3.5" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
