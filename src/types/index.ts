import type { ItemType } from "./database";

export type { ItemType };

export interface Item {
  id: string;
  userId: string;
  parentId: string | null;
  type: ItemType;
  name: string;
  url: string | null;
  icon: string | null;
  createdAt: string;
  updatedAt: string;
}

export type SortMode = "name" | "date" | "type";
export type SortDirection = "asc" | "desc";
export type SearchFilter = "all" | "folder" | "bookmark";

export interface ModalState {
  type:
    | "create-folder"
    | "create-bookmark"
    | "rename"
    | "delete"
    | "item-menu"
    | null;
  item?: Item;
}
