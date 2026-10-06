"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useState } from "react";
import { AdminChat } from "@/components/admin/admin-chat";
import { useSignOutOnExpiry } from "@/components/admin/admin-shell";
import { formatWhen } from "@/components/admin/status";
import { api } from "@/lib/api";
import { usePoll } from "@/lib/use-poll";
import { cn } from "@/lib/utils";
import type { AdminConversationSummary, ChatMessage } from "@/types/chat";

const PREVIEW_PREFIX: Record<ChatMessage["sender"], string> = { customer: "", admin: "You: ", assistant: "AI: ", system: "" };

export default function InboxPage() {
  return (
    <Suspense>
      <Inbox />
    </Suspense>
  );
}

/** All conversations (from the trip planner or started from the chat bubble), with the selected thread beside them. */
function Inbox() {
  const router = useRouter();
  const selected = Number(useSearchParams().get("c")) || null;
  const onExpired = useSignOutOnExpiry();
  const [conversations, setConversations] = useState<AdminConversationSummary[] | null>(null);

  const load = useCallback(async () => {
    try {
      setConversations(await api<AdminConversationSummary[]>("/admin/conversations"));
    } catch (err) {
      onExpired(err);
    }
  }, [onExpired]);

  usePoll(load, 8000, { immediate: true });

  const current = conversations?.find((c) => c.id === selected);

  return (
    <div className="grid h-svh lg:grid-cols-[22rem_minmax(0,1fr)]">
      <section aria-label="Conversations" className={cn("flex min-h-0 flex-col border-r border-sand-200 bg-felt-50", selected !== null && "hidden lg:flex")}>
        <h1 className="border-b border-sand-200 px-5 py-5 font-display text-3xl font-light text-sky-950">Inbox</h1>
        <ul className="min-h-0 flex-1 divide-y divide-sand-200 overflow-y-auto">
          {conversations?.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => router.replace(`/admin/inbox?c=${c.id}`)}
                aria-current={c.id === selected ? "true" : undefined}
                className={cn("block w-full px-5 py-4 text-left transition-colors hover:bg-sand-50", c.id === selected && "bg-sand-100")}
              >
                <span className="flex items-baseline justify-between gap-3">
                  <span className={cn("truncate text-sm text-sky-950", c.unreadCount > 0 ? "font-bold" : "font-medium")}>
                    {c.customerName}
                  </span>
                  <span className="shrink-0 text-[0.6875rem] text-charcoal-400">{formatWhen(c.lastMessageAt)}</span>
                </span>
                <span className="mt-1 flex items-center gap-2">
                  <span className="line-clamp-1 flex-1 text-xs text-charcoal-500">
                    {c.lastMessage ? `${PREVIEW_PREFIX[c.lastMessage.sender]}${c.lastMessage.body}` : "No messages"}
                  </span>
                  {c.unreadCount > 0 && (
                    <span className="rounded-full bg-copper-500 px-1.5 text-[0.6875rem] leading-5 font-semibold text-white">
                      {c.unreadCount}
                    </span>
                  )}
                </span>
                <span className="mt-1 flex items-center gap-2 text-[0.6875rem]">
                  {c.tripReference && <span className="font-mono text-copper-600">{c.tripReference}</span>}
                  {!c.aiEnabled && <span className="rounded-full bg-sky-100 px-1.5 font-semibold text-sky-800">AI off</span>}
                </span>
              </button>
            </li>
          ))}
        </ul>
        {conversations?.length === 0 && (
          <p className="p-5 text-sm text-charcoal-500">No conversations yet. They start when a traveller uses the chat bubble or submits the trip planner.</p>
        )}
        {conversations === null && <p className="p-5 text-sm text-charcoal-500">Loading…</p>}
      </section>

      <section aria-label="Conversation" className={cn("min-h-0 flex-col", selected ? "flex" : "hidden lg:flex")}>
        {current ? (
          <>
            <header className="flex items-center gap-3 border-b border-sand-200 bg-felt-50 px-5 py-4">
              <button
                type="button"
                onClick={() => router.replace("/admin/inbox")}
                aria-label="Back to conversations"
                className="inline-flex size-10 items-center justify-center rounded-full hover:bg-sand-100 lg:hidden"
              >
                <ArrowLeft aria-hidden className="size-4" />
              </button>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-sky-950">{current.customerName}</p>
                <a href={`mailto:${current.customerEmail}`} className="text-xs text-charcoal-500 hover:text-sky-950">
                  {current.customerEmail}
                </a>
              </div>
              {current.tripPlanId && (
                <Link href={`/admin/trips/${current.tripPlanId}`} className="rounded-full border border-sand-300 px-4 py-2 text-xs font-semibold text-sky-950 hover:border-sky-950">
                  View trip plan {current.tripReference}
                </Link>
              )}
            </header>
            <AdminChat key={current.id} conversationId={current.id} className="min-h-0 flex-1" onActivity={load} />
          </>
        ) : (
          <p className="m-auto p-10 text-sm text-charcoal-500">{selected && conversations ? "Conversation not found." : "Select a conversation."}</p>
        )}
      </section>
    </div>
  );
}
