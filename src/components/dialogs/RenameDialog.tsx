"use client";

import type { RefObject } from "react";
import Modal from "@/components/Modal";
import { DialogIcon, FilledButton, M3TextField, TextButton } from "./primitives";
import { PencilIcon } from "@/components/icons";
import type { Item } from "@/types";

interface RenameDialogProps {
  open: boolean;
  onClose: () => void;
  item: Item | undefined;
  value: string;
  onChange: (v: string) => void;
  onRename: (id: string, name: string) => void;
  inputRef: RefObject<HTMLInputElement | null>;
}

export default function RenameDialog({
  open,
  onClose,
  item,
  value,
  onChange,
  onRename,
  inputRef,
}: RenameDialogProps) {
  return (
    <Modal open={open} onClose={onClose} labelledBy="modal-title-rename">
      <div className="flex flex-col items-center text-center gap-3 mb-5">
        <DialogIcon tone="primary">
          <PencilIcon size={24} />
        </DialogIcon>
        <h2 id="modal-title-rename" className="type-headline-sm text-[var(--md-on-surface)]">
          Rename
        </h2>
      </div>
      <M3TextField
        inputRef={inputRef}
        value={value}
        onChange={onChange}
        onKeyDown={(e) => {
          if (e.key === "Enter" && item && value.trim()) {
            onRename(item.id, value.trim());
            onClose();
          }
        }}
        placeholder="New name"
        ariaLabel="New name"
      />
      <div className="flex gap-2 mt-6">
        <TextButton onClick={onClose}>Cancel</TextButton>
        <FilledButton
          onClick={() => {
            if (item && value.trim()) {
              onRename(item.id, value.trim());
              onClose();
            }
          }}
          disabled={!value.trim()}
        >
          Save
        </FilledButton>
      </div>
    </Modal>
  );
}
