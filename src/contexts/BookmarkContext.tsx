import { createContext, useContext, useState, useCallback, type ReactNode, useMemo } from 'react';
import type { 
  FileSystemItem, 
  Folder, 
  Bookmark, 
  SortMode, 
  ClipboardState,
  SearchFilter,
  ContextMenuOption 
} from '@/types';

// Initial mock data
const initialFileSystem: FileSystemItem[] = [
  {
    id: 'root',
    name: 'Bookmark Pro',
    type: 'folder',
    parentId: null,
    date: new Date().toLocaleDateString('en-GB'),
  },
  {
    id: 'dcim',
    name: 'DCIM',
    type: 'folder',
    parentId: 'root',
    iconOverlay: 'Camera',
    date: new Date(Date.now() - 86400000 * 5).toLocaleDateString('en-GB'),
  },
  {
    id: 'docs',
    name: 'Documents',
    type: 'folder',
    parentId: 'root',
    iconOverlay: 'Briefcase',
    date: new Date(Date.now() - 86400000 * 3).toLocaleDateString('en-GB'),
  },
  {
    id: 'work_docs',
    name: 'Work Projects',
    type: 'folder',
    parentId: 'docs',
    iconOverlay: 'Building2',
    date: new Date(Date.now() - 86400000 * 2).toLocaleDateString('en-GB'),
  },
  {
    id: 'google_bm',
    name: 'Google Search',
    type: 'bookmark',
    url: 'https://google.com',
    parentId: 'root',
    date: new Date(Date.now() - 86400000 * 1).toLocaleDateString('en-GB'),
  },
  {
    id: 'github_bm',
    name: 'GitHub',
    type: 'bookmark',
    url: 'https://github.com',
    parentId: 'root',
    date: new Date().toLocaleDateString('en-GB'),
  },
  {
    id: 'music',
    name: 'Music',
    type: 'folder',
    parentId: 'root',
    iconOverlay: 'Headphones',
    date: new Date(Date.now() - 86400000 * 7).toLocaleDateString('en-GB'),
  },
];

interface BookmarkContextType {
  // Navigation
  currentFolderId: string;
  navigateTo: (folderId: string) => void;
  navigateUp: () => void;
  getPath: (folderId: string) => string[];
  
  // Data
  fileSystem: FileSystemItem[];
  currentItems: FileSystemItem[];
  currentFolder: Folder | null;
  
  // CRUD Operations
  createFolder: (name: string) => void;
  createBookmark: (name: string, url: string) => void;
  renameItem: (itemId: string, newName: string) => void;
  deleteItems: (itemIds: string[]) => void;
  
  // Selection
  selectedItems: Set<string>;
  toggleSelection: (itemId: string) => void;
  clearSelection: () => void;
  selectAll: () => void;
  
  // Clipboard
  clipboard: ClipboardState;
  copyItems: (itemIds: string[]) => void;
  cutItems: (itemIds: string[]) => void;
  pasteItems: () => void;
  clearClipboard: () => void;
  
  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchFilter: SearchFilter;
  setSearchFilter: (filter: SearchFilter) => void;
  searchResults: FileSystemItem[];
  
  // Sorting
  sortMode: SortMode;
  setSortMode: (mode: SortMode) => void;
  sortDirection: 'asc' | 'desc';
  toggleSortDirection: () => void;
  
  // Modals
  activeModal: string | null;
  modalData: unknown;
  openModal: (type: string, data?: unknown) => void;
  closeModal: () => void;
  
  // Context Menu
  contextMenuItem: FileSystemItem | null;
  setContextMenuItem: (item: FileSystemItem | null) => void;
  getContextMenuOptions: (item: FileSystemItem) => ContextMenuOption[];
  handleContextAction: (action: string) => void;
  
  // Utilities
  getChildren: (parentId: string) => FileSystemItem[];
  getItemById: (id: string) => FileSystemItem | undefined;
  getFaviconUrl: (url: string) => string;
  generateId: (name: string) => string;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

interface BookmarkProviderProps {
  children: ReactNode;
}

export function BookmarkProvider({ children }: BookmarkProviderProps) {
  // State
  const [fileSystem, setFileSystem] = useState<FileSystemItem[]>(initialFileSystem);
  const [currentFolderId, setCurrentFolderId] = useState<string>('root');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [clipboard, setClipboard] = useState<ClipboardState>({ items: [], action: null });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilter, setSearchFilter] = useState<SearchFilter>('all');
  const [sortMode, setSortMode] = useState<SortMode>('sort-by-name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [modalData, setModalData] = useState<unknown>(null);
  const [contextMenuItem, setContextMenuItem] = useState<FileSystemItem | null>(null);

  // Utilities
  const generateId = useCallback((name: string) => {
    return `${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  }, []);

  const getItemById = useCallback((id: string) => {
    return fileSystem.find(item => item.id === id);
  }, [fileSystem]);

  const getChildren = useCallback((parentId: string) => {
    return fileSystem.filter(item => item.parentId === parentId);
  }, [fileSystem]);

  const getPath = useCallback((folderId: string): string[] => {
    const path: string[] = [];
    let current = getItemById(folderId);
    
    while (current && current.parentId !== null) {
      path.unshift(current.name);
      current = getItemById(current.parentId);
    }
    
    return path;
  }, [getItemById]);

  const getFaviconUrl = useCallback((url: string) => {
    try {
      const hostname = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
      return `https://s2.googleusercontent.com/s2/favicons?domain=${hostname}&sz=32`;
    } catch {
      return '';
    }
  }, []);

  // Navigation
  const navigateTo = useCallback((folderId: string) => {
    setCurrentFolderId(folderId);
    setSelectedItems(new Set());
  }, []);

  const navigateUp = useCallback(() => {
    const current = getItemById(currentFolderId);
    if (current && current.parentId) {
      navigateTo(current.parentId);
    }
  }, [currentFolderId, getItemById, navigateTo]);

  // CRUD Operations
  const createFolder = useCallback((name: string) => {
    const newFolder: Folder = {
      id: generateId(name),
      name,
      type: 'folder',
      parentId: currentFolderId,
      date: new Date().toLocaleDateString('en-GB'),
      iconOverlay: 'Folder',
    };
    
    setFileSystem(prev => [...prev, newFolder]);
  }, [currentFolderId, generateId]);

  const createBookmark = useCallback((name: string, url: string) => {
    let finalUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      finalUrl = `https://${url}`;
    }
    
    const newBookmark: Bookmark = {
      id: generateId(name),
      name,
      type: 'bookmark',
      url: finalUrl,
      parentId: currentFolderId,
      date: new Date().toLocaleDateString('en-GB'),
    };
    
    setFileSystem(prev => [...prev, newBookmark]);
  }, [currentFolderId, generateId]);

  const renameItem = useCallback((itemId: string, newName: string) => {
    setFileSystem(prev => prev.map(item => 
      item.id === itemId ? { ...item, name: newName } : item
    ));
  }, []);

  const deleteItems = useCallback((itemIds: string[]) => {
    const deleteRecursively = (id: string) => {
      const children = fileSystem.filter(i => i.parentId === id);
      children.forEach(child => deleteRecursively(child.id));
      setFileSystem(prev => prev.filter(i => i.id !== id));
    };
    
    itemIds.forEach(id => deleteRecursively(id));
    setSelectedItems(new Set());
  }, [fileSystem]);

  // Selection
  const toggleSelection = useCallback((itemId: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedItems(new Set());
  }, []);

  const selectAll = useCallback(() => {
    const items = getChildren(currentFolderId);
    setSelectedItems(new Set(items.map(item => item.id)));
  }, [currentFolderId, getChildren]);

  // Clipboard
  const copyItems = useCallback((itemIds: string[]) => {
    const items = fileSystem.filter(item => itemIds.includes(item.id));
    setClipboard({ items, action: 'copy' });
    setSelectedItems(new Set());
  }, [fileSystem]);

  const cutItems = useCallback((itemIds: string[]) => {
    const items = fileSystem.filter(item => itemIds.includes(item.id));
    setClipboard({ items, action: 'cut' });
    setSelectedItems(new Set());
  }, [fileSystem]);

  const pasteItems = useCallback(() => {
    if (clipboard.items.length === 0) return;

    clipboard.items.forEach(item => {
      if (clipboard.action === 'cut') {
        // Move item
        setFileSystem(prev => prev.map(i => 
          i.id === item.id ? { ...i, parentId: currentFolderId } : i
        ));
      } else if (clipboard.action === 'copy') {
        // Copy item recursively
        const copyRecursively = (itemToCopy: FileSystemItem, newParentId: string) => {
          const newId = generateId(itemToCopy.name);
          const newItem = { 
            ...itemToCopy, 
            id: newId, 
            parentId: newParentId,
            date: new Date().toLocaleDateString('en-GB'),
          };
          
          setFileSystem(prev => [...prev, newItem]);

          if (itemToCopy.type === 'folder') {
            const children = fileSystem.filter(i => i.parentId === itemToCopy.id);
            children.forEach(child => copyRecursively(child, newId));
          }
        };
        
        copyRecursively(item, currentFolderId);
      }
    });

    setClipboard({ items: [], action: null });
  }, [clipboard, currentFolderId, fileSystem, generateId]);

  const clearClipboard = useCallback(() => {
    setClipboard({ items: [], action: null });
  }, []);

  // Sorting
  const toggleSortDirection = useCallback(() => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  }, []);

  // Modals
  const openModal = useCallback((type: string, data?: unknown) => {
    setActiveModal(type);
    setModalData(data);
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
    setModalData(null);
  }, []);

  // Context Menu Options
  const getContextMenuOptions = useCallback((item: FileSystemItem): ContextMenuOption[] => {
    const isMultiSelect = selectedItems.size > 1;
    const options: ContextMenuOption[] = [];

    if (!isMultiSelect) {
      options.push({
        action: 'open',
        icon: item.type === 'folder' ? 'FolderOpen' : 'ExternalLink',
        text: item.type === 'folder' ? 'Open' : 'Open Link',
        shortcut: 'Enter',
      });

      if (item.type === 'bookmark') {
        options.push({
          action: 'open-new-tab',
          icon: 'ExternalLink',
          text: 'Open in New Tab',
          shortcut: 'Ctrl+Enter',
        });
      }

      options.push({
        action: 'rename',
        icon: 'Pencil',
        text: 'Rename',
        shortcut: 'F2',
      });
    }

    options.push(
      { action: 'copy', icon: 'Copy', text: 'Copy', shortcut: 'Ctrl+C' },
      { action: 'cut', icon: 'Scissors', text: 'Cut', shortcut: 'Ctrl+X' },
      { action: 'delete', icon: 'Trash2', text: 'Delete', shortcut: 'Delete' }
    );

    return options;
  }, [selectedItems.size]);

  // Handle context menu actions
  const handleContextAction = useCallback((action: string) => {
    const item = contextMenuItem;
    if (!item && selectedItems.size === 0) return;

    switch (action) {
      case 'open':
        if (item) {
          if (item.type === 'folder') {
            navigateTo(item.id);
          } else {
            openModal('url-confirm', item);
          }
        }
        break;
        
      case 'open-new-tab':
        if (item && item.type === 'bookmark') {
          window.open(item.url, '_blank');
        }
        break;
        
      case 'rename':
        if (item) {
          openModal('rename', item);
        }
        break;
        
      case 'delete':
        if (selectedItems.size > 0) {
          openModal('delete', Array.from(selectedItems));
        } else if (item) {
          openModal('delete', [item.id]);
        }
        break;
        
      case 'copy':
        if (selectedItems.size > 0) {
          copyItems(Array.from(selectedItems));
        } else if (item) {
          copyItems([item.id]);
        }
        break;
        
      case 'cut':
        if (selectedItems.size > 0) {
          cutItems(Array.from(selectedItems));
        } else if (item) {
          cutItems([item.id]);
        }
        break;
    }
  }, [contextMenuItem, selectedItems, navigateTo, openModal, copyItems, cutItems]);

  // Computed values
  const currentFolder = useMemo(() => {
    const item = getItemById(currentFolderId);
    return item?.type === 'folder' ? item : null;
  }, [currentFolderId, getItemById]);

  const sortedItems = useMemo(() => {
    let items = getChildren(currentFolderId);
    
    items.sort((a, b) => {
      let comparison = 0;
      
      switch (sortMode) {
        case 'sort-by-name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'sort-by-date':
          const dateA = new Date(a.date.split('/').reverse().join('-'));
          const dateB = new Date(b.date.split('/').reverse().join('-'));
          comparison = dateB.getTime() - dateA.getTime();
          break;
        case 'sort-by-type':
          comparison = a.type === b.type ? 0 : a.type === 'folder' ? -1 : 1;
          break;
        case 'sort-by-size':
          const sizeA = a.type === 'folder' ? getChildren(a.id).length : 0;
          const sizeB = b.type === 'folder' ? getChildren(b.id).length : 0;
          comparison = sizeB - sizeA;
          break;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    // Always show folders first when sorting by name
    if (sortMode === 'sort-by-name') {
      items.sort((a, b) => {
        if (a.type === 'folder' && b.type !== 'folder') return -1;
        if (a.type !== 'folder' && b.type === 'folder') return 1;
        return sortDirection === 'asc' 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name);
      });
    }
    
    return items;
  }, [currentFolderId, getChildren, sortMode, sortDirection]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    return fileSystem.filter(item => {
      if (item.id === 'root') return false;
      
      const matchesQuery = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = searchFilter === 'all' || item.type === searchFilter;
      
      return matchesQuery && matchesFilter;
    });
  }, [fileSystem, searchQuery, searchFilter]);

  const currentItems = useMemo(() => {
    return searchQuery.trim() ? searchResults : sortedItems;
  }, [searchQuery, searchResults, sortedItems]);

  const value: BookmarkContextType = {
    currentFolderId,
    navigateTo,
    navigateUp,
    getPath,
    fileSystem,
    currentItems,
    currentFolder,
    createFolder,
    createBookmark,
    renameItem,
    deleteItems,
    selectedItems,
    toggleSelection,
    clearSelection,
    selectAll,
    clipboard,
    copyItems,
    cutItems,
    pasteItems,
    clearClipboard,
    searchQuery,
    setSearchQuery,
    searchFilter,
    setSearchFilter,
    searchResults,
    sortMode,
    setSortMode,
    sortDirection,
    toggleSortDirection,
    activeModal,
    modalData,
    openModal,
    closeModal,
    contextMenuItem,
    setContextMenuItem,
    getContextMenuOptions,
    handleContextAction,
    getChildren,
    getItemById,
    getFaviconUrl,
    generateId,
  };

  return (
    <BookmarkContext.Provider value={value}>
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks() {
  const context = useContext(BookmarkContext);
  if (context === undefined) {
    throw new Error('useBookmarks must be used within a BookmarkProvider');
  }
  return context;
}
