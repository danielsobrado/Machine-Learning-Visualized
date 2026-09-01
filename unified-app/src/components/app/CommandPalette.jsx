import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { allAnimations } from '../../data/animations';
import { glossaryTerms } from '../../data/glossaryRepository';
import { buildCommandPaletteItems, searchCommandPaletteItems } from '../../data/commandPalette';

export default function CommandPalette({ open, onClose }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const items = useMemo(() => buildCommandPaletteItems(allAnimations, glossaryTerms), []);
  const results = useMemo(() => searchCommandPaletteItems(items, query, 12), [items, query]);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    setActiveIndex(0);
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  if (!open) return null;

  const openItem = (item) => {
    if (!item) return;
    navigate(item.href);
    onClose();
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      onClose();
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, results.length - 1));
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      openItem(results[activeIndex]);
    }
  };

  return (
    <div className="ua-command-overlay" role="presentation" onMouseDown={onClose}>
      <section
        className="ua-command-palette"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <label className="ua-command-search">
          <span className="ua-command-search-mark" aria-hidden="true">/</span>
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search lessons, symbols, or glossary terms"
          />
          <kbd>↵</kbd>
        </label>

        <div className="ua-command-results" role="listbox" aria-label="Search results">
          {results.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={`ua-command-result ${index === activeIndex ? 'active' : ''}`}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => openItem(item)}
              role="option"
              aria-selected={index === activeIndex}
            >
              <span className="ua-command-symbol">{item.symbol}</span>
              <span>
                <strong>{item.name}</strong>
                <small>{item.kind} / {item.category}</small>
                <em>{item.description}</em>
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
