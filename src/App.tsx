import { useState, useCallback, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { BookmarkProvider } from './contexts/BookmarkContext';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import FileList from './components/FileList';
import FABMenu from './components/FABMenu';
import ModalManager from './components/ModalManager';
import './App.css';

function App() {
  const [searchActive, setSearchActive] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Handle escape key to close search and menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (searchActive) {
          setSearchActive(false);
        }
        if (menuOpen) {
          setMenuOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchActive, menuOpen]);

  const handleSearchToggle = useCallback(() => {
    setSearchActive(prev => !prev);
  }, []);

  const handleMenuToggle = useCallback(() => {
    setMenuOpen(prev => !prev);
  }, []);

  return (
    <ThemeProvider>
      <BookmarkProvider>
        <div className="app-container">
          <Header 
            searchActive={searchActive}
            onSearchToggle={handleSearchToggle}
            menuOpen={menuOpen}
            onMenuToggle={handleMenuToggle}
          />
          <SearchBar 
            active={searchActive}
          />
          <main className="main-content" role="main">
            <FileList />
          </main>
          <FABMenu />
          <ModalManager />
        </div>
      </BookmarkProvider>
    </ThemeProvider>
  );
}

export default App;
