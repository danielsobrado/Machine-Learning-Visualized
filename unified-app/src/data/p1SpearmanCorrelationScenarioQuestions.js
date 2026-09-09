export const P1_SPEARMAN_CORRELATION_SCENARIOS_BY_LESSON = Object.freeze({
  'spearman-correlation': [
    {
      id: 'spearman-u-shape-dependence-diagnosis',
      level: 'diagnosis',
      relatedComparison: 'monotonic-association-vs-nonmonotonic-dependence',
      scenario: 'A scatterplot shows an almost perfect U-shape: Y is high for very small and very large X, and low near the middle. Spearman rho is close to zero.',
      prompt: 'What is the correct interpretation?',
      choices: ['There can be strong non-monotonic dependence even though Spearman finds little consistent rank direction', 'A near-zero Spearman value proves X and Y are independent', 'The U-shape means Spearman must be close to +1'],
      answerIndex: 0,
      explanation: 'Spearman measures monotonic rank association. In a U-shape, Y first falls and then rises as X increases, so there is no single rank direction even though the variables are strongly related. A scatterplot is essential before treating rho near zero as “no relationship.”',
      misconceptionTested: 'A Spearman correlation near zero rules out every form of dependence between two variables.',
    },
    {
      id: 'spearman-monotonic-transform-invariance',
      level: 'mechanism',
      relatedComparison: 'raw-scale-change-vs-rank-preservation',
      scenario: 'Two variables have a fixed ordering and Spearman rho = 0.82. Every value of Y is then transformed with a strictly increasing function, such as log(Y), and no ties or ordering changes are introduced.',
      prompt: 'What happens to Spearman rho?',
      choices: ['It remains 0.82 because a strictly increasing transform preserves every Y rank', 'It must decrease because logarithms compress large raw gaps', 'It becomes the Pearson correlation of the transformed raw values'],
      answerIndex: 0,
      explanation: 'Spearman depends on ranks rather than raw spacing. A strictly increasing transformation preserves the ordering, so the rank vectors and therefore Spearman rho are unchanged.',
      misconceptionTested: 'Changing raw numeric spacing necessarily changes a rank correlation even when every observation keeps the same order.',
    },
    {
      id: 'spearman-outlier-order-vs-magnitude',
      level: 'comparison',
      relatedComparison: 'extreme-magnitude-vs-rank-reversal',
      scenario: 'In dataset A, the observation already ranked largest in both X and Y gets a Y value multiplied by 1,000 but remains the largest. In dataset B, that same observation moves from the largest Y rank to the smallest Y rank.',
      prompt: 'Which change is more damaging to Spearman correlation?',
      choices: ['Dataset B because Spearman reacts to the large rank-order reversal, while the magnitude-only change in A preserves ranks', 'Dataset A because the largest raw number always dominates a correlation coefficient', 'Both changes must affect Spearman equally because they alter the same observation'],
      answerIndex: 0,
      explanation: 'Spearman is relatively insensitive to extreme magnitude when rank order stays fixed. It is not robust to arbitrary rank changes: moving one observation from one end of the ordering to the other creates large rank disagreement.',
      misconceptionTested: 'Spearman is robust to outliers in every sense, including outliers that radically change the rank ordering.',
    },
    {
      id: 'spearman-small-sample-uncertainty-decision',
      level: 'decision',
      relatedComparison: 'large-rho-point-estimate-vs-finite-sample-uncertainty',
      scenario: 'A study with only six paired observations reports Spearman rho = 0.90. One modest rank swap would change the coefficient substantially, and no uncertainty analysis is shown.',
      prompt: 'What is the defensible reporting decision?',
      choices: ['Report the strong observed rank association but quantify uncertainty or use an appropriate small-sample test before making a stable-population claim', 'Treat rho = 0.90 as essentially exact because rank correlation is nonparametric', 'Ignore sample size because Spearman only depends on order'],
      answerIndex: 0,
      explanation: 'A rank statistic is still an estimate from finite data. With n = 6, a few rank changes can move rho materially. Confidence intervals, resampling, or an appropriate exact/permutation test help communicate how uncertain the population association remains.',
      misconceptionTested: 'Nonparametric statistics are automatically precise and sample size does not matter for rank correlation.',
    },
    {
      id: 'spearman-paired-missing-data-design',
      level: 'design',
      relatedComparison: 'paired-complete-cases-vs-independent-ranking',
      scenario: 'A dataset contains paired measurements X and Y, but some rows are missing X and different rows are missing Y. An analyst ranks all non-missing X values and all non-missing Y values separately, then tries to correlate the two rank lists even though they no longer refer to the same units.',
      prompt: 'What should the analysis do instead for a complete-case Spearman calculation?',
      choices: ['Define the paired rows with both X and Y observed first, then rank X and Y within that same set of units', 'Rank each variable on whatever rows are available and align the two rank lists by rank position', 'Fill every missing value with the best possible rank so sample size is preserved'],
      answerIndex: 0,
      explanation: 'Spearman correlates two ranks for the same observational units. Missing-data handling must preserve that pairing. A simple complete-case analysis first selects rows with both values and then computes both rank vectors on that common row set; other missing-data methods require their own justified assumptions.',
      misconceptionTested: 'Spearman ranks can be computed on different sets of observations and then compared as though row identity does not matter.',
    },
  ],
});

export function getP1SpearmanCorrelationScenariosForLesson(lessonId) {
  return P1_SPEARMAN_CORRELATION_SCENARIOS_BY_LESSON[lessonId] || [];
}
