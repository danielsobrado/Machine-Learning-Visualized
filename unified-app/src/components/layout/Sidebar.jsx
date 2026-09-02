import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { categories } from '../../data/animations';
import { formatLessonCatalogNumber } from '../../data/lessonCatalogNumbers';

function getActiveCategoryId(pathname) {
  const lessonId = pathname.match(/^\/animation\/([^/]+)/)?.[1];
  if (!lessonId) return null;

  return categories.find((category) => (
    category.items.some((item) => item.id === lessonId)
  ))?.id || null;
}

export default function Sidebar({ isOpen, isCollapsed, onClose, onOpenCommandPalette }) {
  const location = useLocation();
  const activeCategoryId = getActiveCategoryId(location.pathname);
  const [expandedCategoryId, setExpandedCategoryId] = React.useState(activeCategoryId);

  React.useEffect(() => {
    if (activeCategoryId) setExpandedCategoryId(activeCategoryId);
  }, [activeCategoryId]);

  const isActive = (path) => (
    location.pathname === path
    || (path.startsWith('/animation/') && location.pathname.startsWith(`${path}/`))
  );

  const toggleCategory = (categoryId) => {
    if (isCollapsed) return;
    setExpandedCategoryId((current) => current === categoryId ? null : categoryId);
  };

  return (
    <>
      {isOpen && <div className="ua-sidebar-overlay" onClick={onClose} />}
      <aside className={`ua-sidebar ${isCollapsed ? 'collapsed' : ''} ${isOpen ? '' : 'closed'}`}>
        <div className="ua-sidebar-brand-row">
          <Link to="/" className="ua-sidebar-brand" aria-label="Machine Learning Visualized home">
            <span className="ua-sidebar-brand-mark" aria-hidden="true">ML</span>
            <span className="ua-sidebar-brand-copy">
              <strong>Machine Learning</strong>
              <span>Visualized</span>
            </span>
          </Link>
        </div>

        <nav className="ua-sidebar-nav">
          {!isCollapsed && (
            <button type="button" className="ua-sidebar-search" onClick={onOpenCommandPalette}>
              <span className="ua-sidebar-search-icon" aria-hidden="true">⌕</span>
              <span>Quick search…</span>
              <kbd>⌘K</kbd>
            </button>
          )}

          <div className="ua-sidebar-nav-label">Learn</div>
          <Link to="/" className={`ua-sidebar-home ${isActive('/') ? 'active' : ''}`}>
            <span className="num">00</span>
            <span>Overview</span>
          </Link>

          <div className="ua-sidebar-nav-label ua-sidebar-topics-label">Topics</div>
          {categories.map((category, categoryIndex) => {
            const expanded = expandedCategoryId === category.id;
            return (
              <section key={category.id} className="ua-sidebar-section">
                <button
                  className="ua-sidebar-section-head"
                  onClick={() => toggleCategory(category.id)}
                  title={isCollapsed ? category.name : undefined}
                  aria-expanded={expanded}
                >
                  <span className="ua-sidebar-section-num">
                    {String(categoryIndex + 1).padStart(2, '0')}
                  </span>
                  <span className="ua-sidebar-section-name">{category.name}</span>
                  <span className="ua-sidebar-section-chevron">
                    {expanded ? '−' : '+'}
                  </span>
                </button>

                {!isCollapsed
                  && expanded
                  && category.items.map((item, itemIndex) => (
                    <Link
                      key={item.id}
                      to={`/animation/${item.id}`}
                      className={`ua-sidebar-item ${isActive(`/animation/${item.id}`) ? 'active' : ''}`}
                    >
                      <span className="num">
                        {formatLessonCatalogNumber(categoryIndex, itemIndex)}
                      </span>
                      <span className="label">{item.name}</span>
                    </Link>
                  ))}
              </section>
            );
          })}
        </nav>

        <div className="ua-sidebar-footer">
          <span className="ua-sidebar-footer-dot" />
          <span>Interactive ML lessons</span>
        </div>
      </aside>
    </>
  );
}
