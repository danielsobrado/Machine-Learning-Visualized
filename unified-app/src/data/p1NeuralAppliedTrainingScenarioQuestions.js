export const P1_NEURAL_APPLIED_TRAINING_SCENARIOS_BY_LESSON = Object.freeze({
  "gradient-descent": [
    {
      id: "gd-quadratic-step-worked",
      level: "calculation",
      relatedComparison: "stable-step-vs-overshoot",
      scenario: "A one-parameter model has loss L(w) = (w - 1)^2. At w = 4 the gradient is 6. The team compares learning rates 0.1 and 1.0 using one ordinary gradient-descent update, w_next = w - learning_rate * gradient.",
      prompt: "Which one-step result correctly identifies the safer update on this local quadratic?",
      choices: [
        "With 0.1, w becomes 3.4 and loss falls from 9 to 5.76; with 1.0, w becomes -2 and loss stays at 9, so 0.1 makes useful progress without overshooting as far",
        "With 1.0, w becomes 10 and loss falls to 0 because a larger learning rate always follows the gradient more accurately",
        "Both learning rates produce w = 1 because gradient descent normalizes every gradient before applying the step",
      ],
      answerIndex: 0,
      explanation: "The update subtracts learning_rate times the gradient. Starting from 4, a 0.1 step moves to 3.4 and lowers the quadratic loss to 5.76. A 1.0 step jumps across the minimum to -2, where the loss is back to 9, illustrating how an excessive step can overshoot even when the gradient direction is correct.",
      misconceptionTested: "A correct gradient direction guarantees that a larger learning rate will reduce the loss more.",
    },
  ],
  "neural-network": [
    {
      id: "nn-capacity-serving-tradeoff-worked",
      level: "decision",
      relatedComparison: "capacity-generalization-latency",
      scenario: "Two networks are trained on the same data with the same evaluation pipeline. Model A has 2.0 million parameters, training loss 0.02, validation loss 0.19, and P95 latency 12 ms. Model B has 0.3 million parameters, training loss 0.05, validation loss 0.08, and P95 latency 4 ms. The serving SLO is 5 ms.",
      prompt: "Which model is the stronger deployment candidate from the evidence given, and why?",
      choices: [
        "Model B, because it generalizes better on validation data and satisfies the latency SLO despite having slightly higher training loss",
        "Model A, because the lowest training loss proves it learned the true function better and serving latency should be ignored",
        "Model A, because more parameters guarantee better out-of-sample performance once the training loss is near zero",
      ],
      answerIndex: 0,
      explanation: "Model B has the lower validation loss, which is the relevant evidence for generalization, and it also meets the stated 5 ms serving constraint. Model A fits the training set more tightly but has a much larger train-validation gap and violates the latency SLO, so its lower training loss is not enough to justify deployment.",
      misconceptionTested: "The neural network with the most parameters or the lowest training loss is automatically the best model to deploy.",
    },
  ],
  "initialization": [
    {
      id: "init-he-fan-in-worked",
      level: "calculation",
      relatedComparison: "he-scale-vs-oversized-initialization",
      scenario: "A ReLU layer has fan-in 400. The team is choosing between weight standard deviations 0.071 and 0.50. Using the He initialization rule std = sqrt(2 / fan_in), the target scale can be estimated before training.",
      prompt: "Which initialization is consistent with the rule, and what failure is the larger scale more likely to cause?",
      choices: [
        "About 0.071, because sqrt(2/400) is about 0.071; 0.50 is roughly seven times larger and is much more likely to amplify activation and gradient variance through depth",
        "0.50, because He initialization sets the standard deviation equal to 2 divided by fan-in without taking a square root",
        "Both are equivalent because initialization scale does not affect forward or backward signal variance in ReLU networks",
      ],
      answerIndex: 0,
      explanation: "He initialization uses a variance of roughly 2/fan-in for ReLU-like activations, so the standard deviation is sqrt(0.005), about 0.071. A standard deviation of 0.50 has far larger variance and can make signals grow rapidly across layers instead of keeping their scale reasonably stable.",
      misconceptionTested: "Any small-looking random weight scale is acceptable, and fan-in does not need to influence initialization.",
    },
  ],
  "optimizers": [
    {
      id: "optimizer-resume-state-diagnosis",
      level: "diagnosis",
      relatedComparison: "full-checkpoint-vs-weights-only-resume",
      scenario: "Training with AdamW is stable at step 80,000. After a restart, the model weights are restored exactly, but the optimizer first- and second-moment buffers and scheduler state are reinitialized. The loss spikes immediately even though the next batches match the previous data distribution.",
      prompt: "What is the most direct checkpointing problem to investigate before changing the model architecture?",
      choices: [
        "The run resumed weights without the optimizer and scheduler state, so AdamW effective updates and learning-rate position no longer match the pre-restart training trajectory",
        "The model weights must be corrupted because optimizer state never affects parameter updates after the first training step",
        "AdamW is deterministic only when the training dataset is replaced after every checkpoint restore",
      ],
      answerIndex: 0,
      explanation: "AdamW updates depend on accumulated first- and second-moment estimates, while the scheduler determines the current step size. Restoring only model weights changes both pieces of training state at the resume boundary, so a sudden loss spike can come from a discontinuous optimization trajectory rather than from the network architecture.",
      misconceptionTested: "Restoring neural-network weights alone is sufficient to resume stateful optimizer training exactly where it stopped.",
    },
  ],
  "training-loop-dynamics": [
    {
      id: "training-loop-scheduler-accumulation-diagnosis",
      level: "diagnosis",
      relatedComparison: "microbatch-count-vs-optimizer-step-count",
      scenario: "A run accumulates gradients over 8 microbatches before each optimizer step. Warm-up is intended to last 1,000 optimizer updates, but the learning-rate scheduler is advanced after every microbatch. The target learning rate is therefore reached while only 125 optimizer updates have occurred.",
      prompt: "What training-loop bug does this reveal, and what should the schedule usually follow here?",
      choices: [
        "The scheduler is counting microbatches instead of optimizer updates; with this design it should advance with the actual optimizer-step cadence so warm-up lasts the intended 1,000 updates",
        "Gradient accumulation requires the scheduler to advance eight times per optimizer update so the effective learning rate is multiplied by eight",
        "The scheduler is correct because warm-up length is defined only by examples seen and can never depend on optimizer-step frequency",
      ],
      answerIndex: 0,
      explanation: "Gradient accumulation separates forward/backward microbatches from parameter updates. If a schedule was specified in optimizer steps, advancing it on every microbatch compresses the schedule by the accumulation factor. The fix is to align scheduler stepping with the event the schedule is defined around: the actual optimizer update.",
      misconceptionTested: "Microbatch count and optimizer-step count are interchangeable when learning-rate schedules use gradient accumulation.",
    },
  ],
  "dropout-batchnorm": [
    {
      id: "dropout-batchnorm-eval-mode-diagnosis",
      level: "diagnosis",
      relatedComparison: "training-mode-vs-evaluation-mode",
      scenario: "The same validation example is scored repeatedly. Its prediction changes from call to call, and its score also changes when unrelated examples are placed beside it in the validation batch. Inspection shows the model was never switched from training mode after fitting.",
      prompt: "Which pair of mechanisms best explains both symptoms?",
      choices: [
        "Dropout remains stochastic and BatchNorm keeps using current-batch statistics; evaluation mode should disable ordinary dropout sampling and use the learned BatchNorm running statistics",
        "Dropout becomes deterministic in training mode while BatchNorm ignores the batch, so the changing predictions must come from label noise",
        "Both Dropout and BatchNorm are inference-only layers, so leaving the model in training mode cannot affect validation predictions",
      ],
      answerIndex: 0,
      explanation: "Training mode activates ordinary dropout masks and makes BatchNorm use batch statistics while updating its running estimates. Those behaviors explain both repeated-call randomness and dependence on other validation examples. Evaluation mode changes both mechanisms to their intended inference behavior.",
      misconceptionTested: "Switching a network between training and evaluation modes has no meaningful effect on Dropout or BatchNorm behavior.",
    },
  ],
  "gradient-problems": [
    {
      id: "gradient-clipping-norm-worked",
      level: "calculation",
      relatedComparison: "clipping-update-control-vs-root-cause-fix",
      scenario: "A recurrent model produces a global gradient norm of 50 on one step, while the configured maximum norm is 5. Global-norm clipping rescales the full gradient vector when the norm exceeds the threshold, but it does not change the forward computation that created the gradient.",
      prompt: "What scale factor is applied, and what can clipping legitimately claim to fix?",
      choices: [
        "The gradient is scaled by 5/50 = 0.1; clipping limits this update magnitude but does not by itself remove the underlying cause of exploding gradients",
        "The gradient is scaled by 50/5 = 10, which makes the step larger so the optimizer escapes the explosion faster",
        "The gradient is set permanently to zero, proving that clipping solves vanishing and exploding gradients at their source",
      ],
      answerIndex: 0,
      explanation: "Global-norm clipping multiplies the gradient vector by max_norm/current_norm when the current norm is too large, giving 0.1 here. That protects the optimizer from an extreme update on this step, but recurrent dynamics, initialization, sequence length, or other conditioning problems can still be responsible for producing the large gradient.",
      misconceptionTested: "Gradient clipping eliminates the mechanism that causes exploding gradients rather than only bounding the resulting update.",
    },
  ],
  "layer-normalization": [
    {
      id: "layernorm-token-axis-worked",
      level: "calculation",
      relatedComparison: "within-token-normalization-vs-batch-statistics",
      scenario: "Ignoring epsilon and learned scale/shift, one token has feature vector [1, 3]. Its feature mean is 2 and its population standard deviation is 1. A second token in the same batch is later replaced with a completely different vector.",
      prompt: "What normalized values should LayerNorm produce for the first token, and should replacing the other token change them?",
      choices: [
        "[-1, 1], and replacing the other token should not change them because LayerNorm uses statistics across the first token’s own features",
        "[0, 0], and replacing the other token must change them because LayerNorm always uses the whole batch mean",
        "[-2, 2], and the result changes with batch size because LayerNorm estimates population statistics across examples",
      ],
      answerIndex: 0,
      explanation: "For the first token, subtracting mean 2 gives [-1, 1], and dividing by standard deviation 1 leaves [-1, 1]. Standard LayerNorm computes its normalization statistics over the representation features for that example/token, so unrelated batch members do not determine these normalized values.",
      misconceptionTested: "LayerNorm depends on statistics from other examples in the batch in the same way that BatchNorm does.",
    },
  ],
});

export function getP1NeuralAppliedTrainingScenariosForLesson(lessonId) {
  return P1_NEURAL_APPLIED_TRAINING_SCENARIOS_BY_LESSON[lessonId] || [];
}
