"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { rowToItem } from "@/lib/mappers";
import { normalizeUrl } from "@/lib/favicon";
import type { Item } from "@/types";

/**
 * Owns the raw items tree for one user: initial fetch, realtime sync, and
 * every write (create/rename/delete). Everything here operates on the flat
 * `items` array and knows nothing about navigation, search, or sort — those
 * live in `useBookmarks`, which composes this store with that view state.
 */
export function useItemsStore(userId: string, currentFolderId: string | null) {
  const supabase = useMemo(() => createClient(), []);

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  // Initial fetch
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .order("created_at", { ascending: true });

      if (!cancelled) {
        if (!error && data) {
          setItems(data.map(rowToItem));
        }
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [supabase, userId]);

  // Realtime sync — keeps multiple tabs/devices consistent
  useEffect(() => {
    const channel = supabase
      .channel("items-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "items", filter: `user_id=eq.${userId}` },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setItems((prev) => {
              if (prev.some((i) => i.id === payload.new.id)) return prev;
              return [...prev, rowToItem(payload.new as never)];
            });
          } else if (payload.eventType === "UPDATE") {
            setItems((prev) =>
              prev.map((i) =>
                i.id === payload.new.id ? rowToItem(payload.new as never) : i
              )
            );
          } else if (payload.eventType === "DELETE") {
            setItems((prev) => prev.filter((i) => i.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, userId]);

  const getChildren = useCallback(
    (parentId: string | null) =>
      items.filter((item) => item.parentId === parentId),
    [items]
  );

  const getItemById = useCallback(
    (id: string) => items.find((item) => item.id === id),
    [items]
  );

  const getPath = useCallback(
    (folderId: string | null): Item[] => {
      const path: Item[] = [];
      let current = folderId ? getItemById(folderId) : undefined;
      while (current) {
        path.unshift(current);
        current = current.parentId ? getItemById(current.parentId) : undefined;
      }
      return path;
    },
    [getItemById]
  );

  // ---- CRUD ----

  /**
   * Shared optimistic-create flow for both folders and bookmarks: insert a
   * temp item into local state immediately, write it to Supabase, then
   * either reconcile the temp id with the real row or roll back on error.
   * `createFolder` and `createBookmark` are thin wrappers around this so
   * both item types go through one insert/rollback/reconcile path.
   */
  const createItem = useCallback(
    async (fields: { type: "folder" | "bookmark"; name: string; url: string | null }) => {
      const tempId = `temp-${crypto.randomUUID()}`;
      const optimistic: Item = {
        id: tempId,
        userId,
        parentId: currentFolderId,
        type: fields.type,
        name: fields.name,
        url: fields.url,
        icon: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setItems((prev) => [...prev, optimistic]);

      const { data, error } = await supabase
        .from("items")
        .insert({
          user_id: userId,
          parent_id: currentFolderId,
          type: fields.type,
          name: fields.name,
          url: fields.url ?? undefined,
        })
        .select()
        .single();

      if (error || !data) {
        setItems((prev) => prev.filter((i) => i.id !== tempId));
        return;
      }
      setItems((prev) =>
        prev.map((i) => (i.id === tempId ? rowToItem(data) : i))
      );
    },
    [supabase, userId, currentFolderId]
  );

  const createFolder = useCallback(
    (name: string) => createItem({ type: "folder", name, url: null }),
    [createItem]
  );

  const createBookmark = useCallback(
    (name: string, url: string) =>
      createItem({ type: "bookmark", name, url: normalizeUrl(url) }),
    [createItem]
  );

  const renameItem = useCallback(
    async (id: string, newName: string) => {
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, name: newName } : i))
      );
      await supabase.from("items").update({ name: newName }).eq("id", id);
    },
    [supabase]
  );

  const deleteItem = useCallback(
    async (id: string) => {
      setItems((prev) => prev.filter((i) => i.id !== id));
      await supabase.from("items").delete().eq("id", id);
    },
    [supabase]
  );

  return {
    items,
    loading,
    getChildren,
    getItemById,
    getPath,
    createFolder,
    createBookmark,
    renameItem,
    deleteItem,
  };
}
