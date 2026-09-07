export const P1_SEQUENCE_TRAINING_SCENARIOS_BY_LESSON = Object.freeze({
  'transformer-token-generation': [
    {
      id: 'sequence-teacher-forcing-mechanism',
      level: 'mechanism',
      relatedComparison: 'gold-prefix-training-vs-model-prefix-inference',
      scenario: 'During autoregressive sequence training, the model predicts token y_t while conditioning on the ground-truth prefix y_<t. At inference, after the first generated token, the next prediction conditions on the model-generated prefix instead.',
      prompt: 'What training strategy is being described, and what train/inference distinction matters?',
      choices: [
        'Teacher forcing: training supplies the gold previous tokens, while autoregressive inference must condition on the model own generated history',
        'Scheduled sampling: training always uses only model-generated prefixes from the first update onward',
        'Bidirectional decoding: inference can condition on future target tokens because they were present during training',
      ],
      answerIndex: 0,
      explanation: 'Teacher forcing makes supervised sequence training efficient because every next-token target can be learned from a correct prefix. At inference those future gold tokens are unavailable, so the model conditions on its own generated history.',
      misconceptionTested: 'Autoregressive training and inference always condition on exactly the same prefix source.',
    },
    {
      id: 'sequence-exposure-bias-diagnosis',
      level: 'diagnosis',
      relatedComparison: 'teacher-forced-loss-vs-free-running-rollout',
      scenario: 'A sequence model has very low teacher-forced validation loss. In free-running generation, one slightly wrong token early in a long output changes the prefix, later predictions degrade, and errors compound. The model rarely saw such imperfect prefixes during supervised training.',
      prompt: 'What failure mode best explains the gap?',
      choices: [
        'Exposure bias: training mostly conditions on gold histories, but inference exposes the model to histories containing its own mistakes, so early errors can shift later inputs away from the training distribution',
        'Label leakage from causal masking, because autoregressive models are expected to read all future targets at inference',
        'Gradient explosion during inference, even though no backpropagation is occurring in the generation loop',
      ],
      answerIndex: 0,
      explanation: 'Low teacher-forced loss does not guarantee stable rollouts. Once inference conditions on a mistaken generated token, the model can enter prefix states it encountered less often during training, allowing errors to cascade.',
      misconceptionTested: 'Low next-token loss under gold prefixes guarantees equally strong free-running generation.',
    },
    {
      id: 'sequence-parallel-training-autoregressive-inference',
      level: 'comparison',
      relatedComparison: 'parallel-causal-training-vs-sequential-decoding',
      scenario: 'A decoder-only language model trains on full target sequences in parallel using a causal attention mask and a shifted next-token loss. At inference it generates one token, appends it to the context, then runs the next decoding step.',
      prompt: 'Why is parallel training compatible with autoregressive inference without leaking future targets?',
      choices: [
        'The causal mask prevents position t from attending to future positions even though many positions are computed in parallel; inference must still decode sequentially because each newly generated token becomes part of the next prefix',
        'Parallel training allows every position to read future target tokens, but the optimizer removes that leakage before deployment',
        'Autoregressive inference can generate all future tokens in parallel because the causal mask makes generated tokens independent of one another',
      ],
      answerIndex: 0,
      explanation: 'Causal masking preserves the autoregressive information constraint during parallel training. The training targets are available for the loss, not as visible future context. At inference the unknown future sequence does not exist yet, so outputs must be generated step by step.',
      misconceptionTested: 'Parallel causal-language-model training means the model can use future target tokens as context or decode all future outputs simultaneously.',
    },
  ],
});

export function getP1SequenceTrainingScenariosForLesson(lessonId) {
  return P1_SEQUENCE_TRAINING_SCENARIOS_BY_LESSON[lessonId] || [];
}
