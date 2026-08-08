"use client";

import type { ReactNode } from "react";
import { useEscapeKey } from "@/lib/useEscapeKey";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  labelledBy?: string;
}

export default function Modal({ open, onClose, children, labelledBy }: ModalProps) {
  useEscapeKey(open, onClose);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-end sm:items-center justify-center p-0 sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
    >
      <div
        className="absolute inset-0 bg-[var(--md-scrim)]/40 animate-scrim"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative w-full sm:max-w-sm bg-[var(--md-surface-container-high)] text-[var(--md-on-surface)] rounded-t-[28px] sm:rounded-[28px] shadow-xl p-6 animate-sheet">
        {children}
      </div>
    </div>
  );
}
