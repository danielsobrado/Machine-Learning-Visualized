export const P1_CNN_FAILURE_MODE_SCENARIOS_BY_LESSON = Object.freeze({
  conv2d: [
    {
      id: 'cnn-translation-shift-diagnosis',
      level: 'diagnosis',
      relatedComparison: 'translation-equivariance-vs-end-to-end-invariance',
      scenario: 'A classifier is almost perfect when an object appears near the center of each image, but accuracy drops sharply when the same object is shifted toward the edge. The convolution filters still detect similar local patterns in intermediate maps.',
      prompt: 'What is the strongest interpretation and next test?',
      choices: [
        'Convolutional weight sharing supports translation-equivariant local features, but the full network is not guaranteed to be translation invariant; evaluate controlled shifts and review stride, padding, pooling, classifier-head geometry, and augmentation',
        'Standard convolution guarantees the final class output is exactly invariant to every image translation, so the drop proves the labels must be wrong',
        'The correct fix is to learn a separate convolution kernel for every image location so shifted objects receive location-specific parameters',
      ],
      answerIndex: 0,
      explanation: 'Sliding the same kernel across space helps similar patterns produce correspondingly shifted feature responses, but borders, strides, pooling, flattening, and later layers can change the final prediction. Translation behavior should therefore be measured rather than assumed from weight sharing alone.',
      misconceptionTested: 'Convolutional weight sharing guarantees exact end-to-end translation invariance for the classifier.',
    },
    {
      id: 'cnn-shortcut-background-cue-diagnosis',
      level: 'diagnosis',
      relatedComparison: 'causal-object-feature-vs-spurious-background-shortcut',
      scenario: 'A cattle classifier is trained mostly on photos where cattle appear on green pasture and non-cattle examples appear on roads or indoors. IID validation is excellent, but cattle photographed on beaches are often rejected. Saliency and occlusion tests suggest large background regions influence the score.',
      prompt: 'What failure mode should be tested first?',
      choices: [
        'Shortcut learning from a spurious background cue; test counterfactual crops/background swaps and broaden training data so the label cannot be predicted reliably from scenery alone',
        'A convolution layer cannot detect objects unless every image has the same background color, so this behavior is expected and not a dataset problem',
        'Increase pooling until the background fills fewer output cells, because more information loss guarantees the model will use the causal object features',
      ],
      answerIndex: 0,
      explanation: 'CNNs optimize predictive loss, not causal understanding. If background correlates strongly with the label, the network can exploit that easier signal. Counterfactual evaluation and more diverse data can reveal and reduce reliance on the shortcut.',
      misconceptionTested: 'High IID validation accuracy proves a CNN learned the intended object rather than an easier correlated feature.',
    },
  ],
  'max-pooling': [
    {
      id: 'cnn-pooling-localization-loss-diagnosis',
      level: 'diagnosis',
      relatedComparison: 'local-robustness-vs-spatial-information-loss',
      scenario: 'A segmentation model repeatedly applies 2 x 2 max pooling with stride 2. Classification accuracy remains strong, but boundaries of small objects become coarse and some tiny objects disappear from the prediction entirely.',
      prompt: 'What mechanism best explains the failure?',
      choices: [
        'Aggressive pooling keeps local maxima while discarding non-maximal values and precise within-window position, so repeated downsampling can erase spatial detail needed for localization',
        'Max pooling learns too many trainable parameters and therefore overfits object coordinates',
        'Pooling preserves every local activation exactly, so any localization loss must be unrelated to the downsampling path',
      ],
      answerIndex: 0,
      explanation: 'Max pooling trades spatial detail for compactness and some local tolerance. Dense prediction tasks often need skip connections, less aggressive downsampling, or other mechanisms that preserve fine-resolution information.',
      misconceptionTested: 'Pooling can reduce spatial resolution without losing information that matters for localization.',
    },
  ],
});

export function getP1CnnFailureModeScenariosForLesson(lessonId) {
  return P1_CNN_FAILURE_MODE_SCENARIOS_BY_LESSON[lessonId] || [];
}
