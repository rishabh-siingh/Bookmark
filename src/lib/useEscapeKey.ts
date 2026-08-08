"use client";

import { useEffect } from "react";

/**
 * Calls `onEscape` whenever the Escape key is pressed while `active` is
 * true. Shared by every dismissible surface (dialogs, sheets, the search
 * bar) so the listener-attach/detach logic lives in one place.
 */
export function useEscapeKey(active: boolean, onEscape: () => void) {
  useEffect(() => {
    if (!active) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onEscape();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [active, onEscape]);
}
