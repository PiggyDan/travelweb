"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Minus, Plus, Sparkles } from "lucide-react";
import { useId, useRef, useState, type FormEvent } from "react";
import { LocaleLink } from "@/components/shared/locale-link";
import { Button, buttonClasses } from "@/components/ui/button";
import { openChat } from "@/lib/chat-events";
import { ACCOMMODATION_OPTIONS, ACTIVITY_OPTIONS, BUDGET_OPTIONS } from "@/lib/planner-options";
import { routes } from "@/lib/routes";
import { submitTripPlan } from "@/services/inquiry-service";
import type { SelectOption } from "@/types/common";
import type {
  AccommodationStyle,
  ActivityPreference,
  BudgetRange,
  FieldErrors,
  TripPlannerRequest,
} from "@/types/inquiry";
import { ChoiceChips } from "./choice-chips";
import { Field, Select, TextArea, TextInput } from "./field";

interface TripPlannerFormProps {
  interests: SelectOption[];
  destinations: SelectOption[];
}

function Stepper({ id, label, value, min, max, onChange }: { id: string; label: string; value: number; min: number; max: number; onChange: (value: number) => void }) {
  return (
    <div>
      <p id={id} className="mb-2 text-sm font-semibold text-sky-950">
        {label}
      </p>
      <div role="group" aria-labelledby={id} className="inline-flex items-center rounded-full border border-sand-300 bg-white">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label={`Fewer ${label.toLowerCase()}`}
          className="inline-flex size-12 items-center justify-center rounded-full text-sky-950 hover:bg-sand-100 disabled:text-charcoal-400"
        >
          <Minus aria-hidden className="size-4" />
        </button>
        <output aria-live="polite" className="w-10 text-center font-display text-xl text-sky-950">
          {value}
        </output>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          aria-label={`More ${label.toLowerCase()}`}
          className="inline-flex size-12 items-center justify-center rounded-full text-sky-950 hover:bg-sand-100 disabled:text-charcoal-400"
        >
          <Plus aria-hidden className="size-4" />
        </button>
      </div>
    </div>
  );
}

type Outcome = { kind: "accepted"; reference: string } | { kind: "unavailable"; message: string };

/**
 * Trip planner. On submit the request is saved by the backend, which returns
 * a reference and opens a chat between the traveller and our planners.
 */
export function TripPlannerForm({ interests, destinations }: TripPlannerFormProps) {
  const uid = useId();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [days, setDays] = useState(10);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([]);
  const [activity, setActivity] = useState<ActivityPreference>("balanced");
  const [accommodation, setAccommodation] = useState<AccommodationStyle>("mixed");
  const [budget, setBudget] = useState<BudgetRange>("2000-3500");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<Outcome | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const top = useRef<HTMLDivElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const request: TripPlannerRequest = {
      fullName,
      email,
      phone: phone || undefined,
      country: country || undefined,
      message: message || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      days,
      adults,
      children,
      interests: selectedInterests,
      destinations: selectedDestinations,
      activityLevel: activity,
      accommodationStyle: accommodation,
      budget,
    };
    setPending(true);
    const response = await submitTripPlan(request);
    setPending(false);
    if (response.status === "invalid") {
      setFieldErrors(response.fieldErrors);
      setFormError(response.fieldErrors._form ?? response.message);
      return;
    }
    setFieldErrors({});
    setFormError(null);
    setResult(
      response.status === "accepted"
        ? { kind: "accepted", reference: response.reference }
        : { kind: "unavailable", message: response.message },
    );
    // The form is long; bring the confirmation (or error) card into view.
    top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    if (response.status === "accepted") openChat();
  }

  const labelFor = (options: readonly SelectOption[], values: readonly string[]) =>
    values.map((v) => options.find((o) => o.value === v)?.label ?? v).join(", ");

  return (
    <>
      <div ref={top} aria-hidden className="scroll-mt-28" />
      <AnimatePresence mode="wait" initial={false}>
        {result ? (
          <motion.div
            key="result"
            role="status"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-[2rem] bg-sky-950 p-8 text-felt-50 sm:p-12"
          >
            <Sparkles aria-hidden className="size-9 text-copper-300" strokeWidth={1.25} />
            {result.kind === "accepted" ? (
              <>
                <h2 className="mt-6 font-display text-4xl leading-tight font-light sm:text-5xl">
                  Thank you, {fullName.split(" ")[0]}. Your journey has begun.
                </h2>
                <p className="mt-5 max-w-xl text-sky-100">
                  Your reference is <strong className="font-semibold text-white">{result.reference}</strong>. A
                  trip planner will reply in the chat (bottom right of every page), usually within a few hours,
                  and can also reach you at {email}.
                </p>
              </>
            ) : (
              <>
                <h2 className="mt-6 font-display text-4xl leading-tight font-light sm:text-5xl">
                  We couldn&apos;t send your plan just now.
                </h2>
                <p className="mt-5 max-w-xl text-sky-100">
                  {result.message} Your answers are still here, so you can try again or contact us directly.
                </p>
              </>
            )}
            <dl className="mt-10 grid gap-6 border-t border-white/15 pt-8 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-sky-300">Length</dt>
                <dd className="mt-1 text-white">
                  {days} days · {adults} adult{adults === 1 ? "" : "s"}
                  {children > 0 && `, ${children} child${children === 1 ? "" : "ren"}`}
                </dd>
              </div>
              <div>
                <dt className="text-sky-300">Style</dt>
                <dd className="mt-1 text-white">
                  {labelFor(ACTIVITY_OPTIONS, [activity])} · {labelFor(ACCOMMODATION_OPTIONS, [accommodation])}
                </dd>
              </div>
              {selectedInterests.length > 0 && (
                <div>
                  <dt className="text-sky-300">Interests</dt>
                  <dd className="mt-1 text-white">{labelFor(interests, selectedInterests)}</dd>
                </div>
              )}
              {selectedDestinations.length > 0 && (
                <div>
                  <dt className="text-sky-300">Destinations</dt>
                  <dd className="mt-1 text-white">{labelFor(destinations, selectedDestinations)}</dd>
                </div>
              )}
            </dl>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              {result.kind === "accepted" ? (
                <Button variant="light" onClick={openChat}>
                  <MessageCircle aria-hidden className="size-4" />
                  Chat with your planner
                </Button>
              ) : (
                <LocaleLink href={routes.contact} className={buttonClasses("light")}>
                  Contact us
                </LocaleLink>
              )}
              <Button variant="outline-light" onClick={() => setResult(null)}>
                {result.kind === "accepted" ? "Plan another trip" : "Back to my answers"}
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-12"
          >
            <section aria-labelledby={`${uid}-when`} className="grid gap-6 sm:grid-cols-2">
              <h2 id={`${uid}-when`} className="font-display text-2xl font-light text-sky-950 sm:col-span-2">
                1. When &amp; who
              </h2>
              <Field id={`${uid}-start`} label="Arrival date">
                <TextInput id={`${uid}-start`} type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </Field>
              <Field id={`${uid}-end`} label="Departure date">
                <TextInput
                  id={`${uid}-end`}
                  type="date"
                  value={endDate}
                  min={startDate || undefined}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </Field>
              <Field id={`${uid}-days`} label="Number of days" hint="Flexible? Give us your best guess.">
                <Select id={`${uid}-days`} value={days} onChange={(e) => setDays(Number(e.target.value))}>
                  {[4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 18, 21].map((n) => (
                    <option key={n} value={n}>
                      {n} days
                    </option>
                  ))}
                </Select>
              </Field>
              <div className="flex flex-wrap gap-8">
                <Stepper id={`${uid}-adults`} label="Adults" value={adults} min={1} max={20} onChange={setAdults} />
                <Stepper id={`${uid}-children`} label="Children" value={children} min={0} max={10} onChange={setChildren} />
              </div>
            </section>

            <section aria-labelledby={`${uid}-what`} className="space-y-8">
              <h2 id={`${uid}-what`} className="font-display text-2xl font-light text-sky-950">
                2. What moves you
              </h2>
              <ChoiceChips
                legend="Interests"
                hint="Choose as many as you like."
                name="interests"
                mode="multiple"
                options={interests}
                value={selectedInterests}
                onChange={setSelectedInterests}
              />
              <ChoiceChips
                legend="Preferred destinations"
                hint="Leave blank if you'd like our suggestions."
                name="destinations"
                mode="multiple"
                options={destinations}
                value={selectedDestinations}
                onChange={setSelectedDestinations}
              />
            </section>

            <section aria-labelledby={`${uid}-how`} className="space-y-8">
              <h2 id={`${uid}-how`} className="font-display text-2xl font-light text-sky-950">
                3. How you travel
              </h2>
              <ChoiceChips
                legend="Activity level"
                name="activity"
                mode="single"
                options={ACTIVITY_OPTIONS}
                value={[activity]}
                onChange={([v]) => v && setActivity(v as ActivityPreference)}
              />
              <ChoiceChips
                legend="Accommodation style"
                name="accommodation"
                mode="single"
                options={ACCOMMODATION_OPTIONS}
                value={[accommodation]}
                onChange={([v]) => v && setAccommodation(v as AccommodationStyle)}
              />
              <Field id={`${uid}-budget`} label="Budget range" className="max-w-md">
                <Select id={`${uid}-budget`} value={budget} onChange={(e) => setBudget(e.target.value as BudgetRange)}>
                  {BUDGET_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </Field>
            </section>

            <section aria-labelledby={`${uid}-who`} className="grid gap-6 sm:grid-cols-2">
              <h2 id={`${uid}-who`} className="font-display text-2xl font-light text-sky-950 sm:col-span-2">
                4. About you
              </h2>
              <Field id={`${uid}-name`} label="Full name" required hint={fieldErrors.fullName}>
                <TextInput
                  id={`${uid}-name`}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  maxLength={120}
                  autoComplete="name"
                  aria-invalid={!!fieldErrors.fullName}
                />
              </Field>
              <Field id={`${uid}-email`} label="Email" required hint={fieldErrors.email}>
                <TextInput
                  id={`${uid}-email`}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  aria-invalid={!!fieldErrors.email}
                />
              </Field>
              <Field id={`${uid}-phone`} label="Phone or WhatsApp" hint="Optional, if you would like us to call or message you.">
                <TextInput
                  id={`${uid}-phone`}
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  maxLength={40}
                  autoComplete="tel"
                />
              </Field>
              <Field id={`${uid}-country`} label="Country you are travelling from">
                <TextInput
                  id={`${uid}-country`}
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  maxLength={80}
                  autoComplete="country-name"
                />
              </Field>
              <Field
                id={`${uid}-message`}
                label="Anything else we should know?"
                hint="Special occasions, dietary needs, must-sees…"
                className="sm:col-span-2"
              >
                <TextArea
                  id={`${uid}-message`}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={4000}
                  className="min-h-28"
                />
              </Field>
            </section>

            <div className="border-t border-sand-300 pt-10">
              {formError && (
                <p role="alert" className="mb-5 text-sm font-medium text-red-700 dark:text-red-300">
                  {formError}
                </p>
              )}
              <Button type="submit" variant="dark" disabled={pending} className="w-full sm:w-auto">
                <Sparkles aria-hidden className="size-4" />
                {pending ? "Sending…" : "Send my journey to a planner"}
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </>
  );
}
