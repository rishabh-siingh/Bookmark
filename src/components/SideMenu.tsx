"use client";

import { useTheme } from "@/lib/theme";
import { useEscapeKey } from "@/lib/useEscapeKey";
import SegmentedControl from "@/components/SegmentedControl";
import {
  DeviceIcon,
  LogoutIcon,
  MoonIcon,
  SortIcon,
  SunIcon,
} from "@/components/icons";
import type { SortDirection, SortMode } from "@/types";

interface SideMenuProps {
  open: boolean;
  onClose: () => void;
  sortMode: SortMode;
  sortDirection: SortDirection;
  onSortModeChange: (m: SortMode) => void;
  onToggleDirection: () => void;
  onSignOut: () => void;
  userEmail: string;
}

const sortOptions: { mode: SortMode; label: string }[] = [
  { mode: "name", label: "Name" },
  { mode: "date", label: "Date" },
  { mode: "type", label: "Type" },
];

const themeOptions: { value: "light" | "dark" | "system"; label: string; icon: typeof SunIcon }[] = [
  { value: "light", label: "Light", icon: SunIcon },
  { value: "dark", label: "Dark", icon: MoonIcon },
  { value: "system", label: "System", icon: DeviceIcon },
];

export default function SideMenu({
  open,
  onClose,
  sortMode,
  sortDirection,
  onSortModeChange,
  onToggleDirection,
  onSignOut,
  userEmail,
}: SideMenuProps) {
  const { preference, setPreference } = useTheme();

  useEscapeKey(open, onClose);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-30" role="dialog" aria-modal="true" aria-label="App menu">
      {/* Invisible click-catcher — closes the menu on outside click without
          a visible scrim, since the panel itself grows straight out of the
          trigger button rather than sitting over a dimmed backdrop. */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden />

      {/*
        Scaling hamburger nav: pinned to the same top-right point as the
        hamburger button. TopBar's row lives inside a `max-w-2xl mx-auto`
        wrapper with px-3 pt-3 / sm:px-4 sm:pt-4 insets, so this wrapper
        mirrors that exactly — otherwise the panel would drift from the
        button on viewports wider than 2xl, where the row is centered
        rather than flush with the screen edge. The panel scales up from
        that top-right corner via the `scale-menu` CSS animation, so the
        button visually "becomes" the menu instead of a separate panel
        appearing elsewhere on screen.
      */}
      <div className="absolute top-0 inset-x-0 px-3 pt-3 sm:px-4 sm:pt-4 pointer-events-none">
        <div className="max-w-2xl mx-auto flex justify-end">
          <div
            className="scale-menu pointer-events-auto bg-[var(--md-surface-container-high)] text-[var(--md-on-surface)] shadow-xl rounded-[28px] w-full max-w-[340px] mt-[4.25rem]"
            style={{ padding: "var(--phi-4)" }}
          >
            <p
              className="truncate"
              style={{
                fontSize: "var(--phi-text-sm)",
                color: "var(--md-on-surface-variant)",
                fontWeight: 600,
                letterSpacing: "0.02em",
              }}
            >
              {userEmail}
            </p>

            {/* Theme selector */}
            <div style={{ marginTop: "var(--phi-4)" }}>
              <p
                style={{
                  fontSize: "var(--phi-text-sm)",
                  color: "var(--md-on-surface-variant)",
                  fontWeight: 600,
                  marginBottom: "var(--phi-2)",
                }}
              >
                Appearance
              </p>
              <SegmentedControl
                ariaLabel="Theme"
                variant="pill"
                value={preference}
                onChange={setPreference}
                options={themeOptions.map(({ value, label, icon: Icon }) => ({
                  value,
                  label,
                  icon: ({ size }) => <Icon size={size} />,
                }))}
              />
            </div>

            {/* Sort */}
            <div style={{ marginTop: "var(--phi-4)" }}>
              <div
                className="flex items-center"
                style={{ gap: "var(--phi-2)", marginBottom: "var(--phi-2)" }}
              >
                <SortIcon size={16} className="text-[var(--md-primary)]" />
                <span
                  style={{
                    fontSize: "var(--phi-text-sm)",
                    color: "var(--md-on-surface-variant)",
                    fontWeight: 600,
                  }}
                >
                  Sort by
                </span>
              </div>
              <SegmentedControl
                ariaLabel="Sort order"
                variant="tile"
                value={sortMode}
                onChange={onSortModeChange}
                options={sortOptions.map(({ mode, label }) => ({
                  value: mode,
                  label,
                }))}
              />
              <button
                onClick={onToggleDirection}
                className="state-layer w-full rounded-xl bg-[var(--md-surface-container-highest)] text-[var(--md-on-surface-variant)]"
                style={{
                  marginTop: "var(--phi-2)",
                  paddingBlock: "var(--phi-2)",
                  fontSize: "var(--phi-text-xs)",
                  fontWeight: 600,
                }}
              >
                {sortDirection === "asc" ? "Ascending ↑" : "Descending ↓"}
              </button>
            </div>

            <div
              className="bg-[var(--md-outline-variant)]"
              style={{ height: "1px", marginBlock: "var(--phi-4)" }}
            />

            <button
              onClick={onSignOut}
              className="state-layer w-full flex items-center rounded-2xl text-[var(--md-error)]"
              style={{
                gap: "var(--phi-2)",
                paddingInline: "var(--phi-2)",
                height: "var(--phi-5)",
                fontSize: "var(--phi-text-base)",
                fontWeight: 500,
              }}
            >
              <LogoutIcon size={18} />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
