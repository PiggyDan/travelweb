import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  /** Heading level. Pages own the single h1, so sections default to h2. */
  as?: "h2" | "h3";
  id?: string;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "dark",
  as: Heading = "h2",
  id,
  className,
}: SectionHeadingProps) {
  const onDark = tone === "light";
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <p className={cn("eyebrow mb-4", onDark ? "text-copper-300" : "text-copper-600")}>{eyebrow}</p>
      )}
      <Heading
        id={id}
        className={cn(
          "font-display text-4xl leading-[1.05] font-light tracking-tight text-balance sm:text-5xl lg:text-6xl",
          onDark ? "text-felt-50" : "text-sky-950",
        )}
      >
        {title}
      </Heading>
      {description && (
        <div
          className={cn(
            "mt-6 text-base leading-relaxed text-pretty sm:text-lg",
            onDark ? "text-sky-100" : "text-charcoal-600",
          )}
        >
          {description}
        </div>
      )}
    </div>
  );
}
