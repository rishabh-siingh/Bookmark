import { useEffect, useRef, useState } from 'react';
import { 
  Folder, 
  Globe, 
  Pencil, 
  Trash2, 
  ExternalLink, 
  Bookmark,
  Check,
  AlertTriangle
} from 'lucide-react';
import { useBookmarks } from '@/contexts/BookmarkContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

export default function ModalManager() {
  const { 
    activeModal, 
    closeModal, 
    createFolder, 
    createBookmark, 
    renameItem, 
    deleteItems,
    modalData,
    contextMenuItem,
    getContextMenuOptions,
    handleContextAction,
  } = useBookmarks();

  // Form states
  const [folderName, setFolderName] = useState('');
  const [bookmarkTitle, setBookmarkTitle] = useState('');
  const [bookmarkUrl, setBookmarkUrl] = useState('');
  const [renameValue, setRenameValue] = useState('');

  // Refs for focus management
  const folderInputRef = useRef<HTMLInputElement>(null);
  const bookmarkTitleRef = useRef<HTMLInputElement>(null);
  const bookmarkUrlRef = useRef<HTMLInputElement>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);

  // Focus inputs when modals open
  useEffect(() => {
    if (activeModal === 'folder') {
      setTimeout(() => folderInputRef.current?.focus(), 100);
    } else if (activeModal === 'bookmark') {
      setTimeout(() => bookmarkTitleRef.current?.focus(), 100);
    } else if (activeModal === 'rename' && contextMenuItem) {
      setRenameValue(contextMenuItem.name);
      setTimeout(() => renameInputRef.current?.focus(), 100);
    }
  }, [activeModal, contextMenuItem]);

  // Reset forms when modals close
  useEffect(() => {
    if (!activeModal) {
      setFolderName('');
      setBookmarkTitle('');
      setBookmarkUrl('');
      setRenameValue('');
    }
  }, [activeModal]);

  // Handle form submissions
  const handleCreateFolder = () => {
    if (folderName.trim()) {
      createFolder(folderName.trim());
      closeModal();
    }
  };

  const handleCreateBookmark = () => {
    if (bookmarkTitle.trim() && bookmarkUrl.trim()) {
      createBookmark(bookmarkTitle.trim(), bookmarkUrl.trim());
      closeModal();
    }
  };

  const handleRename = () => {
    if (renameValue.trim() && contextMenuItem) {
      renameItem(contextMenuItem.id, renameValue.trim());
      closeModal();
    }
  };

  const handleDelete = () => {
    const itemsToDelete = Array.isArray(modalData) ? modalData : 
      contextMenuItem ? [contextMenuItem.id] : [];
    
    if (itemsToDelete.length > 0) {
      deleteItems(itemsToDelete);
      closeModal();
    }
  };

  const handleOpenUrl = () => {
    if (modalData && (modalData as { url?: string }).url) {
      window.open((modalData as { url: string }).url, '_blank');
      closeModal();
    }
  };

  // Context menu action handler
  const handleContextMenuAction = (action: string) => {
    handleContextAction(action);
    closeModal();
  };

  // Render Create Folder Modal
  const renderFolderModal = () => (
    <Dialog open={activeModal === 'folder'} onOpenChange={closeModal}>
      <DialogContent className="modal-content">
        <DialogHeader>
          <div className="modal-icon folder-icon">
            <Folder size={32} />
          </div>
          <DialogTitle className="md-headline-small modal-title">
            Create New Folder
          </DialogTitle>
        </DialogHeader>
        <div className="modal-body">
          <Input
            ref={folderInputRef}
            type="text"
            placeholder="Folder name"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreateFolder();
            }}
            className="modal-input"
            aria-label="Folder name"
          />
        </div>
        <DialogFooter className="modal-footer">
          <Button variant="ghost" onClick={closeModal} className="modal-btn-secondary">
            Cancel
          </Button>
          <Button 
            onClick={handleCreateFolder} 
            disabled={!folderName.trim()}
            className="modal-btn-primary"
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // Render Create Bookmark Modal
  const renderBookmarkModal = () => (
    <Dialog open={activeModal === 'bookmark'} onOpenChange={closeModal}>
      <DialogContent className="modal-content">
        <DialogHeader>
          <div className="modal-icon bookmark-icon">
            <Globe size={32} />
          </div>
          <DialogTitle className="md-headline-small modal-title">
            Create New Bookmark
          </DialogTitle>
        </DialogHeader>
        <div className="modal-body">
          <Input
            ref={bookmarkTitleRef}
            type="text"
            placeholder="Title"
            value={bookmarkTitle}
            onChange={(e) => setBookmarkTitle(e.target.value)}
            className="modal-input"
            aria-label="Bookmark title"
          />
          <Input
            ref={bookmarkUrlRef}
            type="url"
            placeholder="URL (e.g., https://example.com)"
            value={bookmarkUrl}
            onChange={(e) => setBookmarkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreateBookmark();
            }}
            className="modal-input"
            aria-label="Bookmark URL"
          />
        </div>
        <DialogFooter className="modal-footer">
          <Button variant="ghost" onClick={closeModal} className="modal-btn-secondary">
            Cancel
          </Button>
          <Button 
            onClick={handleCreateBookmark}
            disabled={!bookmarkTitle.trim() || !bookmarkUrl.trim()}
            className="modal-btn-primary"
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // Render Rename Modal
  const renderRenameModal = () => (
    <Dialog open={activeModal === 'rename'} onOpenChange={closeModal}>
      <DialogContent className="modal-content">
        <DialogHeader>
          <div className="modal-icon rename-icon">
            <Pencil size={32} />
          </div>
          <DialogTitle className="md-headline-small modal-title">
            Rename Item
          </DialogTitle>
        </DialogHeader>
        <div className="modal-body">
          <Input
            ref={renameInputRef}
            type="text"
            placeholder="New name"
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRename();
            }}
            className="modal-input"
            aria-label="New name"
          />
        </div>
        <DialogFooter className="modal-footer">
          <Button variant="ghost" onClick={closeModal} className="modal-btn-secondary">
            Cancel
          </Button>
          <Button 
            onClick={handleRename}
            disabled={!renameValue.trim()}
            className="modal-btn-primary"
          >
            Rename
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // Render Delete Modal
  const renderDeleteModal = () => {
    const itemsToDelete = Array.isArray(modalData) ? modalData : 
      contextMenuItem ? [contextMenuItem.id] : [];
    const itemCount = itemsToDelete.length;
    const itemName = contextMenuItem?.name || '';

    return (
      <Dialog open={activeModal === 'delete'} onOpenChange={closeModal}>
        <DialogContent className="modal-content">
          <DialogHeader>
            <div className="modal-icon delete-icon">
              <AlertTriangle size={32} />
            </div>
            <DialogTitle className="md-headline-small modal-title">
              Delete {itemCount > 1 ? `${itemCount} Items` : 'Item'}?
            </DialogTitle>
            <DialogDescription className="md-body-medium modal-description">
              Are you sure you want to delete{' '}
              <strong>{itemCount > 1 ? `${itemCount} items` : itemName}</strong>?
              {itemCount === 1 && contextMenuItem?.type === 'folder' && (
                ' This will also delete all items inside this folder.'
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="modal-footer">
            <Button variant="ghost" onClick={closeModal} className="modal-btn-secondary">
              Cancel
            </Button>
            <Button 
              onClick={handleDelete}
              variant="destructive"
              className="modal-btn-danger"
            >
              <Trash2 size={16} />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  // Render URL Confirm Modal
  const renderUrlConfirmModal = () => {
    const item = modalData as { name?: string; url?: string } | null;
    
    return (
      <Dialog open={activeModal === 'url-confirm'} onOpenChange={closeModal}>
        <DialogContent className="modal-content">
          <DialogHeader>
            <div className="modal-icon url-icon">
              <ExternalLink size={32} />
            </div>
            <DialogTitle className="md-headline-small modal-title">
              Open External Link?
            </DialogTitle>
            <DialogDescription className="md-body-medium modal-description">
              You are about to open: <strong>{item?.name}</strong>
              <span className="url-preview">{item?.url}</span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="modal-footer">
            <Button variant="ghost" onClick={closeModal} className="modal-btn-secondary">
              Cancel
            </Button>
            <Button onClick={handleOpenUrl} className="modal-btn-primary">
              <ExternalLink size={16} />
              Open Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  // Render About Modal
  const renderAboutModal = () => (
    <Dialog open={activeModal === 'about'} onOpenChange={closeModal}>
      <DialogContent className="modal-content about-modal">
        <DialogHeader>
          <div className="modal-icon about-icon">
            <Bookmark size={48} />
          </div>
          <DialogTitle className="md-headline-small modal-title">
            Bookmark Pro
          </DialogTitle>
          <DialogDescription className="md-body-medium modal-description">
            Version 2.0
          </DialogDescription>
        </DialogHeader>
        <div className="about-content">
          <p className="md-body-medium about-description">
            A fast, modern bookmark manager designed for effortless organization 
            of your favorite links and folders.
          </p>
          <div className="about-features">
            <h4 className="md-title-small features-title">Features</h4>
            <ul className="features-list">
              {[
                'Nested folder structure',
                'Quick search & filtering',
                'Clipboard operations (Cut/Copy/Paste)',
                'Modern, responsive design',
                'Keyboard navigation',
                'Accessibility support',
              ].map((feature, index) => (
                <li key={index} className="md-body-medium feature-item">
                  <Check size={16} className="feature-check" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <DialogFooter className="modal-footer">
          <Button onClick={closeModal} className="modal-btn-primary">
            Got It
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // Render Context Menu Sheet
  const renderContextMenu = () => {
    if (!contextMenuItem) return null;
    
    const options = getContextMenuOptions(contextMenuItem);
    
    return (
      <Sheet open={activeModal === 'context'} onOpenChange={closeModal}>
        <SheetContent side="bottom" className="context-sheet">
          <SheetHeader>
            <SheetTitle className="md-label-medium context-title">
              {contextMenuItem.name}
            </SheetTitle>
          </SheetHeader>
          <div className="context-options">
            {options.map((option) => (
              <button
                key={option.action}
                className="context-option"
                onClick={() => handleContextMenuAction(option.action)}
              >
                <span className="option-icon">
                  {/* Dynamic icon rendering based on option.icon */}
                  {option.icon === 'FolderOpen' && <Folder size={20} />}
                  {option.icon === 'ExternalLink' && <ExternalLink size={20} />}
                  {option.icon === 'Pencil' && <Pencil size={20} />}
                  {option.icon === 'Copy' && <span className="icon-fallback">📋</span>}
                  {option.icon === 'Scissors' && <span className="icon-fallback">✂️</span>}
                  {option.icon === 'Trash2' && <Trash2 size={20} />}
                </span>
                <span className="md-body-large option-text">{option.text}</span>
                {option.shortcut && (
                  <span className="md-label-small option-shortcut">
                    {option.shortcut}
                  </span>
                )}
              </button>
            ))}
          </div>
          <Button 
            variant="ghost" 
            onClick={closeModal}
            className="context-close-btn"
          >
            Close
          </Button>
        </SheetContent>
      </Sheet>
    );
  };

  return (
    <>
      {renderFolderModal()}
      {renderBookmarkModal()}
      {renderRenameModal()}
      {renderDeleteModal()}
      {renderUrlConfirmModal()}
      {renderAboutModal()}
      {renderContextMenu()}
    </>
  );
}
