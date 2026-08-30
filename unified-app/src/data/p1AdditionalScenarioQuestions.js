export const P1_ADDITIONAL_SCENARIOS_BY_LESSON = Object.freeze({
  'k-means': [
    {
      id: 'kmeans-choose-k',
      level: 'application',
      relatedComparison: 'inertia-silhouette-domain-k',
      scenario: 'Inertia decreases for every larger k, while silhouette score peaks near k = 4 and domain review suggests four meaningful customer groups.',
      prompt: 'How should k be selected?',
      choices: ['Combine validation-style clustering diagnostics such as silhouette/elbow behavior with stability and domain usefulness', 'Choose the largest k because inertia always improves as k increases', 'Choose k = 1 because it uses the fewest centroids'],
      answerIndex: 0,
      explanation: 'K selection is a model-selection problem without one universal metric; inertia, silhouette, stability, and whether clusters are useful should be considered together.',
      misconceptionTested: 'The lowest possible inertia uniquely determines the correct number of clusters.',
    },
  ],
  'recommender-systems-ranking-track': [
    {
      id: 'rec-matrix-factorization-intuition',
      level: 'mechanism',
      relatedComparison: 'interaction-matrix-latent-factors',
      scenario: 'A sparse user-item interaction matrix is approximated by low-dimensional user and item vectors whose dot products predict affinity.',
      prompt: 'What is matrix factorization learning?',
      choices: ['Latent user and item factors that reconstruct useful structure in the sparse interaction matrix', 'A separate one-hot classifier for every possible user-item pair', 'Only item popularity with no user-specific representation'],
      answerIndex: 0,
      explanation: 'Matrix factorization represents users and items in a shared latent space so their vector interaction approximates observed preferences and generalizes to unobserved pairs.',
      misconceptionTested: 'Collaborative matrix factorization stores only memorized observed interactions and cannot generalize across latent structure.',
    },
  ],
});

export function getP1AdditionalScenariosForLesson(lessonId) {
  return P1_ADDITIONAL_SCENARIOS_BY_LESSON[lessonId] || [];
}
