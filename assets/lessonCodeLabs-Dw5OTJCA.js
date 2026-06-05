import{a as u}from"./assessment-data-BEcQsvEZ.js";const b=77,x=new Set(["and","for","the","as","of","to","in","vs","with","from","into","overview","track","comprehensive"]),y=new Map(u.map((e,a)=>[e.id,a]));function m(e){return[...new Set(e)]}function l(e){return m(String(e).toLowerCase().split(/[^a-z0-9]+/).filter(a=>a.length>1&&!x.has(a)))}function v(e){return String(e).split(/[^a-zA-Z0-9]+/).filter(Boolean).map(t=>`${t[0].toUpperCase()}${t.slice(1)}`).join("")||"Lesson"}function d(e,a){const o=e.toLowerCase();return a.filter(t=>o.includes(t)).length}function w(e){const a=m([...l(e.id),...l(e.name)]);return a.length>0?a.slice(0,3):["lesson"]}function p(e){return`/animation/${e.id}`}function k({lesson:e,stepLabel:a,suffix:o,keyword:t,domain:i}){const n=`has${o}Keyword`;return{id:`${e.id}-keyword-check`,group:e.name,stepLabel:a,title:"Recognize the lesson keyword",concept:`${e.name} can be indexed by a stable keyword before deeper ${i.kind} logic runs.`,objective:"Return true when text contains the lesson keyword, case-insensitively.",difficulty:"warmup",starterCode:`function ${n}(text) {
  const keyword = ${JSON.stringify(t)};

  // TODO: return whether text contains keyword, ignoring case.
  return false;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('lesson reference matches', ${n}(${JSON.stringify(`${e.name} ${p(e)}`)}), true);
check('lesson route matches', ${n}(${JSON.stringify(p(e))}), true);
check('unrelated text misses', ${n}('zzzz yyyy xxxx'), false);

return results;`,hints:["Convert the incoming text to lowercase before checking.","Use text.toLowerCase().includes(keyword).","return text.toLowerCase().includes(keyword);"],solution:`function ${n}(text) {
  const keyword = ${JSON.stringify(t)};
  return text.toLowerCase().includes(keyword);
}`,explanation:`Stable keywords help route learners and examples to the right ${e.name} code path.`}}function S({lesson:e,stepLabel:a,suffix:o,terms:t,domain:i}){const n=`count${o}FocusTerms`,s=d(e.name,t),c=`${e.name} ${e.description}`,f=d(c,t);return{id:`${e.id}-focus-term-count`,group:e.name,stepLabel:a,title:"Count focus terms",concept:`${i.kind} systems often reduce text into small signals before ranking or checking.`,objective:"Count how many lesson focus terms appear in the text.",difficulty:"core",starterCode:`function ${n}(text) {
  const terms = ${JSON.stringify(t)};
  const lower = text.toLowerCase();
  let count = 0;

  for (let i = 0; i < terms.length; i++) {
    // TODO: increment count when lower contains terms[i].
  }

  return count;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('title terms', ${n}(${JSON.stringify(e.name)}), ${s});
check('description terms', ${n}(${JSON.stringify(c)}), ${f});
check('no matching terms', ${n}('zzzz yyyy xxxx'), 0);

return results;`,hints:["lower and terms are already prepared.","Use lower.includes(terms[i]) inside the loop.","if (lower.includes(terms[i])) count += 1;"],solution:`function ${n}(text) {
  const terms = ${JSON.stringify(t)};
  const lower = text.toLowerCase();
  let count = 0;

  for (let i = 0; i < terms.length; i++) {
    if (lower.includes(terms[i])) count += 1;
  }

  return count;
}`,explanation:`This mirrors the small feature checks behind search, routing, and lesson-specific ${i.signalName} logic.`}}function O({lesson:e,stepLabel:a,suffix:o,domain:t}){const i=`best${o}Candidate`;return{id:`${e.id}-best-candidate`,group:e.name,stepLabel:a,title:"Select the best candidate",concept:`${t.kind} workflows often rank candidates by a score before choosing the next action.`,objective:"Return the id of the candidate with the highest score.",difficulty:"core",starterCode:`function ${i}(candidates) {
  let best = candidates[0];

  for (let i = 1; i < candidates.length; i++) {
    // TODO: update best when candidates[i] has a higher score.
  }

  return best.id;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('lesson candidate wins', ${i}([
  { id: 'baseline', score: 0.2 },
  { id: ${JSON.stringify(e.id)}, score: 0.9 },
  { id: 'distractor', score: 0.4 },
]), ${JSON.stringify(e.id)});

check('last candidate wins', ${i}([
  { id: 'first', score: 0.1 },
  { id: 'second', score: 0.3 },
  { id: 'third', score: 0.8 },
]), 'third');

return results;`,hints:["Compare candidates[i].score with best.score.","If the current score is larger, replace best.","if (candidates[i].score > best.score) best = candidates[i];"],solution:`function ${i}(candidates) {
  let best = candidates[0];

  for (let i = 1; i < candidates.length; i++) {
    if (candidates[i].score > best.score) best = candidates[i];
  }

  return best.id;
}`,explanation:`Ranking by ${t.signalName} is a reusable pattern across ${e.categoryName} lessons.`}}function N({lesson:e,stepLabel:a,suffix:o,domain:t}){const i=`has${o}PipelineStages`,n=t.stages,s=n.slice(0,-1),c=[...n].reverse();return{id:`${e.id}-pipeline-stage-check`,group:e.name,stepLabel:a,title:"Check required stages",concept:`${e.name} is easier to debug when the expected ${t.kind} stages are explicit.`,objective:"Return false when any required stage is missing.",difficulty:"challenge",starterCode:`function ${i}(stages) {
  const requiredStages = ${JSON.stringify(n)};

  for (let i = 0; i < requiredStages.length; i++) {
    // TODO: return false if stages does not include requiredStages[i].
  }

  return true;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('all stages present', ${i}(${JSON.stringify(n)}), true);
check('order does not matter', ${i}(${JSON.stringify(c)}), true);
check('missing one stage', ${i}(${JSON.stringify(s)}), false);

return results;`,hints:["Use stages.includes(requiredStages[i]).","Return false as soon as one required stage is absent.","if (!stages.includes(requiredStages[i])) return false;"],solution:`function ${i}(stages) {
  const requiredStages = ${JSON.stringify(n)};

  for (let i = 0; i < requiredStages.length; i++) {
    if (!stages.includes(requiredStages[i])) return false;
  }

  return true;
}`,explanation:`${t.stageExplanation} This check makes that dependency visible in code.`}}function L(e,a){const o=y.get(e.id),t=b+o,i=w(e),n=v(e.id);return{lessonId:e.id,lessonName:e.name,categoryId:e.categoryId,categoryName:e.categoryName,groupNumber:t,exercises:[k({lesson:e,stepLabel:`${t}.1`,suffix:n,keyword:i[0],domain:a}),S({lesson:e,stepLabel:`${t}.2`,suffix:n,terms:i,domain:a}),O({lesson:e,stepLabel:`${t}.3`,suffix:n,domain:a}),N({lesson:e,stepLabel:`${t}.4`,suffix:n,domain:a})]}}function r(e,a){return u.filter(o=>o.categoryId===e).map(o=>L(o,a))}function h(e,a,o){return e.map(t=>t.lessonId!==a?t:{...t,exercises:o(t).map((i,n)=>{var s;return{...i,group:t.lessonName,stepLabel:((s=t.exercises[n])==null?void 0:s.stepLabel)||`${t.groupNumber}.${n+1}`}})})}const C=r("nlp",{kind:"text representation",signalName:"text relevance",stages:["tokenize","vectorize","compare"],stageExplanation:"NLP code usually has to tokenize text before it can build or compare representations."}),$=r("transformers",{kind:"sequence-modeling",signalName:"attention or routing score",stages:["project","score","mix"],stageExplanation:"Transformer internals depend on explicit projection, scoring, and mixing stages."}),R=r("papers",{kind:"paper-reading",signalName:"claim, mechanism, or evidence score",stages:["claim","mechanism","evidence"],stageExplanation:"Paper lessons work best when the claim, mechanism, and evidence are checked separately."}),E=r("frontier-llms",{kind:"frontier-model evaluation",signalName:"capability or risk score",stages:["measure","compare","gate"],stageExplanation:"Frontier-model systems need measurement, comparison, and release gates before deployment decisions."}),A=r("neural-networks",{kind:"neural-network computation",signalName:"activation or gradient signal",stages:["forward","loss","update"],stageExplanation:"Neural-network code is built around forward computation, loss measurement, and parameter updates."}),M=h(A,"optimizers",()=>[{id:"optimizers-minibatch-mean-gradient",title:"Average mini-batch gradients",concept:"Mini-batch optimizers update from the mean of noisy per-example gradients, not from one arbitrary example.",objective:"Return the coordinate-wise mean gradient for a batch of gradient vectors.",difficulty:"core",starterCode:`function meanGradient(gradients) {
  const totals = Array(gradients[0].length).fill(0);

  for (let row = 0; row < gradients.length; row++) {
    for (let col = 0; col < gradients[row].length; col++) {
      // TODO: accumulate this gradient coordinate.
    }
  }

  // TODO: divide each total by the batch size.
  return totals;
}`,testCode:`const results = [];

function sameArray(actual, expected) {
  return actual.length === expected.length && actual.every((value, index) => Math.abs(value - expected[index]) <= 1e-9);
}

function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual, expected) });
}

check('two gradients', meanGradient([[2, 4], [4, 8]]), [3, 6]);
check('noise cancels', meanGradient([[1, -1], [3, 1], [2, 0]]), [2, 0]);
check('single example', meanGradient([[-0.5, 2]]), [-0.5, 2]);

return results;`,hints:["Add gradients[row][col] into totals[col].","After accumulation, divide each total by gradients.length.","return totals.map((total) => total / gradients.length);"],solution:`function meanGradient(gradients) {
  const totals = Array(gradients[0].length).fill(0);

  for (let row = 0; row < gradients.length; row++) {
    for (let col = 0; col < gradients[row].length; col++) {
      totals[col] += gradients[row][col];
    }
  }

  return totals.map((total) => total / gradients.length);
}`,explanation:"Larger batches reduce random gradient jitter because independent positive and negative noise partly cancels before the optimizer step."},{id:"optimizers-sgd-step",title:"Take an SGD step",concept:"SGD moves parameters opposite the mini-batch gradient by learningRate times the gradient.",objective:"Return theta - learningRate * gradient coordinate by coordinate.",difficulty:"core",starterCode:`function sgdStep(theta, gradient, learningRate) {
  const next = [];

  for (let i = 0; i < theta.length; i++) {
    // TODO: push the updated coordinate.
  }

  return next;
}`,testCode:`const results = [];

function sameArray(actual, expected) {
  return actual.length === expected.length && actual.every((value, index) => Math.abs(value - expected[index]) <= 1e-9);
}

function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual, expected) });
}

check('downhill both axes', sgdStep([1, 2], [0.5, -1], 0.2), [0.9, 2.2]);
check('zero gradient unchanged', sgdStep([3, -2], [0, 0], 0.1), [3, -2]);
check('larger learning rate', sgdStep([0, 0], [2, 4], 0.5), [-1, -2]);

return results;`,hints:["The update sign is negative because optimizers minimize loss.","Each coordinate uses theta[i] - learningRate * gradient[i].","next.push(theta[i] - learningRate * gradient[i]);"],solution:`function sgdStep(theta, gradient, learningRate) {
  const next = [];

  for (let i = 0; i < theta.length; i++) {
    next.push(theta[i] - learningRate * gradient[i]);
  }

  return next;
}`,explanation:"The first-step prediction in the Optimizers lesson is the sign of this delta on the shared deterministic gradient."},{id:"optimizers-momentum-velocity",title:"Update momentum velocity",concept:"Momentum keeps a velocity term so repeated gradient directions accumulate across steps.",objective:"Return beta * velocity + gradient for each coordinate.",difficulty:"core",starterCode:`function momentumVelocity(velocity, gradient, beta) {
  const nextVelocity = [];

  for (let i = 0; i < velocity.length; i++) {
    // TODO: combine old velocity and current gradient.
  }

  return nextVelocity;
}`,testCode:`const results = [];

function sameArray(actual, expected) {
  return actual.length === expected.length && actual.every((value, index) => Math.abs(value - expected[index]) <= 1e-9);
}

function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual, expected) });
}

check('build velocity', momentumVelocity([1, -2], [0.5, 1], 0.9), [1.4, -0.8]);
check('first step equals gradient', momentumVelocity([0, 0], [3, -1], 0.9), [3, -1]);
check('damped old velocity', momentumVelocity([10], [-2], 0.5), [3]);

return results;`,hints:["Momentum keeps part of the old velocity.","Add the current gradient after beta * velocity[i].","nextVelocity.push(beta * velocity[i] + gradient[i]);"],solution:`function momentumVelocity(velocity, gradient, beta) {
  const nextVelocity = [];

  for (let i = 0; i < velocity.length; i++) {
    nextVelocity.push(beta * velocity[i] + gradient[i]);
  }

  return nextVelocity;
}`,explanation:"Velocity explains why momentum can cross shallow valleys faster but can overshoot when the accumulated direction becomes too large."},{id:"optimizers-adam-bias-corrected-step",title:"Apply Adam bias correction",concept:"Adam corrects early first and second moments before scaling the parameter step.",objective:"Compute one coordinate update using corrected m and v.",difficulty:"challenge",starterCode:`function adamCoordinateStep(theta, gradient, mPrev, vPrev, step, learningRate, beta1, beta2, epsilon = 1e-8) {
  const m = beta1 * mPrev + (1 - beta1) * gradient;
  const v = beta2 * vPrev + (1 - beta2) * gradient * gradient;

  // TODO: bias-correct m and v, then return theta - learningRate * correctedM / (sqrt(correctedV) + epsilon).
  return theta;
}`,testCode:`const results = [];

function approx(actual, expected, tolerance = 1e-9) {
  return Math.abs(actual - expected) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approx(actual, expected) });
}

check('first step normalizes gradient sign', adamCoordinateStep(1, 4, 0, 0, 1, 0.1, 0.9, 0.999), 0.90000000025);
check('negative gradient increases theta', adamCoordinateStep(1, -2, 0, 0, 1, 0.1, 0.9, 0.999), 1.0999999995);
check('later biased moments corrected', Number(adamCoordinateStep(2, 3, 0.2, 0.5, 3, 0.05, 0.8, 0.9).toFixed(6)), 1.965112);

return results;`,hints:["Use 1 - Math.pow(beta, step) as the bias-correction denominator.","Correct both moments before the square-root scaling.","const mHat = m / (1 - Math.pow(beta1, step)); const vHat = v / (1 - Math.pow(beta2, step));"],solution:`function adamCoordinateStep(theta, gradient, mPrev, vPrev, step, learningRate, beta1, beta2, epsilon = 1e-8) {
  const m = beta1 * mPrev + (1 - beta1) * gradient;
  const v = beta2 * vPrev + (1 - beta2) * gradient * gradient;
  const correctedM = m / (1 - Math.pow(beta1, step));
  const correctedV = v / (1 - Math.pow(beta2, step));

  return theta - learningRate * correctedM / (Math.sqrt(correctedV) + epsilon);
}`,explanation:"Bias correction keeps Adam from underestimating early moments, while the second moment still rescales coordinates with different gradient magnitudes."}]),P=r("advanced-models",{kind:"advanced-model pipeline",signalName:"retrieval or multimodal score",stages:["encode","retrieve","ground"],stageExplanation:"Advanced model systems often encode inputs, retrieve or combine evidence, and check grounding."}),_=r("math-fundamentals",{kind:"mathematical computation",signalName:"numeric fit or stability score",stages:["represent","compute","check"],stageExplanation:"Math code is clearer when representation, computation, and result checks are separate."}),T=r("core-ml",{kind:"machine-learning workflow",signalName:"validation metric",stages:["split","train","evaluate"],stageExplanation:"Core ML workflows depend on clean data splits, training logic, and honest evaluation."}),z=r("model-reliability",{kind:"reliability check",signalName:"monitoring or risk score",stages:["observe","alert","triage"],stageExplanation:"Reliability systems observe behavior, alert on meaningful shifts, and triage failures."}),B=r("experimentation-causal-ml",{kind:"experiment analysis",signalName:"effect or balance score",stages:["assign","measure","compare"],stageExplanation:"Experiment code must separate assignment, measurement, and comparison to support causal claims."}),j=r("probability-stats",{kind:"probability/statistics calculation",signalName:"probability or uncertainty score",stages:["count","normalize","summarize"],stageExplanation:"Probability code often counts outcomes, normalizes them, then summarizes uncertainty."}),D=r("reinforcement-learning",{kind:"reinforcement-learning loop",signalName:"return or action-value score",stages:["observe","act","learn"],stageExplanation:"RL loops observe state, choose actions, and update behavior from feedback."}),I=h(D,"ppo-clipped-policy-gradient",()=>[{id:"ppo-policy-ratio",title:"Compute the policy ratio",concept:"PPO compares the new policy probability with the old collection-policy probability for the sampled action.",objective:"Return pi_new divided by pi_old.",difficulty:"core",starterCode:`function policyRatio(newProbability, oldProbability) {
  // TODO: return the new-to-old probability ratio.
  return 0;
}`,testCode:`const results = [];

function approx(actual, expected, tolerance = 1e-9) {
  return Math.abs(actual - expected) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approx(actual, expected) });
}

check('more likely action', policyRatio(0.36, 0.3), 1.2);
check('less likely action', policyRatio(0.16, 0.4), 0.4);
check('unchanged probability', policyRatio(0.25, 0.25), 1);

return results;`,hints:["The ratio is multiplicative: 1 means unchanged probability.","Use newProbability / oldProbability.","return newProbability / oldProbability;"],solution:`function policyRatio(newProbability, oldProbability) {
  return newProbability / oldProbability;
}`,explanation:"The ratio is the small scalar that lets PPO reuse an old sampled action while asking how much the new policy changed it."},{id:"ppo-clip-ratio-bounds",title:"Clip the ratio band",concept:"Clip epsilon defines the allowed ratio band [1 - epsilon, 1 + epsilon].",objective:"Clamp a ratio into the PPO epsilon band.",difficulty:"core",starterCode:`function clipRatio(ratio, epsilon) {
  const lower = 1 - epsilon;
  const upper = 1 + epsilon;

  // TODO: clamp ratio between lower and upper.
  return ratio;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('inside band unchanged', clipRatio(1.1, 0.2), 1.1);
check('above band capped', clipRatio(1.5, 0.2), 1.2);
check('below band lifted', clipRatio(0.4, 0.2), 0.8);

return results;`,hints:["Use Math.max for the lower bound and Math.min for the upper bound.","Clamp in either order: first lower, then upper.","return Math.min(upper, Math.max(lower, ratio));"],solution:`function clipRatio(ratio, epsilon) {
  const lower = 1 - epsilon;
  const upper = 1 + epsilon;

  return Math.min(upper, Math.max(lower, ratio));
}`,explanation:"The clipped ratio is not the whole PPO objective; it is one candidate used by the surrogate calculation."},{id:"ppo-clipped-surrogate",title:"Select the clipped surrogate",concept:"PPO uses the minimum of the unclipped and clipped objective terms, which makes negative advantages sign-sensitive.",objective:"Return min(ratio * advantage, clip(ratio) * advantage).",difficulty:"core",starterCode:`function clippedSurrogate(ratio, advantage, epsilon) {
  const lower = 1 - epsilon;
  const upper = 1 + epsilon;
  const clippedRatio = Math.min(upper, Math.max(lower, ratio));
  const unclipped = ratio * advantage;
  const clipped = clippedRatio * advantage;

  // TODO: return the conservative PPO objective term.
  return unclipped;
}`,testCode:`const results = [];

function approx(actual, expected, tolerance = 1e-9) {
  return Math.abs(actual - expected) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approx(actual, expected) });
}

check('positive advantage upper clips', clippedSurrogate(1.5, 2, 0.2), 2.4);
check('positive advantage inside band', clippedSurrogate(1.1, 2, 0.2), 2.2);
check('negative advantage lower clips', clippedSurrogate(0.5, -2, 0.2), -1.6);
check('negative advantage high ratio remains conservative', clippedSurrogate(1.5, -2, 0.2), -3);

return results;`,hints:["Compute both candidates before choosing.","PPO uses Math.min, even when advantage is negative.","return Math.min(unclipped, clipped);"],solution:`function clippedSurrogate(ratio, advantage, epsilon) {
  const lower = 1 - epsilon;
  const upper = 1 + epsilon;
  const clippedRatio = Math.min(upper, Math.max(lower, ratio));
  const unclipped = ratio * advantage;
  const clipped = clippedRatio * advantage;

  return Math.min(unclipped, clipped);
}`,explanation:"This exercise catches the common mistake of treating clipping as symmetric without checking advantage sign."},{id:"ppo-count-clipped-rows",title:"Audit clipped minibatch rows",concept:"A PPO minibatch contains a mix of clipped and unclipped samples depending on ratio, epsilon, and advantage sign.",objective:"Count rows where the clipped surrogate differs from the unclipped surrogate.",difficulty:"challenge",starterCode:`function countClippedRows(rows, epsilon) {
  let clippedCount = 0;

  for (let i = 0; i < rows.length; i++) {
    const ratio = rows[i].ratio;
    const advantage = rows[i].advantage;
    const clippedRatio = Math.min(1 + epsilon, Math.max(1 - epsilon, ratio));
    const unclipped = ratio * advantage;
    const clipped = clippedRatio * advantage;

    // TODO: increment clippedCount when PPO selects the clipped candidate.
  }

  return clippedCount;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('mixed signs', countClippedRows([
  { ratio: 1.4, advantage: 2 },
  { ratio: 0.7, advantage: -1 },
  { ratio: 1.1, advantage: 3 },
  { ratio: 1.5, advantage: -2 },
], 0.2), 2);

check('all inside band', countClippedRows([
  { ratio: 0.95, advantage: 1 },
  { ratio: 1.05, advantage: -1 },
], 0.2), 0);

return results;`,hints:["PPO selects Math.min(unclipped, clipped).","A row is clipped when the selected value equals clipped and differs from unclipped.","if (Math.min(unclipped, clipped) !== unclipped) clippedCount += 1;"],solution:`function countClippedRows(rows, epsilon) {
  let clippedCount = 0;

  for (let i = 0; i < rows.length; i++) {
    const ratio = rows[i].ratio;
    const advantage = rows[i].advantage;
    const clippedRatio = Math.min(1 + epsilon, Math.max(1 - epsilon, ratio));
    const unclipped = ratio * advantage;
    const clipped = clippedRatio * advantage;

    if (Math.min(unclipped, clipped) !== unclipped) clippedCount += 1;
  }

  return clippedCount;
}`,explanation:"The minibatch audit links the PPO formula to the lesson table: not every out-of-band ratio clips, because the advantage sign decides which side is conservative."}]),q=r("algorithms",{kind:"algorithmic data structure",signalName:"rank or membership score",stages:["insert","query","verify"],stageExplanation:"Algorithmic structures are useful when updates, queries, and checks are kept explicit."}),J=r("diffusion-models",{kind:"diffusion-model pipeline",signalName:"noise or denoising score",stages:["noise","condition","denoise"],stageExplanation:"Diffusion systems manage noise, conditioning, and denoising as separate implementation stages."}),g=[...C,...$,...R,...E,...M,...P,..._,...T,...z,...B,...j,...I,...q,...J],V=Object.fromEntries(g.map(e=>[e.lessonId,e]));g.flatMap(e=>e.exercises);function G(e){return V[e]||null}function F(e){var a;return((a=G(e))==null?void 0:a.exercises)||[]}export{g as L,F as g};
