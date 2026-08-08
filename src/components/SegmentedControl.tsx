"use client";

import type { ReactNode } from "react";

interface SegmentedControlOption<T extends string> {
  value: T;
  label: string;
  /** Optional per-option icon, rendered above the label (theme selector). */
  icon?: (props: { size: number }) => ReactNode;
}

interface SegmentedControlProps<T extends string> {
  ariaLabel: string;
  options: SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** "pill" = fully rounded track + fully rounded segments, icon shown
   *  above the label on every option (theme selector).
   *  "tile" = square track + rounded-xl segments, no persistent icon —
   *  instead a leading checkmark renders only on the active segment
   *  (sort selector). */
  variant: "pill" | "tile";
}

export default function SegmentedControl<T extends string>({
  ariaLabel,
  options,
  value,
  onChange,
  variant,
}: SegmentedControlProps<T>) {
  const isPill = variant === "pill";

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={`grid grid-cols-3 ${
        isPill ? "rounded-full bg-[var(--md-surface-container-highest)]" : ""
      }`}
      style={
        isPill
          ? { gap: "var(--phi-1)", padding: "var(--phi-1)" }
          : { gap: "var(--phi-2)" }
      }
    >
      {options.map((option) => {
        const active = value === option.value;
        return (
          <button
            key={option.value}
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.value)}
            className={`state-layer flex items-center justify-center transition-colors duration-200 ${
              isPill ? "flex-col rounded-full" : "rounded-xl"
            } ${
              active
                ? isPill
                  ? "bg-[var(--md-primary)] text-[var(--md-on-primary)]"
                  : "bg-[var(--md-secondary-container)] text-[var(--md-on-secondary-container)]"
                : isPill
                ? "text-[var(--md-on-surface-variant)]"
                : "bg-[var(--md-surface-container-highest)] text-[var(--md-on-surface-variant)]"
            }`}
            style={{
              gap: "var(--phi-1)",
              paddingBlock: "var(--phi-2)",
              fontSize: "var(--phi-text-xs)",
              fontWeight: 600,
            }}
          >
            {isPill
              ? option.icon?.({ size: 16 })
              : active && <CheckMark />}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function CheckMark() {
  return (
    <svg
      width={13}
      height={13}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.25}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
