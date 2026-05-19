import { useState, useEffect, useRef } from 'react';
import styles from './SearchBar.module.css';
import { searchLocations, GeocodingResult } from '../../utils/weatherApi';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onLocationSelect?: (lat: number, lon: number, city: string, country: string) => void;
  loading?: boolean;
}

export default function SearchBar({ onSearch, onLocationSelect, loading }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<GeocodingResult[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch suggestions as user types
  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      setIsDropdownOpen(false);
      return;
    }

    const fetchSuggestions = async () => {
      setIsSearching(true);
      try {
        const results = await searchLocations(query);
        setSuggestions(results);
        setIsDropdownOpen(true);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setIsDropdownOpen(false);
    }
  };

  const handleSelect = (s: GeocodingResult) => {
    setQuery(s.city);
    setIsDropdownOpen(false);
    if (onLocationSelect) {
      onLocationSelect(s.lat, s.lon, s.city, s.country);
    } else {
      onSearch(s.city);
    }
  };

  return (
    <div className={styles.searchWrapper} ref={wrapperRef}>
      <form className={styles.searchForm} onSubmit={handleSubmit}>
        <input
          type="text"
          className={`glass-panel ${styles.searchInput}`}
          placeholder="Search any location..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (suggestions.length > 0) setIsDropdownOpen(true); }}
          disabled={loading}
        />
        <button type="submit" className={styles.searchButton} disabled={loading || !query.trim()}>
          {loading || isSearching ? '...' : '🔍'}
        </button>
      </form>

      {isDropdownOpen && suggestions.length > 0 && (
        <ul className={`glass-panel ${styles.dropdown}`}>
          {suggestions.map((s, idx) => (
            <li 
              key={`${s.lat}-${s.lon}-${idx}`} 
              className={styles.dropdownItem}
              onClick={() => handleSelect(s)}
            >
              <span className={styles.itemIcon}>📍</span>
              <div className={styles.itemText}>
                <span className={styles.itemName}>{s.city}</span>
                <span className={styles.itemSubName}>
                  {s.state ? `${s.state}, ` : ''}{s.country}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
