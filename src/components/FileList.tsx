import { useRef, useCallback, useEffect, useState } from 'react';
import { 
  Folder, 
  FolderOpen, 
  ArrowUp, 
  Globe, 
  Camera, 
  Briefcase, 
  Building2, 
  Headphones,
  FileQuestion,
  MoreVertical
} from 'lucide-react';
import { useBookmarks } from '@/contexts/BookmarkContext';
import type { FileSystemItem, Folder as FolderType, Bookmark } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// Icon mapping for folder overlays
const folderIcons: Record<string, React.ElementType> = {
  Camera,
  Briefcase,
  Building2,
  Headphones,
  Folder: FolderOpen,
  default: FileQuestion,
};

interface FileListProps {}

export default function FileList({}: FileListProps) {
  const {
    currentItems,
    currentFolderId,
    selectedItems,
    toggleSelection,
    clearSelection,
    navigateTo,
    navigateUp,
    getChildren,
    getFaviconUrl,
    openModal,
    setContextMenuItem,
    searchQuery,
  } = useBookmarks();

  const listRef = useRef<HTMLDivElement>(null);
  const [longPressTimer, setLongPressTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [touchStartPos, setTouchStartPos] = useState<{ x: number; y: number } | null>(null);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        clearSelection();
      }
      
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedItems.size > 0) {
        openModal('delete', Array.from(selectedItems));
      }
      
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'a') {
          e.preventDefault();
          // Select all would be implemented here
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [clearSelection, openModal, selectedItems]);

  const handleItemClick = useCallback((item: FileSystemItem, e: React.MouseEvent | React.TouchEvent) => {
    // Don't navigate if we're in selection mode
    if (selectedItems.size > 0 || e.shiftKey || e.ctrlKey || e.metaKey) {
      toggleSelection(item.id);
      return;
    }

    if (item.type === 'folder') {
      navigateTo(item.id);
    } else {
      openModal('url-confirm', item);
    }
  }, [selectedItems.size, toggleSelection, navigateTo, openModal]);

  const handleIconClick = useCallback((item: FileSystemItem, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSelection(item.id);
  }, [toggleSelection]);

  const handleContextMenu = useCallback((item: FileSystemItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!selectedItems.has(item.id)) {
      toggleSelection(item.id);
    }
    
    setContextMenuItem(item);
    openModal('context', item);
  }, [selectedItems, toggleSelection, setContextMenuItem, openModal]);

  // Long press handling for mobile
  const handleTouchStart = useCallback((item: FileSystemItem, e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStartPos({ x: touch.clientX, y: touch.clientY });
    
    const timer = setTimeout(() => {
      if (!selectedItems.has(item.id)) {
        toggleSelection(item.id);
      }
      setContextMenuItem(item);
      openModal('context', item);
    }, 500);
    
    setLongPressTimer(timer);
  }, [selectedItems, toggleSelection, setContextMenuItem, openModal]);

  const handleTouchEnd = useCallback(() => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    setTouchStartPos(null);
  }, [longPressTimer]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartPos) return;
    
    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStartPos.x);
    const deltaY = Math.abs(touch.clientY - touchStartPos.y);
    
    // Cancel long press if moved too much
    if (deltaX > 10 || deltaY > 10) {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        setLongPressTimer(null);
      }
    }
  }, [touchStartPos, longPressTimer]);

  const renderFolderIcon = (folder: FolderType) => {
    const IconComponent = folder.iconOverlay 
      ? (folderIcons[folder.iconOverlay] || folderIcons.default)
      : FolderOpen;

    return (
      <div className="pl-4 "folder-icon-container">
        <Folder className="pl-4 "folder-bg-icon" size={40} />
        <div className="pl-4 "folder-overlay">
          <IconComponent size={16} />
        </div>
      </div>
    );
  };

  const renderBookmarkIcon = (bookmark: Bookmark) => {
    const faviconUrl = getFaviconUrl(bookmark.url);
    
    return (
      <div className="pl-4 "bookmark-icon-container">
        {faviconUrl ? (
          <img 
            src={faviconUrl} 
            alt="" 
            className="pl-4 "bookmark-favicon"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <Globe size={24} className="pl-4 "bookmark-fallback-icon" />
        )}
      </div>
    );
  };

  const renderItem = (item: FileSystemItem) => {
    const isSelected = selectedItems.has(item.id);
    const childCount = item.type === 'folder' ? getChildren(item.id).length : 0;
    const subtitle = item.type === 'folder' 
      ? `${childCount} item${childCount !== 1 ? 's' : ''}`
      : (item as Bookmark).url;

    return (
      <div
        key={item.id}
        className="pl-4 {cn(
          'file-item',
          isSelected && 'selected'
        )}
        onClick={(e) => handleItemClick(item, e)}
        onContextMenu={(e) => handleContextMenu(item, e)}
        onTouchStart={(e) => handleTouchStart(item, e)}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
        role="listitem"
        aria-selected={isSelected}
        aria-label={`${item.name}, ${item.type}`}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleItemClick(item, e as unknown as React.MouseEvent);
          }
        }}
      >
        {/* Icon Area */}
        <button
          className="pl-4 {cn(
            'item-icon-area',
            isSelected && 'selected'
          )}
          onClick={(e) => handleIconClick(item, e)}
          aria-label={isSelected ? 'Deselect item' : 'Select item'}
          aria-pressed={isSelected}
        >
          {item.type === 'folder' 
            ? renderFolderIcon(item as FolderType)
            : renderBookmarkIcon(item as Bookmark)
          }
        </button>

        {/* Content Area */}
        <div className="pl-4 "item-content">
          <span className="pl-4 "md-body-large item-name">{item.name}</span>
          <span className="pl-4 "md-body-small item-subtitle" title={subtitle}>
            {subtitle}
          </span>
        </div>

        {/* Date */}
        <span className="pl-4 "md-label-small item-date">{item.date}</span>

        {/* Actions */}
        <Button
          variant="ghost"
          size="icon"
          className="pl-4 "item-actions-btn"
          onClick={(e) => {
            e.stopPropagation();
            setContextMenuItem(item);
            openModal('context', item);
          }}
          aria-label={`Options for ${item.name}`}
        >
          <MoreVertical size={18} />
        </Button>
      </div>
    );
  };

  const showUpItem = currentFolderId !== 'root' && !searchQuery;

  return (
    <div 
      ref={listRef}
      className="pl-4 "file-list"
      role="list"
      aria-label="File list"
      aria-multiselectable="true"
    >
      {/* Up/Back Item */}
      {showUpItem && (
        <div
          className="pl-4 "file-item up-item"
          onClick={navigateUp}
          role="listitem"
          aria-label="Go to parent folder"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              navigateUp();
            }
          }}
        >
          <div className="pl-4 "item-icon-area">
            <div className="pl-4 "folder-icon-container up">
              <Folder className="pl-4 "folder-bg-icon" size={40} />
              <div className="pl-4 "folder-overlay up-overlay">
                <ArrowUp size={16} />
              </div>
            </div>
          </div>
          <div className="pl-4 "item-content">
            <span className="pl-4 "md-body-large item-name">..</span>
            <span className="pl-4 "md-body-small item-subtitle">Parent folder</span>
          </div>
        </div>
      )}

      {/* Items */}
      {currentItems.map(renderItem)}

      {/* Empty State */}
      {currentItems.length === 0 && (
        <div className="pl-4 "empty-state" role="status" aria-live="polite">
          <Folder className="pl-4 "empty-icon" size={48} />
          <p className="pl-4 "md-body-large empty-title">
            {searchQuery ? 'No results found' : 'This folder is empty'}
          </p>
          <p className="pl-4 "md-body-medium empty-subtitle">
            {searchQuery 
              ? 'Try adjusting your search terms'
              : 'Create a new folder or bookmark to get started'
            }
          </p>
        </div>
      )}
    </div>
  );
}
