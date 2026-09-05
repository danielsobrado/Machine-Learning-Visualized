import React from 'react';
import { Link } from 'react-router-dom';
import {
  getAvailableLessonSections,
  getLessonSectionPath,
} from '../../data/lessonSections';
import './LessonSectionTabs.css';

export default function LessonSectionTabs({ animationId, activeSection, hasDeepDive }) {
  const sections = getAvailableLessonSections(hasDeepDive);

  return (
    <nav className="ua-lesson-section-tabs" aria-label="Lesson sections">
      {sections.map((section, index) => {
        const selected = section.id === activeSection;

        return (
          <Link
            key={section.id}
            to={getLessonSectionPath(animationId, section.id)}
            className={`ua-lesson-section-tab${selected ? ' active' : ''}`}
            aria-current={selected ? 'page' : undefined}
          >
            <span className="ua-lesson-section-tab-index">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span>{section.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
