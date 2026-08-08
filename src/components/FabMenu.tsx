"use client";

import { useState } from "react";
import { FolderPlusIcon, LinkPlusIcon, CloseIcon } from "@/components/icons";

interface FabMenuProps {
  onCreateFolder: () => void;
  onCreateBookmark: () => void;
}

export default function FabMenu({ onCreateFolder, onCreateBookmark }: FabMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-4 sm:right-5 z-30 flex flex-col items-end gap-3">
      {open && (
        <>
          {/* M3 extended FAB (secondary action) */}
          <button
            onClick={() => {
              onCreateBookmark();
              setOpen(false);
            }}
            className="state-layer animate-pop flex items-center gap-3 pl-4 pr-5 h-14 rounded-2xl bg-[var(--md-tertiary-container)] text-[var(--md-on-tertiary-container)] type-label-lg shadow-md"
          >
            <LinkPlusIcon size={20} />
            New bookmark
          </button>
          <button
            onClick={() => {
              onCreateFolder();
              setOpen(false);
            }}
            className="state-layer animate-pop flex items-center gap-3 pl-4 pr-5 h-14 rounded-2xl bg-[var(--md-secondary-container)] text-[var(--md-on-secondary-container)] type-label-lg shadow-md"
            style={{ animationDelay: "40ms" }}
          >
            <FolderPlusIcon size={20} />
            New folder
          </button>
        </>
      )}

      {/* M3 primary FAB — large, rounded-square (16-28dp M3 Expressive shape) */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close create menu" : "Create new item"}
        aria-expanded={open}
        className={`state-layer w-16 h-16 rounded-[28px] flex items-center justify-center shadow-lg transition-[background-color,border-radius,transform] duration-300 ${
          open
            ? "bg-[var(--md-surface-container-high)] text-[var(--md-on-surface)] rounded-2xl rotate-45"
            : "bg-[var(--md-primary-container)] text-[var(--md-on-primary-container)]"
        }`}
      >
        {open ? (
          <CloseIcon size={26} className="-rotate-45" />
        ) : (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        )}
      </button>
    </div>
  );
}
