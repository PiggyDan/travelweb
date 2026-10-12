import type { Metadata } from "next";
import type { ReactNode } from "react";
import { display, sans } from "../fonts";
import "../globals.css";

/** Root layout for the staff area. Separate from the public site: no header, footer, chat bubble or locale. */
export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Dolgion’s Tour admin" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="min-h-svh bg-felt-100 antialiased">{children}</body>
    </html>
  );
}
