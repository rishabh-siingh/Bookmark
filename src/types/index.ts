// Bookmark Manager Types

export type ItemType = 'folder' | 'bookmark';

export interface BaseItem {
  id: string;
  name: string;
  type: ItemType;
  parentId: string | null;
  date: string;
}

export interface Folder extends BaseItem {
  type: 'folder';
  iconOverlay?: string;
  items?: number;
}

export interface Bookmark extends BaseItem {
  type: 'bookmark';
  url: string;
}

export type FileSystemItem = Folder | Bookmark;

export type SortMode = 'sort-by-name' | 'sort-by-date' | 'sort-by-type' | 'sort-by-size';

export type ClipboardAction = 'cut' | 'copy' | null;

export interface ClipboardState {
  items: FileSystemItem[];
  action: ClipboardAction;
}

export type SearchFilter = 'folder' | 'bookmark' | 'all';

export interface ThemeState {
  mode: 'light' | 'dark';
}

export interface ModalState {
  isOpen: boolean;
  type: 'folder' | 'bookmark' | 'rename' | 'delete' | 'url-confirm' | 'about' | 'context' | null;
}

export interface ContextMenuOption {
  action: string;
  icon: string;
  text: string;
  shortcut?: string;
}
