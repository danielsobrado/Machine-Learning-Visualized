import React from 'react';
import { Link } from 'react-router-dom';
import {
  getAvailableLessonSections,
  getLessonSection,
  getLessonSectionPath,
} from '../../data/lessonSections';
import { LessonSectionProvider } from './LessonSectionContext';
import './LessonLayout.css';
import './LessonCodeLayout.css';
import './LessonAssessmentTypography.css';

export default function LessonLayout({ animation, activeSection, hasDeepDive, children }) {
  const sections = getAvailableLessonSections(hasDeepDive);
  const section = getLessonSection(activeSection);
  const layoutMode = section?.layout || 'wide';
  const showSectionRail = layoutMode !== 'code';

  return (
    <LessonSectionProvider lessonId={animation.id} activeSection={activeSection}>
      <div className={`ua-lesson-layout ua-lesson-layout--${layoutMode}`}>
        <div className="ua-lesson-layout-content">{children}</div>

        {showSectionRail && (
          <aside className="ua-lesson-section-nav" aria-label={`${animation.name} sections`}>
            <div className="ua-lesson-section-nav-head">
              <span>This lesson</span>
              <strong>{animation.name}</strong>
            </div>
            <nav className="ua-lesson-section-links" aria-label="Lesson learning modes">
              {sections.map((item, index) => {
                const selected = item.id === activeSection;
                return (
                  <Link
                    key={item.id}
                    to={getLessonSectionPath(animation.id, item.id)}
                    className={`ua-lesson-section-link${selected ? ' active' : ''}`}
                    aria-current={selected ? 'page' : undefined}
                  >
                    <span className="ua-lesson-section-index">{String(index + 1).padStart(2, '0')}</span>
                    <span className="ua-lesson-section-copy">
                      <strong>{item.label}</strong>
                      <small>{item.description}</small>
                    </span>
                  </Link>
                );
              })}
            </nav>
          </aside>
        )}
      </div>
    </LessonSectionProvider>
  );
}
