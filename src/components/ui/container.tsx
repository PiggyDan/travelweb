import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ContainerProps {
  as?: ElementType;
  className?: string;
  /** "default" for page content, "narrow" for long-form reading. */
  width?: "default" | "narrow";
  children: ReactNode;
}

export function Container({ as: Component = "div", className, width = "default", children }: ContainerProps) {
  return (
    <Component
      className={cn(
        "mx-auto w-full px-5 sm:px-8 lg:px-12",
        width === "default" ? "max-w-[90rem]" : "max-w-3xl",
        className,
      )}
    >
      {children}
    </Component>
  );
}
