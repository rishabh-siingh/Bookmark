"use client";

import type { RefObject } from "react";
import Modal from "@/components/Modal";
import { DialogIcon, FilledButton, M3TextField, TextButton } from "./primitives";
import { FolderIcon } from "@/components/icons";

interface CreateFolderDialogProps {
  open: boolean;
  onClose: () => void;
  value: string;
  onChange: (v: string) => void;
  onCreate: (name: string) => void;
  inputRef: RefObject<HTMLInputElement | null>;
}

export default function CreateFolderDialog({
  open,
  onClose,
  value,
  onChange,
  onCreate,
  inputRef,
}: CreateFolderDialogProps) {
  return (
    <Modal open={open} onClose={onClose} labelledBy="modal-title-folder">
      <div className="flex flex-col items-center text-center gap-3 mb-5">
        <DialogIcon tone="primary">
          <FolderIcon size={26} />
        </DialogIcon>
        <h2 id="modal-title-folder" className="type-headline-sm text-[var(--md-on-surface)]">
          New folder
        </h2>
      </div>
      <M3TextField
        inputRef={inputRef}
        value={value}
        onChange={onChange}
        onKeyDown={(e) => {
          if (e.key === "Enter" && value.trim()) {
            onCreate(value.trim());
            onClose();
          }
        }}
        placeholder="Folder name"
        ariaLabel="Folder name"
      />
      <div className="flex gap-2 mt-6">
        <TextButton onClick={onClose}>Cancel</TextButton>
        <FilledButton
          onClick={() => {
            if (value.trim()) {
              onCreate(value.trim());
              onClose();
            }
          }}
          disabled={!value.trim()}
        >
          Create
        </FilledButton>
      </div>
    </Modal>
  );
}
