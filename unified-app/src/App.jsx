import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Header from './components/layout/Header';
import KeyboardHintDock from './components/app/KeyboardHintDock';
import { ACTIVE_LESSON_COUNT } from './data/catalogStats';
import { CODE_LAB_PROGRESS_EVENT } from './data/codeLabProgress.js';
import {
  readGitHubSyncSettings,
  syncCodeLabProgressToGitHub,
  writeGitHubSyncSettings,
} from './data/githubProgressSync.js';

import { getGlossaryTerm } from './data/glossaryRepository.js';

const HomePage = lazy(() => import('./pages/HomePage'));
const AnimationPage = lazy(() => import('./pages/AnimationPage'));
const LabsPage = lazy(() => import('./pages/LabsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const GlossaryPage = lazy(() => import('./pages/GlossaryPage'));
const GlossaryIndexPage = lazy(() => import('./pages/GlossaryIndexPage'));
const CommandPalette = lazy(() => import('./components/app/CommandPalette'));
const Sidebar = lazy(() => import('./components/layout/Sidebar'));

const VISITED_KEY = 'ml-animations:visited-lessons';
const SITE_BASE_URL = 'https://danielsobrado.github.io/Machine-Learning-Visualized';

const DEFAULT_META = {
  title: 'Machine Learning Visualized - Interactive AI and ML Visualizations',
  description:
    'Interactive visualizations and animations for machine learning concepts including transformers, attention mechanisms, neural networks, and more.',
};

function ensureMetaTag(tagName, key, value, attrs = {}) {
  const selector = `${tagName}[${key}="${value}"]`;
  let node = document.head.querySelector(selector);

  if (!node) {
    node = document.createElement(tagName);
    node.setAttribute(key, value);
    document.head.appendChild(node);
  }

  Object.entries(attrs).forEach(([attr, v]) => {
    node.setAttribute(attr, v);
  });

  return node;
}

function setHeadMeta({ title = DEFAULT_META.title, description = DEFAULT_META.description, path = '/' }) {
  document.title = title;

  ensureMetaTag('meta', 'name', 'description', { content: description });
  ensureMetaTag('meta', 'name', 'robots', { content: 'index, follow' });
  ensureMetaTag('link', 'rel', 'canonical', { href: `${SITE_BASE_URL}${path}` });

  ensureMetaTag('meta', 'property', 'og:type', { content: 'website' });
  ensureMetaTag('meta', 'property', 'og:title', { content: title });
  ensureMetaTag('meta', 'property', 'og:description', { content: description });
  ensureMetaTag('meta', 'property', 'og:url', { content: `${SITE_BASE_URL}${path}` });
  ensureMetaTag('meta', 'property', 'og:site_name', { content: 'Machine Learning Visualized' });
  ensureMetaTag('meta', 'property', 'og:image', {
    content: `${SITE_BASE_URL}/favicon.svg`,
  });

  ensureMetaTag('meta', 'name', 'twitter:card', { content: 'summary_large_image' });
  ensureMetaTag('meta', 'name', 'twitter:title', { content: title });
  ensureMetaTag('meta', 'name', 'twitter:description', { content: description });
  ensureMetaTag('meta', 'name', 'twitter:image', {
    content: `${SITE_BASE_URL}/favicon.svg`,
  });
}

function getAnimationMeta(animation) {
  if (!animation) {
    return {
      title: 'Animation not found - Machine Learning Visualized',
      description:
        'That animation is not yet available in the catalog. Try another topic or go back to the main catalog.',
    };
  }

  return {
    title: `${animation.name} - Machine Learning Visualized`,
    description: `${animation.description}. An interactive lesson with controls, charts, and visual step-through.`,
  };
}

function getMetaFromPath(pathname, currentLesson) {
  if (pathname === '/') {
    return {
      ...DEFAULT_META,
      path: '/',
    };
  }

  if (pathname.startsWith('/animation/')) {
    return {
      ...getAnimationMeta(currentLesson),
      path: `${pathname.replace(/\/?$/, '/')}`,
    };
  }

  if (pathname === '/labs' || pathname === '/labs/') {
    return {
      title: 'Code Labs - Machine Learning Visualized',
      description:
        'Rustlings-style JavaScript implementation exercises for every active Machine Learning Visualized lesson.',
      path: '/labs/',
    };
  }

  if (pathname === '/settings' || pathname === '/settings/') {
    return {
      title: 'Progress Settings - Machine Learning Visualized',
      description:
        'Configure local code-lab progress and optional GitHub sync for Machine Learning Visualized practice evidence.',
      path: '/settings/',
    };
  }

  if (pathname === '/glossary' || pathname === '/glossary/') {
    return {
      title: 'Glossary - Machine Learning Visualized',
      description:
        'Browse machine learning glossary terms with definitions, intuition, examples, and links to related lessons.',
      path: '/glossary/',
    };
  }

  if (pathname.startsWith('/glossary/')) {
    const slug = decodeURIComponent(pathname.split('/').pop() || '');
    const term = getGlossaryTerm(slug);
    if (term) {
      return {
        title: `${term.term} - Machine Learning Visualized Glossary`,
        description: `${term.definition} Explore intuition, examples, and related concepts.`,
        path: `${pathname.replace(/\/?$/, '/')}`,
      };
    }

    return {
      title: 'Glossary term not found - Machine Learning Visualized',
      description: 'That glossary entry is not in the catalog yet. Browse the full glossary or return to the home page.',
      path: `${pathname.replace(/\/?$/, '/')}`,
    };
  }

  return {
    ...DEFAULT_META,
    path: `${pathname.replace(/\/?$/, '/')}`,
  };
}

function isEditableTarget(target) {
  return target?.closest?.('input, textarea, select, [contenteditable="true"]');
}

function readVisitedLessons() {
  try {
    return JSON.parse(localStorage.getItem(VISITED_KEY) || '[]');
  } catch {
    return [];
  }
}

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 768);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [visitedLessons, setVisitedLessons] = useState(() => new Set(readVisitedLessons()));
  const [currentLesson, setCurrentLesson] = useState(null);

  useEffect(() => {
    if (window.innerWidth < 768) setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const match = location.pathname.match(/^\/animation\/([^/]+)/);
    if (!match) return;

    const lessonId = match[1];
    setVisitedLessons((current) => {
      if (current.has(lessonId)) return current;
      const next = new Set(current);
      next.add(lessonId);
      localStorage.setItem(VISITED_KEY, JSON.stringify([...next]));
      return next;
    });
  }, [location.pathname]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isEditableTarget(event.target)) return;

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setCommandPaletteOpen(true);
        return;
      }

      if (event.key === '/') {
        event.preventDefault();
        setCommandPaletteOpen(true);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const currentLessonId = location.pathname.match(/^\/animation\/([^/]+)/)?.[1];

  useEffect(() => {
    let disposed = false;

    if (!currentLessonId) {
      setCurrentLesson(null);
      return undefined;
    }

    import('./data/animations').then(({ getAnimationById }) => {
      if (!disposed) setCurrentLesson(getAnimationById(currentLessonId) || null);
    });

    return () => {
      disposed = true;
    };
  }, [currentLessonId]);

  const handleSidebarControlClick = () => {
    if (!sidebarOpen) {
      setSidebarOpen(true);
      setSidebarCollapsed(false);
      return;
    }

    setSidebarCollapsed((collapsed) => !collapsed);
  };

  useEffect(() => {
    const normalizedPath = location.pathname || '/';
    const pageMeta = getMetaFromPath(normalizedPath, currentLesson);
    setHeadMeta(pageMeta);
  }, [location.pathname, currentLessonId, currentLesson]);

  useEffect(() => {
    let timeoutId = null;
    let syncing = false;

    const scheduleAutoSync = () => {
      const settings = readGitHubSyncSettings();
      if (!settings.enabled || !settings.autoSync || !settings.storageUrl) return;
      if (timeoutId || syncing) return;

      timeoutId = window.setTimeout(async () => {
        timeoutId = null;
        syncing = true;
        try {
          await syncCodeLabProgressToGitHub({ settings: readGitHubSyncSettings() });
        } catch (error) {
          const current = readGitHubSyncSettings();
          writeGitHubSyncSettings({
            ...current,
            lastStatus: 'Auto-sync failed',
            lastError: error.message || 'Auto-sync failed.',
          });
        } finally {
          syncing = false;
        }
      }, 45_000);
    };

    window.addEventListener(CODE_LAB_PROGRESS_EVENT, scheduleAutoSync);
    return () => {
      window.removeEventListener(CODE_LAB_PROGRESS_EVENT, scheduleAutoSync);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="ua-app">
      <Header
        onMenuClick={() => setSidebarOpen((open) => !open)}
        onSidebarControlClick={handleSidebarControlClick}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        progress={{ visited: visitedLessons.size, total: ACTIVE_LESSON_COUNT }}
        sidebarOpen={sidebarOpen}
        sidebarCollapsed={sidebarCollapsed}
      />
      <Suspense fallback={null}>
        <Sidebar
          isOpen={sidebarOpen}
          isCollapsed={sidebarCollapsed}
          onClose={() => setSidebarOpen(false)}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        />
      </Suspense>
      <main
        className={`ua-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''} ${
          sidebarOpen ? '' : 'sidebar-closed'
        }`}
      >
        <Suspense fallback={<div className="ds-panel ua-loading">Loading page</div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/animation/:id" element={<AnimationPage />} />
            <Route path="/labs" element={<LabsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/glossary" element={<GlossaryIndexPage />} />
            <Route path="/glossary/:slug" element={<GlossaryPage />} />
          </Routes>
        </Suspense>
      </main>
      {commandPaletteOpen && (
        <Suspense fallback={null}>
          <CommandPalette open={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
        </Suspense>
      )}
      <KeyboardHintDock />
    </div>
  );
}
