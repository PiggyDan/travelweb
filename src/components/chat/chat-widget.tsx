"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Field, TextArea, TextInput } from "@/components/forms/field";
import { Button } from "@/components/ui/button";
import { api, ApiError } from "@/lib/api";
import { OPEN_CHAT_EVENT } from "@/lib/chat-events";
import { usePoll } from "@/lib/use-poll";
import type { ChatMessage, CustomerConversation } from "@/types/chat";
import { Composer, MessageList } from "./chat-thread";

const OPEN_POLL_MS = 4000;
const CLOSED_POLL_MS = 30000;
/** While the AI assistant is writing, check often so its reply appears promptly. */
const TYPING_POLL_MS = 1500;

/**
 * Floating "Chat with us" bubble on every public page. Visitors start a chat
 * with their name and email (or get one automatically after submitting the
 * trip planner); the browser keeps it via an httpOnly cookie. Replies from
 * the team are fetched by polling: often while the panel is open, rarely
 * (just for the unread badge) while it is closed.
 */
export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [conversation, setConversation] = useState<Omit<CustomerConversation, "messages"> | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const lastId = useRef(0);
  const panelId = useId();

  const merge = useCallback((data: CustomerConversation, replace = false) => {
    const { messages: incoming, ...rest } = data;
    setConversation(rest);
    setMessages((current) => {
      const known = replace ? [] : current;
      const ids = new Set(known.map((m) => m.id));
      const next = [...known, ...incoming.filter((m) => !ids.has(m.id))];
      lastId.current = next.at(-1)?.id ?? 0;
      return next;
    });
  }, []);

  const refresh = useCallback(
    async (full = false) => {
      try {
        const data = await api<CustomerConversation | null>(`/chat/conversation?after=${full ? 0 : lastId.current}`);
        if (data) merge(data, full);
        setError(null);
      } catch {
        // Stay quiet while polling; errors surface when the visitor sends something.
      } finally {
        setLoaded(true);
      }
    },
    [merge],
  );

  useEffect(() => {
    void refresh(true);
  }, [refresh]);

  // Opened from elsewhere (e.g. right after the trip planner created this visitor's chat).
  useEffect(() => {
    const onOpen = () => {
      setOpen(true);
      void refresh(true);
    };
    window.addEventListener(OPEN_CHAT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_CHAT_EVENT, onOpen);
  }, [refresh]);

  const pollMs = conversation?.assistantTyping ? TYPING_POLL_MS : open ? OPEN_POLL_MS : CLOSED_POLL_MS;
  usePoll(() => refresh(), pollMs, { enabled: conversation !== null });

  // While the panel is open everything is on screen, so mark it read.
  const serverUnread = conversation?.unreadCount ?? 0;
  const unread = open ? 0 : serverUnread;
  useEffect(() => {
    if (!open || serverUnread === 0) return;
    api("/chat/read", { method: "POST" }).then(
      () => setConversation((c) => (c ? { ...c, unreadCount: 0 } : c)),
      () => {},
    );
  }, [open, serverUnread]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function send(body: string) {
    try {
      const message = await api<ChatMessage>("/chat/messages", { body: { body } });
      setMessages((current) => [...current, message]);
      lastId.current = message.id;
      setError(null);
      // Picks up the assistant's "typing" state straight away.
      void refresh();
      return true;
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Message not sent. Please try again.");
      return false;
    }
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.section
            id={panelId}
            aria-label="Chat with Eternal Sky Tour"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed right-3 bottom-24 z-[55] flex h-[min(36rem,calc(100svh-7.5rem))] w-[min(24rem,calc(100vw-1.5rem))] origin-bottom-right flex-col overflow-hidden rounded-3xl bg-felt-50 shadow-2xl ring-1 shadow-sky-950/25 ring-sand-200 sm:right-6"
          >
            <header className="flex items-center justify-between gap-3 bg-sky-950 px-5 py-4 text-white">
              <div>
                <p className="font-display text-lg leading-tight">Chat with a trip planner</p>
                <p className="text-xs text-sky-200">
                  {conversation?.tripReference
                    ? `Trip plan ${conversation.tripReference}`
                    : "AI assistant · trip planners join anytime"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="inline-flex size-10 items-center justify-center rounded-full hover:bg-white/10"
              >
                <X aria-hidden className="size-5" />
              </button>
            </header>

            {!loaded ? (
              <p className="flex-1 p-6 text-sm text-charcoal-500">Loading…</p>
            ) : conversation ? (
              <>
                <MessageList
                  messages={messages}
                  viewer="customer"
                  typing={conversation.assistantTyping}
                  className="flex-1 bg-sand-50"
                />
                {error && <p className="px-4 pb-1 text-xs text-red-700 dark:text-red-300">{error}</p>}
                <Composer onSend={send} autoFocus />
              </>
            ) : (
              <StartForm onStarted={(data) => merge(data, true)} />
            )}
          </motion.section>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-label={open ? "Close chat" : unread > 0 ? `Open chat, ${unread} new message${unread === 1 ? "" : "s"}` : "Chat with us"}
        className="fixed right-4 bottom-5 z-[55] inline-flex size-14 items-center justify-center rounded-full bg-copper-600 text-white shadow-xl shadow-sky-950/25 transition-transform hover:scale-105 hover:bg-copper-700 sm:right-6"
      >
        {open ? <X aria-hidden className="size-6" /> : <MessageCircle aria-hidden className="size-6" strokeWidth={1.75} />}
        {!open && unread > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex min-w-6 items-center justify-center rounded-full bg-sky-950 px-1.5 text-xs leading-6 font-semibold ring-2 ring-white">
            {unread}
          </span>
        )}
      </button>
    </>
  );
}

function StartForm({ onStarted }: { onStarted: (conversation: CustomerConversation) => void }) {
  const uid = useId();
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setPending(true);
    try {
      onStarted(
        await api<CustomerConversation>("/chat/conversations", {
          body: { name: data.get("name"), email: data.get("email"), message: data.get("message") },
        }),
      );
    } catch (err) {
      setErrors(err instanceof ApiError ? err.fieldErrors : {});
      setFormError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={submit} data-lenis-prevent className="flex-1 space-y-4 overflow-y-auto p-5">
      <p className="text-sm leading-relaxed text-charcoal-600">
        Ask us anything about travelling in Mongolia. Leave your email so we can reach you if you step away.
      </p>
      <Field id={`${uid}-name`} label="Your name" required>
        <TextInput id={`${uid}-name`} name="name" required maxLength={120} autoComplete="name" aria-invalid={!!errors.name} />
      </Field>
      <Field id={`${uid}-email`} label="Email" required hint={errors.email}>
        <TextInput id={`${uid}-email`} name="email" type="email" required autoComplete="email" aria-invalid={!!errors.email} />
      </Field>
      <Field id={`${uid}-message`} label="Message" required>
        <TextArea id={`${uid}-message`} name="message" required maxLength={4000} className="min-h-24" />
      </Field>
      {formError && <p className="text-sm text-red-700 dark:text-red-300">{formError}</p>}
      <Button type="submit" variant="dark" size="md" disabled={pending} className="w-full">
        {pending ? "Sending…" : "Start chat"}
      </Button>
    </form>
  );
}
