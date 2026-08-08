"use client";

import { useCallback, useMemo, useState } from "react";
import { useItemsStore } from "@/lib/useItemsStore";
import type { SearchFilter, SortDirection, SortMode } from "@/types";

export function useBookmarks(userId: string) {
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilter, setSearchFilter] = useState<SearchFilter>("all");
  const [sortMode, setSortMode] = useState<SortMode>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const {
    items,
    loading,
    getChildren,
    getItemById,
    getPath,
    createFolder,
    createBookmark,
    renameItem,
    deleteItem,
  } = useItemsStore(userId, currentFolderId);

  const currentFolder = currentFolderId ? getItemById(currentFolderId) ?? null : null;

  const navigateTo = useCallback((folderId: string | null) => {
    setCurrentFolderId(folderId);
  }, []);

  const navigateUp = useCallback(() => {
    if (!currentFolder) return;
    setCurrentFolderId(currentFolder.parentId);
  }, [currentFolder]);

  const toggleSortDirection = useCallback(() => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  }, []);

  // ---- Derived lists ----

  const sortedChildren = useMemo(() => {
    const children = [...getChildren(currentFolderId)];
    children.sort((a, b) => {
      let cmp = 0;
      switch (sortMode) {
        case "name":
          cmp = a.name.localeCompare(b.name);
          break;
        case "date":
          cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case "type":
          cmp = a.type === b.type ? 0 : a.type === "folder" ? -1 : 1;
          break;
      }
      return sortDirection === "asc" ? cmp : -cmp;
    });
    // Folders always float to top
    children.sort((a, b) => {
      if (a.type === b.type) return 0;
      return a.type === "folder" ? -1 : 1;
    });
    return children;
  }, [getChildren, currentFolderId, sortMode, sortDirection]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return items.filter((item) => {
      const matchesQuery = item.name.toLowerCase().includes(q);
      const matchesFilter = searchFilter === "all" || item.type === searchFilter;
      return matchesQuery && matchesFilter;
    });
  }, [items, searchQuery, searchFilter]);

  const isSearching = searchQuery.trim().length > 0;
  const displayedItems = isSearching ? searchResults : sortedChildren;

  return {
    loading,
    currentFolderId,
    currentFolder,
    displayedItems,
    isSearching,
    navigateTo,
    navigateUp,
    getPath,
    getChildren,
    createFolder,
    createBookmark,
    renameItem,
    deleteItem,
    searchQuery,
    setSearchQuery,
    searchFilter,
    setSearchFilter,
    sortMode,
    setSortMode,
    sortDirection,
    toggleSortDirection,
  };
}
