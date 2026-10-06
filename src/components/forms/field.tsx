import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const control =
  "w-full rounded-xl border border-sand-300 bg-white px-4 text-base text-charcoal-900 placeholder:text-charcoal-400 transition-colors hover:border-sand-500 focus:border-sky-700 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper-500";

interface FieldProps {
  id: string;
  label: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}

export function Field({ id, label, hint, required, className, children }: FieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-sky-950">
        {label}
        {required && (
          <span aria-hidden className="text-copper-600">
            {" "}
            *
          </span>
        )}
      </label>
      {children}
      {hint && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-charcoal-500">
          {hint}
        </p>
      )}
    </div>
  );
}

export function TextInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(control, "min-h-12", className)} {...props} />;
}

export function TextArea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(control, "min-h-36 py-3", className)} {...props} />;
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select className={cn(control, "min-h-12 cursor-pointer appearance-none pr-10", className)} {...props}>
        {children}
      </select>
      <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-sky-950" />
    </div>
  );
}
