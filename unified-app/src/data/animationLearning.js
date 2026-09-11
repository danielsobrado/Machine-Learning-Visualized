import { getGlossaryTermsForCategory, GLOSSARY_IDS_BY_CATEGORY, FULL_GLOSSARY_CATEGORY_IDS } from './glossaryRepository.js';
import { curriculumTracks } from './animations.js';
import { getCurriculumDepth } from './curriculumDepth.js';
import { getConceptMap } from './conceptMaps.js';
import { getMindmapCuration } from './mindmapCuration.js';

export const CARD_TYPES = [
  { id: 'def', label: 'def.', title: 'Definition' },
  { id: 'int', label: 'int.', title: 'Intuition' },
  { id: 'eqn', label: 'eqn.', title: 'Equation' },
  { id: 'ex', label: 'ex.', title: 'Example' },
  { id: 'why', label: 'why.', title: 'Why it matters' },
  { id: 'do', label: 'do.', title: 'Try it' },
];

export const MATH_CONTROLS = [
  { id: 'prereq', sigil: '∂', label: 'Prereq' },
  { id: 'reset', sigil: '↺', label: 'Reset' },
  { id: 'play', sigil: '▷', label: 'Focus' },
  { id: 'sum', sigil: 'Σ', label: 'Glossary' },
  { id: 'next', sigil: '∇', label: 'Next' },
];

const CATEGORY_GLOSSARY_LIMITS = Object.fromEntries(
  FULL_GLOSSARY_CATEGORY_IDS.map((categoryId) => [
    categoryId,
    GLOSSARY_IDS_BY_CATEGORY[categoryId].length,
  ]),
);

function glossaryLimitForCategory(categoryId) {
  return CATEGORY_GLOSSARY_LIMITS[categoryId] || 12;
}

const CATEGORY_EQUATIONS = {
  nlp: 'x_{text} \\rightarrow v \\in \\mathbb{R}^d',
  transformers: '\\operatorname{Attention}(Q,K,V)=\\operatorname{softmax}(QK^T/\\sqrt{d_k})V',
  'frontier-llms': 'token_t \\rightarrow active\\ compute,\\ KV\\ memory,\\ context,\\ generation,\\ modality',
  'neural-networks': 'h_{\\ell}=\\sigma(W_{\\ell}h_{\\ell-1}+b_{\\ell})',
  'advanced-models': 'p_\\theta(y\\mid x,c)=\\int p_\\theta(y,z\\mid x,c)\\,dz',
  'math-fundamentals': 'f(x;\\theta) \\rightarrow \\arg\\min_\\theta \\mathcal{L}(\\theta)',
  'core-ml': '\\hat{f}=\\arg\\min_f \\mathcal{L}_{train}(f)\\quad then\\quad score(\\hat{f},D_{test})',
  'probability-stats': '\\mathbb{E}[X]=\\sum_x x\\,p(x)',
  'reinforcement-learning': "Q(s,a) \\leftarrow r+\\gamma\\max_{a'}Q(s',a')",
  algorithms: 'score(v)=\\sum_{u\\rightarrow v} w_{uv}\\,score(u)',
  'diffusion-models': 'dx_t=v_\\theta(x_t,t)\\,dt',
};

const EQUATION_OVERRIDES = {
  relu: 'f(x)=\\max(0,x)',
  'leaky-relu': 'f(x)=\\max(\\alpha x,x)',
  lstm: 'c_t=f_t\\odot c_{t-1}+i_t\\odot\\tilde{c}_t,\\quad h_t=o_t\\odot\\tanh(c_t)',
  conv2d: 'Y_{i,j}=\\sum_m\\sum_n X_{i+m,j+n}K_{m,n}',
  'conv-relu': 'A=\\max(0, X*K+b)',
  'max-pooling': 'Y_{i,j}=\\max_{0\\le m,n<k} X_{si+m,sj+n}',
  softmax: 'p_i=\\frac{e^{z_i}}{\\sum_j e^{z_j}}',
  'matrix-multiplication': 'C_{ij}=\\sum_k A_{ik}B_{kj}',
  'matrix-decompositions': 'A\\rightarrow LU,QR,V\\Lambda V^{-1},U\\Sigma V^T,LL^T',
  'fundamental-subspaces': '\\dim Row(A)=\\dim Col(A)=r,\\quad \\dim Null(A)=n-r,\\quad \\dim Null(A^T)=m-r',
  eigenvalue: 'Av=\\lambda v',
  svd: 'A=U\\Sigma V^T,\\quad \\sigma_1\\ge\\sigma_2\\ge\\cdots\\ge0',
  'qr-decomposition': 'A=QR,\\quad Q^TQ=I,\\quad R\\;\\text{upper triangular}',
  'linear-regression': '\\hat{y}=X\\beta+\\epsilon',
  'train-validation-test-split': 'D=D_{train}\\cup D_{val}\\cup D_{test}',
  'cross-validation': '\\operatorname{CV}_k=\\frac{1}{k}\\sum_{i=1}^{k} score_i',
  'data-leakage-deep-dive': 'D_{eval}\\cap Information(D_{train})=\\varnothing',
  'feature-scaling-preprocessing': 'z=\\frac{x-\\mu_{train}}{\\sigma_{train}}',
  overfitting: '\\mathcal{L}_{train}\\downarrow\\quad while\\quad \\mathcal{L}_{val}\\uparrow',
  'logistic-regression': 'p(y=1\\mid x)=\\sigma(w^Tx+b)',
  'classification-metrics': 'F_1=2\\cdot\\frac{precision\\cdot recall}{precision+recall}',
  'roc-pr-curves': 'ROC=(FPR,TPR)\\quad PR=(Recall,Precision)',
  calibration: 'P(y=1\\mid \\hat{p}=p)\\approx p',
  'bias-variance-tradeoff': '\\mathbb{E}[(y-\\hat{f}(x))^2]=Bias^2+Variance+Noise',
  regularization: '\\mathcal{L}_{total}=\\mathcal{L}_{data}+\\lambda\\lVert w\\rVert_2^2',
  'knn-naive-bayes-svm': '\\hat{y}=\\operatorname{vote}_k(x)\\quad or\\quad \\arg\\max_y p(y)\\prod_j p(x_j\\mid y)',
  'tree-ensembles': '\\hat{y}=\\operatorname{aggregate}(T_1(x),\\ldots,T_M(x))',
  'computation-graph-backprop': '\\frac{\\partial L}{\\partial w}=\\frac{\\partial L}{\\partial a}\\frac{\\partial a}{\\partial z}\\frac{\\partial z}{\\partial w}',
  'transformer-token-generation': 'x_{t+1}\\sim \\operatorname{Filter}(\\operatorname{softmax}(z_t/\\tau))',
  'kv-cache': 'K_{cache},V_{cache}\\leftarrow [K_{old},K_t],[V_{old},V_t]',
  'grouped-query-attention': 'H_{kv}<H_q,\\quad group=\\lfloor h_q/(H_q/H_{kv})\\rfloor',
  'flash-attention': 'O_i\\leftarrow \\operatorname{OnlineSoftmaxTile}(Q_i,K_j,V_j)',
  'rag-retrieval-evaluation': 'Recall@k=\\frac{|R\\cap Top_k|}{|R|}',
  'attention-masks': '\\operatorname{softmax}(QK^T/\\sqrt{d_k}+M)V',
  'positional-encoding': 'PE_{pos,2i}=\\sin(pos/10000^{2i/d}),\\quad PE_{pos,2i+1}=\\cos(pos/10000^{2i/d})',
  rope: 'q_m^T k_n=(R_m q)^T(R_n k)=q^T R_{n-m} k',
  'residual-stream': 'x_{\\ell+1}=x_{\\ell}+\\operatorname{Attn}(x_{\\ell})+\\operatorname{MLP}(x_{\\ell})',
  'transformer-architecture-families': 'Encoder\\;only\\neq Decoder\\;only\\neq Encoder\\text{-}Decoder',
  'llm-training-objectives': '\\mathcal{L}=-\\log p_\\theta(target\\mid context)',
  'sampling-strategies': 'x_{t+1}\\sim \\operatorname{Sample}(\\operatorname{TopP}(\\operatorname{TopK}(\\operatorname{softmax}(z/\\tau))))',
  'fine-tuning': 'W^{\\prime}=W+BA\\quad or\\quad \\max_\\theta\\log p_\\theta(y_{chosen})-\\log p_\\theta(y_{rejected})',
  'frontier-llm-architecture-overview': 'KV\\ bytes\\approx L\\cdot T\\cdot H_{kv}\\cdot d_h\\cdot2\\cdot bytes',
  'frontier-moe-systems': '\\operatorname{MoE}(x)=\\operatorname{SharedExpert}(x) + \\sum_{e\\in E_{selected}} g_e(x) \\cdot \\operatorname{Expert}_e(x)',
  'multi-head-latent-attention': 'c_t = W_{down} x_t \\quad K_t, V_t \\approx W_{up} c_t',
  'native-sparse-attention': 'z=g_c z_c + g_s z_s + g_w z_w',
  'grpo-reasoning': 'A_i = \\frac{r_i - \\operatorname{mean}(r)}{\\operatorname{std}(r)}',
  'dapo-reasoning-rl': 'L=\\operatorname{mean}_{tokens}\\min(r_t A,\\operatorname{clip}(r_t,1-\\epsilon_{low},1+\\epsilon_{high})A)',
  'coconut-latent-reasoning': 'x_{t+1}=h_t\\quad\\text{in latent mode}',
  'reasoning-rlvr-grpo': 'A_i = \\frac{r_i - \\mu}{\\sigma + \\epsilon} \\quad \\Delta \\theta \\propto \\mathbb{E}[\\nabla \\log \\pi_\\theta(y_i|x) A_i]',
  'test-time-compute-thinking-budgets': 'acc(N) \\approx 1 - (1 - p_{correct})^N \\quad cost(N) = N \\cdot L_{avg}',
  'long-context-frontier-models': 'score = Q + \\lambda_g G - \\lambda_c C - \\lambda_l L - \\lambda_r R',
  'omni-multimodal-architectures': 'h = Thinker(x_{text}, x_{image}, x_{audio}, x_{video}) \\quad speech = Talker(h)',
  'diffusion-language-models': 'q(x_t|x_0)=\\operatorname{mask}(x_0,t) \\quad p_\\theta(x_i|x_t,t)',
  'efficient-llm-serving': '\\text{goodput}=\\frac{\\text{requests within SLO}}{\\text{second}} \\quad TTFT=q+p+d_1',
  'frontier-evaluation-safety': '\\text{safe success}=\\text{task success}\\land\\neg\\text{policy violation}\\land\\neg\\text{unsafe action}',
  'tool-using-reasoning-models': '\\text{score}(\\text{tool}) = \\text{uncertainty\\_reduction} - \\text{latency} - \\text{cost} - \\text{safety\\_risk}',
  'agentic-coding-systems': 'Issue \\rightarrow Search \\rightarrow Plan \\rightarrow Edit \\rightarrow Test \\rightarrow Review \\rightarrow PR',
  'rag-chunking-context': 'chunks=\\operatorname{Split}(D,size,overlap)\\quad pack=\\arg\\max_{token\\ budget}\\sum relevance',
  'rag-vector-indexing': '\\operatorname{ANN}(q,I)\\approx \\arg\\max_{x_i\\in D}\\cos(q,x_i)',
  'rag-reranking-grounding': '\\operatorname{rerank}(\\{x_i\\},r)\\rightarrow \\operatorname{ground}(C,\\tau)',
  'rag-failure-modes': 'grounded\\iff supported\\;\\land\\;\\neg stale\\;\\land\\;\\neg conflict',
  'diffusion-basics': 'x_t=\\sqrt{1-t}\\,x_0+\\sqrt{t}\\,\\epsilon,\\quad \\hat{x}_0\\leftarrow x_t-\\hat{\\epsilon}',
  'diffusion-sampling': 'x_T\\sim\\mathcal{N}(0,I),\\quad x_{t-1}\\leftarrow S_\\phi(x_t,t,\\hat{\\epsilon}_\\theta)',
  'classifier-free-guidance': '\\hat{\\epsilon}=\\epsilon_{uncond}+s(\\epsilon_{cond}-\\epsilon_{uncond})',
  'unet-vs-dit': 'N=(H/P)(W/P),\\quad Attention\\;cost\\propto N^2',
  'gradient-descent': '\\theta_{t+1}=\\theta_t-\\eta\\nabla\\mathcal{L}(\\theta_t)',
  optimization: '\\theta_{t+1}=\\theta_t-\\eta\\,u_t,\\quad u_t=f(g_t,m_t,v_t,\\lambda)',
  optimizers: '\\theta_{t+1}=\\theta_t-\\eta\\,\\operatorname{Update}(g_t,m_t,v_t)',
  initialization: '\\sigma_{xavier}=\\sqrt{\\frac{2}{fan_{in}+fan_{out}}}\\quad \\sigma_{he}=\\sqrt{\\frac{2}{fan_{in}}}',
  'training-loop-dynamics': '\\theta_{t+1}=\\theta_t-\\eta\\hat{g}_{B_t},\\quad monitor:\\mathcal{L}_{train},\\mathcal{L}_{val}',
  'dropout-batchnorm': '\\hat{x}=\\frac{x-\\mu_B}{\\sqrt{\\sigma_B^2+\\epsilon}},\\quad y=\\gamma\\hat{x}+\\beta',
  'gradient-problems': '\\frac{\\partial L}{\\partial h_0}=\\frac{\\partial L}{\\partial h_L}\\prod_{\\ell=1}^{L}\\frac{\\partial h_\\ell}{\\partial h_{\\ell-1}}',
  'layer-normalization': '\\operatorname{LN}(x)=\\gamma\\frac{x-\\mu_x}{\\sqrt{\\sigma_x^2+\\epsilon}}+\\beta',
  entropy: 'H(X)=-\\sum_x p(x)\\log p(x)',
  'cross-entropy': 'H(p,q)=-\\sum_x p(x)\\log q(x)',
  'cosine-similarity': '\\cos(\\theta)=\\frac{u\\cdot v}{\\lVert u\\rVert\\lVert v\\rVert}',
  pca: 'X_c^TX_c v_i=\\lambda_i v_i',
  'k-means': '\\min_C\\sum_i \\lVert x_i-c_{a_i}\\rVert^2',
  'conditional-probability': 'P(A\\mid B)=\\frac{P(A\\cap B)}{P(B)}',
  'bayes-rule-ml': 'P(y\\mid x)=\\frac{P(x\\mid y)P(y)}{P(x)}',
  'sampling-confidence-intervals': '\\hat{p}\\pm z\\sqrt{\\frac{\\hat{p}(1-\\hat{p})}{n}}',
  'probability-distributions': 'p(x)\\ge 0,\\quad \\sum_x p(x)=1\\quad or\\quad \\int p(x)\\,dx=1',
  'hypothesis-testing-intuition': 'z=\\frac{observed\\ effect}{standard\\ error}',
  'ab-testing-foundations': '\\hat{\\Delta}=\\hat{p}_T-\\hat{p}_C,\\quad z=\\frac{\\hat{\\Delta}}{SE(\\hat{\\Delta})}',
  'power-sample-size': 'n_{per\\ group}\\approx\\frac{(z_{\\alpha/2}+z_{1-\\beta})^2(\\sigma_C^2+\\sigma_T^2)}{MDE^2}',
  'sequential-testing-peeking': 'P(any\\ false\\ positive)=1-(1-\\alpha)^k',
  'cuped-variance-reduction': 'Y_{cuped}=Y-\\theta(X-\\bar{X}),\\quad Var(Y_{cuped})\\approx Var(Y)(1-\\rho^2)',
  'confounding-simpsons-paradox': 'Effect_{agg}=\\sum_g w_g\\,Effect_g+\\sum_g \\Delta w_g\\,Baseline_g',
  'causal-graphs-dags': 'Backdoor:\\ T\\leftarrow C\\rightarrow Y,\\quad Collider:\\ T\\rightarrow S\\leftarrow U',
  'treatment-effects': 'ATE=E[Y(1)-Y(0)],\\quad CATE(x)=E[Y(1)-Y(0)\\mid X=x]',
  'propensity-scores': 'e(x)=P(T=1\\mid X=x),\\quad w_T=1/e(x),\\quad w_C=1/(1-e(x))',
  'time-series-forecasting-track': '\\hat{y}_{t+h}=f(y_t,y_{t-1},season(t),x_t),\\quad train[0:t]\\rightarrow test[t+1:t+h]',
  'recommender-systems-ranking-track': 'score(u,i)=p_u^Tq_i,\\quad DCG=\\sum_i\\frac{rel_i}{\\log_2(i+1)}',
  'ml-security-robustness-track': 'risk\\approx attack\\ surface\\times impact\\times(1-defense\\ coverage)',
  'efficient-inference-compression-track': 'latency=TTFT+tokens\\times decode\\ time,\\quad memory\\approx weights+KV\\ cache',
  'data-engineering-for-ml-track': 'feature\\_time\\le prediction\\_time<label\\_window\\_end',
  'model-debugging': '\\text{localize}(data,train,eval,serve)\\rightarrow \\text{one intervention}',
  'model-monitoring': '\\Delta_{data},\\Delta_{score},\\text{error budget},\\; y_{delayed}',
  'model-interpretability': '\\phi(x)\\mid background,\\quad \\text{stable if }x+\\varepsilon\\text{ agrees}',
  'spearman-correlation': '\\rho_s=1-\\frac{6\\sum_i d_i^2}{n(n^2-1)}',
  'maximum-likelihood-estimation': '\\hat{\\theta}=\\arg\\max_\\theta P(D\\mid\\theta)',
  'loss-functions-likelihoods': '\\mathcal{L}(\\theta)=-\\log P(y\\mid x,\\theta)',
  'expected-value-variance': '\\operatorname{Var}(X)=\\mathbb{E}[(X-\\mu)^2]',
  'rl-foundations': 'G_t=R_{t+1}+\\gamma R_{t+2}+\\gamma^2R_{t+3}+\\cdots',
  'mdp-formalism': 'M=(S,A,P,R,\\gamma)',
  'value-iteration': 'V_{k+1}(s)=\\max_a\\sum_{s\\prime}P(s\\prime\\mid s,a)[R+\\gamma V_k(s\\prime)]',
  'policy-iteration': '\\pi_{k+1}(s)=\\arg\\max_a\\mathbb{E}[R+\\gamma V^{\\pi_k}(s\\prime)]',
  'q-learning': "Q(s,a)\\leftarrow Q(s,a)+\\alpha[r+\\gamma\\max Q(s',a')-Q(s,a)]",
  'rl-exploration': 'a\\sim\\begin{cases}\\operatorname{Random}(A)&\\epsilon\\\\ \\arg\\max_a Q(s,a)&1-\\epsilon\\end{cases}',
  'policy-gradients': '\\nabla J(\\theta)=\\mathbb{E}[G_t\\nabla_\\theta\\log\\pi_\\theta(a_t\\mid s_t)]',
  'actor-critic': 'A_t=G_t-V_\\phi(s_t)\\quad actor:\\nabla\\log\\pi_\\theta(a_t\\mid s_t)A_t',
  'ppo-clipped-policy-gradient': 'L^{clip}=\\mathbb{E}[\\min(r_tA_t,\\operatorname{clip}(r_t,1-\\epsilon,1+\\epsilon)A_t)]',
  'reward-shaping': "r'=r+\\gamma\\Phi(s')-\\Phi(s)",
  'bloom-filter': 'p\\approx(1-e^{-kn/m})^k',
  pagerank: 'PR(v)=\\frac{1-d}{N}+d\\sum_{u\\in B_v}\\frac{PR(u)}{L(u)}',
};

function cardSet(def, intuition, equation, example, why, tryIt) {
  return {
    def: { body: def },
    int: { body: intuition },
    eqn: { body: equation },
    ex: { body: example },
    why: { body: why },
    do: { body: tryIt },
  };
}

export const LEARNING_CARD_OVERRIDES = {
  'matrix-multiplication': cardSet(
    'Matrix multiplication solves the problem of composing many weighted sums into one reusable operation.',
    'Read each output cell as one row asking one column how strongly they line up.',
    'The math is a row-column dot product: multiply aligned entries, then add the products.',
    'Manipulate one entry in A or B and predict exactly which output cells can change.',
    'Mistake to avoid: this is not elementwise multiplication; order and shape decide what the product means.',
    'Check understanding by computing one highlighted cell before revealing the animation result.',
  ),
  'linear-regression': cardSet(
    'Linear regression solves the problem of fitting a simple numeric trend from features to a continuous target.',
    'The line is a compromise: it moves to reduce all residuals, not to pass through every point.',
    'The math compares predictions with targets through residuals, then chooses parameters that reduce squared error.',
    'Manipulate slope and intercept, then watch which residuals shrink and which grow.',
    'Mistake to avoid: a lower training error alone does not prove the line will generalize.',
    'Check understanding by predicting whether a slope change raises or lowers total residual error.',
  ),
  'train-validation-test-split': cardSet(
    'Data splitting solves the problem of measuring generalization without letting evaluation data shape the model.',
    'Training is practice, validation is coaching, and the test set is the final exam.',
    'The math separates D into train, validation, and test slices with different jobs.',
    'Manipulate validation and test percentages and watch how much data remains for fitting.',
    'Mistake to avoid: repeated test-set tuning quietly turns the test set into validation data.',
    'Check understanding by identifying which split should guide threshold or hyperparameter choices.',
  ),
  'cross-validation': cardSet(
    'Cross-validation solves the problem of model selection depending too much on one validation split.',
    'Each fold gets one turn as validation while the other folds act as training data.',
    'The math averages validation scores across k rotations, but each pipeline must be refit inside the rotation.',
    'Manipulate the fold count and leakage risk, then compare reported validation score with honest signal.',
    'Mistake to avoid: preprocessing before the fold split lets validation information leak into training.',
    'Check understanding by naming which unit, such as user or time, must stay grouped before random splitting.',
  ),
  'data-leakage-deep-dive': cardSet(
    'Data leakage audits solve the problem of scores looking valid while hidden evaluation information shaped training.',
    'Leakage is an information boundary failure: validation or future facts sneak into features, preprocessing, splits, or decisions.',
    'The math is an independence promise: evaluation rows must not share learned information with the training process.',
    'Manipulate leakage mode and strict-pipeline controls to see how duplicate users, target fields, time order, and test tuning inflate scores.',
    'Mistake to avoid: random rows are not always independent when entities repeat, chronology matters, or features know the answer.',
    'Check understanding by naming the leaked information and the split or pipeline rule that blocks it.',
  ),
  'feature-scaling-preprocessing': cardSet(
    'Feature scaling solves the problem of raw columns having incompatible units, ranges, and missing-value treatments.',
    'A scaler learns training-set statistics, then applies the same transformation to validation, test, and production rows.',
    'The math includes z = (x - train_mean) / train_std, min-max ranges, and robust median/IQR scaling.',
    'Manipulate scaler type, outlier presence, fit scope, and selected point to compare distances before and after preprocessing.',
    'Mistake to avoid: fitting preprocessing on validation or test data leaks information just like tuning on the test set.',
    'Check understanding by predicting which scaler changes most when one validation outlier appears.',
  ),
  'fundamental-subspaces': cardSet(
    'The four fundamental subspaces solve the problem of understanding what a matrix measures, erases, reaches, and misses.',
    'The domain splits into row-space directions and null-space directions; the codomain splits into column-space outputs and left-null constraints.',
    'The math ties both worlds together: row and column space share rank r, while nullities fill n-r and m-r dimensions.',
    'Manipulate rank-nullity cases and classify where each subspace lives before reading the dimension bars.',
    'Mistake to avoid: row space and column space usually live in different ambient spaces, even though they have the same dimension.',
    'Check understanding by deciding whether b must be in Col(A) or Row(A) for Ax = b to be solvable.',
  ),
  'matrix-decompositions': cardSet(
    'Matrix decompositions solve the problem of replacing one hard matrix operation with structured factors suited to a job.',
    'Different factorizations expose different structure: triangular solves, orthogonal bases, stretch directions, low-rank axes, or nonnegative parts.',
    'The math is a family of rewrites such as A=LU, A=QR, A=U Sigma V^T, and A=L L^T under different assumptions.',
    'Filter the one-sheet by task and choose the factorization before reading the detailed requirement and warning.',
    'Mistake to avoid: no single decomposition is always best; shape, assumptions, stability, and goal decide the right tool.',
    'Check understanding by choosing QR for stable least squares and SVD for general low-rank approximation.',
  ),
  eigenvalue: cardSet(
    'Eigenvalue analysis solves the problem of finding directions a square matrix only scales, rather than rotates into a new direction.',
    'Picture dragging a vector until A v lands on the same line; that line is an eigenvector direction.',
    'The math is A v = lambda v, with nonzero v and lambda recording the scale, flip, or collapse along that direction.',
    'Use the circle-to-ellipse view and the vector explorer to compare ordinary directions with aligned eigenvector directions.',
    'Mistake to avoid: a length ratio is not automatically an eigenvalue unless the transformed vector stays aligned with the original direction.',
    'Check understanding by explaining why rectangular matrices need SVD instead of ordinary eigenvectors of A.',
  ),
  'qr-decomposition': cardSet(
    'QR decomposition solves the problem of building a stable orthonormal basis for the columns of a matrix.',
    'Q gives clean perpendicular axes; R records how the original columns are assembled from those axes.',
    'The math writes A=QR, with Q^T Q=I and R upper triangular.',
    'Step through Gram-Schmidt and watch each projection get removed before the leftover vector is normalized.',
    'Mistake to avoid: Q is not the original matrix with scaled columns; it is a new orthonormal basis for the same column space.',
    'Check understanding by identifying which coefficient in R stores the projection of a2 onto q1.',
  ),
  svd: cardSet(
    'SVD solves the problem of finding the strongest input and output axes of any rectangular matrix.',
    'V gives input directions, Sigma tells how much each direction is stretched, and U gives the corresponding output directions.',
    'The math writes A=U Sigma V^T with nonnegative singular values ordered from largest to smallest.',
    'Step through U, Sigma, and V^T, then compare full reconstruction with a truncated low-rank version.',
    'Mistake to avoid: singular vectors are not eigenvectors of A unless special square symmetric conditions apply.',
    'Check understanding by predicting which component is kept first in rank-1 compression.',
  ),
  'bayes-rule-ml': cardSet(
    'Bayes rule solves the problem of updating a class belief after evidence arrives.',
    'The posterior depends on both the evidence quality and how common the class was before the evidence.',
    'The math multiplies likelihood by prior, then normalizes by all ways the evidence could appear.',
    'Manipulate base rate, hit rate, and false alarm rate to see why rare classes need very clean evidence.',
    'Mistake to avoid: ignoring the base rate can make weak positive evidence look decisive.',
    'Check understanding by predicting whether posterior probability rises more from a better hit rate or a lower false alarm rate.',
  ),
  'sampling-confidence-intervals': cardSet(
    'Confidence intervals solve the problem of reporting sample estimates with their sampling uncertainty.',
    'A sample is a noisy measurement of the population; more observations usually make the estimate less jumpy.',
    'The math is an estimate plus or minus a critical value times standard error.',
    'Manipulate sample size, observed rate, and confidence level to watch interval width change.',
    'Mistake to avoid: a 95 percent confidence interval is about the procedure over repeated samples, not certainty about one fixed interval.',
    'Check understanding by explaining why four times as much data roughly halves the interval width.',
  ),
  'hypothesis-testing-intuition': cardSet(
    'Hypothesis testing solves the problem of asking whether an observed effect is surprising under a no-effect baseline.',
    'Evidence grows when the effect is large compared with noise, and when sample size makes the estimate stable.',
    'The math divides observed effect by standard error to form a test statistic.',
    'Manipulate effect size, noise, and sample size to separate statistical evidence from raw difference.',
    'Mistake to avoid: statistical significance does not prove the effect is large, useful, or causal.',
    'Check understanding by identifying when a tiny effect becomes significant only because the sample is huge.',
  ),
  'ab-testing-foundations': cardSet(
    'A/B testing solves the problem of deciding whether a product change caused an outcome difference.',
    'Random assignment creates comparable treatment and control groups before the change has a chance to act.',
    'The math estimates treatment minus control, then divides by standard error to judge statistical signal.',
    'Manipulate allocation, sample size, lift, MDE, and guardrail impact to decide whether the variant should ship.',
    'Mistake to avoid: a statistically significant metric lift can still be too small or too harmful to act on.',
    'Check understanding by explaining why a guardrail breach blocks an otherwise positive treatment result.',
  ),
  'power-sample-size': cardSet(
    'Power analysis solves the problem of planning whether an experiment can detect the smallest effect worth acting on.',
    'Sample size is the resolution of the experiment: too little data makes useful effects blur into noise.',
    'The math balances detectable effect against variance, alpha, and target power.',
    'Manipulate baseline rate, MDE, alpha, variance, and planned sample size to see when the design becomes underpowered.',
    'Mistake to avoid: a non-significant result from an underpowered test is not evidence that the treatment has no useful effect.',
    'Check understanding by explaining why halving the MDE usually needs about four times more sample.',
  ),
  'sequential-testing-peeking': cardSet(
    'Sequential testing solves the problem of monitoring experiments without quietly increasing false positives.',
    'Each unplanned peek gives random noise another chance to look like a discovery.',
    'The math spends one total alpha budget across planned interim looks instead of reusing 5 percent every time.',
    'Manipulate the number of looks and alpha budget to see naive peeking inflate error.',
    'Mistake to avoid: stopping when p first dips below 0.05 is not the same as a valid sequential design.',
    'Check understanding by comparing fixed-horizon and any-look false positive risk.',
  ),
  'cuped-variance-reduction': cardSet(
    'CUPED solves the problem of noisy experiment metrics by subtracting predictable pre-treatment variation.',
    'Users who were high or low before treatment often stay partly high or low after treatment.',
    'The math adjusts outcomes with a pre-period covariate, reducing variance by roughly 1 minus rho squared.',
    'Manipulate pre/post correlation and raw standard error to see confidence intervals narrow.',
    'Mistake to avoid: using post-treatment variables for adjustment can bias the causal estimate.',
    'Check understanding by naming why the covariate must be measured before assignment.',
  ),
  'confounding-simpsons-paradox': cardSet(
    'Confounding analysis solves the problem of treatment and control groups differing before treatment acts.',
    'An aggregate effect mixes treatment impact with who ended up in each group.',
    'The math is a weighted average: changing segment weights can reverse the overall comparison.',
    'Manipulate segment mix and within-segment lift to create a Simpson reversal.',
    'Mistake to avoid: an aggregate dashboard gap is not causal when exposure was not randomized.',
    'Check understanding by identifying the variable that affects both exposure and outcome.',
  ),
  'causal-graphs-dags': cardSet(
    'Causal DAGs solve the problem of making adjustment assumptions explicit before estimating effects.',
    'Confounders open backdoor paths, colliders can open biasing paths, and mediators carry effects.',
    'The math is graphical: block non-causal paths without blocking or distorting the causal path of interest.',
    'Manipulate confounding, adjustment, and collider conditioning to see bias risk move.',
    'Mistake to avoid: adding every variable is not always safer because colliders and mediators can change the question.',
    'Check understanding by choosing whether a variable is a confounder, collider, or mediator.',
  ),
  'treatment-effects': cardSet(
    'Treatment-effect analysis solves the problem of averages hiding who benefits or is harmed.',
    'ATE is the population summary; CATE and uplift show how effects differ by segment.',
    'The math compares potential outcomes, Y(1) minus Y(0), averaged overall or within a subgroup.',
    'Manipulate segment share and segment effects to see when targeting beats one-size-fits-all rollout.',
    'Mistake to avoid: a positive average effect does not mean every user should receive the treatment.',
    'Check understanding by explaining when a targeted rollout is better than shipping to everyone.',
  ),
  'propensity-scores': cardSet(
    'Propensity scores solve the problem of comparing observational treated and control units with different covariates.',
    'Match or weight users with similar treatment probabilities so observed covariates become more balanced.',
    'The math estimates e(x), the probability of treatment given observed features, then uses matching or inverse weights.',
    'Manipulate overlap, initial imbalance, and hidden bias to judge whether the estimate is credible.',
    'Mistake to avoid: propensity methods cannot fix unmeasured confounders or missing common support.',
    'Check understanding by naming why poor overlap makes observational adjustment fragile.',
  ),
  'probability-distributions': cardSet(
    'Probability distributions solve the problem of describing uncertainty over possible outcomes instead of treating one observed value as the whole story.',
    'A distribution is a map from possible values to how much probability they receive, whether as discrete mass or continuous density.',
    'The math includes PMFs, PDFs, CDFs, expectation, variance, and families such as Bernoulli, Poisson, and Normal.',
    'Manipulate mean, variance, and family choice, then predict how probability mass or tail weight moves.',
    'Mistake to avoid: a familiar family name does not prove the data match that family, especially under overdispersion or heavy tails.',
    'Check understanding by choosing whether a count, binary trial, or continuous error needs a different distribution family.',
  ),
  'time-series-forecasting-track': cardSet(
    'Time series forecasting solves the problem of predicting future values when rows are ordered and dependent over time.',
    'The past is allowed to inform the future, but the future must never leak into training features or validation.',
    'The math uses rolling windows, lagged values, seasonal terms, exogenous variables, and horizon-specific metrics.',
    'Manipulate seasonality, leakage risk, and rolling backtests to see when a forecast workflow is credible.',
    'Mistake to avoid: random row splits can leak temporal information and overstate forecast performance.',
    'Check understanding by explaining why every feature must be knowable at prediction time.',
  ),
  'recommender-systems-ranking-track': cardSet(
    'Recommender systems solve the problem of ordering items for a user under feedback, sparsity, and product constraints.',
    'The model is part predictor and part allocation system: what it ranks highly gets more future data.',
    'The math includes user-item dot products, pairwise/listwise ranking losses, and ordered metrics such as MAP, MRR, and nDCG.',
    'Manipulate collaborative signal, cold-start pressure, and exploration to balance ranking quality and learning.',
    'Mistake to avoid: optimizing only click prediction can hurt ranking quality, coverage, or long-term learning.',
    'Check understanding by choosing when exploration or content features are needed.',
  ),
  'ml-security-robustness-track': cardSet(
    'ML security solves the problem of keeping model systems reliable when inputs, retrieval, tools, or data are adversarial.',
    'The model is only one attack surface; retrieved text, tool outputs, files, and user prompts can all steer behavior.',
    'The math is risk budgeting: exposure and impact must be reduced by isolation, validation, evals, and monitoring.',
    'Manipulate attack surface, defense coverage, and data sensitivity to judge release readiness.',
    'Mistake to avoid: a better system prompt alone does not secure RAG, tools, or sensitive data.',
    'Check understanding by mapping one attack to one concrete control and one evaluation.',
  ),
  'efficient-inference-compression-track': cardSet(
    'Efficient inference solves the problem of serving models within latency, throughput, memory, and quality budgets.',
    'Every optimization has a tradeoff: compression may affect quality, batching may affect latency, and KV cache may dominate memory.',
    'The math tracks time to first token, decode time, tokens per second, and memory for weights plus KV cache.',
    'Manipulate compression, batching, and memory pressure to see throughput and latency tradeoffs.',
    'Mistake to avoid: optimizing throughput alone can make interactive latency or output quality unacceptable.',
    'Check understanding by naming which bottleneck quantization, batching, or paged attention addresses.',
  ),
  'data-engineering-for-ml-track': cardSet(
    'Data engineering for ML solves the problem of producing features and labels that are correct at prediction time.',
    'Most ML data bugs are boundary bugs: timestamp boundaries, label windows, train/serve parity, or schema contracts.',
    'The math is temporal validity: feature timestamps must be no later than the prediction timestamp, while labels come after.',
    'Manipulate feature freshness, leakage risk, and contract coverage to diagnose pipeline readiness.',
    'Mistake to avoid: target encodings and aggregates can leak future labels unless computed inside the right window.',
    'Check understanding by explaining point-in-time correctness for one feature.',
  ),
  'model-debugging': cardSet(
    'Model debugging solves the problem of localizing where expected behavior first diverged before applying a fix.',
    'Treat an incident as a pipeline investigation: data, training, evaluation, and serving can each produce the same symptom.',
    'The math is evidence first: slice metrics, support, and train-serve parity beat a global score that hides the failure.',
    'Manipulate the failing slice, serving contract, and hypothesized stage, then choose one targeted intervention.',
    'Mistake to avoid: changing capacity or thresholds before checking whether production inputs still match validation.',
    'Check understanding by naming the first stage whose evidence actually explains the regression.',
  ),
  'model-monitoring': cardSet(
    'Model monitoring solves the problem of noticing production change before delayed labels confirm a quality drop.',
    'Watch data, score, and serving signals immediately, then confirm with delayed outcomes when they arrive.',
    'The math is layered detection: distribution shift, score shift, error-budget burn, and delayed-label quality are different clocks.',
    'Manipulate drift type, label delay, and alert threshold to see which signal fires first.',
    'Mistake to avoid: treating a proxy metric as ground truth just because the true label is delayed.',
    'Check understanding by deciding whether to act on an early proxy or wait for delayed labels.',
  ),
  'model-interpretability': cardSet(
    'Model interpretability solves the problem of explaining which inputs moved a prediction without confusing correlation for cause.',
    'An explanation is a local or grouped attribution, not a proof that changing one feature would change the real-world outcome.',
    'The math includes attributions, background distributions, and stability checks under tiny input perturbations.',
    'Manipulate correlated features and background data to see when attributions become unstable or misleading.',
    'Mistake to avoid: ranking one correlated feature as the cause because its attribution is largest.',
    'Check understanding by explaining why grouped or background-shifted explanations can change the story.',
  ),
  'spearman-correlation': cardSet(
    'Spearman correlation solves the problem of measuring whether two variables move in the same order, even when the curve is not linear.',
    'Replace raw values with ranks, then ask whether high-ranked X values tend to pair with high-ranked Y values.',
    'The no-tie formula subtracts a penalty based on squared rank differences from a perfect score of one.',
    'Step through the rank table and predict rho before the formula uses the sum of squared rank gaps.',
    'Mistake to avoid: Spearman measures monotonic order, not causation and not necessarily straight-line fit.',
    'Check understanding by changing an outlier and deciding whether its rank order actually changed.',
  ),
  'maximum-likelihood-estimation': cardSet(
    'Maximum likelihood solves the problem of choosing the parameter that makes observed data most probable.',
    'Try a candidate parameter, ask how plausible the data would be, then move toward the peak of that plausibility.',
    'The math chooses theta that maximizes P(data given theta), often by maximizing log-likelihood.',
    'Manipulate successes, trials, and candidate probability to see the likelihood peak around the observed rate.',
    'Mistake to avoid: MLE picks the best parameter inside a model family; it does not prove the family is true.',
    'Check understanding by explaining why more trials punish a wrong candidate probability more sharply.',
  ),
  'loss-functions-likelihoods': cardSet(
    'Loss-as-likelihood solves the problem of explaining why common ML losses have their particular shapes.',
    'A loss is often the negative log of how plausible the observed target is under the model prediction.',
    'The math is negative log-likelihood: squared error comes from Gaussian noise and cross-entropy from class probabilities.',
    'Manipulate regression error, noise scale, and true-class probability to compare loss pressure.',
    'Mistake to avoid: choosing a loss also chooses assumptions about target noise and output distribution.',
    'Check understanding by matching squared error to regression noise and cross-entropy to classification likelihood.',
  ),
  'logistic-regression': cardSet(
    'Logistic regression solves binary classification by turning a linear score into a class probability.',
    'A straight boundary creates a logit; sigmoid bends that score onto a 0-to-1 scale.',
    'The math is p = sigmoid(w x + b), followed by a decision threshold.',
    'Manipulate weight, bias, or threshold and predict which points flip labels.',
    'Mistake to avoid: a sigmoid output is not automatically well calibrated just because it is between 0 and 1.',
    'Check understanding by explaining what changes when the threshold moves from 0.5 to 0.7.',
  ),
  'classification-metrics': cardSet(
    'Classification metrics solve the problem of describing which mistakes a classifier is making.',
    'The confusion matrix is an accounting table for positive and negative decisions.',
    'The math builds precision, recall, F1, and accuracy from TP, FP, FN, and TN counts.',
    'Manipulate the threshold and predict which count changes before reading the metrics.',
    'Mistake to avoid: high accuracy can hide poor recall when positives are rare.',
    'Check understanding by choosing a metric for a case where false negatives are expensive.',
  ),
  'roc-pr-curves': cardSet(
    'ROC and PR curves solve the problem of evaluating every threshold instead of trusting one cutoff.',
    'Slide the threshold and the classifier trades found positives against false alarms.',
    'The math plots TPR against FPR for ROC, and precision against recall for PR.',
    'Manipulate the threshold and watch the active point move on both curves.',
    'Mistake to avoid: a high ROC-AUC does not choose a deployment threshold or guarantee strong rare-positive precision.',
    'Check understanding by choosing whether ROC or PR is more useful when positives are rare.',
  ),
  calibration: cardSet(
    'Calibration solves the problem of knowing whether a probability score can be trusted as a frequency estimate.',
    'A score bucket is calibrated when examples scored around 0.8 are positive about 80 percent of the time.',
    'The math compares predicted probability buckets with observed positive rates using reliability gaps, ECE, and Brier score.',
    'Manipulate confidence behavior and threshold to separate probability quality from classification cutoff behavior.',
    'Mistake to avoid: sigmoid and softmax outputs are probability-shaped, but training can still make them overconfident.',
    'Check understanding by finding which bucket sits farthest from the perfect-calibration diagonal.',
  ),
  overfitting: cardSet(
    'Overfitting explains why a model can look better on training data while becoming worse on new data.',
    'The model starts learning the pattern, then begins chasing quirks of the sample.',
    'The math shows a widening gap: training error keeps falling while validation error rises.',
    'Manipulate model complexity and find the point where validation error is lowest.',
    'Mistake to avoid: the most flexible model is not automatically the best model.',
    'Check understanding by naming the first visual sign that memorization has started.',
  ),
  'bias-variance-tradeoff': cardSet(
    'Bias-variance solves the problem of diagnosing why a model fails to generalize, not just whether it fails.',
    'Bias is a model being too rigid; variance is a model being too sensitive to the particular sample it saw.',
    'The math decomposes expected squared error into bias squared, variance, and irreducible noise.',
    'Manipulate model complexity, sample size, and noise to see train error, validation error, and the generalization gap change.',
    'Mistake to avoid: high validation error is not always overfitting; high training error points to underfitting and bias.',
    'Check understanding by deciding whether the next fix should be more flexibility, more data, regularization, or averaging.',
  ),
  regularization: cardSet(
    'Regularization solves the problem of models spending too much complexity on weak evidence.',
    'It is a budget: a parameter can be large only if it earns enough predictive value.',
    'The math adds a penalty term to the data loss, controlled by lambda.',
    'Manipulate lambda and watch coefficients shrink while total loss changes.',
    'Mistake to avoid: stronger regularization is not always better; too much penalty underfits.',
    'Check understanding by explaining why validation data should choose lambda.',
  ),
  'knn-naive-bayes-svm': cardSet(
    'kNN, Naive Bayes, and SVM solve classification with three different assumptions about the same feature space.',
    'kNN trusts local neighbors, Naive Bayes trusts class-conditional feature likelihoods, and SVM trusts a separating margin.',
    'The math is neighbor voting, probabilistic argmax over feature likelihoods, or a signed distance from a margin boundary.',
    'Manipulate the query point, k value, and classifier mode to see which assumption controls the prediction.',
    'Mistake to avoid: these models are not plug-compatible; scaling, independence, and margin geometry matter.',
    'Check understanding by explaining why two classifiers disagree on the same query point.',
  ),
  'tree-ensembles': cardSet(
    'Tree ensembles solve the problem of making threshold-split models stronger and more stable than one tree.',
    'A single tree asks yes/no feature questions; forests vote across many trees; boosting fixes errors in sequence.',
    'The math aggregates tree predictions, either by averaging votes or by summing scaled weak-tree corrections.',
    'Manipulate depth, forest size, boosting rounds, and learning rate to compare variance and correction behavior.',
    'Mistake to avoid: more ensemble members do not mean the same thing as a deeper individual tree.',
    'Check understanding by explaining why a forest can generalize better even when each tree is noisy.',
  ),
  'gradient-descent': cardSet(
    'Gradient descent solves the problem of improving parameters when the loss surface gives only local slope information.',
    'Each step feels the uphill direction and walks a scaled distance downhill.',
    'The math updates parameters with theta_next = theta - learning_rate * gradient.',
    'Manipulate the learning rate and compare crawling, converging, and overshooting traces.',
    'Mistake to avoid: the gradient is local, so one step does not guarantee the global minimum.',
    'Check understanding by predicting the next step direction from the slope sign.',
  ),
  optimization: cardSet(
    'Optimization landscapes solve the problem of seeing why the same gradient signal can produce very different training paths.',
    'Contours, valleys, starts, and targets show how curvature turns a simple update into zigzagging, crawling, or smooth progress.',
    'The math chooses an update direction from gradients, momentum, adaptive moments, and regularization before taking a learning-rate-scaled step.',
    'Manipulate learning rate and weight decay while comparing SGD, RMSProp, Adam, and AdamW on the same toy objective.',
    'Mistake to avoid: one fast toy path does not prove that an optimizer is universally best.',
    'Check understanding by explaining why AdamW decouples weight decay from adaptive gradient scaling.',
  ),
  'neural-network': cardSet(
    'A neural network solves the problem of composing many learned transformations into a flexible predictor.',
    'Each layer computes weighted sums, adds bias, and applies a nonlinear activation before passing values onward.',
    'The core layer equation is h_l = sigma(W_l h_{l-1} + b_l), with gradients flowing backward by the chain rule.',
    'Step through one XOR input to connect forward activations, loss, backward gradients, and the weight update.',
    'Mistake to avoid: stacking linear layers without activations is still just one linear map.',
    'Check understanding by naming where nonlinearity enters and where the first loss gradient appears.',
  ),
  optimizers: cardSet(
    'Optimizers solve the problem of turning noisy training gradients into useful parameter updates over many steps.',
    'SGD follows the current mini-batch, momentum carries velocity through stable directions, and Adam rescales updates per parameter.',
    'The math starts with theta_next = theta - eta * update, where update can be a raw gradient, velocity, or bias-corrected adaptive step.',
    'Manipulate update rule, learning rate, momentum, batch size, and steps to compare path smoothness and final loss.',
    'Mistake to avoid: Adam is not a substitute for tuning; a bad learning rate or noisy batch can still produce unstable training.',
    'Check understanding by predicting how a larger mini-batch changes the visible path before moving the slider.',
  ),
  initialization: cardSet(
    'Initialization solves the problem of starting a deep network with signal scales that can survive many layers.',
    'Xavier and He choose random weight variance from fan-in and fan-out instead of using arbitrary small numbers.',
    'The math sets standard deviation so activation and gradient variance stay near a useful range.',
    'Manipulate fan-in, fan-out, activation, and depth to see when signal vanishes, stays stable, or explodes.',
    'Mistake to avoid: random initialization is not automatically safe; the variance matters as much as randomness.',
    'Check understanding by deciding why ReLU networks usually prefer He initialization over Xavier.',
  ),
  'training-loop-dynamics': cardSet(
    'Training loop dynamics solve the problem of connecting optimizer math to real learning curves and validation behavior.',
    'Mini-batches create noisy gradient estimates; learning rate controls how far each noisy estimate moves the weights.',
    'The math applies an optimizer step from a batch gradient, then monitors both training and validation losses.',
    'Manipulate batch size, learning rate, steps, curvature, and validation difficulty to diagnose healthy or unstable training.',
    'Mistake to avoid: a lower training loss is not enough if validation loss rises or updates are overshooting.',
    'Check understanding by predicting whether a smaller batch makes the path noisier or a larger learning rate makes it unstable.',
  ),
  'dropout-batchnorm': cardSet(
    'Dropout and BatchNorm solve different training problems: over-reliance on units and unstable activation scale.',
    'BatchNorm recenters and rescales a batch; dropout randomly removes units during training so paths cannot co-adapt too easily.',
    'The math normalizes with batch mean and variance, then learns gamma and beta to scale and shift the result.',
    'Manipulate batch statistics, gamma, beta, dropout rate, and training mode to compare stabilization with regularization.',
    'Mistake to avoid: dropout is not used the same way at inference, and BatchNorm is not just another dropout mask.',
    'Check understanding by predicting what changes when switching from training mode to inference mode.',
  ),
  'gradient-problems': cardSet(
    'Gradient problem diagnostics solve the problem of explaining why early layers learn too slowly or update unstably.',
    'Backprop is a chain of multiplications; many small factors erase signal and many large factors amplify it.',
    'The math is a product of local derivatives from the output layer back to the earlier hidden state.',
    'Manipulate depth, derivative scale, residual path strength, and clipping to classify the failure mode.',
    'Mistake to avoid: clipping can cap explosions, but it does not automatically restore vanished signal.',
    'Check understanding by predicting whether a deeper chain with multiplier below one will vanish faster.',
  ),
  'layer-normalization': cardSet(
    'LayerNorm solves the problem of token features drifting to unstable scales inside deep networks.',
    'Normalize across one token vector, then let learned gamma and beta restore useful scale and shift.',
    'The math subtracts the feature mean, divides by feature standard deviation, then applies an affine transform.',
    'Manipulate token case, gamma, beta, branch strength, and pre/post placement to inspect residual stability.',
    'Mistake to avoid: LayerNorm is not BatchNorm; it does not need statistics from other examples in the batch.',
    'Check understanding by predicting whether a shifted token keeps its large mean after normalization.',
  ),
  relu: cardSet(
    'ReLU solves the activation problem by giving networks a simple nonlinearity that keeps positive signal easy to pass.',
    'Positive inputs go through unchanged; negative inputs are shut off.',
    'The math is f(x)=max(0,x), with slope 1 on the active side and 0 on the blocked side.',
    'Manipulate the input across zero and watch both output and local slope switch.',
    'Mistake to avoid: a blocked ReLU has zero local gradient for that example.',
    'Check understanding by identifying whether a negative pre-activation can send gradient backward.',
  ),
  'leaky-relu': cardSet(
    'Leaky ReLU solves the dead-zone problem by giving negative pre-activations a small nonzero slope.',
    'Positive values pass through normally; negative values keep their sign but are scaled down.',
    'The math is f(z)=max(alpha z,z), with derivative alpha below zero and 1 at or above zero.',
    'Manipulate alpha, bias shift, and upstream gradient to see how forward outputs and backprop signals differ from ReLU.',
    'Mistake to avoid: Leaky ReLU does not turn negative evidence positive; it only avoids a fully flat negative branch.',
    'Check understanding by predicting the backward gradient for a negative z before changing alpha.',
  ),
  lstm: cardSet(
    'LSTMs solve the problem of carrying useful sequence context across many time steps without rewriting memory at every step.',
    'A gated cell state is the long path; hidden state is the exposed output that the next step and downstream layers can read.',
    'The math uses forget, input, and output gates to keep old memory, write candidate content, and reveal a hidden state.',
    'Manipulate gate values across two time steps and predict whether cell memory is preserved, overwritten, or hidden.',
    'Mistake to avoid: the LSTM name does not guarantee unlimited memory, and padding or causality mistakes can still leak or drop context.',
    'Check understanding by tracing which gate changed cell state versus hidden output on a single step.',
  ),
  conv2d: cardSet(
    'Conv2D solves the problem of detecting local spatial patterns with a small reusable set of weights.',
    'Slide the same kernel across the input; each stop asks whether the local patch matches the learned pattern.',
    'The math sums input-window values times aligned kernel weights for each output location.',
    'Manipulate stride, padding, and kernel type to see how shape and local responses change.',
    'Mistake to avoid: convolution reuses one kernel across locations; it is not a different dense matrix for every patch.',
    'Check understanding by computing one output cell from its highlighted 3x3 input window.',
  ),
  'conv-relu': cardSet(
    'Conv + ReLU solves the problem of turning local image patterns into sparse positive feature maps.',
    'The convolution filter gives signed evidence; ReLU keeps positive detections and blocks negative responses.',
    'The math applies a kernel and bias first, then a = max(0, z) for each output location.',
    'Manipulate filter choice, bias, and input contrast to see which feature responses survive.',
    'Mistake to avoid: ReLU does not create the feature map; it gates the pre-activation made by convolution.',
    'Check understanding by predicting which cells will become zero before reading the activation map.',
  ),
  'max-pooling': cardSet(
    'Max pooling solves the problem of shrinking feature maps while keeping the strongest local detections.',
    'Each pooling window asks which activation shouts loudest, then passes only that value onward.',
    'The math takes a maximum over each k by k window, with stride deciding where the next window starts.',
    'Manipulate pool size, stride, and feature-map pattern to trace which input coordinate creates each output cell.',
    'Mistake to avoid: pooling is not learned convolution; it discards non-maximum detail by design.',
    'Check understanding by predicting one pooled output from its highlighted input window.',
  ),
  'computation-graph-backprop': cardSet(
    'Backpropagation solves the problem of assigning blame to each parameter in a nested computation.',
    'The forward graph stores local operations; the backward pass reuses them in reverse.',
    'The math is chain rule multiplication of upstream gradients and local derivatives.',
    'Manipulate x, w, b, target, or learning rate and predict the next loss before updating.',
    'Mistake to avoid: backprop is not a separate learning rule; it is the chain rule on a graph.',
    'Check understanding by explaining why a negative ReLU pre-activation blocks the weight gradient.',
  ),
  tokenization: cardSet(
    'Tokenization solves the problem of turning raw text into units a model can index and embed.',
    'The tokenizer decides what the model sees: characters, words, or reusable subword pieces.',
    'The math is mostly discrete mapping from text spans to token ids before vectors enter the model.',
    'Manipulate the input phrase and compare how character, word, BPE, or WordPiece splits change length.',
    'Mistake to avoid: tokens are not the same as words, especially for rare words and punctuation.',
    'Check understanding by predicting which part of a rare word becomes a shared subword.',
  ),
  embeddings: cardSet(
    'Embeddings solve the problem of representing discrete items as vectors that can be compared and transformed.',
    'Nearby vectors often share learned behavior, but the geometry comes from data and objectives.',
    'The math stores each item as a dense vector in R^d and compares vectors with distance or similarity.',
    'Manipulate one vector or query and observe which neighbors become closest.',
    'Mistake to avoid: embedding distance is learned correlation, not guaranteed semantic truth.',
    'Check understanding by explaining why two similar words can still differ along one direction.',
  ),
  'cosine-similarity': cardSet(
    'Cosine similarity solves the problem of comparing vector direction without letting vector length dominate the score.',
    'Two vectors are similar when they point the same way, even if one has a larger magnitude.',
    'The math divides the dot product by both vector norms, producing 1 for same direction, 0 for perpendicular, and -1 for opposite direction.',
    'Move the vectors or edit the search query, then predict which candidate should rank highest before reading the score.',
    'Mistake to avoid: a high cosine score is a ranking signal from the chosen representation, not proof that two items mean the same thing.',
    'Check understanding by explaining why scaling one nonzero vector alone does not change its cosine similarity.',
  ),
  pca: cardSet(
    'PCA solves the problem of compressing numeric data while preserving the largest directions of variation.',
    'Imagine rotating the axes until the first axis catches the longest shadow cast by the point cloud.',
    'The math centers X, forms a covariance matrix, and keeps eigenvectors with the largest eigenvalues.',
    'Manipulate correlation, noise, and component count to see how projection changes reconstruction.',
    'Mistake to avoid: PCA does not use labels, so high variance is not automatically predictive signal.',
    'Check understanding by explaining why the blue PC1 axis changes when the cloud rotates.',
  ),
  'k-means': cardSet(
    'K-means solves the problem of grouping unlabeled points around a chosen number of representative centroids.',
    'Each centroid acts like a magnet; points join the nearest one, then the magnet moves to the group average.',
    'The math minimizes within-cluster squared distance by alternating assignment and centroid update steps.',
    'Manipulate k and iteration count to watch assignments, centroids, and inertia change together.',
    'Mistake to avoid: lower inertia from larger k does not automatically mean a better clustering.',
    'Check understanding by predicting which centroid moves when one point changes cluster.',
  ),
  'attention-mechanism': cardSet(
    'Attention solves the problem of selecting useful context instead of compressing everything equally.',
    'A query asks questions of keys; the answers become weights over values.',
    'The math scores query-key matches, applies softmax, then forms a weighted sum of values.',
    'Manipulate a query or key and predict which value receives the largest weight.',
    'Mistake to avoid: attention weights are contextual mixtures, not permanent word importance scores.',
    'Check understanding by tracing one high score through softmax into the output vector.',
  ),
  'self-attention': cardSet(
    'Self-attention solves the problem of letting every token build context from the same sequence.',
    'Each token creates its own query, then mixes value information from other positions.',
    'The math uses softmax(QK^T / sqrt(d_k))V so dot-product scale does not overwhelm softmax.',
    'Manipulate one token vector and inspect which row of attention weights changes.',
    'Mistake to avoid: self-attention recomputes mixtures for each sequence, not a fixed lookup table.',
    'Check understanding by explaining one row of weights and the context vector it creates.',
  ),
  'attention-masks': cardSet(
    'Attention masks solve the problem of enforcing which tokens are legally visible before attention weights are formed.',
    'A mask is a gate on the score matrix: keep allowed query-key pairs and push blocked pairs toward zero probability.',
    'The math adds M to scaled scores before softmax, where blocked cells receive a very negative value.',
    'Manipulate mask type and query row to compare causal, padding, bidirectional, and cross-attention visibility.',
    'Mistake to avoid: attention masks are visibility rules, not the same thing as replacing input tokens with [MASK].',
    'Check understanding by predicting which keys a decoder query can read before revealing the selected row.',
  ),
  transformer: cardSet(
    'A transformer solves sequence modeling by stacking attention, feed-forward transforms, residual paths, and normalization.',
    'Attention moves information across positions; feed-forward layers transform each position; residuals preserve the stream.',
    'The math alternates token mixing and per-token nonlinear transforms inside repeated blocks.',
    'Manipulate or step through a token path and watch what attention changes versus what the MLP changes.',
    'Mistake to avoid: a transformer is not only attention; residual, normalization, and feed-forward layers are essential.',
    'Check understanding by naming what information is mixed across tokens and what is processed per token.',
  ),
  'transformer-architecture-families': cardSet(
    'Transformer architecture families solve the problem of matching a transformer stack to the way a task consumes and produces text.',
    'Encoder-only models read fixed inputs, decoder-only models generate from a prefix, and encoder-decoder models condition generation on a source.',
    'The math changes the attention mask: bidirectional visibility, causal prefix visibility, or decoder cross-attention into encoder states.',
    'Manipulate the family selector to compare BERT-style, GPT-style, and T5-style token visibility and output behavior.',
    'Mistake to avoid: a transformer block is not the whole model design; objectives and masks decide what the system can naturally do.',
    'Check understanding by choosing the family for classification, chat completion, and translation before revealing the examples.',
  ),
  'llm-training-objectives': cardSet(
    'LLM training objectives solve the problem of turning raw text, demonstrations, and preferences into different learning signals.',
    'Pretraining teaches prediction, supervised fine-tuning teaches response format, and preference optimization teaches chosen-over-rejected behavior.',
    'The math is usually log-probability loss, but the target changes from next token to masked token to reference answer or preferred answer.',
    'Manipulate the objective and data quality to compare which behavior each training stage rewards.',
    'Mistake to avoid: alignment objectives do not simply add factual knowledge; they mostly change how the model responds.',
    'Check understanding by matching continuation, instruction following, and preference shaping to the right objective.',
  ),
  'transformer-token-generation': cardSet(
    'Token generation solves the problem of turning a trained transformer into text one next-token decision at a time.',
    'The model reads the current context, scores possible next tokens, chooses one, appends it, and repeats.',
    'The math applies softmax to logits divided by temperature, then filters candidates before selecting a token.',
    'Manipulate temperature, top-k, and top-p to see which tokens remain eligible for the next step.',
    'Mistake to avoid: generation is not a single full-sentence prediction; every sampled token changes the next context.',
    'Check understanding by tracing how one selected token becomes part of the KV cache for the following step.',
  ),
  'kv-cache': cardSet(
    'KV cache solves the problem of making one-token-at-a-time generation avoid recomputing old key and value vectors.',
    'Previous tokens keep the same keys and values, so each new token only needs fresh projections for the current step.',
    'The math appends new K and V vectors to the cache, then the current query attends over the visible cached positions.',
    'Manipulate decode step, context length, heads, and window size to compare projection work and cache memory.',
    'Mistake to avoid: the cache does not skip attention; it skips repeated K/V projection for previous tokens.',
    'Check understanding by explaining why projection work can stay flat while cache reads still grow with context.',
  ),
  'grouped-query-attention': cardSet(
    'Grouped-query attention solves the problem of shrinking long-context KV cache without collapsing all heads into one shared cache.',
    'Several query heads share each key/value head, so the model keeps many query views while storing fewer K/V vectors.',
    'The math maps each query head to a smaller set of KV heads; MHA has equal counts, MQA has one KV head, and GQA sits between them.',
    'Manipulate query heads, KV heads, context length, and head dimension to compare cache memory, bandwidth, and sharing ratio.',
    'Mistake to avoid: GQA does not reduce the number of query heads; it reduces how many K/V heads are stored and read.',
    'Check understanding by identifying when a configuration is MHA, MQA, or GQA and explaining the tradeoff.',
  ),
  'flash-attention': cardSet(
    'Flash Attention solves the problem of exact attention spending too much time moving the full score matrix through memory.',
    'It streams query/key/value tiles through fast memory and maintains per-row softmax state instead of materializing all scores.',
    'The math is still scaled dot-product attention; the implementation computes it tile by tile with online normalization.',
    'Manipulate sequence length, tile size, head dimension, and dtype to compare full score-matrix memory with tile working-set memory.',
    'Mistake to avoid: Flash Attention is not sparse or approximate attention; it changes the schedule, not the target result.',
    'Check understanding by explaining why memory traffic can drop while the attention formula remains the same.',
  ),
  'positional-encoding': cardSet(
    'Positional encoding solves the problem of self-attention not having built-in knowledge of token order.',
    'A position vector is combined with each token embedding so the same word can mean different things at different places.',
    'The sinusoidal formula uses sine and cosine waves at different frequencies to create repeatable position fingerprints.',
    'Manipulate sentence order, encoding type, model dimension, and probe position to see what order information is present.',
    'Mistake to avoid: positional encodings do not replace token meaning; they add order information to token representations.',
    'Check understanding by explaining why "dog bites man" and "man bites dog" need different position-aware representations.',
  ),
  rope: cardSet(
    'RoPE solves the problem of giving attention scores relative-position information without just adding absolute position vectors.',
    'It rotates query and key dimension pairs by position-dependent angles before computing their dot product.',
    'The math makes a query at position m and a key at position n interact through their relative offset m minus n.',
    'Manipulate query position, key position, dimension pair, model dimension, and RoPE base to inspect rotation angles and scores.',
    'Mistake to avoid: RoPE does not rotate value vectors or replace masks; it changes Q/K geometry before scoring.',
    'Check understanding by shifting query and key together and explaining why relative distance is the important quantity.',
  ),
  'residual-stream': cardSet(
    'The residual stream solves the problem of carrying token information through many transformer components without forcing each layer to rewrite everything.',
    'Attention and MLP blocks add vector writes into the current token representation, creating a shared workspace across layers.',
    'The math is an additive update: the next stream equals the current stream plus component outputs, often with normalization around the writes.',
    'Manipulate attention and MLP write strengths to inspect how subject, relation, syntax, and prediction features accumulate.',
    'Mistake to avoid: the residual stream is not a separate memory bank; it is the evolving hidden representation.',
    'Check understanding by tracing one component write from before to after and explaining why scale control matters.',
  ),
  'sampling-strategies': cardSet(
    'Sampling strategies solve the problem of choosing one useful continuation from a probability distribution.',
    'Greedy and beam search lean deterministic; temperature, top-k, and top-p keep controlled uncertainty for more varied output.',
    'The math rescales logits with temperature, filters candidates by rank or cumulative probability, then samples or maximizes sequence score.',
    'Manipulate temperature, top-k, top-p, and beam width to see which tokens or paths remain eligible.',
    'Mistake to avoid: decoding settings do not retrain the model; they only change how inference chooses from existing probabilities.',
    'Check understanding by picking settings for factual QA, brainstorming, and translation before comparing the candidate set.',
  ),
  'fine-tuning': cardSet(
    'Fine-tuning methods solve the problem of changing a pretrained model behavior using a smaller task-specific signal.',
    'Full fine-tuning changes many weights, LoRA learns small adapter updates, SFT imitates demonstrations, and preference tuning compares answers.',
    'The math can be a low-rank weight update W plus BA or a preference objective that raises chosen answers over rejected answers.',
    'Manipulate adapter rank, quantization, data quality, and preference margin to compare memory and behavior tradeoffs.',
    'Mistake to avoid: fine-tuning is not retrieval and it is not one fixed method; the data signal decides what behavior can improve.',
    'Check understanding by matching limited GPU memory, demonstration data, and preference pairs to the right method.',
  ),
  'frontier-llm-architecture-overview': cardSet(
    'This lesson maps the major architecture families used in modern frontier LLM systems.',
    'Read each architecture as a different answer to the same bottleneck: compute, memory, context, generation order, or modality.',
    'The central comparison is active compute, KV memory, context access, and output generation process.',
    'Switch from dense to MoE and watch the same token activate only selected experts.',
    'Mistake to avoid: assuming every frontier model is just a larger dense transformer.',
    'Pick one paper architecture and classify what changed: expert routing, attention memory, context strategy, recurrence, diffusion, or modality.',
  ),
  'frontier-moe-systems': cardSet(
    'Frontier MoE systems scale model capacity by storing many experts but activating only a small subset for each token.',
    'Think of an MoE layer as a dispatch system: the router reads a token, sends it to selected experts, then blends their outputs.',
    'The core equation is MoE(x) = SharedExpert(x) + \\sum w_e Expert_e(x) over selected top-k experts.',
    'Send a batch of math, code, and general tokens through the router and watch which experts light up.',
    'Mistake to avoid: sparse active compute does not remove serving complexity; routing, load balance, and communication are now central.',
    'Check understanding by diagnosing whether poor behavior comes from routing collapse, dead experts, token dropping, or communication bottlenecks.'
  ),
  'multi-head-latent-attention': cardSet(
    'MLA solves the problem of KV cache becoming too wide during long-context autoregressive decoding.',
    'GQA saves memory by sharing K/V heads; MLA saves memory by factoring the K/V pathway through a cached latent vector.',
    'The core equations are c_KV = W_DKV h_t and q dot (W_up c_KV) = (W_up^T q) dot c_KV when projection absorption applies.',
    'Move query heads, KV heads, latent dimension, RoPE mode, and absorption to compare MHA, MQA, GQA, MLA, and TransMLA.',
    'Mistake to avoid: MLA is not ordinary cache quantization; it changes what is cached and still pays projection and RoPE-handling costs.',
    'Check understanding by converting repeated GQA heads into a low-rank TransMLA-style latent cache and naming the tradeoff.'
  ),
  'native-sparse-attention': cardSet(
    'Native Sparse Attention reduces how much context each query reads during long-context attention.',
    'Think of NSA as reading a map, shining a flashlight on important blocks, and keeping recent notes open.',
    'The core merge is z = gate_c z_c + gate_s z_s + gate_w z_w for compression, selection, and sliding-window outputs.',
    'Move sequence length, block sizes, selected blocks, local window, GQA group size, and gate mode to compare dense attention with NSA.',
    'Mistake to avoid: sparse attention is not automatically fast; scattered token reads can lose the hardware benefit.',
    'Check understanding by explaining why native training, blockwise selection, and shared GQA-group KV loads matter together.'
  ),
  'grpo-reasoning': cardSet(
    'GRPO trains reasoning behavior by sampling a group of candidate answers for the same prompt and comparing their rewards.',
    'Think of one prompt as a small classroom competition: better-than-average answers get reinforced and worse-than-average answers get suppressed.',
    'The core statistic is A_i = (r_i - mean(r)) / std(r), so the group replaces the learned critic baseline used in PPO.',
    'Move group size, reward type, KL strength, clip range, difficulty, and temperature to see when the group has useful contrast.',
    'Mistake to avoid: all-correct or all-wrong groups can provide weak or misleading relative learning signals.',
    'Check understanding by explaining why R1-Zero can discover self-checking behavior while R1 adds cold-start data for readability.'
  ),
  'dapo-reasoning-rl': cardSet(
    'DAPO makes GRPO-style reasoning RL train reliably at long chain-of-thought scale.',
    'Think of DAPO as a batch factory with quality control: keep useful comparisons, preserve exploration, grade token by token, and smooth length penalties.',
    'The objective uses group-relative advantages with separated clip bounds and token-level aggregation across long responses.',
    'Move difficulty, group size, upper clip, loss granularity, max response length, and shaping mode to see which bottleneck dominates the batch.',
    'Mistake to avoid: large nominal batches are not useful if most prompt groups are all correct, all wrong, overlong, or entropy-collapsed.',
    'Check understanding by explaining why Dynamic Sampling, Clip-Higher, Token-Level Loss, and Overlong Reward Shaping work together.'
  ),
  'coconut-latent-reasoning': cardSet(
    'Coconut separates reasoning from explanation by feeding hidden states back as continuous thoughts.',
    'Think of CoT as speaking each scratchpad step aloud and Coconut as taking silent vector scratchpad steps before answering.',
    'In language mode, hidden state goes through the LM head to a token; in latent mode, h_t becomes the next input embedding directly.',
    'Move reasoning mode, latent steps, training stage, task type, and faithfulness test to compare visible tokens, branch entropy, and perturbation sensitivity.',
    'Mistake to avoid: latent thoughts are not automatically faithful reasoning traces; they can be opaque or shortcut-like.',
    'Check understanding by explaining why perturbing or removing a reasoning-critical latent state should change branch distributions or answers.'
  ),
  'reasoning-rlvr-grpo': cardSet(
    'Reasoning post-training teaches a model to produce, check, and improve multi-step solution traces rather than only imitate next-token text.',
    'Think of the model as trying several solution paths, receiving scores, and increasing the probability of paths that solve the problem cleanly.',
    'GRPO samples a group of responses, normalizes their rewards within the group, and uses those advantages to update the policy without a separate critic.',
    'Generate 8 candidate solutions, score correctness and format, then watch positive-advantage traces become more likely.',
    'Mistake to avoid: rewarding format or length too heavily can create polished but wrong reasoning (reward hacking) or overthinking.',
    'Check understanding by designing a reward that improves correctness without causing overthinking, language mixing, or reward hacking.'
  ),
  'tool-using-reasoning-models': cardSet(
    'Tool-using reasoning models solve tasks by interleaving internal reasoning with external actions such as search, Python, file reads, browser actions, or structured function calls.',
    'Read the system as a loop: think about what is missing, call a tool to reduce uncertainty, observe the result, then update the plan.',
    'A tool policy can be modeled as expected benefit minus latency, cost, and safety risk.',
    'Run the same task with search, Python, file analysis, and browser tools enabled or disabled, then compare groundedness and latency.',
    'Mistake to avoid: tool output is not automatically true or safe; it must be checked for relevance, freshness, provenance, and permissions.',
    'Check understanding by diagnosing whether a failure came from tool overuse, stale evidence, hallucinated observation, or unsafe action.'
  ),
  'long-context-frontier-models': cardSet(
    'Long-context systems work with large documents, codebases, histories, and multimodal streams without discarding most information up front.',
    'Think of context as expensive attention real estate: every included token can help, distract, or add memory and latency cost.',
    'Full context maximizes direct access; RAG controls evidence; compression saves tokens; hybrid systems retrieve broadly and reason over selected evidence.',
    'Move a hidden fact through a 1M-token context, then compare full context, RAG, memory compression, and hybrid packing.',
    'Mistake to avoid: passing a needle test does not prove the model can perform multi-hop reasoning over real long documents.',
    'Check understanding by choosing the cheapest strategy that still includes all evidence, avoids distractors, and supports citations.'
  ),
  'omni-multimodal-architectures': cardSet(
    'Omni models solve the problem of understanding and generating across text, image, video, and audio in one interactive system.',
    'Think of each modality as a token stream with its own encoder, timing, and failure modes before the streams meet inside a shared reasoning system.',
    'Vision encoders produce image tokens; audio systems may produce codec tokens; Thinker-Talker designs separate multimodal reasoning from speech generation.',
    'Send text, image, audio, and video through different fusion strategies and compare grounding, token budget, and first-audio latency.',
    'Mistake to avoid: multimodal perception is not the same as grounded multimodal reasoning; the model must link claims to the right modality evidence.',
    'Check understanding by deciding when early fusion, late fusion, Thinker-Talker, diffusion audio, or codec autoregression is the right design choice.'
  ),
  'diffusion-language-models': cardSet(
    'Diffusion language models generate text by iteratively denoising masked or corrupted token sequences instead of committing to one next token at a time.',
    'Think of the response as a draft with blanks: the model fills confident blanks first, revises uncertain positions, and gradually turns a noisy sequence into text.',
    'AR factorizes text left-to-right; masked diffusion learns a reverse process that predicts clean tokens from corrupted token states.',
    'Start with a fully masked response, change denoising steps and confidence threshold, then watch multiple positions refine in parallel.',
    'Mistake to avoid: diffusion LMs are not automatically faster or better than AR LMs; schedules, fluency, alignment, and serving stack still matter.',
    'Check understanding by comparing AR, full-sequence diffusion, and block diffusion on continuation, infilling, and editing tasks.'
  ),
  'efficient-llm-serving': cardSet(
    'Efficient LLM serving solves the problem of turning one expensive autoregressive model into a reliable multi-user service.',
    'Think of the server as a scheduler plus memory manager: it must keep GPUs busy, allocate KV cache, interleave requests, and stream tokens under latency targets.',
    'Prefill fills the KV cache; decode grows it one token at a time; PagedAttention manages cache in blocks; speculation tries to accept multiple tokens per target pass.',
    'Run mixed requests through naive, paged, chunked, speculative, and quantized serving modes and watch throughput, memory, and tail latency change.',
    'Mistake to avoid: maximizing throughput alone can hurt users if TTFT, TPOT, or P99 latency gets worse.',
    'Check understanding by diagnosing whether a slowdown is caused by KV fragmentation, long prefill blocking, poor batching, rejected speculation, or communication overhead.'
  ),
  'frontier-evaluation-safety': cardSet(
    'Frontier evaluation measures not just what a model can answer, but how a deployed system behaves under tools, policies, adversaries, uncertainty, and autonomy.',
    'Think of evaluation as layered gates: capability, product reliability, tool safety, adversarial robustness, and frontier-risk preparedness.',
    'Safe success requires both task completion and no policy, tool, or action violation.',
    'Run an agent through prompt injection, stale retrieval, unsafe tool requests, hidden objective conflict, and deployment gates to see which guardrails catch what.',
    'Mistake to avoid: treating a benchmark score as a deployment decision.',
    'Check understanding by diagnosing whether a failure came from capability limits, workflow design, prompt injection, reward hacking, autonomy boundary failure, or insufficient preparedness.'
  ),
  'agentic-coding-systems': cardSet(
    'Agentic coding systems solve software tasks by looping over issue understanding, repo navigation, planning, editing, testing, reviewing, rollback, and patch submission.',
    'Think of the agent as a developer with tools: it must find the right context, make a minimal change, prove it with tests, and ask before risky actions.',
    'The SWE-bench-style success condition is FAIL_TO_PASS passing after the fix while PASS_TO_PASS behavior remains passing.',
    'Watch an issue flow through repo search, patch generation, test execution, rejection, retry, and final diff review.',
    'Mistake to avoid: plausible code can still be unsafe if it edits out of scope, skips regression tests, or runs risky commands.',
    'Check understanding by diagnosing whether a failed run came from wrong context, bad plan, bad patch, incomplete tests, or approval boundary failure.'
  ),
  'test-time-compute-thinking-budgets': cardSet(
    'Test-time compute scaling spends more inference-time tokens on harder queries to raise accuracy without retraining the model.',
    'Tokens equal compute: generating N candidates, running beam search, or extending a thinking trace all trade latency for accuracy.',
    'Best-of-N expected accuracy approaches the oracle bound as N grows, but cost is O(N × L) and gains are sub-logarithmic.',
    'Slide the thinking-token budget from 64 to 4096 tokens and observe where accuracy plateaus while latency continues to grow.',
    'Mistake to avoid: more thinking tokens do not always help; past the plateau, cost rises linearly while accuracy is flat.',
    'Check understanding by finding the budget where a hard math problem is solved but a trivial query wastes at least 90% of allocated tokens.'
  ),
  'rag-chunking-context': cardSet(
    'RAG chunking and context packing solve the problem of turning long documents into evidence the model can actually use.',
    'Chunks are retrieval units; packed context is the subset that survives ranking, top-k, and token budget constraints.',
    'The math splits documents by size and overlap, ranks chunks by relevance, then selects evidence under a context window budget.',
    'Manipulate chunk size, overlap, top-k, and budget to see which refund facts are retrieved and packed.',
    'Mistake to avoid: more overlap or larger top-k can duplicate text and crowd out the answer space.',
    'Check understanding by tuning settings until boundary-spanning evidence fits without excessive duplicate context.',
  ),
  'rag-vector-indexing': cardSet(
    'Vector indexing solves the problem of finding similar chunks quickly when exact comparison across the whole corpus is too slow.',
    'Exact search checks everything, IVF narrows search to nearby buckets, and HNSW walks a neighbor graph toward likely matches.',
    'The math approximates nearest neighbors under cosine or dot-product similarity while controlling candidate search breadth.',
    'Manipulate index type, corpus scale, and search breadth to compare recall and latency.',
    'Mistake to avoid: approximate search can miss relevant chunks before reranking or generation has a chance to use them.',
    'Check understanding by choosing exact, IVF, or HNSW for small corpora, large corpora, and high-recall workflows.',
  ),
  'rag-reranking-grounding': cardSet(
    'Reranking decides which retrieved chunks should be surfaced first; grounding decides whether surfaced claims can be trusted as citations.',
    'Reranking changes ranking and top-k composition, while grounding checks for stale, conflicting, and unsupported evidence.',
    'The math re-scores candidates with a second layer, then applies a validity gate before a claim is considered grounded.',
    'Move strictness and reranker mode, then predict which claim flips from grounded to unsupported.',
    'Mistake to avoid: a high-ranked chunk is not automatically a valid citation source.',
    'Check understanding by comparing lenient and strict grounding for the same top-k output.',
  ),
  'rag-failure-modes': cardSet(
    'RAG failure modes define why an apparently confident answer can still be unreliable.',
    'Each claim should be tested against top-k evidence: grounded support, stale facts, conflict, or absence.',
    'The failure math is claim-level: grounded = usable support exists, else classify whether missing, stale, conflicting, or irrelevant.',
    'Use the controls to move top-k, reranker, and strictness, then predict each claim outcome.',
    'Mistake to avoid: fixing decoding settings before retrieval quality often makes fluent answers more confidently wrong.',
    'Check understanding by identifying why a claim is rejected when no valid evidence remains in the grounded set.',
  ),
  'diffusion-basics': cardSet(
    'Diffusion basics solve the beginner gap between latent-variable models and advanced SD3 components.',
    'The forward process corrupts data with controlled noise; the reverse process learns how to remove that noise.',
    'The math mixes clean signal with noise at timestep t, then uses predicted noise to estimate the clean sample.',
    'Manipulate clean signal, noise, timestep, and prediction error to see why better noise prediction improves denoising.',
    'Mistake to avoid: the model is not asked to invent the whole image in one step; it learns many denoising steps.',
    'Check understanding by predicting what happens when the model overestimates the noise that was added.',
  ),
  'diffusion-sampling': cardSet(
    'Diffusion sampling solves the problem of turning a trained denoiser into an actual generation procedure.',
    'Start from noise, repeatedly estimate what noise to remove, and choose how much randomness each reverse step keeps.',
    'The math treats each sampler as an update rule from x_t to x_{t-1}, with DDPM adding stochasticity and DDIM setting it to zero.',
    'Manipulate sampler type, step count, and prediction quality to see speed, randomness, and clarity trade off.',
    'Mistake to avoid: DDPM, DDIM, and flow-style paths are sampler choices, not three unrelated image models.',
    'Check understanding by explaining why fewer steps can be faster yet more sensitive to denoising errors.',
  ),
  'classifier-free-guidance': cardSet(
    'Classifier-free guidance solves prompt steering without training or running a separate image classifier.',
    'The denoiser predicts noise once with the prompt and once without it, then amplifies the difference between those predictions.',
    'The math is eps_uncond plus guidance scale times the conditional-minus-unconditional direction.',
    'Manipulate guidance scale and both predictions to see prompt match rise while diversity can fall.',
    'Mistake to avoid: higher guidance is not always better because extreme scale can overshoot and create artifacts.',
    'Check understanding by predicting what happens when conditional and unconditional predictions are nearly identical.',
  ),
  'unet-vs-dit': cardSet(
    'U-Net vs DiT solves the architectural bridge between classic diffusion backbones and newer transformer diffusion systems.',
    'U-Nets process feature maps with local convolutions and skip connections; DiTs process latent patches as token sequences.',
    'The math counts patches as tokens, then attention cost grows with the square of token count.',
    'Manipulate resolution, patch size, depth, and backbone choice to see local bias, global mixing, and memory pressure change.',
    'Mistake to avoid: DiT is not just a larger U-Net, because it changes the representation and mixing operation.',
    'Check understanding by explaining why latent patches make transformer diffusion more practical than raw-pixel tokens.',
  ),
  'rl-foundations': cardSet(
    'RL foundations solve the problem of describing learning as repeated interaction with an environment.',
    'An agent acts, the environment responds, and reward tells the agent which outcomes the designer made valuable.',
    'The math collects future rewards into return, often discounting delayed rewards by powers of gamma.',
    'Move the agent, edit rewards, and change gamma to see how local feedback and delayed goals shape behavior.',
    'Mistake to avoid: the reward number is not the same as the real goal unless the reward function encodes the goal well.',
    'Check understanding by naming the state, action, reward, next state, and return in one move.',
  ),
  'mdp-formalism': cardSet(
    'MDP formalism solves the problem of describing sequential decisions with one consistent vocabulary.',
    'A state says where the agent is, an action says what it tries, and the environment samples what happens next.',
    'The math is M=(S,A,P,R,gamma): states, actions, transition probabilities, rewards, and discounted future value.',
    'Manipulate the action choice and discount factor to see how immediate and delayed rewards change value.',
    'Mistake to avoid: treating a transition as deterministic when the action really creates a probability distribution.',
    'Check understanding by predicting which action has higher expected return before changing gamma.',
  ),
  'value-iteration': cardSet(
    'Value iteration solves the planning problem of choosing actions when the transition model and rewards are known.',
    'Each sweep asks every state what its best one-step lookahead would be if neighboring values were trusted.',
    'The math is a Bellman optimality backup: reward plus discounted next-state value, then max over actions.',
    'Manipulate discount and sweep count to watch values propagate backward from terminal rewards.',
    'Mistake to avoid: value iteration is not sample-based trial and error; it uses the model to plan before acting.',
    'Check understanding by predicting which state changes after one more Bellman sweep.',
  ),
  'policy-iteration': cardSet(
    'Policy iteration solves planning by repeatedly evaluating a policy and then improving that policy.',
    'First ask how good the current instructions are, then replace bad instructions with greedier ones.',
    'The math evaluates V for the current policy, then sets each state policy to the action with best one-step lookahead.',
    'Manipulate evaluation depth and improvement rounds to watch a policy stabilize.',
    'Mistake to avoid: policy evaluation and policy improvement are separate phases, not one blended update.',
    'Check understanding by predicting which state changes action after an improvement round.',
  ),
  'q-learning': cardSet(
    'Q-learning solves the problem of learning action values from sampled experience without needing the full transition model.',
    'Each step compares what happened with what the Q-table expected, then nudges that state-action value toward the new target.',
    'The math updates old Q by alpha times the temporal-difference error: reward plus discounted best future Q minus old Q.',
    'Edit the Bellman update inputs and predict the target, TD error, and new Q-value before reading the result.',
    'Mistake to avoid: Q-learning backs up toward the greedy future action even when exploration sampled a different action.',
    'Check understanding by explaining why gamma controls delayed reward while alpha controls update size.',
  ),
  'rl-exploration': cardSet(
    'Exploration solves the problem of learning from actions the current policy would not choose greedily.',
    'The agent needs enough random trials to discover better rewards, but too much randomness makes behavior noisy and risky.',
    'The math for epsilon-greedy chooses a random action with probability epsilon and the best-known action otherwise.',
    'Adjust epsilon, watch explore/exploit counts, then compare how the cliff path changes when random moves are likely.',
    'Mistake to avoid: the shortest path is not always the best deployed path when exploration or execution noise can cause failures.',
    'Check understanding by predicting whether higher epsilon increases discovery, danger, or both in the cliff scenario.',
  ),
  'policy-gradients': cardSet(
    'Policy gradients solve the problem of learning a stochastic action policy directly from returns.',
    'Good sampled actions become more likely, bad sampled actions become less likely, but exploration can remain.',
    'The math raises log-probability of actions in proportion to return or advantage.',
    'Manipulate return and baseline to see which action probability receives the strongest update.',
    'Mistake to avoid: this is not Q-learning with a table; the policy itself is the optimized object.',
    'Check understanding by predicting whether a positive advantage increases or decreases the sampled action probability.',
  ),
  'actor-critic': cardSet(
    'Actor-critic solves the noisy policy-gradient problem by learning both a policy and a value baseline.',
    'The actor chooses actions; the critic judges whether the outcome was better or worse than expected.',
    'The math uses advantage: return minus critic value, then applies that advantage to the actor update.',
    'Manipulate critic value and return to see how actor and critic update signals differ.',
    'Mistake to avoid: the critic is not the controller; it trains the actor by estimating value.',
    'Check understanding by predicting whether the actor should reinforce an action when return is below critic value.',
  ),
  'ppo-clipped-policy-gradient': cardSet(
    'PPO solves the problem of making policy-gradient updates large enough to learn but small enough to stay stable.',
    'It compares the new policy probability with the old collection policy and clips extra gain when the ratio moves too far.',
    'The math takes the minimum of ratio times advantage and clipped-ratio times advantage.',
    'Manipulate ratio, advantage, epsilon, and old probability to see which minibatch rows get clipped.',
    'Mistake to avoid: clipping is not a monotonic-improvement proof; KL, entropy, and critic quality still matter.',
    'Check understanding by predicting which side clips when the advantage sign changes.',
  ),
  'reward-shaping': cardSet(
    'Reward shaping solves sparse feedback by adding an immediate hint while preserving the real task reward.',
    'A potential function acts like a progress meter: moves toward useful states earn denser feedback.',
    'The math adds gamma times next-state potential minus current-state potential to the environment reward.',
    'Manipulate current state, next state, discount, and shaping weight to see when a transition becomes informative.',
    'Mistake to avoid: shaping is not a new objective; bad shaping can reward shortcuts that miss the goal.',
    'Check understanding by predicting whether moving away from the goal should receive a positive or negative shaping bonus.',
  ),
  'rag-retrieval-evaluation': cardSet(
    'RAG retrieval evaluation solves the problem of knowing whether the answer evidence actually reached the model.',
    'Chunking decides what can be retrieved; reranking decides what rises to the top; metrics decide if that was good.',
    'The math includes recall@k for coverage, MRR for first useful rank, and nDCG for rank-sensitive relevance.',
    'Manipulate chunk size, overlap, top-k, and reranking to watch evidence appear, disappear, or move up.',
    'Mistake to avoid: a reranker cannot rescue a relevant chunk that was never retrieved as a candidate.',
    'Check understanding by explaining why a fluent answer can still be ungrounded when recall@k is low.',
  ),
  'bloom-filter': cardSet(
    'A Bloom filter solves approximate set membership with a compact bit array instead of storing every key.',
    'Each inserted item flips several hash-selected bits; a query checks whether all of those bits are already set.',
    'The false-positive probability is approximated by p = (1 - exp(-kn/m))^k, with k tuned near (m/n) ln 2.',
    'Add words, force a false positive, then change m, n, and k to see how saturation changes the error rate.',
    'Mistake to avoid: probably present is not proof of presence, but any zero bit is proof of absence.',
    'Check understanding by identifying which shared bits caused a false positive in the collision lab.',
  ),
};

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function getCategoryAnimations(animation, allAnimations) {
  return allAnimations.filter((item) => item.categoryId === animation.categoryId);
}

function cleanSentence(value) {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .replace(/\.$/, '')
    .trim();
}

function withPeriod(value) {
  const sentence = cleanSentence(value);
  if (!sentence) return '';
  return /[.!?]$/.test(sentence) ? sentence : `${sentence}.`;
}

function makeNodeExplanation(animation, relation = 'related') {
  const description = withPeriod(animation.description);
  if (relation === 'current') return `${animation.name}: ${description}`;
  if (relation === 'prereq') return `${animation.name} is useful background for this lesson. ${description}`;
  if (relation === 'next') return `${animation.name} is a good next step after this lesson. ${description}`;
  return `${animation.name}: ${description}`;
}

function toNode(animation, relation = 'related') {
  return {
    id: animation.id,
    label: animation.name,
    description: animation.description,
    explanation: makeNodeExplanation(animation, relation),
  };
}

function makeInsightNodes(animation) {
  const curation = getMindmapCuration(animation.id);
  if (curation) {
    return [
      {
        id: `${animation.id}-mental-model`,
        label: 'Mental model',
        tag: 'Model',
        explanation: `Mental model: ${withPeriod(curation.mentalModel)} Use this as the simplest picture for the lesson.`,
      },
      {
        id: `${animation.id}-explore`,
        label: 'Try this',
        tag: 'Do',
        explanation: `Try this: ${withPeriod(curation.explore)}`,
      },
      {
        id: `${animation.id}-self-check`,
        label: 'Check yourself',
        tag: 'Check',
        explanation: `Check yourself: ${withPeriod(curation.selfCheck)}`,
      },
      {
        id: `${animation.id}-trap`,
        label: 'Common trap',
        tag: 'Trap',
        explanation: `Common trap: ${withPeriod(curation.trap)}`,
      },
    ];
  }

  const objectives = (animation.learningObjectives || []).slice(0, 2);
  return [
    {
      id: `${animation.id}-key-idea`,
      label: 'Key idea',
      tag: 'Idea',
      explanation: `${animation.name} focuses on ${cleanSentence(animation.description).toLowerCase()}.`,
    },
    ...objectives.map((objective, index) => ({
      id: `${animation.id}-goal-${index + 1}`,
      label: index === 0 ? 'Main goal' : 'Practice goal',
      tag: 'Goal',
      explanation: withPeriod(objective),
    })),
    {
      id: `${animation.id}-watch-out`,
      label: 'Watch out',
      tag: 'Trap',
      explanation: withPeriod(animation.commonMisconception),
    },
  ].filter((node) => node.explanation);
}

function getNeighborNodes(animation, allAnimations, direction) {
  const categoryAnimations = getCategoryAnimations(animation, allAnimations);
  const categoryIndex = categoryAnimations.findIndex((item) => item.id === animation.id);
  const globalIndex = allAnimations.findIndex((item) => item.id === animation.id);
  const nodes = [];

  if (direction === 'prev') {
    if (categoryIndex > 0) nodes.push(toNode(categoryAnimations[categoryIndex - 1], 'prereq'));
    if (globalIndex > 0) nodes.push(toNode(allAnimations[globalIndex - 1], 'prereq'));
  } else {
    if (categoryIndex < categoryAnimations.length - 1) nodes.push(toNode(categoryAnimations[categoryIndex + 1], 'next'));
    if (globalIndex < allAnimations.length - 1) nodes.push(toNode(allAnimations[globalIndex + 1], 'next'));
  }

  const fallback = direction === 'prev'
    ? categoryAnimations.find((item) => item.id !== animation.id) || allAnimations.find((item) => item.id !== animation.id)
    : [...categoryAnimations].reverse().find((item) => item.id !== animation.id) || [...allAnimations].reverse().find((item) => item.id !== animation.id);
  if (nodes.length === 0 && fallback) nodes.push(toNode(fallback, direction === 'prev' ? 'prereq' : 'next'));

  return nodes.filter((node, index, list) => (
    node.id !== animation.id && list.findIndex((candidate) => candidate.id === node.id) === index
  ));
}

function byId(allAnimations) {
  return new Map(allAnimations.map((animation) => [animation.id, animation]));
}

function getPrereqNodes(animation, allAnimations) {
  const animationById = byId(allAnimations);
  const nodes = (animation.prerequisites || [])
    .map((id) => animationById.get(id))
    .filter(Boolean)
    .filter((item) => item.id !== animation.id)
    .map((item) => toNode(item, 'prereq'));

  if (nodes.length > 0) return nodes;
  return getNeighborNodes(animation, allAnimations, 'prev').slice(0, 2);
}

function getTrackNextNodes(animation, allAnimations) {
  const animationById = byId(allAnimations);
  const nodes = [];

  for (const trackId of animation.trackIds || []) {
    const track = curriculumTracks.find((candidate) => candidate.id === trackId);
    if (!track) continue;

    const index = track.animationIds.indexOf(animation.id);
    if (index === -1) continue;

    const nextId = track.animationIds[index + 1];
    const nextAnimation = animationById.get(nextId);
    if (nextAnimation && nextAnimation.id !== animation.id) {
      nodes.push(toNode(nextAnimation, 'next'));
    }
  }

  const uniqueNodes = nodes.filter((node, index, list) => (
    list.findIndex((candidate) => candidate.id === node.id) === index
  ));

  if (uniqueNodes.length > 0) return uniqueNodes.slice(0, 3);
  return getNeighborNodes(animation, allAnimations, 'next').slice(0, 2);
}

function formatPrereqChip(prereqs) {
  if (!prereqs.length) return 'No prerequisites';
  return prereqs.slice(0, 3).map((node) => node.label).join(', ');
}

function termSet(glossary, requestedTerms) {
  const available = new Map(glossary.flatMap((entry) => [
    [entry.id, entry],
    [entry.term.toLowerCase(), entry],
  ]));

  return requestedTerms
    .map((term) => available.get(slugify(term)) || available.get(String(term).toLowerCase()))
    .filter(Boolean)
    .slice(0, 4);
}

function makeCards(animation, glossary, equation) {
  const category = animation.categoryName.toLowerCase();
  const terms = glossary.map((entry) => entry.id);

  const cards = CARD_TYPES.map((type) => {
    const common = {
      type: type.id,
      label: type.label,
      title: type.title,
    };

    if (type.id === 'def') {
      return {
        ...common,
        body: `${animation.name} studies how ${animation.description.toLowerCase()} becomes a repeatable computational concept.`,
        terms: termSet(glossary, [terms[0], 'concept', 'input', 'output']),
      };
    }

    if (type.id === 'int') {
      return {
        ...common,
        body: 'Read the stage as a flow: an input representation is transformed, compared, or updated until the key pattern becomes visible.',
        terms: termSet(glossary, ['input', 'representation', 'vector', terms[1]]),
      };
    }

    if (type.id === 'eqn') {
      return {
        ...common,
        body: 'The headline equation compresses the central operation into symbols so you can connect the visual motion to the math.',
        equation,
        terms: termSet(glossary, ['matrix', 'parameter', 'gradient', terms[2]]),
      };
    }

    if (type.id === 'ex') {
      return {
        ...common,
        body: 'Example lens: change one value, token, state, or vector and watch how the downstream output responds.',
        terms: termSet(glossary, ['token', 'state', 'vector', 'output']),
      };
    }

    if (type.id === 'why') {
      return {
        ...common,
        body: `This matters because ${category} systems only become reliable when you can explain the objective and the failure mode.`,
        terms: termSet(glossary, ['objective', 'loss', 'probability', 'normalization']),
      };
    }

    return {
      ...common,
      body: `${animation.commonMisconception} Do one pass slowly: predict the update, run the animation, then compare your prediction with the output.`,
      terms: termSet(glossary, ['input', 'iteration', 'gradient', 'output']),
    };
  });

  if (animation.id === 'softmax') {
    cards.push(
      {
        type: 'theorem',
        label: 'thm.',
        title: 'Theorem 3.1: translation invariance',
        body: 'Translation invariance says adding the same constant to every logit leaves softmax unchanged, because the common exponential factor cancels from numerator and denominator.',
        equation: '\\operatorname{softmax}(z+c\\mathbf{1})=\\operatorname{softmax}(z)',
        terms: termSet(glossary, ['logits', 'temperature', 'probability', 'normalization']),
      },
      {
        type: 'marginalia',
        label: 'note.',
        title: 'Overflow margin note',
        body: 'Notebook aside: implementations subtract the largest logit before exponentiating. The probabilities are identical, but the numbers stay away from overflow.',
        terms: termSet(glossary, ['logits', 'probability', 'normalization', 'temperature']),
      },
    );
  }

  const overrides = LEARNING_CARD_OVERRIDES[animation.id];
  if (!overrides) return cards;

  return cards.map((card) => ({
    ...card,
    ...(overrides[card.type] || {}),
  }));
}

export function createLearningModel(animation, allAnimations) {
  const glossary = getGlossaryTermsForCategory(animation.categoryId).slice(0, glossaryLimitForCategory(animation.categoryId));
  const headlineLatex = EQUATION_OVERRIDES[animation.id] || CATEGORY_EQUATIONS[animation.categoryId] || 'y=f(x)';
  const prereqs = getPrereqNodes(animation, allAnimations);
  const next = getTrackNextNodes(animation, allAnimations);
  const conceptMap = getConceptMap(animation.id);
  const mindmap = conceptMap
    ? { ...conceptMap, prereqs, next }
    : {
        prereqs,
        current: toNode(animation, 'current'),
        insights: makeInsightNodes(animation),
        next,
      };

  return {
    conceptName: animation.name,
    headlineEquation: {
      latex: headlineLatex,
    },
    chips: {
      difficulty: animation.difficulty || 'intermediate',
      prereq: formatPrereqChip(prereqs),
      category: animation.categoryName,
      minutes: `${animation.estimatedMinutes || 15} min`,
    },
    mindmap,
    learningCards: makeCards(animation, glossary, headlineLatex),
    depth: getCurriculumDepth(animation),
    controls: MATH_CONTROLS,
    glossary,
  };
}
