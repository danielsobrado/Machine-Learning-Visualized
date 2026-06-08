import React from 'react';

const HINTS = [
  ['⌘K', 'search'],
  ['/', 'palette'],
  ['↑↓', 'move'],
  ['↵', 'open'],
];

export default function KeyboardHintDock() {
  return (
    <div className="ua-hint-dock" aria-label="Keyboard shortcuts">
      {HINTS.map(([key, label]) => (
        <span key={`${key}-${label}`}>
          <kbd>{key}</kbd>
          {label}
        </span>
      ))}
    </div>
  );
}
