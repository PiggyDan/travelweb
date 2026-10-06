"use client";

import "./globals.css";

/**
 * Last-resort boundary for errors thrown in the root `[locale]` layout
 * itself. It replaces the whole document, so it renders its own html/body.
 */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body className="flex min-h-svh items-center justify-center bg-sky-950 p-6 text-center text-white">
        <main>
          <h1 className="text-4xl">Something went wrong</h1>
          <p className="mt-4 text-sky-100">Please try again in a moment.</p>
          <button
            type="button"
            onClick={reset}
            className="mt-8 min-h-12 rounded-full bg-felt-100 px-8 text-xs font-semibold tracking-[0.18em] text-sky-950 uppercase"
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
