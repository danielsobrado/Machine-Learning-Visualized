export const FRONTIER_CASE_STUDY_REVIEW_DATE = '2026-09-18';

function caseStudy(versionLabel, mechanismFocus) {
  return Object.freeze({
    lessonType: 'case-study',
    versionLabel,
    reviewedAt: FRONTIER_CASE_STUDY_REVIEW_DATE,
    mechanismFocus,
    maintenancePolicy: 'Keep durable mechanism questions separate from version-specific architecture facts; re-review version facts when the source model or paper changes.',
  });
}

export const FRONTIER_CASE_STUDY_METADATA = Object.freeze({
  'eagle-3-1-speculative-decoding': caseStudy(
    'EAGLE 3.1',
    'speculative decoding correctness, drafter quality, acceptance, and attention drift',
  ),
  turboquant: caseStudy(
    'TurboQuant',
    'low-bit KV-cache compression and preservation of attention-relevant geometry',
  ),
  'sd3-overview': caseStudy(
    'Stable Diffusion 3',
    'integration of latent representation, text encoders, joint attention, and flow matching',
  ),
  'qwen-hybrid-qsa': caseStudy(
    'Qwen hybrid QSA',
    'attention-mode selection and long-context compute tradeoffs',
  ),
  'qwen-gated-residual': caseStudy(
    'Qwen gated residual',
    'gated information flow and gradient propagation through residual pathways',
  ),
  'qwen-ngram-embedding': caseStudy(
    'Qwen n-gram embedding',
    'local n-gram signal added to token representations',
  ),
  'qwen-multimodal-moe': caseStudy(
    'Qwen multimodal MoE',
    'modality-aware routing, expert specialization, and sparse-compute tradeoffs',
  ),
  'qwen-training-recipe': caseStudy(
    'Qwen training recipe',
    'durable training principles separated from recipe-specific hyperparameters',
  ),
  'qwen-reasoning-control': caseStudy(
    'Qwen reasoning control',
    'reasoning-mode control, compute budgeting, and quality-cost tradeoffs',
  ),
});
