"use client";

import Modal from "@/components/Modal";
import {
  ExternalLinkIcon,
  FolderIcon,
  GlobeIcon,
  PencilIcon,
  TrashIcon,
} from "@/components/icons";
import type { Item } from "@/types";

interface ItemMenuDialogProps {
  open: boolean;
  onClose: () => void;
  item: Item | undefined;
  onOpenLink: (item: Item) => void;
  onEditRequest: (item: Item) => void;
  onDeleteRequest: (item: Item) => void;
}

export default function ItemMenuDialog({
  open,
  onClose,
  item,
  onOpenLink,
  onEditRequest,
  onDeleteRequest,
}: ItemMenuDialogProps) {
  return (
    <Modal open={open} onClose={onClose} labelledBy="modal-title-item">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-11 h-11 rounded-full bg-[var(--md-surface-container-highest)] flex items-center justify-center shrink-0">
          {item?.type === "folder" ? (
            <FolderIcon size={20} className="text-[var(--md-primary)]" />
          ) : (
            <GlobeIcon size={18} className="text-[var(--md-tertiary)]" />
          )}
        </div>
        <h2 id="modal-title-item" className="type-title-lg text-[var(--md-on-surface)] truncate">
          {item?.name}
        </h2>
      </div>
      <div className="flex flex-col gap-1 -mx-2">
        {item?.type === "bookmark" && (
          <button
            onClick={() => {
              if (item) onOpenLink(item);
              onClose();
            }}
            className="state-layer flex items-center gap-4 px-4 h-14 rounded-2xl type-body-lg text-[var(--md-on-surface)] text-left"
          >
            <ExternalLinkIcon size={20} className="text-[var(--md-on-surface-variant)]" />
            Open link
          </button>
        )}
        <button
          onClick={() => {
            if (item) onEditRequest(item);
          }}
          className="state-layer flex items-center gap-4 px-4 h-14 rounded-2xl type-body-lg text-[var(--md-on-surface)] text-left"
        >
          <PencilIcon size={20} className="text-[var(--md-on-surface-variant)]" />
          Rename
        </button>
        <button
          onClick={() => {
            if (item) onDeleteRequest(item);
          }}
          className="state-layer flex items-center gap-4 px-4 h-14 rounded-2xl type-body-lg text-[var(--md-error)] text-left"
        >
          <TrashIcon size={20} />
          Delete
        </button>
      </div>
    </Modal>
  );
}
