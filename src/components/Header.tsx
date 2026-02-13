import { useState, useRef, useEffect } from 'react';
import { 
  Bookmark, 
  Search, 
  Menu, 
  Sun, 
  Moon, 
  Settings, 
  Info, 
  ArrowUpDown,
  ArrowUpAZ,
  Calendar,
  FileType,
  BarChart3,
  X
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useBookmarks } from '@/contexts/BookmarkContext';
import type { SortMode } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  searchActive: boolean;
  onSearchToggle: () => void;
  menuOpen: boolean;
  onMenuToggle: () => void;
}

export default function Header({ 
  searchActive, 
  onSearchToggle,
  menuOpen,
  onMenuToggle 
}: HeaderProps) {
  const { mode, toggleTheme } = useTheme();
  const { 
    currentFolder, 
    getPath, 
    currentFolderId,
    sortMode,
    setSortMode,
    sortDirection,
    toggleSortDirection,
    setSearchQuery,
    openModal,
  } = useBookmarks();
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [localSearchQuery, setLocalSearchQuery] = useState('');

  // Focus search input when search becomes active
  useEffect(() => {
    if (searchActive && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [searchActive]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localSearchQuery);
    }, 150);
    
    return () => clearTimeout(timer);
  }, [localSearchQuery, setSearchQuery]);

  const handleSearchToggle = () => {
    if (searchActive) {
      setLocalSearchQuery('');
      setSearchQuery('');
    }
    onSearchToggle();
  };

  const handleSortChange = (newMode: SortMode) => {
    if (sortMode === newMode) {
      toggleSortDirection();
    } else {
      setSortMode(newMode);
    }
  };

  const path = currentFolderId === 'root' ? [] : getPath(currentFolderId);
  const displayTitle = currentFolder?.name || 'Bookmark Pro';

  const sortOptions: { mode: SortMode; label: string; icon: React.ElementType }[] = [
    { mode: 'sort-by-name', label: 'Name', icon: ArrowUpAZ },
    { mode: 'sort-by-date', label: 'Date', icon: Calendar },
    { mode: 'sort-by-type', label: 'Type', icon: FileType },
    { mode: 'sort-by-size', label: 'Size', icon: BarChart3 },
  ];

  return (
    <header 
      className="header"
      role="banner"
      aria-label="Bookmark Pro Header"
    >
      <div className="header-content">
        {/* Left Section - Logo and Title */}
        <div className={`header-left ${searchActive ? 'hidden' : ''}`}>
          <div className="logo-container" aria-hidden="true">
            <Bookmark className="logo-icon" size={24} />
          </div>
          <div className="title-container">
            <h1 className="md-title-large header-title">
              {displayTitle}
            </h1>
            {path.length > 0 && (
              <span className="md-body-small header-path">
                {path.join(' / ')}
              </span>
            )}
          </div>
        </div>

        {/* Search Section */}
        <div className={`search-section ${searchActive ? 'active' : ''}`}>
          {searchActive && (
            <>
              <Search className="search-icon" size={20} aria-hidden="true" />
              <Input
                ref={searchInputRef}
                type="text"
                placeholder="Search bookmarks..."
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
                className="search-input"
                aria-label="Search bookmarks"
              />
              {localSearchQuery && (
                <button 
                  className="search-clear"
                  onClick={() => setLocalSearchQuery('')}
                  aria-label="Clear search"
                >
                  <X size={18} />
                </button>
              )}
            </>
          )}
        </div>

        {/* Right Section - Actions */}
        <div className="header-right">
          {/* Search Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSearchToggle}
            className={`header-btn ${searchActive ? 'active' : ''}`}
            aria-label={searchActive ? 'Close search' : 'Open search'}
            aria-pressed={searchActive}
          >
            {searchActive ? <X size={20} /> : <Search size={20} />}
          </Button>

          {/* Menu Dropdown */}
          <DropdownMenu open={menuOpen} onOpenChange={onMenuToggle}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="header-btn"
                aria-label="Open menu"
              >
                <Menu size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-56 menu-dropdown"
              sideOffset={8}
            >
              {/* Sort Options */}
              <div className="menu-section">
                <span className="md-label-medium menu-section-title">Sort by</span>
                <div className="sort-grid">
                  {sortOptions.map(({ mode: optMode, label, icon: Icon }) => (
                    <button
                      key={optMode}
                      className={`sort-option ${sortMode === optMode ? 'active' : ''}`}
                      onClick={() => handleSortChange(optMode)}
                      aria-pressed={sortMode === optMode}
                      aria-label={`Sort by ${label}`}
                    >
                      <Icon size={16} />
                      <span className="md-label-medium">{label}</span>
                    </button>
                  ))}
                </div>
                <DropdownMenuItem 
                  onClick={toggleSortDirection}
                  className="sort-direction"
                >
                  <ArrowUpDown size={16} />
                  <span className="md-body-medium">
                    {sortDirection === 'asc' ? 'Ascending' : 'Descending'}
                  </span>
                </DropdownMenuItem>
              </div>

              <DropdownMenuSeparator />

              {/* Theme Toggle */}
              <DropdownMenuItem onClick={toggleTheme}>
                {mode === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                <span className="md-body-medium">
                  {mode === 'dark' ? 'Light mode' : 'Dark mode'}
                </span>
              </DropdownMenuItem>

              {/* Settings */}
              <DropdownMenuItem onClick={() => openModal('settings')}>
                <Settings size={16} />
                <span className="md-body-medium">Settings</span>
              </DropdownMenuItem>

              {/* About */}
              <DropdownMenuItem onClick={() => openModal('about')}>
                <Info size={16} />
                <span className="md-body-medium">About</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
