"use client";

import { ArrowRight } from "lucide-react";
import { useId, useState, type FormEvent } from "react";
import { subscribeToNewsletter } from "@/services/inquiry-service";

export function NewsletterForm() {
  const inputId = useId();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    const result = await subscribeToNewsletter(email);
    setPending(false);
    setMessage(result.status === "accepted" ? "Thank you — you're on the list." : result.message);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <label htmlFor={inputId} className="eyebrow block text-copper-300">
        Letters from the steppe
      </label>
      <p className="mt-3 text-sm text-sky-200">
        Seasonal stories, new departures and quiet travel advice. A few times a year.
      </p>
      <div className="mt-5 flex items-center gap-2 border-b border-white/30 pb-2 focus-within:border-white">
        <input
          id={inputId}
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Your email address"
          className="min-h-11 min-w-0 flex-1 bg-transparent text-base text-white placeholder:text-sky-300 focus:outline-none"
        />
        <button
          type="submit"
          disabled={pending}
          aria-label="Subscribe to the newsletter"
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-felt-100 text-sky-950 transition-colors hover:bg-white disabled:opacity-60"
        >
          <ArrowRight aria-hidden className="size-5" />
        </button>
      </div>
      <p role="status" aria-live="polite" className="mt-3 min-h-5 text-sm text-copper-300">
        {message}
      </p>
    </form>
  );
}
