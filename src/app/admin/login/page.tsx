"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useId, useState, type FormEvent } from "react";
import { Field, TextInput } from "@/components/forms/field";
import { Button } from "@/components/ui/button";
import { api, ApiError } from "@/lib/api";
import logo from "../../../../public/images/logo.png";

export default function AdminLoginPage() {
  const router = useRouter();
  const uid = useId();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setPending(true);
    setError(null);
    try {
      await api("/admin/login", { body: { email: data.get("email"), password: data.get("password") } });
      router.replace("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Sign-in failed. Please try again.");
      setPending(false);
    }
  }

  return (
    <main className="flex min-h-svh items-center justify-center p-5">
      <div className="w-full max-w-sm rounded-[2rem] bg-felt-50 p-8 shadow-xl shadow-sky-950/10 ring-1 ring-sand-200">
        <Image src={logo} alt="Eternal Sky Tour" priority className="mx-auto h-20 w-auto" />
        <h1 className="mt-6 text-center font-display text-3xl font-light text-sky-950">Staff sign-in</h1>
        <form onSubmit={submit} className="mt-8 space-y-5">
          <Field id={`${uid}-email`} label="Email or username">
            <TextInput id={`${uid}-email`} name="email" required autoComplete="username" autoCapitalize="none" spellCheck={false} autoFocus />
          </Field>
          <Field id={`${uid}-password`} label="Password">
            <TextInput id={`${uid}-password`} name="password" type="password" required autoComplete="current-password" />
          </Field>
          {error && (
            <p role="alert" className="text-sm font-medium text-red-700">
              {error}
            </p>
          )}
          <Button type="submit" variant="dark" disabled={pending} className="w-full">
            {pending ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </div>
    </main>
  );
}
