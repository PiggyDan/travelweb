import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from "react";
import { LocaleLink } from "@/components/shared/locale-link";
import { cn } from "@/lib/utils";

export type ButtonVariant = "light" | "dark" | "copper" | "outline-light" | "outline-dark";
export type ButtonSize = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2.5 rounded-full font-semibold uppercase tracking-[0.18em] transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<ButtonVariant, string> = {
  light: "bg-felt-100 text-sky-950 hover:bg-white",
  dark: "bg-sky-950 text-felt-100 hover:bg-sky-800 dark:bg-felt-100 dark:text-sky-950 dark:hover:bg-white",
  copper: "bg-copper-600 text-white hover:bg-copper-700",
  "outline-light": "border border-white/60 text-white hover:border-white hover:bg-white/10",
  "outline-dark": "border border-sky-950/30 text-sky-950 hover:border-sky-950 hover:bg-sky-950/5",
};

const sizes: Record<ButtonSize, string> = {
  md: "min-h-11 px-6 text-[0.6875rem]",
  lg: "min-h-13 px-8 text-xs",
};

export function buttonClasses(variant: ButtonVariant = "dark", size: ButtonSize = "lg", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

type ButtonLinkProps = Omit<ComponentProps<typeof LocaleLink>, "className"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
};

/** A link styled as a button. `href` is an unlocalized path. */
export function ButtonLink({ variant, size, className, children, ...props }: ButtonLinkProps) {
  return (
    <LocaleLink className={buttonClasses(variant, size, className)} {...props}>
      {children}
    </LocaleLink>
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({ variant, size, className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={buttonClasses(variant, size, className)} {...props} />;
}
