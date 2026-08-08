"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogoIcon, MailIcon, LockIcon, SpinnerIcon } from "@/components/icons";

type Mode = "signin" | "signup";

export default function LoginPage() {
  const router = useRouter();

  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);

    const supabase = createClient();

    // Shared by both branches below: stop the loading spinner, and if
    // Supabase returned an error, surface it and report "stop here" to
    // the caller so it can bail out before touching the session.
    function handleAuthResult(error: { message: string } | null): boolean {
      setLoading(false);
      if (error) {
        setError(error.message);
        return true;
      }
      return false;
    }

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (handleAuthResult(error)) return;
      router.replace("/");
      router.refresh();
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (handleAuthResult(error)) return;
      if (data.session) {
        router.replace("/");
        router.refresh();
      } else {
        setNotice("Account created — check your email to confirm, then sign in.");
        setMode("signin");
      }
    }
  }

  return (
    <main className="min-h-dvh flex items-center justify-center px-5 py-10 relative overflow-hidden bg-[var(--md-background)]">
      {/* Ambient tonal blobs — expressive but quiet */}
      <div
        aria-hidden
        className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[var(--md-primary-container)] opacity-60 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-[var(--md-tertiary-container)] opacity-40 blur-3xl"
      />

      <div className="w-full max-w-sm relative animate-rise">
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="w-16 h-16 rounded-[20px] bg-[var(--md-primary)] text-[var(--md-on-primary)] flex items-center justify-center shadow-md">
            <LogoIcon size={28} />
          </div>
          <h1 className="type-headline-lg text-[var(--md-on-background)]">Bookmark Pro</h1>
          <p className="type-body-md text-[var(--md-on-surface-variant)]">
            Your links, organized and synced.
          </p>
        </div>

        <div className="bg-[var(--md-surface-container-low)] rounded-[28px] p-6 shadow-lg">
          {/* M3 segmented button */}
          <div
            role="radiogroup"
            aria-label="Sign in or sign up"
            className="flex gap-1 mb-6 bg-[var(--md-surface-container-highest)] p-1 rounded-full"
          >
            <button
              type="button"
              role="radio"
              aria-checked={mode === "signin"}
              onClick={() => {
                setMode("signin");
                setError(null);
                setNotice(null);
              }}
              className={`state-layer flex-1 py-2.5 rounded-full type-label-lg transition-colors duration-200 ${
                mode === "signin"
                  ? "bg-[var(--md-primary)] text-[var(--md-on-primary)]"
                  : "text-[var(--md-on-surface-variant)]"
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={mode === "signup"}
              onClick={() => {
                setMode("signup");
                setError(null);
                setNotice(null);
              }}
              className={`state-layer flex-1 py-2.5 rounded-full type-label-lg transition-colors duration-200 ${
                mode === "signup"
                  ? "bg-[var(--md-primary)] text-[var(--md-on-primary)]"
                  : "text-[var(--md-on-surface-variant)]"
              }`}
            >
              Sign up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="flex flex-col gap-2">
              <span className="type-label-md text-[var(--md-on-surface-variant)]">
                Email
              </span>
              <div className="flex items-center gap-3 h-14 bg-[var(--md-surface-container-highest)] rounded-xl px-4 ring-1 ring-transparent focus-within:ring-[var(--md-primary)] transition-colors">
                <MailIcon size={18} className="text-[var(--md-on-surface-variant)] shrink-0" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="type-body-lg bg-transparent outline-none w-full text-[var(--md-on-surface)] placeholder:text-[var(--md-on-surface-variant)]"
                />
              </div>
            </label>

            <label className="flex flex-col gap-2">
              <span className="type-label-md text-[var(--md-on-surface-variant)]">
                Password
              </span>
              <div className="flex items-center gap-3 h-14 bg-[var(--md-surface-container-highest)] rounded-xl px-4 ring-1 ring-transparent focus-within:ring-[var(--md-primary)] transition-colors">
                <LockIcon size={18} className="text-[var(--md-on-surface-variant)] shrink-0" />
                <input
                  type="password"
                  required
                  minLength={6}
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="type-body-lg bg-transparent outline-none w-full text-[var(--md-on-surface)] placeholder:text-[var(--md-on-surface-variant)]"
                />
              </div>
            </label>

            {error && (
              <p
                role="alert"
                className="type-body-sm font-medium text-[var(--md-on-error-container)] bg-[var(--md-error-container)] rounded-xl px-3 py-2.5"
              >
                {error}
              </p>
            )}
            {notice && (
              <p
                role="status"
                className="type-body-sm font-medium text-[var(--md-on-tertiary-container)] bg-[var(--md-tertiary-container)] rounded-xl px-3 py-2.5"
              >
                {notice}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="state-layer mt-2 flex items-center justify-center gap-2 bg-[var(--md-primary)] text-[var(--md-on-primary)] type-label-lg text-base py-3.5 rounded-full shadow-sm disabled:opacity-60"
            >
              {loading ? (
                <SpinnerIcon size={20} className="animate-spin" />
              ) : mode === "signin" ? (
                "Sign in"
              ) : (
                "Create account"
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
