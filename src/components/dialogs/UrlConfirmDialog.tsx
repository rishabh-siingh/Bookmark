"use client";

import Modal from "@/components/Modal";
import { DialogIcon, FilledButton, TextButton } from "./primitives";
import { ExternalLinkIcon } from "@/components/icons";
import type { Item } from "@/types";

interface UrlConfirmDialogProps {
  item: Item | null;
  onClose: () => void;
  onConfirm: (item: Item) => void;
}

export default function UrlConfirmDialog({
  item,
  onClose,
  onConfirm,
}: UrlConfirmDialogProps) {
  return (
    <Modal open={!!item} onClose={onClose} labelledBy="modal-title-url">
      <div className="flex flex-col items-center text-center gap-3 mb-2">
        <DialogIcon tone="primary">
          <ExternalLinkIcon size={24} />
        </DialogIcon>
        <h2 id="modal-title-url" className="type-headline-sm text-[var(--md-on-surface)]">
          Open link?
        </h2>
        <p className="type-body-md font-medium text-[var(--md-on-surface)] truncate max-w-full">
          {item?.name}
        </p>
        <p className="type-body-sm text-[var(--md-on-surface-variant)] truncate max-w-full">
          {item?.url}
        </p>
      </div>
      <div className="flex gap-2 mt-6">
        <TextButton onClick={onClose}>Cancel</TextButton>
        <FilledButton
          onClick={() => {
            if (item) onConfirm(item);
          }}
        >
          <ExternalLinkIcon size={16} />
          Open
        </FilledButton>
      </div>
    </Modal>
  );
}
