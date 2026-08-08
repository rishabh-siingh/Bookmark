"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useBookmarks } from "@/lib/useBookmarks";
import { useEscapeKey } from "@/lib/useEscapeKey";
import TopBar from "@/components/TopBar";
import SearchFilters from "@/components/SearchFilters";
import ItemList from "@/components/ItemList";
import FabMenu from "@/components/FabMenu";
import ModalManager from "@/components/ModalManager";
import SideMenu from "@/components/SideMenu";
import { SpinnerIcon } from "@/components/icons";
import type { Item, ModalState } from "@/types";

interface BookmarkAppProps {
  userId: string;
  userEmail: string;
}

export default function BookmarkApp({ userId, userEmail }: BookmarkAppProps) {
  const router = useRouter();
  const supabase = createClient();

  const {
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
  } = useBookmarks(userId);

  const [searchActive, setSearchActive] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [modal, setModal] = useState<ModalState>({ type: null });
  const [urlConfirmItem, setUrlConfirmItem] = useState<Item | null>(null);

  useEscapeKey(searchActive, () => setSearchActive(false));
  useEscapeKey(menuOpen, () => setMenuOpen(false));

  const handleSearchToggle = useCallback(() => {
    setSearchActive((prev) => {
      if (prev) setSearchQuery("");
      return !prev;
    });
  }, [setSearchQuery]);

  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }, [supabase, router]);

  const path = currentFolderId ? getPath(currentFolderId) : [];
  const title = currentFolder?.name ?? "Bookmark Pro";

  return (
    <main className="min-h-dvh pb-28">
      <TopBar
        title={title}
        path={path}
        searchActive={searchActive}
        onSearchToggle={handleSearchToggle}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onLogoClick={() => navigateTo(null)}
        onMenuClick={() => setMenuOpen((o) => !o)}
        menuOpen={menuOpen}
      />

      <div className="pt-24 px-4 max-w-2xl mx-auto flex flex-col gap-4">
        {searchActive && (
          <SearchFilters value={searchFilter} onChange={setSearchFilter} />
        )}

        {loading ? (
          <div className="flex justify-center py-20" role="status" aria-live="polite">
            <SpinnerIcon size={28} className="animate-spin text-[var(--md-primary)]" />
            <span className="sr-only">Loading your bookmarks</span>
          </div>
        ) : (
          <ItemList
            items={displayedItems}
            showUp={currentFolderId !== null && !isSearching}
            onUp={navigateUp}
            onOpenFolder={navigateTo}
            onOpenBookmark={(item) => setUrlConfirmItem(item)}
            onItemMenu={(item) => setModal({ type: "item-menu", item })}
            childCount={(id) => getChildren(id).length}
            isSearching={isSearching}
          />
        )}
      </div>

      <FabMenu
        onCreateFolder={() => setModal({ type: "create-folder" })}
        onCreateBookmark={() => setModal({ type: "create-bookmark" })}
      />

      <SideMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        sortMode={sortMode}
        sortDirection={sortDirection}
        onSortModeChange={setSortMode}
        onToggleDirection={toggleSortDirection}
        onSignOut={handleSignOut}
        userEmail={userEmail}
      />

      <ModalManager
        modal={modal}
        onClose={() => setModal({ type: null })}
        onCreateFolder={createFolder}
        onCreateBookmark={createBookmark}
        onRename={renameItem}
        onDelete={deleteItem}
        onOpenLink={(item) => setUrlConfirmItem(item)}
        onEditRequest={(item) => setModal({ type: "rename", item })}
        onDeleteRequest={(item) => setModal({ type: "delete", item })}
        urlConfirmItem={urlConfirmItem}
        onCloseUrlConfirm={() => setUrlConfirmItem(null)}
        onConfirmOpenLink={(item) => {
          if (item.url) window.open(item.url, "_blank", "noopener,noreferrer");
          setUrlConfirmItem(null);
        }}
      />
    </main>
  );
}
