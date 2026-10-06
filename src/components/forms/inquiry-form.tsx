"use client";

import { Mail } from "lucide-react";
import { useId, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";
import { submitInquiry } from "@/services/inquiry-service";
import type { SelectOption } from "@/types/common";
import type { InquiryPayload } from "@/types/inquiry";
import { Field, Select, TextArea, TextInput } from "./field";

interface InquiryFormProps {
  tours: SelectOption[];
  defaultTourSlug?: string;
  departureLabel?: string;
}

type Status = { kind: "idle" } | { kind: "pending" } | { kind: "done"; message: string };

export function InquiryForm({ tours, defaultTourSlug, departureLabel }: InquiryFormProps) {
  const uid = useId();
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const payload: InquiryPayload = {
      fullName: String(data.get("fullName") ?? ""),
      email: String(data.get("email") ?? ""),
      country: String(data.get("country") ?? "") || undefined,
      travelers: Number(data.get("travelers") ?? 2),
      travelMonth: String(data.get("travelMonth") ?? "") || undefined,
      tourSlug: String(data.get("tourSlug") ?? "") || undefined,
      message: String(data.get("message") ?? ""),
      consent: data.get("consent") === "on",
    };
    setStatus({ kind: "pending" });
    const result = await submitInquiry(payload);
    setStatus({
      kind: "done",
      message: result.status === "accepted" ? `Thank you — your reference is ${result.reference}.` : result.message,
    });
  }

  if (status.kind === "done") {
    return (
      <div role="status" className="rounded-[1.5rem] bg-sky-950 p-8 text-felt-50 sm:p-10">
        <Mail aria-hidden className="size-8 text-copper-300" strokeWidth={1.25} />
        <h2 className="mt-5 font-display text-3xl font-light">Thank you for reaching out.</h2>
        <p className="mt-4 text-sky-100">{status.message}</p>
        <p className="mt-6 text-sky-100">
          Write to us at{" "}
          <a href={`mailto:${siteConfig.contact.email}`} className="font-semibold text-white underline underline-offset-4">
            {siteConfig.contact.email}
          </a>{" "}
          and a planner will reply personally.
        </p>
        <Button variant="outline-light" className="mt-8" onClick={() => setStatus({ kind: "idle" })}>
          Back to the form
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 sm:grid-cols-2" aria-describedby={`${uid}-required`}>
      <p id={`${uid}-required`} className="text-sm text-charcoal-500 sm:col-span-2">
        Fields marked <span className="text-copper-600">*</span> are required.
      </p>
      <Field id={`${uid}-name`} label="Full name" required>
        <TextInput id={`${uid}-name`} name="fullName" required autoComplete="name" />
      </Field>
      <Field id={`${uid}-email`} label="Email" required>
        <TextInput id={`${uid}-email`} name="email" type="email" required autoComplete="email" />
      </Field>
      <Field id={`${uid}-country`} label="Country of residence">
        <TextInput id={`${uid}-country`} name="country" autoComplete="country-name" />
      </Field>
      <Field id={`${uid}-travelers`} label="Travellers">
        <TextInput id={`${uid}-travelers`} name="travelers" type="number" min={1} max={30} defaultValue={2} />
      </Field>
      <Field id={`${uid}-tour`} label="Journey of interest" hint={departureLabel ? `Departure: ${departureLabel}` : undefined}>
        <Select id={`${uid}-tour`} name="tourSlug" defaultValue={defaultTourSlug ?? ""}>
          <option value="">Not sure yet / custom journey</option>
          {tours.map((tour) => (
            <option key={tour.value} value={tour.value}>
              {tour.label}
            </option>
          ))}
        </Select>
      </Field>
      <Field id={`${uid}-month`} label="Preferred month">
        <TextInput id={`${uid}-month`} name="travelMonth" type="month" />
      </Field>
      <Field id={`${uid}-message`} label="Tell us about your trip" required className="sm:col-span-2">
        <TextArea
          id={`${uid}-message`}
          name="message"
          required
          placeholder="Who is travelling, what you'd love to see, any questions…"
        />
      </Field>
      <div className="flex items-start gap-3 sm:col-span-2">
        <input
          id={`${uid}-consent`}
          name="consent"
          type="checkbox"
          required
          className="mt-1 size-5 shrink-0 cursor-pointer accent-sky-950"
        />
        <label htmlFor={`${uid}-consent`} className="text-sm text-charcoal-600">
          I agree that Eternal Sky Tour may use these details to reply to my enquiry.
        </label>
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" variant="dark" disabled={status.kind === "pending"} className="w-full sm:w-auto">
          {status.kind === "pending" ? "Sending…" : "Send enquiry"}
        </Button>
      </div>
    </form>
  );
}
