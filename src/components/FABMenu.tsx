import { useState, useRef, useEffect } from 'react';
import { Plus, Folder, Globe, ClipboardPaste, X } from 'lucide-react';
import { useBookmarks } from '@/contexts/BookmarkContext';
import { cn } from '@/lib/utils';

export default function FABMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { clipboard, pasteItems, openModal } = useBookmarks();

  const hasClipboardItems = clipboard.items.length > 0;

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle paste mode
  const handleMainClick = () => {
    if (hasClipboardItems) {
      pasteItems();
    } else {
      setIsOpen(!isOpen);
    }
  };

  const handleCreateFolder = () => {
    setIsOpen(false);
    openModal('folder');
  };

  const handleCreateBookmark = () => {
    setIsOpen(false);
    openModal('bookmark');
  };

  return (
    <div 
      ref={menuRef}
      className={cn(
        'fab-menu',
        isOpen && 'open',
        hasClipboardItems && 'paste-mode'
      )}
      role="region"
      aria-label="Floating action menu"
    >
      {/* Child Actions */}
      {!hasClipboardItems && (
        <>
          <button
            className={cn(
              'fab-child',
              'fab-folder',
              isOpen && 'visible'
            )}
            onClick={handleCreateFolder}
            aria-label="Create new folder"
            tabIndex={isOpen ? 0 : -1}
          >
            <span className="fab-label md-label-large">New Folder</span>
            <div className="fab-icon-container">
              <Folder size={20} />
            </div>
          </button>

          <button
            className={cn(
              'fab-child',
              'fab-bookmark',
              isOpen && 'visible'
            )}
            onClick={handleCreateBookmark}
            aria-label="Create new bookmark"
            tabIndex={isOpen ? 0 : -1}
          >
            <span className="fab-label md-label-large">New Bookmark</span>
            <div className="fab-icon-container">
              <Globe size={20} />
            </div>
          </button>
        </>
      )}

      {/* Main FAB */}
      <button
        className={cn(
          'fab-main',
          isOpen && 'open',
          hasClipboardItems && 'paste'
        )}
        onClick={handleMainClick}
        aria-label={hasClipboardItems 
          ? `Paste ${clipboard.items.length} item${clipboard.items.length !== 1 ? 's' : ''}` 
          : isOpen ? 'Close menu' : 'Open menu'
        }
        aria-expanded={isOpen}
        aria-haspopup={!hasClipboardItems}
      >
        {hasClipboardItems ? (
          <ClipboardPaste size={24} />
        ) : isOpen ? (
          <X size={24} />
        ) : (
          <Plus size={24} />
        )}
      </button>

      {/* Paste Badge */}
      {hasClipboardItems && (
        <span className="fab-badge md-label-small">
          {clipboard.items.length}
        </span>
      )}
    </div>
  );
}
