export const P1_FRONTIER_SYSTEMS_APPLIED_SCENARIOS_BY_LESSON = Object.freeze({
  'test-time-compute-thinking-budgets': [
    {
      id: 'ttc-adaptive-budget-slo-worked',
      level: 'decision',
      relatedComparison: 'adaptive-test-time-compute-vs-fixed-budget-cost-quality-frontier',
      scenario: 'A workload has 70 easy queries and 30 hard queries. With a 1x thinking budget, easy-query accuracy is 95% and hard-query accuracy is 50%, at $0.001 per query. With an 8x budget, easy accuracy is 96% and hard accuracy is 78%, at $0.008 per query. The batch must reach at least 89.5% expected accuracy while staying below $0.40 total inference cost.',
      prompt: 'Which budget policy satisfies both the expected-quality target and the total-cost limit?',
      choices: [
        'Use 1x for easy queries and 8x for hard queries: expected accuracy is 0.70 x 0.95 + 0.30 x 0.78 = 89.9%, and total cost is 70 x $0.001 + 30 x $0.008 = $0.31',
        'Use 1x for every query: total cost is only $0.10, so the quality requirement can be ignored even though expected accuracy is 81.5%',
        'Use 8x for every query: expected accuracy is 90.6%, but total cost is $0.80, so exceeding the stated cost limit is acceptable whenever accuracy is highest',
      ],
      answerIndex: 0,
      explanation: 'Adaptive compute meets both constraints. Easy queries gain almost nothing from 8x compute, while hard queries gain substantially. Routing only the hard 30% to 8x yields 89.9% expected accuracy for $0.31, whereas fixed 1x misses the quality target and fixed 8x violates the cost ceiling.',
      misconceptionTested: 'Test-time compute should use one fixed maximum or minimum budget for every query instead of allocating inference effort where its marginal value is highest.',
    },
  ],
  'long-context-frontier-models': [
    {
      id: 'long-context-effective-window-diagnosis',
      level: 'diagnosis',
      relatedComparison: 'advertised-context-capacity-vs-effective-evidence-use-under-position-and-distractor-stress',
      scenario: 'A model advertises a 1M-token context window. On single-needle retrieval it scores 98% when evidence is near the beginning, 96% near the end, and 72% in middle positions. On a realistic two-hop task with distractors, accuracy falls to 49% when the two supporting facts are separated by more than 300K tokens.',
      prompt: 'What conclusion is best supported by these measurements?',
      choices: [
        'The model can technically accept 1M tokens, but its effective context for reliable evidence use is materially smaller and position/task dependent',
        'The 1M-token claim is fully validated because single-needle accuracy exceeds 95% in at least two positions',
        'The failures prove tokenization cannot represent middle-position text, so context length is unrelated to evidence-use reliability',
      ],
      answerIndex: 0,
      explanation: 'Maximum accepted sequence length is a capacity claim, not a guarantee of uniform reasoning quality. The strong position effect and collapse on separated multi-hop evidence show that usable context depends on where evidence appears, distractor load, and the reasoning required to combine it.',
      misconceptionTested: 'A model that accepts a very long prompt and passes a simple needle benchmark necessarily uses all positions and multi-hop evidence with equal reliability.',
    },
  ],
  'omni-multimodal-architectures': [
    {
      id: 'omni-temporal-skew-worked',
      level: 'calculation',
      relatedComparison: 'cross-modal-timestamp-alignment-vs-semantic-model-capacity',
      scenario: 'An omni model consumes audio features every 20 ms and video frames every 40 ms. A camera clock is accidentally delayed by 120 ms relative to the audio stream. Training examples are otherwise correct, but lip-motion and phoneme alignment quality drops sharply after this pipeline change.',
      prompt: 'How large is the temporal misalignment in each modality timeline, and what should be fixed first?',
      choices: [
        'The skew equals 6 audio feature steps and 3 video frames; correct timestamp synchronization/alignment before changing model capacity',
        'The skew equals 3 audio steps and 6 video frames; increase the language-model vocabulary because timing errors are tokenization errors',
        'The skew is less than one step in both streams; retrain a larger model because 120 ms cannot materially affect audiovisual alignment',
      ],
      answerIndex: 0,
      explanation: 'At 20 ms per audio step, 120 ms corresponds to 6 audio steps. At 40 ms per video frame, it corresponds to 3 video frames. That systematic offset corrupts the cross-modal correspondence the model is supposed to learn, so the data/timestamp contract should be repaired before adding capacity.',
      misconceptionTested: 'Multimodal alignment failures should be attributed to model capacity before verifying whether modality clocks and sampling timelines actually refer to the same real-world moments.',
    },
  ],
});

export function getP1FrontierSystemsAppliedScenariosForLesson(lessonId) {
  return P1_FRONTIER_SYSTEMS_APPLIED_SCENARIOS_BY_LESSON[lessonId] || [];
}
