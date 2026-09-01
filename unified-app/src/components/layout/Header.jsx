import React from 'react';
import { Link } from 'react-router-dom';
import { readGitHubSyncSettings, GITHUB_SYNC_EVENT } from '../../data/githubProgressSync.js';

// Drawn rather than imported: the rail toggle shows this notebook's own index margin,
// which no stock icon vocabulary says better.
function RailMark({ open }) {
  return (
    <svg className="ua-rail-mark" viewBox="0 0 20 20" aria-hidden="true">
      {open && <rect className="ua-rail-fill" x="2.5" y="3.5" width="5.5" height="13" />}
      <rect x="2.5" y="3.5" width="15" height="13" />
      <line x1="8" y1="3.5" x2="8" y2="16.5" />
    </svg>
  );
}

export default function Header({
  onMenuClick,
  onSidebarControlClick,
  onOpenCommandPalette,
  progress,
  sidebarOpen,
  sidebarCollapsed,
}) {
  const progressLabel = `Σ ${progress.visited} / ${progress.total} lessons`;
  const progressPercent = progress.total > 0 ? (progress.visited / progress.total) * 100 : 0;
  const railOpen = sidebarOpen && !sidebarCollapsed;

  const [settings, setSettings] = React.useState(() => readGitHubSyncSettings());

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleUpdate = () => {
      setSettings(readGitHubSyncSettings());
    };
    window.addEventListener(GITHUB_SYNC_EVENT, handleUpdate);
    return () => {
      window.removeEventListener(GITHUB_SYNC_EVENT, handleUpdate);
    };
  }, []);

  const hasStorageUrl = Boolean(settings.storageUrl);
  const isEnabled = settings.enabled;

  return (
    <header className="ua-header">
      <div className="ua-header-left">
        <button
          className="ua-icon-btn md:hidden"
          onClick={onMenuClick}
          aria-label="Toggle menu"
          aria-expanded={sidebarOpen}
        >
          <RailMark open={sidebarOpen} />
        </button>
        <button
          className="ua-icon-btn hidden md:inline-flex"
          onClick={onSidebarControlClick}
          aria-label="Toggle sidebar"
          aria-expanded={railOpen}
        >
          <RailMark open={railOpen} />
        </button>
        <Link to="/" className="ua-brand">
          <span className="ua-brand-mark">ml</span>
          <span className="ua-brand-text">
            <span className="ua-brand-title">Machine Learning Visualized</span>
            <span className="ua-brand-sub">Interactive machine learning lessons</span>
          </span>
        </Link>
      </div>

      <div className="ua-header-right">
        <div className="ua-progress-track" aria-label={progressLabel}>
          <span>{progressLabel}</span>
          <div>
            <i style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
        <button
          type="button"
          className="ua-header-action"
          onClick={onOpenCommandPalette}
          aria-label="Open glossary search"
        >
          Search / Glossary
        </button>
        <Link to="/labs" className="ua-header-action">
          Code labs
        </Link>
        <Link
          to="/settings"
          className={`ua-header-action ua-header-login-btn ${hasStorageUrl && isEnabled ? 'ua-sync-active' : ''}`}
        >
          {hasStorageUrl && isEnabled ? 'Sync active' : 'Sign in'}
        </Link>
        <Link to="/settings" className="ua-header-action">
          Settings
        </Link>
        <a
          className="ua-header-action"
          href="https://github.com/danielsobrado/Machine-Learning-Visualized"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source ↗
        </a>
      </div>
    </header>
  );
}
