import { CUSTOM_LESSON_CODE_LABS, getMappedLessonExercises } from './lessonCodeLabMappings.js';

export function applyLessonLabMappings(groups) {
  return groups.flatMap((group) => {
    if (CUSTOM_LESSON_CODE_LABS.has(group.lessonId)) {
      return [group];
    }

    const exercises = getMappedLessonExercises(group.lessonId);
    if (!exercises) return [];

    return [{
      ...group,
      exercises: exercises.map((exercise, index) => ({
        ...exercise,
        id: `${group.lessonId}--${exercise.id}`,
        group: group.lessonName,
        stepLabel: `${group.groupNumber}.${index + 1}`,
      })),
    }];
  });
}
