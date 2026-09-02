import React from 'react';

const LessonSectionContext = React.createContext(null);

export function LessonSectionProvider({ lessonId, activeSection, children }) {
  const value = React.useMemo(
    () => ({ lessonId, activeSection }),
    [lessonId, activeSection],
  );

  return (
    <LessonSectionContext.Provider value={value}>
      {children}
    </LessonSectionContext.Provider>
  );
}

export function useLessonSectionContext() {
  return React.useContext(LessonSectionContext);
}
