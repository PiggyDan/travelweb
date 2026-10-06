"use client";

import { ArrowLeft, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";
import { api, ApiError } from "@/lib/api";
import { ACCOMMODATION_OPTIONS, ACTIVITY_OPTIONS, BUDGET_OPTIONS, optionLabel } from "@/lib/planner-options";
import { usePoll } from "@/lib/use-poll";
import { formatDate } from "@/lib/utils";
import type { TripPlanDetail, TripPlanStatus } from "@/types/chat";
import { AdminChat } from "./admin-chat";
import { useAdmin, useSignOutOnExpiry } from "./admin-shell";
import { formatWhen, STATUS_LABELS, STATUSES, StatusBadge } from "./status";

export function TripPlanView({ id, labels }: { id: number; labels: Record<string, string> }) {
  const { refreshSummary } = useAdmin();
  const onExpired = useSignOutOnExpiry();
  const [plan, setPlan] = useState<TripPlanDetail | null>(null);
  /** Unsaved edits to the notes; null means "show what's saved". */
  const [notes, setNotes] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setPlan(await api<TripPlanDetail>(`/admin/trip-plans/${id}`));
    } catch (err) {
      onExpired(err);
      setError(err instanceof ApiError ? err.message : "Could not load this trip plan.");
    }
  }, [id, onExpired]);

  // Refreshes now and then, e.g. when a reply moves the plan to "contacted".
  usePoll(load, 20000, { immediate: true });

  async function update(changes: { status?: TripPlanStatus; adminNotes?: string }) {
    setSaving(true);
    try {
      setPlan(await api<TripPlanDetail>(`/admin/trip-plans/${id}`, { method: "PATCH", body: changes }));
      if (changes.adminNotes !== undefined) setNotes(null);
      setNotice(changes.status ? `Marked as ${STATUS_LABELS[changes.status].toLowerCase()}.` : "Notes saved.");
      refreshSummary();
    } catch (err) {
      onExpired(err);
      setNotice(err instanceof ApiError ? err.message : "Could not save.");
    } finally {
      setSaving(false);
    }
  }

  if (error) return <p className="p-10 text-sm text-red-700">{error}</p>;
  if (!plan) return <p className="p-10 text-sm text-charcoal-500">Loading…</p>;

  const savedNotes = plan.adminNotes ?? "";
  const named = (values: string[]) => values.map((v) => labels[v] ?? v).join(", ") || "—";
  const facts: [string, string][] = [
    ["Dates", plan.startDate ? `${formatDate(plan.startDate)}${plan.endDate ? ` – ${formatDate(plan.endDate)}` : ""}` : "Flexible"],
    ["Length", `${plan.days} days`],
    ["Travellers", `${plan.adults} adult${plan.adults === 1 ? "" : "s"}${plan.children ? `, ${plan.children} child${plan.children === 1 ? "" : "ren"}` : ""}`],
    ["Budget", optionLabel(BUDGET_OPTIONS, plan.budget)],
    ["Activity level", optionLabel(ACTIVITY_OPTIONS, plan.activityLevel)],
    ["Accommodation", optionLabel(ACCOMMODATION_OPTIONS, plan.accommodationStyle)],
    ["Interests", named(plan.interests)],
    ["Destinations", named(plan.destinations)],
  ];

  return (
    <div className="grid min-h-svh lg:grid-cols-[minmax(0,1fr)_26rem]">
      <div className="p-5 sm:p-8 lg:p-10">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-charcoal-500 hover:text-sky-950">
          <ArrowLeft aria-hidden className="size-4" /> All trip plans
        </Link>

        <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs text-charcoal-500">{plan.reference}</p>
            <h1 className="mt-1 font-display text-4xl font-light text-sky-950">{plan.fullName}</h1>
            <p className="mt-2 text-sm text-charcoal-500">
              Received {formatWhen(plan.createdAt)}
              {plan.country ? ` · from ${plan.country}` : ""}
            </p>
          </div>
          <StatusBadge status={plan.status} />
        </div>

        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <a href={`mailto:${plan.email}?subject=Your Mongolia journey (${plan.reference})`} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-sand-300 px-4 text-sky-950 hover:border-sky-950">
            <Mail aria-hidden className="size-4" /> {plan.email}
          </a>
          {plan.phone && (
            <a href={`tel:${plan.phone.replace(/[^+\d]/g, "")}`} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-sand-300 px-4 text-sky-950 hover:border-sky-950">
              <Phone aria-hidden className="size-4" /> {plan.phone}
            </a>
          )}
        </div>

        <dl className="mt-8 grid gap-x-8 gap-y-5 rounded-2xl bg-felt-50 p-6 ring-1 ring-sand-200 sm:grid-cols-2">
          {facts.map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs font-semibold tracking-wide text-charcoal-500 uppercase">{label}</dt>
              <dd className="mt-1 text-sm text-charcoal-900">{value}</dd>
            </div>
          ))}
          {plan.message && (
            <div className="sm:col-span-2">
              <dt className="text-xs font-semibold tracking-wide text-charcoal-500 uppercase">Their message</dt>
              <dd className="mt-1 text-sm whitespace-pre-wrap text-charcoal-900">{plan.message}</dd>
            </div>
          )}
        </dl>

        <section aria-labelledby="manage" className="mt-8 rounded-2xl bg-felt-50 p-6 ring-1 ring-sand-200">
          <h2 id="manage" className="font-display text-xl text-sky-950">
            Manage
          </h2>
          <label htmlFor="status" className="mt-4 mb-2 block text-sm font-semibold text-sky-950">
            Status
          </label>
          <select
            id="status"
            value={plan.status}
            disabled={saving}
            onChange={(event) => update({ status: event.target.value as TripPlanStatus })}
            className="min-h-11 w-full max-w-xs rounded-xl border border-sand-300 bg-white px-3 text-sm"
          >
            {STATUSES.map((value) => (
              <option key={value} value={value}>
                {STATUS_LABELS[value]}
              </option>
            ))}
          </select>
          <label htmlFor="notes" className="mt-5 mb-2 block text-sm font-semibold text-sky-950">
            Internal notes <span className="font-normal text-charcoal-500">(only staff see these)</span>
          </label>
          <textarea
            id="notes"
            value={notes ?? savedNotes}
            onChange={(event) => setNotes(event.target.value)}
            maxLength={8000}
            rows={5}
            className="w-full rounded-xl border border-sand-300 bg-white px-3.5 py-2.5 text-sm focus:border-sky-700 focus:outline-none"
          />
          <div className="mt-3 flex items-center gap-4">
            <button
              type="button"
              disabled={saving || notes === null || notes === savedNotes}
              onClick={() => notes !== null && update({ adminNotes: notes })}
              className="min-h-10 rounded-full bg-sky-950 px-5 text-sm font-semibold text-white disabled:opacity-40"
            >
              Save notes
            </button>
            {notice && (
              <p role="status" className="text-sm text-charcoal-500">
                {notice}
              </p>
            )}
          </div>
        </section>
      </div>

      <aside aria-label="Chat with traveller" className="flex h-[75svh] flex-col border-t border-sand-200 bg-felt-50 lg:sticky lg:top-0 lg:h-svh lg:border-t-0 lg:border-l">
        <div className="border-b border-sand-200 px-5 py-4">
          <h2 className="font-display text-xl text-sky-950">Chat</h2>
          <p className="text-xs text-charcoal-500">Replies appear in the chat on the traveller&apos;s screen.</p>
        </div>
        {plan.conversationId ? (
          <AdminChat conversationId={plan.conversationId} className="min-h-0 flex-1" onActivity={() => void load()} />
        ) : (
          <p className="p-5 text-sm text-charcoal-500">This plan has no chat. Reply by email instead.</p>
        )}
      </aside>
    </div>
  );
}
