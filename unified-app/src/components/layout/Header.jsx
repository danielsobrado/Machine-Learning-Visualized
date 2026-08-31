import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Menu, PanelLeft, PanelLeftClose, Settings } from 'lucide-react';
import { readGitHubSyncSettings, GITHUB_SYNC_EVENT } from '../../data/githubProgressSync.js';

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
  const DesktopIcon = !sidebarOpen || sidebarCollapsed ? PanelLeft : PanelLeftClose;

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
          <Menu size={20} />
        </button>
        <button
          className="ua-icon-btn hidden md:inline-flex"
          onClick={onSidebarControlClick}
          aria-label="Toggle sidebar"
          aria-expanded={sidebarOpen && !sidebarCollapsed}
        >
          <DesktopIcon size={20} />
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
          <Github size={15} />
          <span>{hasStorageUrl && isEnabled ? 'Sync Active' : 'Sign In'}</span>
        </Link>
        <Link to="/settings" className="ua-icon-btn" aria-label="Settings">
          <Settings size={19} />
        </Link>
        <a
          className="ua-icon-btn"
          href="https://github.com/danielsobrado/Machine-Learning-Visualized"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub repository"
        >
          <Github size={19} />
        </a>
      </div>
    </header>
  );
}
