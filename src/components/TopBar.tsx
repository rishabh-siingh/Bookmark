"use client";

import { useEffect, useRef } from "react";
import {
  LogoIcon,
  SearchIcon,
  MenuIcon,
  CloseIcon,
  ChevronRightIcon,
} from "@/components/icons";
import type { Item } from "@/types";

interface TopBarProps {
  title: string;
  path: Item[];
  searchActive: boolean;
  onSearchToggle: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onLogoClick: () => void;
  onMenuClick: () => void;
  menuOpen: boolean;
}

export default function TopBar({
  title,
  path,
  searchActive,
  onSearchToggle,
  searchQuery,
  onSearchChange,
  onLogoClick,
  onMenuClick,
  menuOpen,
}: TopBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchActive) {
      const t = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(t);
    }
  }, [searchActive]);

  return (
    <header className="fixed top-0 inset-x-0 z-30 px-3 pt-3 sm:px-4 sm:pt-4">
      <div className="max-w-2xl mx-auto flex items-center gap-2 sm:gap-3">
        {/* Logo — always present, never hides or swaps */}
        <button
          onClick={onLogoClick}
          aria-label="Bookmark Pro home"
          className="state-layer shrink-0 w-14 h-14 rounded-full bg-[var(--md-primary)] text-[var(--md-on-primary)] shadow-sm flex items-center justify-center"
        >
          <LogoIcon size={24} />
        </button>

        {/* Search bar — M3 search-bar component: surface-container-high, full shape, elevation 1.
            Grows to fill the space freed by the single trailing button, since
            the logo no longer disappears. */}
        <div
          className={`flex-1 h-14 rounded-full bg-[var(--md-surface-container-high)] flex items-center px-4 sm:px-5 min-w-0 shadow-sm ring-1 transition-colors duration-200 ${
            searchActive ? "ring-[var(--md-primary)]" : "ring-transparent"
          }`}
        >
          {searchActive ? (
            <>
              <SearchIcon size={20} className="text-[var(--md-on-surface-variant)] shrink-0" />
              <input
                ref={inputRef}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search bookmarks & folders"
                className="type-body-lg ml-3 bg-transparent w-full text-[var(--md-on-surface)] placeholder:text-[var(--md-on-surface-variant)]"
                aria-label="Search bookmarks"
              />
            </>
          ) : (
            <button
              onClick={onSearchToggle}
              className="w-full h-full flex items-center min-w-0 text-left"
              aria-label="Open search"
            >
              <SearchIcon size={20} className="text-[var(--md-on-surface-variant)] shrink-0" />
              <div className="ml-3 min-w-0 flex-1">
                <p className="type-title-md truncate text-[var(--md-on-surface)]">
                  {title}
                </p>
                {path.length > 0 && (
                  <div className="flex items-center gap-1 type-label-sm text-[var(--md-on-surface-variant)] truncate normal-case tracking-normal font-medium">
                    {path.map((p, i) => (
                      <span key={p.id} className="flex items-center gap-1 truncate">
                        {i > 0 && <ChevronRightIcon size={10} />}
                        <span className="truncate">{p.name}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </button>
          )}
        </div>

        {/* Single trailing button — hamburger while browsing, morphs into
            search-close while searching. Never hidden, never duplicated. */}
        <button
          onClick={searchActive ? onSearchToggle : onMenuClick}
          aria-label={searchActive ? "Close search" : "Open menu"}
          aria-pressed={searchActive ? undefined : menuOpen}
          className={`state-layer shrink-0 w-14 h-14 rounded-full flex items-center justify-center shadow-sm transition-colors duration-300 ${
            searchActive
              ? "bg-[var(--md-secondary-container)] text-[var(--md-on-secondary-container)]"
              : menuOpen
              ? "bg-[var(--md-tertiary-container)] text-[var(--md-on-tertiary-container)]"
              : "bg-[var(--md-surface-container-high)] text-[var(--md-on-surface)]"
          }`}
        >
          {searchActive || menuOpen ? (
            <CloseIcon size={22} />
          ) : (
            <MenuIcon size={22} />
          )}
        </button>
      </div>
    </header>
  );
}
