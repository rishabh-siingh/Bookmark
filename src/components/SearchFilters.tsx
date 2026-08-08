"use client";

import { CheckIcon, FolderIcon, GlobeIcon } from "@/components/icons";
import type { SearchFilter } from "@/types";

interface SearchFiltersProps {
  value: SearchFilter;
  onChange: (v: SearchFilter) => void;
}

const filters: { value: SearchFilter; label: string; icon: typeof FolderIcon }[] = [
  { value: "all", label: "All", icon: GlobeIcon },
  { value: "folder", label: "Folders", icon: FolderIcon },
  { value: "bookmark", label: "Bookmarks", icon: GlobeIcon },
];

export default function SearchFilters({ value, onChange }: SearchFiltersProps) {
  return (
    <div
      role="group"
      aria-label="Filter search results"
      className="flex gap-2 px-1 animate-rise overflow-x-auto no-scrollbar"
    >
      {filters.map(({ value: v, label, icon: Icon }) => {
        const active = value === v;
        return (
          <button
            key={v}
            onClick={() => onChange(v)}
            aria-pressed={active}
            className={`state-layer flex items-center gap-1.5 pl-3 pr-4 h-9 rounded-lg type-label-lg shrink-0 transition-colors duration-200 border ${
              active
                ? "bg-[var(--md-secondary-container)] text-[var(--md-on-secondary-container)] border-transparent"
                : "bg-transparent text-[var(--md-on-surface-variant)] border-[var(--md-outline-variant)]"
            }`}
          >
            {active ? <CheckIcon size={16} /> : <Icon size={16} />}
            {label}
          </button>
        );
      })}
    </div>
  );
}
