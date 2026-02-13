import { Folder, Globe } from 'lucide-react';
import { useBookmarks } from '@/contexts/BookmarkContext';
import type { SearchFilter } from '@/types';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  active: boolean;
}

export default function SearchBar({ active }: SearchBarProps) {
  const { searchFilter, setSearchFilter } = useBookmarks();

  const filters: { value: SearchFilter; label: string; icon: React.ElementType }[] = [
    { value: 'folder', label: 'Folders', icon: Folder },
    { value: 'bookmark', label: 'Bookmarks', icon: Globe },
  ];

  if (!active) return null;

  return (
    <div 
      className="search-bar"
      role="region"
      aria-label="Search filters"
    >
      <div className="search-filters">
        {filters.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            className={cn(
              'search-filter-chip',
              searchFilter === value && 'active'
            )}
            onClick={() => setSearchFilter(value)}
            aria-pressed={searchFilter === value}
            aria-label={`Filter by ${label}`}
          >
            <span className={cn(
              'filter-icon',
              value === 'folder' && 'folder-icon',
              value === 'bookmark' && 'bookmark-icon'
            )}>
              <Icon size={14} />
            </span>
            <span className="md-label-large filter-label">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
