"use client";

import { useEffect, useRef, useState } from "react";
import CreateFolderDialog from "@/components/dialogs/CreateFolderDialog";
import CreateBookmarkDialog from "@/components/dialogs/CreateBookmarkDialog";
import RenameDialog from "@/components/dialogs/RenameDialog";
import DeleteDialog from "@/components/dialogs/DeleteDialog";
import ItemMenuDialog from "@/components/dialogs/ItemMenuDialog";
import UrlConfirmDialog from "@/components/dialogs/UrlConfirmDialog";
import type { Item, ModalState } from "@/types";

interface ModalManagerProps {
  modal: ModalState;
  onClose: () => void;
  onCreateFolder: (name: string) => void;
  onCreateBookmark: (name: string, url: string) => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onOpenLink: (item: Item) => void;
  onEditRequest: (item: Item) => void;
  onDeleteRequest: (item: Item) => void;
  urlConfirmItem: Item | null;
  onCloseUrlConfirm: () => void;
  onConfirmOpenLink: (item: Item) => void;
}

export default function ModalManager({
  modal,
  onClose,
  onCreateFolder,
  onCreateBookmark,
  onRename,
  onDelete,
  onOpenLink,
  onEditRequest,
  onDeleteRequest,
  urlConfirmItem,
  onCloseUrlConfirm,
  onConfirmOpenLink,
}: ModalManagerProps) {
  const [folderName, setFolderName] = useState("");
  const [bookmarkTitle, setBookmarkTitle] = useState("");
  const [bookmarkUrl, setBookmarkUrl] = useState("");
  const [renameValue, setRenameValue] = useState("");

  const folderInputRef = useRef<HTMLInputElement>(null);
  const bookmarkTitleRef = useRef<HTMLInputElement>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (modal.type === "create-folder") {
      setFolderName("");
      setTimeout(() => folderInputRef.current?.focus(), 100);
    } else if (modal.type === "create-bookmark") {
      setBookmarkTitle("");
      setBookmarkUrl("");
      setTimeout(() => bookmarkTitleRef.current?.focus(), 100);
    } else if (modal.type === "rename" && modal.item) {
      setRenameValue(modal.item.name);
      setTimeout(() => renameInputRef.current?.focus(), 100);
    }
  }, [modal]);

  return (
    <>
      <CreateFolderDialog
        open={modal.type === "create-folder"}
        onClose={onClose}
        value={folderName}
        onChange={setFolderName}
        onCreate={onCreateFolder}
        inputRef={folderInputRef}
      />

      <CreateBookmarkDialog
        open={modal.type === "create-bookmark"}
        onClose={onClose}
        title={bookmarkTitle}
        onTitleChange={setBookmarkTitle}
        url={bookmarkUrl}
        onUrlChange={setBookmarkUrl}
        onCreate={onCreateBookmark}
        titleInputRef={bookmarkTitleRef}
      />

      <RenameDialog
        open={modal.type === "rename"}
        onClose={onClose}
        item={modal.item}
        value={renameValue}
        onChange={setRenameValue}
        onRename={onRename}
        inputRef={renameInputRef}
      />

      <DeleteDialog
        open={modal.type === "delete"}
        onClose={onClose}
        item={modal.item}
        onDelete={onDelete}
      />

      <ItemMenuDialog
        open={modal.type === "item-menu"}
        onClose={onClose}
        item={modal.item}
        onOpenLink={onOpenLink}
        onEditRequest={onEditRequest}
        onDeleteRequest={onDeleteRequest}
      />

      <UrlConfirmDialog
        item={urlConfirmItem}
        onClose={onCloseUrlConfirm}
        onConfirm={onConfirmOpenLink}
      />
    </>
  );
}
