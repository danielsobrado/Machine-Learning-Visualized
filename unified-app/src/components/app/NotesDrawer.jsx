import React, { useEffect, useMemo, useState } from 'react';

const NOTES_PREFIX = 'ml-animations:notes:';

function storageKey(scope) {
  return `${NOTES_PREFIX}${scope || 'catalog'}`;
}

export default function NotesDrawer({ open, scope, title, onClose }) {
  const key = useMemo(() => storageKey(scope), [scope]);
  const [value, setValue] = useState('');

  useEffect(() => {
    if (!open) return;
    setValue(localStorage.getItem(key) || '');
  }, [key, open]);

  const updateValue = (nextValue) => {
    setValue(nextValue);
    localStorage.setItem(key, nextValue);
  };

  return (
    <aside className={`ua-notes-drawer ${open ? 'open' : ''}`} aria-hidden={!open}>
      <div className="ua-notes-head">
        <span>Notebook</span>
        <button type="button" className="ua-icon-btn" onClick={onClose} aria-label="Close notes">
          ×
        </button>
      </div>
      <h2>{title || 'Catalog notes'}</h2>
      <textarea
        value={value}
        onChange={(event) => updateValue(event.target.value)}
        placeholder="Write the thing you want future-you to remember."
        aria-label="Lesson notes"
      />
    </aside>
  );
}
