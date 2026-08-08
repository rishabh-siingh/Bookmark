"use client";

import Image from "next/image";
import { getFaviconUrl } from "@/lib/favicon";
import {
  ArrowUpIcon,
  EmptyIcon,
  FolderIcon,
  GlobeIcon,
  MoreIcon,
} from "@/components/icons";
import type { Item } from "@/types";

interface ItemListProps {
  items: Item[];
  showUp: boolean;
  onUp: () => void;
  onOpenFolder: (id: string) => void;
  onOpenBookmark: (item: Item) => void;
  onItemMenu: (item: Item) => void;
  childCount: (folderId: string) => number;
  isSearching: boolean;
}

export default function ItemList({
  items,
  showUp,
  onUp,
  onOpenFolder,
  onOpenBookmark,
  onItemMenu,
  childCount,
  isSearching,
}: ItemListProps) {
  return (
    <ul role="list" aria-label="Bookmarks and folders" className="flex flex-col gap-2 list-none p-0 m-0">
      {showUp && (
        <li>
          <button
            onClick={onUp}
            aria-label="Go to parent folder"
            className="state-layer w-full flex items-center gap-4 bg-[var(--md-surface-container-low)] rounded-full px-3 py-3 text-left min-h-[64px]"
          >
            <div className="w-12 h-12 rounded-full bg-[var(--md-surface-container-highest)] flex items-center justify-center shrink-0">
              <ArrowUpIcon size={20} className="text-[var(--md-on-surface-variant)]" />
            </div>
            <div className="min-w-0">
              <p className="type-title-md text-[var(--md-on-surface)]">Back</p>
              <p className="type-body-sm text-[var(--md-on-surface-variant)]">
                Parent folder
              </p>
            </div>
          </button>
        </li>
      )}

      {items.map((item, i) => {
        const isFolder = item.type === "folder";
        const count = isFolder ? childCount(item.id) : 0;
        const faviconUrl = !isFolder && item.url ? getFaviconUrl(item.url) : "";

        return (
          <li
            key={item.id}
            className="animate-rise"
            style={{ animationDelay: `${Math.min(i, 8) * 25}ms` }}
          >
            <div
              className="state-layer group flex items-center gap-4 bg-[var(--md-surface-container-low)] rounded-full pl-3 pr-3 py-3 min-h-[72px] cursor-pointer transition-[background-color,box-shadow] duration-200 hover:shadow-sm"
              tabIndex={0}
              role="button"
              onClick={() =>
                isFolder ? onOpenFolder(item.id) : onOpenBookmark(item)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  isFolder ? onOpenFolder(item.id) : onOpenBookmark(item);
                }
              }}
              aria-label={`${item.name}, ${item.type}${
                isFolder ? `, ${count} item${count !== 1 ? "s" : ""}` : ""
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 overflow-hidden ${
                  isFolder
                    ? "bg-[var(--md-primary-container)]"
                    : "bg-[var(--md-tertiary-container)]"
                }`}
              >
                {isFolder ? (
                  <FolderIcon size={22} className="text-[var(--md-on-primary-container)]" />
                ) : faviconUrl ? (
                  <Image
                    src={faviconUrl}
                    alt=""
                    width={48}
                    height={48}
                    unoptimized
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <GlobeIcon size={20} className="text-[var(--md-on-tertiary-container)]" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="type-title-md text-[var(--md-on-surface)] truncate">
                  {item.name}
                </p>
                <p className="type-body-sm text-[var(--md-on-surface-variant)] truncate">
                  {isFolder
                    ? `${count} item${count !== 1 ? "s" : ""}`
                    : item.url}
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onItemMenu(item);
                }}
                aria-label={`Options for ${item.name}`}
                className="state-layer shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-[var(--md-on-surface-variant)]"
              >
                <MoreIcon size={20} />
              </button>
            </div>
          </li>
        );
      })}

      {items.length === 0 && (
        <li
          role="status"
          className="flex flex-col items-center gap-3 py-16 text-center animate-rise"
        >
          <div className="w-20 h-20 rounded-full bg-[var(--md-surface-container-high)] flex items-center justify-center">
            <EmptyIcon size={36} className="text-[var(--md-on-surface-variant)]" />
          </div>
          <p className="type-title-lg text-[var(--md-on-surface)]">
            {isSearching ? "No matches found" : "This folder is empty"}
          </p>
          <p className="type-body-md text-[var(--md-on-surface-variant)] max-w-xs">
            {isSearching
              ? "Try a different search term or filter."
              : "Tap the + button to add a bookmark or folder."}
          </p>
        </li>
      )}
    </ul>
  );
}
