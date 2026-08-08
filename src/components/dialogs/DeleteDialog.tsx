"use client";

import Modal from "@/components/Modal";
import { DialogIcon, FilledButton, TextButton } from "./primitives";
import { AlertIcon, TrashIcon } from "@/components/icons";
import type { Item } from "@/types";

interface DeleteDialogProps {
  open: boolean;
  onClose: () => void;
  item: Item | undefined;
  onDelete: (id: string) => void;
}

export default function DeleteDialog({
  open,
  onClose,
  item,
  onDelete,
}: DeleteDialogProps) {
  return (
    <Modal open={open} onClose={onClose} labelledBy="modal-title-delete">
      <div className="flex flex-col items-center text-center gap-3 mb-2">
        <DialogIcon tone="error">
          <AlertIcon size={26} />
        </DialogIcon>
        <h2 id="modal-title-delete" className="type-headline-sm text-[var(--md-on-surface)]">
          Delete {item?.type === "folder" ? "folder" : "bookmark"}?
        </h2>
        <p className="type-body-md text-[var(--md-on-surface-variant)]">
          {item?.type === "folder"
            ? `"${item?.name}" and everything inside it will be permanently deleted.`
            : `"${item?.name}" will be permanently deleted.`}
        </p>
      </div>
      <div className="flex gap-2 mt-6">
        <TextButton onClick={onClose}>Cancel</TextButton>
        <FilledButton
          tone="error"
          onClick={() => {
            if (item) {
              onDelete(item.id);
              onClose();
            }
          }}
        >
          <TrashIcon size={16} />
          Delete
        </FilledButton>
      </div>
    </Modal>
  );
}
