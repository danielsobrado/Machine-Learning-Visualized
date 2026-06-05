export function filterExercisesByGroups(exercises, groups) {
  const groupSet = new Set(groups);
  return exercises.filter((exercise) => groupSet.has(exercise.group));
}
