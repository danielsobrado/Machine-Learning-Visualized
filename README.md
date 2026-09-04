# Machine Learning Visualized

Machine Learning Visualized is an interactive curriculum for machine learning, deep learning, language models, retrieval, diffusion, reinforcement learning, and the math behind them.

The project started as a collection of standalone animations. It is now centered on a unified React app with guided paths, lesson metadata, quizzes, labs, glossary links, and local progress tracking.

[Open the live site](https://danielsobrado.github.io/Machine-Learning-Visualized/)

![Machine Learning Visualized home](screenshots/readme/home.png)

## What is inside

- A unified lesson browser with searchable topics and curriculum tracks.
- Guided paths for fundamentals, experimentation and causal ML, LLMs, frontier LLMs and agentic systems, RAG, model reliability, vision and diffusion, and reinforcement learning.
- Core ML lessons for splitting data, cross-validation, leakage, scaling, metrics, calibration, PCA, clustering, tree ensembles, classical classifiers, and time-series forecasting with rolling-origin backtests.
- Model reliability lessons for debugging, interpretability, monitoring, fairness, and uncertainty estimation.
- Experimentation and causal ML lessons for A/B testing foundations and power analysis, with planned modules for sequential testing, CUPED, confounding, DAGs, treatment effects, and propensity scores.
- Transformer lessons for attention, masks, architecture families, training objectives, token generation, sampling, KV cache, Flash Attention, and fine-tuning.
- Frontier LLM lessons for MoE at scale, MLA, Native Sparse Attention, RLVR/GRPO, test-time compute, long-context systems, omni multimodal models, diffusion language models, efficient serving, frontier evaluation/safety, tool-using reasoners, and agentic coding systems.
- RAG lessons for chunking, vector indexing, reranking, grounding, retrieval evaluation, and failure modes.
- Neural-network lessons for backpropagation, initialization, optimizers, dropout, batch normalization, and training-loop dynamics.
- Diffusion lessons from beginner denoising intuition through sampling, classifier-free guidance, U-Net vs DiT, SD3, DiT, VAE, CLIP, T5, and flow matching.
- Small from-scratch implementations in Rust, Go, Java, and Python for neural networks, diffusion, and Markov chains.

### Core ML Lesson

![Core ML lesson](screenshots/readme/core-ml.png)

### LLM Generation Lesson

![Token generation lesson](screenshots/readme/llm-generation.png)

### Frontier LLM Architecture

![Frontier LLM architecture lesson](screenshots/readme/frontier-llm-architecture.png)

### Reasoning RLVR / GRPO

![Reasoning RLVR and GRPO lesson](screenshots/readme/reasoning-rlvr-grpo.png)

### Efficient LLM Serving

![Efficient LLM serving lesson](screenshots/readme/efficient-llm-serving.png)

### Frontier Evaluation and Safety

![Frontier evaluation and safety lesson](screenshots/readme/frontier-evaluation-safety.png)

### Diffusion Basics Lesson

![Diffusion basics lesson](screenshots/readme/diffusion-basics.png)

## Curriculum Areas

### Foundations

The foundations track covers linear algebra, probability, statistics, optimization, and the core supervised-learning workflow. Lessons include matrix multiplication, linear regression, train/validation/test splits, gradient descent, PCA, k-means, overfitting, regularization, calibration, ROC and precision-recall curves, and bias-variance tradeoffs.

### Natural Language Processing and Transformers

The NLP and transformer track starts with bag-of-words, tokenization, and embeddings, then moves into attention, self-attention, masks, positional encoding, RoPE, transformer architectures, LLM training objectives, token generation, sampling, KV cache, Flash Attention, Native Sparse Attention, and fine-tuning.

### Frontier LLMs and Agentic Systems

The frontier path covers modern architecture and systems topics: dense vs MoE models, MLA, Native Sparse Attention, attention compression, reasoning models, RLVR/GRPO, test-time compute, tool-using reasoning, agentic coding, long-context systems, omni multimodal models, diffusion language models, efficient LLM serving, and frontier evaluation/safety.

### RAG

The retrieval track covers the RAG pipeline as a system: chunking, embedding search, vector indexing, reranking, context packing, grounding, retrieval metrics, and failure modes.

### Model Reliability

The model reliability track covers post-training and deployed-system concerns: debugging failures, interpreting model behavior, estimating uncertainty, monitoring drift and regressions, and evaluating fairness tradeoffs across slices and groups.

### Experimentation and Causal ML

The experimentation track connects hypothesis testing, confidence intervals, metrics, calibration, leakage, fairness, monitoring, and uncertainty to causal decision-making. Active lessons now cover A/B testing foundations, power and sample size, sequential testing and peeking, CUPED variance reduction, confounding and Simpson's paradox, causal graphs and DAGs, treatment effects, and propensity scores.

Time series and forecasting has graduated from an overview into an interactive forecasting workbench with naive and seasonal-naive baselines, trend-plus-seasonal modeling, chronological holdouts, rolling-origin backtests, MAE/RMSE/MASE diagnostics, regime-shift stress tests, and a concrete future-leakage demonstration.

The remaining next-priority applied ML pillars are active as overview lessons: recommender systems and ranking, ML security and robustness, efficient inference and compression, and data engineering for ML.

### Vision and Diffusion

The diffusion track starts with basic denoising and sampling before moving into classifier-free guidance, U-Net vs DiT, latent VAEs, CLIP, T5, SD3, DiT, joint attention, and flow matching.

### Reinforcement Learning

The RL track covers agents, rewards, discounted returns, MDPs, value iteration, policy iteration, Q-learning, exploration, policy gradients, actor-critic methods, and reward shaping.

## Standalone Implementations

The repository also includes compact implementations meant for reading and experimentation:

- `mini-nn/`, `mini-nn-go/`, `mini-nn-java/`, `mini-nn-python/`
- `mini-diffusion/`, `mini-diffusion-go/`, `mini-diffusion-java/`, `mini-diffusion-python/`
- `mini-markov/`, `mini-markov-go/`, `mini-markov-java/`, `mini-markov-python/`
- `mini-eagle/` Rustlings-style exercises for EAGLE 3.1 speculative decoding
- `mini-spec-sparse/` Rustlings-style exercises for SpecSA / SpecAttn sparse speculative decoding
- `mini-turboquant/` Rustlings-style exercises for TurboQuant KV-cache quantization

Each directory has its own README with setup notes and examples.\

## License

MIT. See [LICENSE](LICENSE).
