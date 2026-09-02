export const P1_ADVANCED_NEURAL_ARCHITECTURES_APPLIED_SCENARIOS_BY_LESSON = Object.freeze({
  lstm: [
    {
      id: 'lstm-cell-state-update-worked',
      level: 'calculation',
      relatedComparison: 'gated-cell-state-update-vs-overwriting-recurrent-memory',
      scenario: 'Consider one scalar component of an LSTM cell. The previous cell state is c_prev = 2.0. At the current step the forget gate is f = 0.8, the input gate is i = 0.25, the candidate value is g = -0.4, and the output gate is o = 0.6. Use c_t = f*c_prev + i*g. For the hidden state, use h_t = o*tanh(c_t) and tanh(1.5) approximately 0.905.',
      prompt: 'What are the updated cell state and hidden state, and what does the calculation reveal about how an LSTM preserves and edits memory?',
      choices: [
        'c_t = 1.5 and h_t approximately 0.543; most old memory is retained, a small negative candidate update is written, and only part of the resulting memory is exposed',
        'c_t = 2.3 and h_t approximately 1.38; gate values should be added to the cell state rather than used as multiplicative filters',
        'c_t = -0.1 and h_t approximately -0.06; the input gate replaces the previous cell state instead of combining with the forget path',
      ],
      answerIndex: 0,
      explanation: 'The retained old memory is 0.8*2.0 = 1.6. The written candidate contribution is 0.25*(-0.4) = -0.1, so c_t = 1.6 - 0.1 = 1.5. The exposed hidden state is 0.6*tanh(1.5) approximately 0.6*0.905 = 0.543. The arithmetic shows why the cell path is additive: forgetting and writing are separate gated operations, while the output gate controls what downstream layers see.',
      misconceptionTested: 'LSTM gates are labels or switches that completely replace memory; the cell update is actually a weighted additive combination, and the stored cell state can differ from the exposed hidden state.',
    },
    {
      id: 'lstm-bptt-gradient-retention-worked',
      level: 'calculation',
      relatedComparison: 'gated-additive-gradient-path-vs-repeated-small-recurrent-derivatives',
      scenario: 'A simplified LSTM memory component is preserved across five recurrent transitions with forget-gate value 0.9 at every transition, and assume no other path changes that component. The derivative carried through this cell-state path is therefore the product of the five forget gates. For comparison, imagine a plain recurrent path whose local derivative magnitude is 0.5 at each of the same five transitions.',
      prompt: 'Approximately how much gradient magnitude survives each path after five transitions, and which mechanism better preserves long-range credit assignment?',
      choices: [
        'LSTM cell path: 0.9^5 approximately 0.590; plain path: 0.5^5 = 0.03125, so the gated cell path preserves substantially more gradient signal',
        'LSTM cell path: 4.5; plain path: 2.5, because recurrent derivatives should be summed across time rather than multiplied by the chain rule',
        'Both paths preserve exactly 1.0 because recurrence automatically prevents vanishing gradients regardless of the local derivatives',
      ],
      answerIndex: 0,
      explanation: 'Backpropagation multiplies local derivatives along a path. Five factors of 0.9 retain about 59% of the incoming gradient, while five factors of 0.5 retain only 3.125%. LSTMs do not eliminate vanishing gradients, but a cell-state path with forget gates near one can create a much less destructive route through time than repeatedly applying smaller recurrent derivatives.',
      misconceptionTested: 'An LSTM magically prevents all vanishing gradients, or recurrent gradients are added rather than multiplied. The useful property is a controllable additive state path whose derivative can stay near one when forget gates preserve memory.',
    },
  ],
  vae: [
    {
      id: 'vae-reparameterization-worked',
      level: 'calculation',
      relatedComparison: 'reparameterized-latent-sampling-vs-nondifferentiable-direct-random-draw',
      scenario: 'A two-dimensional VAE encoder outputs mu = [1.0, -1.0] and log-variance = [0.0, 1.386]. Use sigma = exp(0.5*logvar), so the standard deviations are approximately [1.0, 2.0]. During this training example the sampled standard-normal noise is epsilon = [0.5, -0.25]. The reparameterization rule is z = mu + sigma*epsilon.',
      prompt: 'What latent sample z is used for this example, and why is this form useful for gradient-based training?',
      choices: [
        'z = [1.5, -1.5]; randomness is isolated in epsilon while z remains a differentiable arithmetic function of the learned mu and sigma',
        'z = [0.5, -0.75]; epsilon replaces mu, so gradients do not need to pass through the encoder distribution parameters',
        'z = [1.5, -1.25]; log-variance itself should multiply epsilon directly instead of first converting it to standard deviation',
      ],
      answerIndex: 0,
      explanation: 'The first coordinate is 1.0 + 1.0*0.5 = 1.5. The second is -1.0 + 2.0*(-0.25) = -1.5. Reparameterization does not remove stochasticity; it moves the random draw into epsilon. The resulting z is still differentiable with respect to mu and sigma, which allows reconstruction gradients to train the encoder parameters through the sampled latent variable.',
      misconceptionTested: 'The reparameterization trick makes the VAE deterministic or removes randomness. It instead expresses the random sample as differentiable learned parameters plus external noise so gradients can flow through the sampling computation.',
    },
    {
      id: 'vae-kl-regularization-worked',
      level: 'calculation',
      relatedComparison: 'reconstruction-only-autoencoding-vs-kl-regularized-latent-distribution-learning',
      scenario: 'A VAE has two independent Gaussian latent dimensions with mu = [1.0, 0.0] and log-variance = [0.0, 1.386], where exp(1.386) is approximately 4. For a standard-normal prior, use KL = 0.5*sum(mu^2 + exp(logvar) - 1 - logvar). The reconstruction loss for this example is 2.0 and beta = 0.5 in total_loss = reconstruction + beta*KL.',
      prompt: 'What are the approximate KL term and beta-weighted total loss, and what behavior does the KL term discourage?',
      choices: [
        'KL approximately 1.307 and total loss approximately 2.654; KL penalizes posterior means and variances that drift too far from the standard-normal prior',
        'KL approximately 0 and total loss exactly 2.0; any Gaussian posterior has zero KL as long as reconstruction error is finite',
        'KL approximately 2.614 and total loss approximately 3.307; beta should multiply reconstruction loss rather than the KL regularizer',
      ],
      answerIndex: 0,
      explanation: 'Dimension one contributes 0.5*(1 + 1 - 1 - 0) = 0.5. Dimension two contributes 0.5*(0 + 4 - 1 - 1.386) approximately 0.807. The total KL is therefore about 1.307. With beta = 0.5, the minimized loss is 2.0 + 0.5*1.307 approximately 2.654. This pressure keeps q(z|x) closer to the prior so prior samples are more likely to land in decoder-supported regions.',
      misconceptionTested: 'VAE training is only reconstruction, or KL is automatically zero for Gaussian latents. The KL term explicitly measures deviation from the chosen prior and beta controls how strongly that regularization competes with reconstruction fidelity.',
    },
  ],
  moe: [
    {
      id: 'moe-routing-capacity-worked',
      level: 'calculation',
      relatedComparison: 'total-expert-parameter-capacity-vs-per-token-active-computation',
      scenario: 'A sparse mixture-of-experts layer contains 16 experts, and each expert has 100 million parameters. The router uses top-2 routing, so each token activates exactly two experts. Ignore shared attention, router parameters, and implementation overhead for this calculation; compare only the expert parameter pool with the expert parameters touched by one token.',
      prompt: 'How many expert parameters are stored in total, how many are active for one token, and what conditional-computation advantage does that demonstrate?',
      choices: [
        '1.6 billion expert parameters are stored, 200 million are active per token, so the expert pool has 8 times the parameter capacity of the expert computation used by one token',
        '200 million expert parameters are stored and all 200 million are active, because unselected experts do not count toward model capacity',
        '1.6 billion expert parameters are stored and all 1.6 billion run for every token, because top-2 only changes how outputs are weighted after dense execution',
      ],
      answerIndex: 0,
      explanation: 'The stored expert pool is 16*100M = 1.6B parameters. Top-2 activates 2*100M = 200M expert parameters for one token. The ratio is 1.6B/200M = 8. This is the central MoE scaling idea: total representational capacity can grow with the expert pool while per-token expert work remains tied mainly to top-k rather than total expert count.',
      misconceptionTested: 'Sparse MoE either stores only the selected experts or executes every expert and merely changes output weights. In reality all expert parameters exist, while routing activates only a small subset for each token.',
    },
    {
      id: 'moe-load-balance-worked',
      level: 'calculation',
      relatedComparison: 'average-expert-capacity-vs-hot-expert-overflow-under-skewed-routing',
      scenario: 'An MoE batch contains 160 tokens, uses top-2 routing, and has 8 experts. That creates 320 expert assignments. The average is therefore 40 assignments per expert. If the implementation uses capacity factor 1.25, each expert can accept 50 assignments for the batch. A routing trace shows one expert receiving 72 assignments before capacity enforcement.',
      prompt: 'How many assignments exceed that expert capacity, and why can the batch still bottleneck even though total expert capacity across the layer is sufficient?',
      choices: [
        '22 assignments exceed the hot expert capacity; capacity is enforced per expert, so skewed routing can overflow one expert while other experts remain underused',
        'No assignments overflow because the layer has 8*50 = 400 total expert slots, and spare slots on other experts automatically absorb any routing decision',
        '72 assignments overflow because an expert with capacity 50 cannot process any token once its requested load is above the limit',
      ],
      answerIndex: 0,
      explanation: 'The hot expert receives 72 assignments but has room for 50, so 72 - 50 = 22 assignments exceed its capacity. Although the layer has 400 aggregate slots, routing destinations matter: unused capacity on another expert does not automatically help a token assigned to the overloaded expert. This is why load-balancing losses, capacity factors, rerouting, or dropping policies matter in real MoE systems.',
      misconceptionTested: 'Only total layer capacity matters for MoE throughput. Expert capacity is local, so routing skew can create overflow, dropped tokens, or queues even while substantial capacity is idle on other experts.',
    },
  ],
});

export function getP1AdvancedNeuralArchitecturesAppliedScenariosForLesson(lessonId) {
  return P1_ADVANCED_NEURAL_ARCHITECTURES_APPLIED_SCENARIOS_BY_LESSON[lessonId] || [];
}
