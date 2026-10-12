"use client";

import { ClipboardList, ExternalLink, LogOut, MessagesSquare } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { api, ApiError } from "@/lib/api";
import { usePoll } from "@/lib/use-poll";
import { cn } from "@/lib/utils";
import type { AdminSummary, AdminUser } from "@/types/chat";
import logo from "../../../public/images/dolgion-tour-logo.svg";

interface AdminContextValue {
  admin: AdminUser;
  summary: AdminSummary;
  /** Re-fetch the nav badges now (e.g. after reading a conversation). */
  refreshSummary: () => void;
}

const AdminContext = createContext<AdminContextValue | null>(null);

export function useAdmin(): AdminContextValue {
  const value = useContext(AdminContext);
  if (!value) throw new Error("useAdmin must be used inside <AdminShell>");
  return value;
}

/** Any 401 from the API means the session ended: go back to sign-in. */
export function useSignOutOnExpiry() {
  const router = useRouter();
  return useCallback(
    (error: unknown) => {
      if (error instanceof ApiError && error.status === 401) router.replace("/admin/login");
    },
    [router],
  );
}

const NAV = [
  { href: "/admin", label: "Trip plans", icon: ClipboardList, badge: "newTripPlans" },
  { href: "/admin/inbox", label: "Inbox", icon: MessagesSquare, badge: "unreadConversations" },
] as const;

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const onExpired = useSignOutOnExpiry();
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [summary, setSummary] = useState<AdminSummary>({ newTripPlans: 0, unreadConversations: 0 });
  const [loadError, setLoadError] = useState<string | null>(null);

  const refreshSummary = useCallback(() => {
    api<AdminSummary>("/admin/summary").then(setSummary, onExpired);
  }, [onExpired]);

  useEffect(() => {
    api<AdminUser>("/admin/me").then(setAdmin, (error) => {
      onExpired(error);
      if (error instanceof ApiError && error.status !== 401) setLoadError(error.message);
    });
    refreshSummary();
  }, [onExpired, refreshSummary]);

  usePoll(refreshSummary, 15000, { enabled: admin !== null });

  async function signOut() {
    await api("/admin/logout", { method: "POST" }).catch(() => {});
    router.replace("/admin/login");
  }

  if (!admin) {
    return <p className="p-10 text-sm text-charcoal-500">{loadError ?? "Loading…"}</p>;
  }

  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" || pathname.startsWith("/admin/trips") : pathname.startsWith(href));

  return (
    <AdminContext.Provider value={{ admin, summary, refreshSummary }}>
      <div className="flex min-h-svh flex-col lg:flex-row">
        <aside className="flex shrink-0 items-center gap-2 bg-sky-950 px-4 py-3 text-felt-50 lg:sticky lg:top-0 lg:h-svh lg:w-60 lg:flex-col lg:items-stretch lg:px-4 lg:py-6">
          <Link href="/admin" className="mr-2 shrink-0 lg:mr-0 lg:mb-8 lg:self-center">
            <Image src={logo} alt="Dolgion’s Tour admin" className="h-10 w-auto lg:h-16" priority />
          </Link>
          <nav aria-label="Admin" className="flex flex-1 gap-1 lg:flex-col">
            {NAV.map(({ href, label, icon: Icon, badge }) => (
              <Link
                key={href}
                href={href}
                aria-current={isActive(href) ? "page" : undefined}
                className={cn(
                  "flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors",
                  isActive(href) ? "bg-white/12 text-white" : "text-sky-200 hover:bg-white/6 hover:text-white",
                )}
              >
                <Icon aria-hidden className="size-4.5" />
                <span className="hidden sm:inline">{label}</span>
                {summary[badge] > 0 && (
                  <span className="ml-auto rounded-full bg-copper-500 px-2 text-xs leading-5 font-semibold text-white">
                    {summary[badge]}
                    <span className="sr-only"> {badge === "newTripPlans" ? "new" : "unread"}</span>
                  </span>
                )}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-1 lg:flex-col lg:items-stretch lg:border-t lg:border-white/10 lg:pt-4">
            <p className="hidden truncate px-3 text-xs text-sky-300 lg:block">{admin.name}</p>
            <a
              href="/en"
              target="_blank"
              rel="noreferrer"
              className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm text-sky-200 hover:bg-white/6 hover:text-white"
            >
              <ExternalLink aria-hidden className="size-4.5" />
              <span className="hidden lg:inline">View website</span>
            </a>
            <button
              type="button"
              onClick={signOut}
              className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm text-sky-200 hover:bg-white/6 hover:text-white"
            >
              <LogOut aria-hidden className="size-4.5" />
              <span className="hidden lg:inline">Sign out</span>
            </button>
          </div>
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </AdminContext.Provider>
  );
}
