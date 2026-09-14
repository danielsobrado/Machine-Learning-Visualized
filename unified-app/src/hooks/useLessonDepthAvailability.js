import { useEffect, useState } from 'react';

const IDLE_TIMEOUT_MS = 1500;
const FALLBACK_DELAY_MS = 250;

function hasLessonDepth(depth) {
  return Boolean(
    depth
    && [depth.comparisons, depth.failures, depth.paperSignals, depth.caveats]
      .some((items) => items?.length),
  );
}

export default function useLessonDepthAvailability({ lessonId, categoryId, eager = false }) {
  const [state, setState] = useState({ isReady: false, hasDeepDive: false });

  useEffect(() => {
    let disposed = false;
    let idleId = null;
    let timerId = null;

    if (!lessonId) {
      setState({ isReady: true, hasDeepDive: false });
      return undefined;
    }

    setState({ isReady: false, hasDeepDive: false });

    const load = async () => {
      try {
        const { getCurriculumDepth } = await import('../data/curriculumDepth.js');
        if (disposed) return;
        const depth = getCurriculumDepth({ id: lessonId, categoryId });
        setState({ isReady: true, hasDeepDive: hasLessonDepth(depth) });
      } catch (error) {
        if (disposed) return;
        console.error('Failed to load lesson depth metadata.', error);
        setState({ isReady: true, hasDeepDive: false });
      }
    };

    if (eager) {
      void load();
    } else if (typeof window.requestIdleCallback === 'function') {
      idleId = window.requestIdleCallback(() => void load(), { timeout: IDLE_TIMEOUT_MS });
    } else {
      timerId = window.setTimeout(() => void load(), FALLBACK_DELAY_MS);
    }

    return () => {
      disposed = true;
      if (idleId !== null && typeof window.cancelIdleCallback === 'function') window.cancelIdleCallback(idleId);
      if (timerId !== null) window.clearTimeout(timerId);
    };
  }, [lessonId, categoryId, eager]);

  return state;
}
