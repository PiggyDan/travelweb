"use client";

import { MessageCircle, Search } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useSignOutOnExpiry } from "@/components/admin/admin-shell";
import { formatWhen, STATUS_LABELS, STATUSES, StatusBadge } from "@/components/admin/status";
import { api } from "@/lib/api";
import { BUDGET_OPTIONS, optionLabel } from "@/lib/planner-options";
import { usePoll } from "@/lib/use-poll";
import { cn, formatDate } from "@/lib/utils";
import type { TripPlanStatus, TripPlanSummary } from "@/types/chat";

export default function TripPlansPage() {
  const onExpired = useSignOutOnExpiry();
  const [status, setStatus] = useState<TripPlanStatus | "all">("all");
  const [query, setQuery] = useState("");
  const [plans, setPlans] = useState<TripPlanSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const params = new URLSearchParams();
    if (status !== "all") params.set("status", status);
    if (query.trim()) params.set("q", query.trim());
    try {
      setPlans(await api<TripPlanSummary[]>(`/admin/trip-plans?${params}`));
      setError(null);
    } catch (err) {
      onExpired(err);
      setError(err instanceof Error ? err.message : "Could not load trip plans.");
    }
  }, [status, query, onExpired]);

  useEffect(() => {
    const timer = window.setTimeout(load, query ? 250 : 0);
    return () => window.clearTimeout(timer);
  }, [load, query]);
  usePoll(load, 20000);

  return (
    <div className="p-5 sm:p-8 lg:p-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-4xl font-light text-sky-950">Trip plans</h1>
          <p className="mt-1 text-sm text-charcoal-500">Requests from the website&apos;s trip planner, newest first.</p>
        </div>
        <label className="relative block sm:w-72">
          <span className="sr-only">Search trip plans</span>
          <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-charcoal-400" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Name, email or reference"
            className="min-h-11 w-full rounded-xl border border-sand-300 bg-white pr-3 pl-10 text-sm text-charcoal-900 focus:border-sky-700 focus:outline-none"
          />
        </label>
      </div>

      <div role="tablist" aria-label="Filter by status" className="mt-6 flex flex-wrap gap-2">
        {(["all", ...STATUSES] as const).map((value) => (
          <button
            key={value}
            role="tab"
            aria-selected={status === value}
            onClick={() => setStatus(value)}
            className={cn(
              "min-h-9 rounded-full border px-4 text-sm transition-colors",
              status === value
                ? "border-sky-950 bg-sky-950 text-white"
                : "border-sand-300 text-charcoal-700 hover:border-sky-950",
            )}
          >
            {value === "all" ? "All" : STATUS_LABELS[value]}
          </button>
        ))}
      </div>

      {error && <p className="mt-6 text-sm text-red-700">{error}</p>}

      <div className="mt-6 overflow-x-auto rounded-2xl bg-felt-50 ring-1 ring-sand-200">
        <table className="w-full min-w-[52rem] text-left text-sm">
          <thead className="border-b border-sand-200 text-xs tracking-wide text-charcoal-500 uppercase">
            <tr>
              <th className="px-5 py-3 font-semibold">Traveller</th>
              <th className="px-5 py-3 font-semibold">Reference</th>
              <th className="px-5 py-3 font-semibold">Trip</th>
              <th className="px-5 py-3 font-semibold">Budget</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold">Received</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand-200">
            {plans?.map((plan) => (
              <tr key={plan.id} className="relative transition-colors hover:bg-sand-50">
                <td className="px-5 py-4">
                  <Link href={`/admin/trips/${plan.id}`} className="font-semibold text-sky-950 after:absolute after:inset-0">
                    {plan.fullName}
                  </Link>
                  <p className="text-xs text-charcoal-500">
                    {plan.email}
                    {plan.country ? ` · ${plan.country}` : ""}
                  </p>
                </td>
                <td className="px-5 py-4 font-mono text-xs text-charcoal-700">{plan.reference}</td>
                <td className="px-5 py-4 text-charcoal-700">
                  {plan.days} days · {plan.adults + plan.children} pax
                  {plan.startDate && <p className="text-xs text-charcoal-500">from {formatDate(plan.startDate)}</p>}
                </td>
                <td className="px-5 py-4 text-charcoal-700">{optionLabel(BUDGET_OPTIONS, plan.budget).replace(" per person", "")}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={plan.status} />
                    {plan.unreadCount > 0 && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-copper-600">
                        <MessageCircle aria-hidden className="size-3.5" />
                        {plan.unreadCount}
                        <span className="sr-only">unread messages</span>
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-4 text-xs whitespace-nowrap text-charcoal-500">{formatWhen(plan.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {plans?.length === 0 && (
          <p className="px-5 py-14 text-center text-sm text-charcoal-500">
            {query || status !== "all" ? "No trip plans match." : "No trip plans yet. They will appear here as travellers submit the planner."}
          </p>
        )}
        {plans === null && !error && <p className="px-5 py-14 text-center text-sm text-charcoal-500">Loading…</p>}
      </div>
    </div>
  );
}
