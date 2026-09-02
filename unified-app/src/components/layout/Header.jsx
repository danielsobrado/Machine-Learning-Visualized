import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { readGitHubSyncSettings, GITHUB_SYNC_EVENT } from '../../data/githubProgressSync.js';

const TOP_NAV = [
  { label: 'Overview', to: '/' },
  { label: 'Code Labs', to: '/labs' },
  { label: 'Glossary', to: '/glossary' },
  { label: 'Settings', to: '/settings' },
];

function RailMark({ open }) {
  return (
    <svg className="ua-rail-mark" viewBox="0 0 20 20" aria-hidden="true">
      {open && <rect className="ua-rail-fill" x="2.5" y="3.5" width="5.5" height="13" />}
      <rect x="2.5" y="3.5" width="15" height="13" />
      <line x1="8" y1="3.5" x2="8" y2="16.5" />
    </svg>
  );
}

function isRouteActive(pathname, target) {
  if (target === '/') return pathname === '/';
  return pathname === target || pathname.startsWith(`${target}/`);
}

export default function Header({
  onMenuClick,
  onSidebarControlClick,
  onOpenCommandPalette,
  progress,
  sidebarOpen,
  sidebarCollapsed,
}) {
  const location = useLocation();
  const progressPercent = progress.total > 0 ? (progress.visited / progress.total) * 100 : 0;
  const railOpen = sidebarOpen && !sidebarCollapsed;
  const [settings, setSettings] = React.useState(() => readGitHubSyncSettings());

  React.useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const handleUpdate = () => setSettings(readGitHubSyncSettings());
    window.addEventListener(GITHUB_SYNC_EVENT, handleUpdate);
    return () => window.removeEventListener(GITHUB_SYNC_EVENT, handleUpdate);
  }, []);

  const syncActive = Boolean(settings.storageUrl && settings.enabled);
  const headerClassName = [
    'ua-header',
    sidebarCollapsed ? 'sidebar-collapsed' : '',
    sidebarOpen ? '' : 'sidebar-closed',
  ].filter(Boolean).join(' ');

  return (
    <header className={headerClassName}>
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

        <nav className="ua-top-nav" aria-label="Primary">
          {TOP_NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`ua-top-nav-item ${isRouteActive(location.pathname, item.to) ? 'active' : ''}`}
            >
              {item.label}
              {item.to === '/settings' && syncActive && (
                <span className="ua-sync-dot" title="GitHub progress sync active" aria-label="Sync active" />
              )}
            </Link>
          ))}
        </nav>
      </div>

      <div className="ua-header-right">
        <div className="ua-progress-pill" aria-label={`${progress.visited} of ${progress.total} lessons visited`}>
          <span>{progress.visited}/{progress.total}</span>
          <i aria-hidden="true"><b style={{ width: `${progressPercent}%` }} /></i>
        </div>
        <button type="button" className="ua-top-search" onClick={onOpenCommandPalette}>
          <span>Search</span>
          <kbd>⌘K</kbd>
        </button>
        <a
          className="ua-source-link"
          href="https://github.com/danielsobrado/Machine-Learning-Visualized"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub ↗
        </a>
      </div>
    </header>
  );
}
