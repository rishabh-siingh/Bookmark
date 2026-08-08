"use client";

import type { RefObject } from "react";
import Modal from "@/components/Modal";
import { DialogIcon, FilledButton, M3TextField, TextButton } from "./primitives";
import { LinkPlusIcon } from "@/components/icons";

interface CreateBookmarkDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  onTitleChange: (v: string) => void;
  url: string;
  onUrlChange: (v: string) => void;
  onCreate: (title: string, url: string) => void;
  titleInputRef: RefObject<HTMLInputElement | null>;
}

export default function CreateBookmarkDialog({
  open,
  onClose,
  title,
  onTitleChange,
  url,
  onUrlChange,
  onCreate,
  titleInputRef,
}: CreateBookmarkDialogProps) {
  return (
    <Modal open={open} onClose={onClose} labelledBy="modal-title-bookmark">
      <div className="flex flex-col items-center text-center gap-3 mb-5">
        <DialogIcon tone="tertiary">
          <LinkPlusIcon size={26} />
        </DialogIcon>
        <h2 id="modal-title-bookmark" className="type-headline-sm text-[var(--md-on-surface)]">
          New bookmark
        </h2>
      </div>
      <div className="flex flex-col gap-3">
        <M3TextField
          inputRef={titleInputRef}
          value={title}
          onChange={onTitleChange}
          placeholder="Title"
          ariaLabel="Bookmark title"
        />
        <M3TextField
          value={url}
          onChange={onUrlChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && title.trim() && url.trim()) {
              onCreate(title.trim(), url.trim());
              onClose();
            }
          }}
          placeholder="https://example.com"
          ariaLabel="Bookmark URL"
        />
      </div>
      <div className="flex gap-2 mt-6">
        <TextButton onClick={onClose}>Cancel</TextButton>
        <FilledButton
          onClick={() => {
            if (title.trim() && url.trim()) {
              onCreate(title.trim(), url.trim());
              onClose();
            }
          }}
          disabled={!title.trim() || !url.trim()}
        >
          Create
        </FilledButton>
      </div>
    </Modal>
  );
}
