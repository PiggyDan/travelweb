"use client";

import { ArrowUpRight, SendHorizontal, Sparkles } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import type { ChatMessage, TourAttachment } from "@/types/chat";

const timeFormat = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit" });
const dayFormat = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short" });

function dayLabel(iso: string) {
  const date = new Date(iso);
  const today = new Date();
  if (date.toDateString() === today.toDateString()) return "Today";
  today.setDate(today.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return "Yesterday";
  return dayFormat.format(date);
}

/** The tour the assistant attached to a reply: the one trip the traveller asked about. */
function TourCard({ tour, newTab }: { tour: TourAttachment; newTab?: boolean }) {
  return (
    <a
      href={tour.url}
      target={newTab ? "_blank" : undefined}
      rel={newTab ? "noreferrer" : undefined}
      className="group mt-2 block w-64 max-w-full overflow-hidden rounded-2xl bg-white ring-1 ring-sand-200 transition-shadow hover:shadow-lg"
    >
      <span className="relative block aspect-[16/9] overflow-hidden">
        <Image src={tour.image} alt="" fill sizes="256px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
      </span>
      <span className="block p-3.5">
        <span className="block font-display text-base leading-snug text-sky-950">{tour.title}</span>
        <span className="mt-1 block text-xs text-charcoal-500">
          {tour.region} · {tour.durationDays} days · from {tour.priceFrom}
        </span>
        <span className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold text-copper-600">
          View tour <ArrowUpRight aria-hidden className="size-3.5" />
        </span>
      </span>
    </a>
  );
}

/**
 * Scrollable list of chat bubbles. `viewer` decides which side is "mine"
 * (right-aligned); for staff, the AI assistant's replies sit on their side
 * too. System notes are shown centred. Keeps itself scrolled to the newest
 * message unless the reader has scrolled up.
 */
export function MessageList({
  messages,
  viewer,
  typing,
  className,
  emptyState,
}: {
  messages: ChatMessage[];
  viewer: "customer" | "admin";
  /** Show a "typing…" bubble from the assistant. */
  typing?: boolean;
  className?: string;
  emptyState?: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const pinned = useRef(true);

  useEffect(() => {
    const element = ref.current;
    if (element && pinned.current) element.scrollTop = element.scrollHeight;
  }, [messages, typing]);

  return (
    <div
      ref={ref}
      data-lenis-prevent
      onScroll={(event) => {
        const el = event.currentTarget;
        pinned.current = el.scrollHeight - el.scrollTop - el.clientHeight < 48;
      }}
      role="log"
      aria-live="polite"
      className={cn("overflow-y-auto overscroll-contain px-4 py-5", className)}
    >
      {messages.length === 0 && emptyState}
      <ol className="space-y-3">
        {messages.map((message, index) => {
          const previous = messages[index - 1];
          const newDay = !previous || dayLabel(previous.createdAt) !== dayLabel(message.createdAt);
          const mine = message.sender === viewer || (viewer === "admin" && message.sender === "assistant");
          const ai = message.sender === "assistant";
          return (
            <li key={message.id}>
              {newDay && (
                <p className="my-4 text-center text-[0.6875rem] font-semibold tracking-[0.16em] text-charcoal-400 uppercase">
                  {dayLabel(message.createdAt)}
                </p>
              )}
              {message.sender === "system" ? (
                <p className="mx-auto max-w-[90%] rounded-xl bg-sand-100 px-3 py-2 text-center text-xs leading-relaxed text-charcoal-600">
                  {message.body}
                </p>
              ) : (
                <div className={cn("flex flex-col", mine ? "items-end" : "items-start")}>
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed break-words whitespace-pre-wrap",
                      mine ? "rounded-br-md" : "rounded-bl-md",
                      mine && !ai && "bg-sky-950 text-white dark:bg-copper-600",
                      mine && ai && "bg-sky-100 text-sky-950 ring-1 ring-sky-200",
                      !mine && "bg-white text-charcoal-900 ring-1 ring-sand-200",
                    )}
                  >
                    {message.body}
                  </div>
                  {message.attachment && <TourCard tour={message.attachment} newTab={viewer === "admin"} />}
                  <p className="mt-1 inline-flex items-center gap-1 px-1 text-[0.6875rem] text-charcoal-400">
                    {ai && <Sparkles aria-hidden className="size-3 text-copper-500" />}
                    {ai ? "AI assistant · " : !mine && message.authorName ? `${message.authorName} · ` : ""}
                    {timeFormat.format(new Date(message.createdAt))}
                  </p>
                </div>
              )}
            </li>
          );
        })}
      </ol>
      {typing && (
        <div className={cn("mt-3 flex", viewer === "admin" ? "justify-end" : "justify-start")}>
          <p className="inline-flex items-center gap-1 rounded-2xl bg-white px-4 py-3 ring-1 ring-sand-200">
            <span className="sr-only">The assistant is typing</span>
            {[0, 150, 300].map((delay) => (
              <span
                key={delay}
                aria-hidden
                style={{ animationDelay: `${delay}ms` }}
                className="size-1.5 animate-bounce rounded-full bg-charcoal-400"
              />
            ))}
          </p>
        </div>
      )}
    </div>
  );
}

/** Message box: Enter sends, Shift+Enter adds a line. */
export function Composer({
  onSend,
  placeholder = "Write a message…",
  disabled,
  autoFocus,
}: {
  onSend: (body: string) => Promise<boolean>;
  placeholder?: string;
  disabled?: boolean;
  autoFocus?: boolean;
}) {
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  async function send(event?: FormEvent) {
    event?.preventDefault();
    const text = body.trim();
    if (!text || sending) return;
    setSending(true);
    const ok = await onSend(text);
    setSending(false);
    if (ok) setBody("");
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      void send();
    }
  }

  return (
    <form onSubmit={send} className="flex items-end gap-2 border-t border-sand-200 p-3">
      <label className="sr-only" htmlFor="chat-composer">
        Message
      </label>
      <textarea
        id="chat-composer"
        value={body}
        onChange={(event) => setBody(event.target.value)}
        onKeyDown={onKeyDown}
        rows={1}
        maxLength={4000}
        autoFocus={autoFocus}
        disabled={disabled}
        placeholder={placeholder}
        className="max-h-32 min-h-11 flex-1 resize-none [field-sizing:content] rounded-xl border border-sand-300 bg-white px-3.5 py-2.5 text-sm text-charcoal-900 placeholder:text-charcoal-400 focus:border-sky-700 focus:outline-none"
      />
      <button
        type="submit"
        disabled={disabled || sending || !body.trim()}
        aria-label="Send message"
        className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-copper-600 text-white transition-colors hover:bg-copper-700 disabled:opacity-40"
      >
        <SendHorizontal aria-hidden className="size-4.5" />
      </button>
    </form>
  );
}
