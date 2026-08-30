export const P0_EXPERIMENTATION_SCENARIOS_BY_LESSON = Object.freeze({
  'ab-testing-foundations': [
    {
      id: 'ab-peeking-false-positive',
      level: 'diagnosis',
      relatedComparison: 'fixed-horizon-vs-repeated-peeking',
      scenario: 'A team runs a nominal alpha = 0.05 A/B test but checks the p-value every hour and stops the first time p < 0.05.',
      prompt: 'What is the main statistical problem?',
      choices: ['Repeated unplanned looks inflate the chance of a false positive', 'More frequent checking makes the nominal alpha smaller automatically', 'Stopping early guarantees the observed lift is practically important'],
      answerIndex: 0,
      explanation: 'Repeatedly testing the same null with a fixed 0.05 threshold creates multiple opportunities to cross the boundary by chance, increasing false-positive risk.',
      misconceptionTested: 'A fixed 0.05 threshold remains a 5% experiment-level false-positive rate under arbitrary peeking.',
    },
    {
      id: 'ab-alpha-spending',
      level: 'design',
      relatedComparison: 'naive-peeking-vs-alpha-spending',
      scenario: 'A product team requires three planned interim analyses before the final experiment readout.',
      prompt: 'Which design keeps sequential decisions statistically controlled?',
      choices: ['Use a pre-specified sequential boundary or alpha-spending plan across the looks', 'Use p < 0.05 independently at every look with no correction', 'Ignore the number of looks because sample size is increasing'],
      answerIndex: 0,
      explanation: 'A sequential design allocates the error budget across planned interim analyses so stopping rules and repeated looks do not silently inflate Type I error.',
      misconceptionTested: 'Planned interim analyses need no adjustment if every individual test uses alpha 0.05.',
    },
  ],
});

export function getP0ExperimentationScenariosForLesson(lessonId) {
  return P0_EXPERIMENTATION_SCENARIOS_BY_LESSON[lessonId] || [];
}
