"use client";

import type { ReactNode, RefObject, KeyboardEvent } from "react";

export function DialogIcon({
  children,
  tone = "primary",
}: {
  children: ReactNode;
  tone?: "primary" | "secondary" | "tertiary" | "error";
}) {
  const toneClasses: Record<string, string> = {
    primary: "bg-[var(--md-primary-container)] text-[var(--md-on-primary-container)]",
    secondary: "bg-[var(--md-secondary-container)] text-[var(--md-on-secondary-container)]",
    tertiary: "bg-[var(--md-tertiary-container)] text-[var(--md-on-tertiary-container)]",
    error: "bg-[var(--md-error-container)] text-[var(--md-on-error-container)]",
  };
  return (
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${toneClasses[tone]}`}>
      {children}
    </div>
  );
}

export function TextButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="state-layer flex-1 h-11 rounded-full type-label-lg text-[var(--md-primary)]"
    >
      {children}
    </button>
  );
}

export function FilledButton({
  onClick,
  disabled,
  tone = "primary",
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  tone?: "primary" | "error";
  children: ReactNode;
}) {
  const toneClasses =
    tone === "error"
      ? "bg-[var(--md-error)] text-[var(--md-on-error)]"
      : "bg-[var(--md-primary)] text-[var(--md-on-primary)]";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`state-layer flex-1 h-11 flex items-center justify-center gap-2 rounded-full type-label-lg shadow-sm disabled:opacity-40 disabled:shadow-none ${toneClasses}`}
    >
      {children}
    </button>
  );
}

export function M3TextField({
  value,
  onChange,
  onKeyDown,
  placeholder,
  ariaLabel,
  inputRef,
}: {
  value: string;
  onChange: (v: string) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  placeholder: string;
  ariaLabel: string;
  inputRef?: RefObject<HTMLInputElement | null>;
}) {
  return (
    <div className="w-full h-14 rounded-xl bg-[var(--md-surface-container-highest)] flex items-center px-4 ring-1 ring-transparent focus-within:ring-[var(--md-primary)] transition-colors">
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="type-body-lg w-full bg-transparent outline-none text-[var(--md-on-surface)] placeholder:text-[var(--md-on-surface-variant)]"
      />
    </div>
  );
}
