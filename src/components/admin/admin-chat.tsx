"use client";

import { Sparkles } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Composer, MessageList } from "@/components/chat/chat-thread";
import { api, ApiError } from "@/lib/api";
import { usePoll } from "@/lib/use-poll";
import { cn } from "@/lib/utils";
import type { AdminConversation, ChatMessage } from "@/types/chat";
import { useAdmin, useSignOutOnExpiry } from "./admin-shell";

/**
 * A conversation as staff see it: polls for new customer messages every few
 * seconds and marks the thread read while it is open.
 */
export function AdminChat({
  conversationId,
  className,
  onActivity,
}: {
  conversationId: number;
  className?: string;
  /** Called after the thread changes (new reply, read marker), so lists can refresh. */
  onActivity?: () => void;
}) {
  const { refreshSummary } = useAdmin();
  const onExpired = useSignOutOnExpiry();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ai, setAi] = useState<{ enabled: boolean; pending: boolean } | null>(null);
  const lastId = useRef(0);
  // Kept in a ref so a new callback each render doesn't restart loading.
  const activity = useRef(onActivity);
  useEffect(() => {
    activity.current = onActivity;
  });

  const markRead = useCallback(async () => {
    await api(`/admin/conversations/${conversationId}/read`, { method: "POST" }).catch(() => {});
    refreshSummary();
    activity.current?.();
  }, [conversationId, refreshSummary]);

  const load = useCallback(
    async (full = false) => {
      try {
        const data = await api<AdminConversation>(
          `/admin/conversations/${conversationId}?after=${full ? 0 : lastId.current}`,
        );
        if (full || data.messages.length > 0) {
          setMessages((current) => {
            const known = full ? [] : current;
            const ids = new Set(known.map((m) => m.id));
            const next = [...known, ...data.messages.filter((m) => !ids.has(m.id))];
            lastId.current = next.at(-1)?.id ?? 0;
            return next;
          });
        }
        setAi({ enabled: data.aiEnabled, pending: data.aiPending });
        if (data.unreadCount > 0) void markRead();
        setError(null);
      } catch (err) {
        onExpired(err);
        if (full) setError(err instanceof ApiError ? err.message : "Could not load the conversation.");
      } finally {
        setLoaded(true);
      }
    },
    [conversationId, markRead, onExpired],
  );

  // Starting from message 0 loads the whole thread; later ticks fetch only newer messages.
  // Callers remount this component (via `key`) to switch conversations.
  usePoll(() => load(), 4000, { immediate: true });

  async function send(body: string) {
    try {
      const message = await api<ChatMessage>(`/admin/conversations/${conversationId}/messages`, { body: { body } });
      setMessages((current) => [...current, message]);
      lastId.current = message.id;
      setError(null);
      // Replying takes over from the assistant (the server switches it off).
      setAi((current) => (current ? { ...current, enabled: false } : current));
      activity.current?.();
      return true;
    } catch (err) {
      onExpired(err);
      setError(err instanceof ApiError ? err.message : "Reply not sent. Please try again.");
      return false;
    }
  }

  async function toggleAi() {
    if (!ai) return;
    try {
      const updated = await api<{ aiEnabled: boolean; aiPending: boolean }>(`/admin/conversations/${conversationId}`, {
        method: "PATCH",
        body: { aiEnabled: !ai.enabled },
      });
      setAi({ enabled: updated.aiEnabled, pending: updated.aiPending });
      activity.current?.();
    } catch (err) {
      onExpired(err);
      setError(err instanceof ApiError ? err.message : "Could not change the assistant setting.");
    }
  }

  return (
    <div className={cn("flex min-h-0 flex-col overflow-hidden", className)}>
      {ai && (
        <div className="flex items-center justify-between gap-3 border-b border-sand-200 bg-felt-50 px-4 py-2.5">
          <p className="inline-flex items-center gap-2 text-xs text-charcoal-600">
            <Sparkles aria-hidden className="size-3.5 text-copper-500" />
            {ai.enabled ? "AI assistant is answering" : "AI assistant is off: you're answering"}
          </p>
          <button
            type="button"
            role="switch"
            aria-checked={ai.enabled}
            aria-label="AI assistant"
            onClick={toggleAi}
            className={cn(
              "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
              ai.enabled ? "bg-copper-500" : "bg-sand-300",
            )}
          >
            <span
              aria-hidden
              className={cn(
                "inline-block size-5 rounded-full bg-white shadow transition-transform",
                ai.enabled ? "translate-x-5.5" : "translate-x-0.5",
              )}
            />
          </button>
        </div>
      )}
      {loaded ? (
        <MessageList messages={messages} viewer="admin" typing={ai?.pending} className="min-h-0 flex-1 bg-sand-50" />
      ) : (
        <p className="flex-1 p-6 text-sm text-charcoal-500">Loading…</p>
      )}
      {error && <p className="px-4 pb-1 text-xs text-red-700">{error}</p>}
      <Composer onSend={send} placeholder="Reply to the traveller…" disabled={!loaded} />
    </div>
  );
}
