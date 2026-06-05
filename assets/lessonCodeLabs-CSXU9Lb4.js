import{a as h}from"./assessment-data-BEcQsvEZ.js";const b=77,x=new Set(["and","for","the","as","of","to","in","vs","with","from","into","overview","track","comprehensive"]),v=new Map(h.map((e,n)=>[e.id,n]));function m(e){return[...new Set(e)]}function u(e){return m(String(e).toLowerCase().split(/[^a-z0-9]+/).filter(n=>n.length>1&&!x.has(n)))}function y(e){return String(e).split(/[^a-zA-Z0-9]+/).filter(Boolean).map(t=>`${t[0].toUpperCase()}${t.slice(1)}`).join("")||"Lesson"}function d(e,n){const o=e.toLowerCase();return n.filter(t=>o.includes(t)).length}function w(e){const n=m([...u(e.id),...u(e.name)]);return n.length>0?n.slice(0,3):["lesson"]}function p(e){return`/animation/${e.id}`}function k({lesson:e,stepLabel:n,suffix:o,keyword:t,domain:a}){const r=`has${o}Keyword`;return{id:`${e.id}-keyword-check`,group:e.name,stepLabel:n,title:"Recognize the lesson keyword",concept:`${e.name} can be indexed by a stable keyword before deeper ${a.kind} logic runs.`,objective:"Return true when text contains the lesson keyword, case-insensitively.",difficulty:"warmup",starterCode:`function ${r}(text) {
  const keyword = ${JSON.stringify(t)};

  // TODO: return whether text contains keyword, ignoring case.
  return false;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('lesson reference matches', ${r}(${JSON.stringify(`${e.name} ${p(e)}`)}), true);
check('lesson route matches', ${r}(${JSON.stringify(p(e))}), true);
check('unrelated text misses', ${r}('zzzz yyyy xxxx'), false);

return results;`,hints:["Convert the incoming text to lowercase before checking.","Use text.toLowerCase().includes(keyword).","return text.toLowerCase().includes(keyword);"],solution:`function ${r}(text) {
  const keyword = ${JSON.stringify(t)};
  return text.toLowerCase().includes(keyword);
}`,explanation:`Stable keywords help route learners and examples to the right ${e.name} code path.`}}function A({lesson:e,stepLabel:n,suffix:o,terms:t,domain:a}){const r=`count${o}FocusTerms`,s=d(e.name,t),c=`${e.name} ${e.description}`,g=d(c,t);return{id:`${e.id}-focus-term-count`,group:e.name,stepLabel:n,title:"Count focus terms",concept:`${a.kind} systems often reduce text into small signals before ranking or checking.`,objective:"Count how many lesson focus terms appear in the text.",difficulty:"core",starterCode:`function ${r}(text) {
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

check('title terms', ${r}(${JSON.stringify(e.name)}), ${s});
check('description terms', ${r}(${JSON.stringify(c)}), ${g});
check('no matching terms', ${r}('zzzz yyyy xxxx'), 0);

return results;`,hints:["lower and terms are already prepared.","Use lower.includes(terms[i]) inside the loop.","if (lower.includes(terms[i])) count += 1;"],solution:`function ${r}(text) {
  const terms = ${JSON.stringify(t)};
  const lower = text.toLowerCase();
  let count = 0;

  for (let i = 0; i < terms.length; i++) {
    if (lower.includes(terms[i])) count += 1;
  }

  return count;
}`,explanation:`This mirrors the small feature checks behind search, routing, and lesson-specific ${a.signalName} logic.`}}function O({lesson:e,stepLabel:n,suffix:o,domain:t}){const a=`best${o}Candidate`;return{id:`${e.id}-best-candidate`,group:e.name,stepLabel:n,title:"Select the best candidate",concept:`${t.kind} workflows often rank candidates by a score before choosing the next action.`,objective:"Return the id of the candidate with the highest score.",difficulty:"core",starterCode:`function ${a}(candidates) {
  let best = candidates[0];

  for (let i = 1; i < candidates.length; i++) {
    // TODO: update best when candidates[i] has a higher score.
  }

  return best.id;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('lesson candidate wins', ${a}([
  { id: 'baseline', score: 0.2 },
  { id: ${JSON.stringify(e.id)}, score: 0.9 },
  { id: 'distractor', score: 0.4 },
]), ${JSON.stringify(e.id)});

check('last candidate wins', ${a}([
  { id: 'first', score: 0.1 },
  { id: 'second', score: 0.3 },
  { id: 'third', score: 0.8 },
]), 'third');

return results;`,hints:["Compare candidates[i].score with best.score.","If the current score is larger, replace best.","if (candidates[i].score > best.score) best = candidates[i];"],solution:`function ${a}(candidates) {
  let best = candidates[0];

  for (let i = 1; i < candidates.length; i++) {
    if (candidates[i].score > best.score) best = candidates[i];
  }

  return best.id;
}`,explanation:`Ranking by ${t.signalName} is a reusable pattern across ${e.categoryName} lessons.`}}function j({lesson:e,stepLabel:n,suffix:o,domain:t}){const a=`has${o}PipelineStages`,r=t.stages,s=r.slice(0,-1),c=[...r].reverse();return{id:`${e.id}-pipeline-stage-check`,group:e.name,stepLabel:n,title:"Check required stages",concept:`${e.name} is easier to debug when the expected ${t.kind} stages are explicit.`,objective:"Return false when any required stage is missing.",difficulty:"challenge",starterCode:`function ${a}(stages) {
  const requiredStages = ${JSON.stringify(r)};

  for (let i = 0; i < requiredStages.length; i++) {
    // TODO: return false if stages does not include requiredStages[i].
  }

  return true;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('all stages present', ${a}(${JSON.stringify(r)}), true);
check('order does not matter', ${a}(${JSON.stringify(c)}), true);
check('missing one stage', ${a}(${JSON.stringify(s)}), false);

return results;`,hints:["Use stages.includes(requiredStages[i]).","Return false as soon as one required stage is absent.","if (!stages.includes(requiredStages[i])) return false;"],solution:`function ${a}(stages) {
  const requiredStages = ${JSON.stringify(r)};

  for (let i = 0; i < requiredStages.length; i++) {
    if (!stages.includes(requiredStages[i])) return false;
  }

  return true;
}`,explanation:`${t.stageExplanation} This check makes that dependency visible in code.`}}function C(e,n){const o=v.get(e.id),t=b+o,a=w(e),r=y(e.id);return{lessonId:e.id,lessonName:e.name,categoryId:e.categoryId,categoryName:e.categoryName,groupNumber:t,exercises:[k({lesson:e,stepLabel:`${t}.1`,suffix:r,keyword:a[0],domain:n}),A({lesson:e,stepLabel:`${t}.2`,suffix:r,terms:a,domain:n}),O({lesson:e,stepLabel:`${t}.3`,suffix:r,domain:n}),j({lesson:e,stepLabel:`${t}.4`,suffix:r,domain:n})]}}function i(e,n){return h.filter(o=>o.categoryId===e).map(o=>C(o,n))}function l(e,n,o){return e.map(t=>t.lessonId!==n?t:{...t,exercises:o(t).map((a,r)=>{var s;return{...a,group:t.lessonName,stepLabel:((s=t.exercises[r])==null?void 0:s.stepLabel)||`${t.groupNumber}.${r+1}`}})})}const S=i("nlp",{kind:"text representation",signalName:"text relevance",stages:["tokenize","vectorize","compare"],stageExplanation:"NLP code usually has to tokenize text before it can build or compare representations."}),M=i("transformers",{kind:"sequence-modeling",signalName:"attention or routing score",stages:["project","score","mix"],stageExplanation:"Transformer internals depend on explicit projection, scoring, and mixing stages."}),T=i("papers",{kind:"paper-reading",signalName:"claim, mechanism, or evidence score",stages:["claim","mechanism","evidence"],stageExplanation:"Paper lessons work best when the claim, mechanism, and evidence are checked separately."}),N=i("frontier-llms",{kind:"frontier-model evaluation",signalName:"capability or risk score",stages:["measure","compare","gate"],stageExplanation:"Frontier-model systems need measurement, comparison, and release gates before deployment decisions."}),q=i("neural-networks",{kind:"neural-network computation",signalName:"activation or gradient signal",stages:["forward","loss","update"],stageExplanation:"Neural-network code is built around forward computation, loss measurement, and parameter updates."}),B=l(q,"optimizers",()=>[{id:"optimizers-minibatch-mean-gradient",title:"Average mini-batch gradients",concept:"Mini-batch optimizers update from the mean of noisy per-example gradients, not from one arbitrary example.",objective:"Return the coordinate-wise mean gradient for a batch of gradient vectors.",difficulty:"core",starterCode:`function meanGradient(gradients) {
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
}`,explanation:"Bias correction keeps Adam from underestimating early moments, while the second moment still rescales coordinates with different gradient magnitudes."}]),L=i("advanced-models",{kind:"advanced-model pipeline",signalName:"retrieval or multimodal score",stages:["encode","retrieve","ground"],stageExplanation:"Advanced model systems often encode inputs, retrieve or combine evidence, and check grounding."}),E=[{id:"dot-product-first-pair",stepLabel:"1.1",group:"Dot product",title:"First matching pair",concept:"A dot product starts by multiplying entries with the same index. The first contribution comes from multiplying the two index-0 entries.",objective:"Replace one expression with the current aligned pair product inside the full matmul function.",difficulty:"warmup",starterCode:`/**
 * Multiply matrix A (m×n) by matrix B (n×p).
 * @param {number[][]} A - left matrix with m rows and n columns
 * @param {number[][]} B - right matrix with n rows and p columns
 * @returns {number[][]} C - result with m rows and p columns
 */
function matmul(A, B) {
  const m = A.length;
  const n = A[0].length;
  const p = B[0].length;
  const C = Array.from({ length: m }, () => Array(p).fill(0));

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < p; j++) {
      let sum = 0;
      for (let k = 0; k < n; k++) {
        // TODO: replace 0 with the current aligned pair product.
        sum += 0;
      }
      C[i][j] = sum;
    }
  }

  return C;
}`,testCode:`const results = [];

function sameMatrix(actual, expected) {
  return JSON.stringify(actual) === JSON.stringify(expected);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: sameMatrix(actual, expected),
  });
}

check('2x2 product', matmul([[1, 2], [3, 4]], [[5, 6], [7, 8]]), [[19, 22], [43, 50]]);
check('row-column dot product', matmul([[2, 3]], [[4], [5]]), [[23]]);

return results;`,hints:["Each inner-loop step multiplies A[i][k] with B[k][j].","The row entry and column entry must share the same index k.","sum += A[i][k] * B[k][j];"],solution:`/**
 * Multiply matrix A (m×n) by matrix B (n×p).
 * @param {number[][]} A - left matrix with m rows and n columns
 * @param {number[][]} B - right matrix with n rows and p columns
 * @returns {number[][]} C - result with m rows and p columns
 */
function matmul(A, B) {
  const m = A.length;
  const n = A[0].length;
  const p = B[0].length;
  const C = Array.from({ length: m }, () => Array(p).fill(0));

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < p; j++) {
      let sum = 0;
      for (let k = 0; k < n; k++) {
        sum += A[i][k] * B[k][j];
      }
      C[i][j] = sum;
    }
  }

  return C;
}`,explanation:"The first contribution to a dot product comes from multiplying aligned entries; inside matmul that rule lives in the innermost loop."},{id:"dot-product-two-pairs",stepLabel:"1.2",group:"Dot product",title:"Add two pair products",concept:"Before looping, you can add the first two aligned pairs explicitly. The second pair uses index 1 on both sides.",objective:"Replace one expression with the missing second pair product inside the full matmul function.",difficulty:"warmup",starterCode:`/**
 * Multiply matrix A (m×n) by matrix B (n×p).
 * @param {number[][]} A - left matrix with m rows and n columns
 * @param {number[][]} B - right matrix with n rows and p columns
 * @returns {number[][]} C - result with m rows and p columns
 */
function matmul(A, B) {
  const m = A.length;
  const n = A[0].length;
  const p = B[0].length;
  const C = Array.from({ length: m }, () => Array(p).fill(0));

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < p; j++) {
      let sum = A[i][0] * B[0][j];
      // TODO: replace 0 with the second aligned pair product.
      sum += 0;
      for (let k = 2; k < n; k++) {
        sum += A[i][k] * B[k][j];
      }
      C[i][j] = sum;
    }
  }

  return C;
}`,testCode:`const results = [];

function sameMatrix(actual, expected) {
  return JSON.stringify(actual) === JSON.stringify(expected);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: sameMatrix(actual, expected),
  });
}

check('3-wide inner dimension', matmul([[1, 2, 3]], [[4, 5], [6, 7], [8, 9]]), [[40, 46]]);

return results;`,hints:["The second pair also lines up at index 1.","Use A[i][1] and B[1][j].","sum += A[i][1] * B[1][j];"],solution:`/**
 * Multiply matrix A (m×n) by matrix B (n×p).
 * @param {number[][]} A - left matrix with m rows and n columns
 * @param {number[][]} B - right matrix with n rows and p columns
 * @returns {number[][]} C - result with m rows and p columns
 */
function matmul(A, B) {
  const m = A.length;
  const n = A[0].length;
  const p = B[0].length;
  const C = Array.from({ length: m }, () => Array(p).fill(0));

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < p; j++) {
      let sum = A[i][0] * B[0][j];
      sum += A[i][1] * B[1][j];
      for (let k = 2; k < n; k++) {
        sum += A[i][k] * B[k][j];
      }
      C[i][j] = sum;
    }
  }

  return C;
}`,explanation:"Unrolling the first two terms makes the pair pattern visible before the loop generalizes it."},{id:"dot-product-loop-update",stepLabel:"1.3",group:"Dot product",title:"Loop over every pair",concept:"Once you see the pattern, a loop over k accumulates every aligned pair into sum.",objective:"Replace one bound so the inner loop visits every shared index.",difficulty:"core",starterCode:`/**
 * Multiply matrix A (m×n) by matrix B (n×p).
 * @param {number[][]} A - left matrix with m rows and n columns
 * @param {number[][]} B - right matrix with n rows and p columns
 * @returns {number[][]} C - result with m rows and p columns
 */
function matmul(A, B) {
  const m = A.length;
  const n = A[0].length;
  const p = B[0].length;
  const C = Array.from({ length: m }, () => Array(p).fill(0));

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < p; j++) {
      let sum = 0;
      // TODO: replace 0 with the shared inner dimension.
      for (let k = 0; k < 0; k++) {
        sum += A[i][k] * B[k][j];
      }
      C[i][j] = sum;
    }
  }

  return C;
}`,testCode:`const results = [];

function sameMatrix(actual, expected) {
  return JSON.stringify(actual) === JSON.stringify(expected);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: sameMatrix(actual, expected),
  });
}

check(
  'practice-sized product',
  matmul([[1, 2], [3, 1]], [[2, 1, 3], [1, 4, 2]]),
  [[4, 9, 7], [7, 7, 11]]
);

return results;`,hints:["The shared inner size between A and B is n.","The inner loop should run once for every aligned pair.","for (let k = 0; k < n; k++) {"],solution:`/**
 * Multiply matrix A (m×n) by matrix B (n×p).
 * @param {number[][]} A - left matrix with m rows and n columns
 * @param {number[][]} B - right matrix with n rows and p columns
 * @returns {number[][]} C - result with m rows and p columns
 */
function matmul(A, B) {
  const m = A.length;
  const n = A[0].length;
  const p = B[0].length;
  const C = Array.from({ length: m }, () => Array(p).fill(0));

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < p; j++) {
      let sum = 0;
      for (let k = 0; k < n; k++) {
        sum += A[i][k] * B[k][j];
      }
      C[i][j] = sum;
    }
  }

  return C;
}`,explanation:"The inner dimension n tells you how many aligned pairs belong in each dot product."},{id:"matrix-cell-one-term",stepLabel:"2.1",group:"Matrix cell",title:"One cell, first term",concept:"Each output cell C[i][j] stores one dot product. Start with the first aligned pair inside that cell.",objective:"Replace one expression with the first row-column product inside the full matmul function.",difficulty:"core",starterCode:`/**
 * Multiply matrix A (m×n) by matrix B (n×p).
 * @param {number[][]} A - left matrix with m rows and n columns
 * @param {number[][]} B - right matrix with n rows and p columns
 * @returns {number[][]} C - result with m rows and p columns
 */
function matmul(A, B) {
  const m = A.length;
  const n = A[0].length;
  const p = B[0].length;
  const C = Array.from({ length: m }, () => Array(p).fill(0));

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < p; j++) {
      let sum = 0;
      for (let k = 0; k < n; k++) {
        if (k === 0) {
          // TODO: replace 0 with the first row-column product.
          sum += 0;
        } else {
          sum += A[i][k] * B[k][j];
        }
      }
      C[i][j] = sum;
    }
  }

  return C;
}`,testCode:`const results = [];

function sameMatrix(actual, expected) {
  return JSON.stringify(actual) === JSON.stringify(expected);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: sameMatrix(actual, expected),
  });
}

check('first pair drives every cell', matmul([[2, 5], [1, 3]], [[4, 1], [2, 6]]), [[18, 32], [10, 19]]);

return results;`,hints:["For k = 0, use A[i][0] and B[0][j].","The first term is still one aligned pair product.","sum += A[i][0] * B[0][j];"],solution:`/**
 * Multiply matrix A (m×n) by matrix B (n×p).
 * @param {number[][]} A - left matrix with m rows and n columns
 * @param {number[][]} B - right matrix with n rows and p columns
 * @returns {number[][]} C - result with m rows and p columns
 */
function matmul(A, B) {
  const m = A.length;
  const n = A[0].length;
  const p = B[0].length;
  const C = Array.from({ length: m }, () => Array(p).fill(0));

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < p; j++) {
      let sum = 0;
      for (let k = 0; k < n; k++) {
        if (k === 0) {
          sum += A[i][0] * B[0][j];
        } else {
          sum += A[i][k] * B[k][j];
        }
      }
      C[i][j] = sum;
    }
  }

  return C;
}`,explanation:"A matrix cell is a dot product; the first product in that dot product uses k = 0."},{id:"matrix-cell-loop-update",stepLabel:"2.2",group:"Matrix cell",title:"One cell loop",concept:"A single cell is complete once the inner loop accumulates every pair and stores the result in C[i][j].",objective:"Replace one assignment so each computed dot product lands in the correct output cell.",difficulty:"core",starterCode:`/**
 * Multiply matrix A (m×n) by matrix B (n×p).
 * @param {number[][]} A - left matrix with m rows and n columns
 * @param {number[][]} B - right matrix with n rows and p columns
 * @returns {number[][]} C - result with m rows and p columns
 */
function matmul(A, B) {
  const m = A.length;
  const n = A[0].length;
  const p = B[0].length;
  const C = Array.from({ length: m }, () => Array(p).fill(0));

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < p; j++) {
      let sum = 0;
      for (let k = 0; k < n; k++) {
        sum += A[i][k] * B[k][j];
      }
      // TODO: replace 0 with the correct output cell assignment.
      C[0][0] = sum;
    }
  }

  return C;
}`,testCode:`const results = [];

function sameMatrix(actual, expected) {
  return JSON.stringify(actual) === JSON.stringify(expected);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: sameMatrix(actual, expected),
  });
}

check('all cells assigned', matmul([[1, 0], [0, 2]], [[3, 4], [5, 6]]), [[3, 4], [10, 12]]);

return results;`,hints:["Store the finished dot product at row i and column j.","The outer loops already chose the output position.","C[i][j] = sum;"],solution:`/**
 * Multiply matrix A (m×n) by matrix B (n×p).
 * @param {number[][]} A - left matrix with m rows and n columns
 * @param {number[][]} B - right matrix with n rows and p columns
 * @returns {number[][]} C - result with m rows and p columns
 */
function matmul(A, B) {
  const m = A.length;
  const n = A[0].length;
  const p = B[0].length;
  const C = Array.from({ length: m }, () => Array(p).fill(0));

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < p; j++) {
      let sum = 0;
      for (let k = 0; k < n; k++) {
        sum += A[i][k] * B[k][j];
      }
      C[i][j] = sum;
    }
  }

  return C;
}`,explanation:"Assignment to C[i][j] is what turns a dot product into one matrix entry."},{id:"matrix-multiply-column-count",stepLabel:"3.1",group:"Matrix multiplication",title:"Output column",concept:"The j loop walks across output columns. Each column of C comes from pairing every row of A with one column of B.",objective:"Replace one bound so the middle loop visits every output column.",difficulty:"challenge",starterCode:`/**
 * Multiply matrix A (m×n) by matrix B (n×p).
 * @param {number[][]} A - left matrix with m rows and n columns
 * @param {number[][]} B - right matrix with n rows and p columns
 * @returns {number[][]} C - result with m rows and p columns
 */
function matmul(A, B) {
  const m = A.length;
  const n = A[0].length;
  const p = B[0].length;
  const C = Array.from({ length: m }, () => Array(p).fill(0));

  for (let i = 0; i < m; i++) {
    // TODO: replace 0 with the number of output columns.
    for (let j = 0; j < 0; j++) {
      let sum = 0;
      for (let k = 0; k < n; k++) {
        sum += A[i][k] * B[k][j];
      }
      C[i][j] = sum;
    }
  }

  return C;
}`,testCode:`const results = [];

function sameMatrix(actual, expected) {
  return JSON.stringify(actual) === JSON.stringify(expected);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: sameMatrix(actual, expected),
  });
}

check('wide output', matmul([[1, 2], [3, 4]], [[1, 0, 2], [0, 1, 1]]), [[1, 2, 4], [3, 4, 10]]);

return results;`,hints:["B has p columns, so C also has p columns.","The middle loop should run once per output column.","for (let j = 0; j < p; j++) {"],solution:`/**
 * Multiply matrix A (m×n) by matrix B (n×p).
 * @param {number[][]} A - left matrix with m rows and n columns
 * @param {number[][]} B - right matrix with n rows and p columns
 * @returns {number[][]} C - result with m rows and p columns
 */
function matmul(A, B) {
  const m = A.length;
  const n = A[0].length;
  const p = B[0].length;
  const C = Array.from({ length: m }, () => Array(p).fill(0));

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < p; j++) {
      let sum = 0;
      for (let k = 0; k < n; k++) {
        sum += A[i][k] * B[k][j];
      }
      C[i][j] = sum;
    }
  }

  return C;
}`,explanation:"Outer loops choose which output cell you are filling; the inner loop still does the dot product."},{id:"matrix-multiply-push-cell",stepLabel:"3.2",group:"Matrix multiplication",title:"Full matrix multiply",concept:"The i loop walks down rows of A. Together, the three loops fill every output cell.",objective:"Replace one bound so the outer loop visits every output row.",difficulty:"challenge",starterCode:`/**
 * Multiply matrix A (m×n) by matrix B (n×p).
 * @param {number[][]} A - left matrix with m rows and n columns
 * @param {number[][]} B - right matrix with n rows and p columns
 * @returns {number[][]} C - result with m rows and p columns
 */
function matmul(A, B) {
  const m = A.length;
  const n = A[0].length;
  const p = B[0].length;
  const C = Array.from({ length: m }, () => Array(p).fill(0));

  // TODO: replace 0 with the number of output rows.
  for (let i = 0; i < 0; i++) {
    for (let j = 0; j < p; j++) {
      let sum = 0;
      for (let k = 0; k < n; k++) {
        sum += A[i][k] * B[k][j];
      }
      C[i][j] = sum;
    }
  }

  return C;
}`,testCode:`const results = [];

function sameMatrix(actual, expected) {
  return JSON.stringify(actual) === JSON.stringify(expected);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: sameMatrix(actual, expected),
  });
}

check('complete implementation', matmul([[1, 2, 3], [4, 5, 6]], [[7, 8], [9, 10], [11, 12]]), [[58, 64], [139, 154]]);
check('identity matrix', matmul([[1, 0], [0, 1]], [[5, 6], [7, 8]]), [[5, 6], [7, 8]]);

return results;`,hints:["A has m rows, so the outer loop should run m times.","Every row of A should produce one row of C.","for (let i = 0; i < m; i++) {"],solution:`/**
 * Multiply matrix A (m×n) by matrix B (n×p).
 * @param {number[][]} A - left matrix with m rows and n columns
 * @param {number[][]} B - right matrix with n rows and p columns
 * @returns {number[][]} C - result with m rows and p columns
 */
function matmul(A, B) {
  const m = A.length;
  const n = A[0].length;
  const p = B[0].length;
  const C = Array.from({ length: m }, () => Array(p).fill(0));

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < p; j++) {
      let sum = 0;
      for (let k = 0; k < n; k++) {
        sum += A[i][k] * B[k][j];
      }
      C[i][j] = sum;
    }
  }

  return C;
}`,explanation:"You now have the complete manual matmul that general libraries implement much faster."},{id:"vector-norm-square-entry",stepLabel:"4.1",group:"Vector norm",title:"Square one entry",concept:"A vector norm starts by squaring each entry so negative and positive values both contribute positively.",objective:"Replace one number with the square of the first entry.",difficulty:"warmup",starterCode:`function firstSquaredEntry(v) {
  // TODO: replace 0 with the square of the first entry.
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({
    name,
    actual,
    expected,
    passed: Object.is(actual, expected),
  });
}

check('firstSquaredEntry([3, 4])', firstSquaredEntry([3, 4]), 9);
check('firstSquaredEntry([-5, 2])', firstSquaredEntry([-5, 2]), 25);
check('firstSquaredEntry([0, 7])', firstSquaredEntry([0, 7]), 0);

return results;`,hints:["Use index 0 for the first entry.","Squaring means multiplying the value by itself.","return v[0] * v[0];"],solution:`function firstSquaredEntry(v) {
  return v[0] * v[0];
}`,explanation:"The Euclidean norm is based on squared entries, so negative values still add positive length."},{id:"vector-norm-sum-squares",stepLabel:"4.2",group:"Vector norm",title:"Sum every square",concept:"The squared length of a vector is the sum of its squared entries.",objective:"Complete the accumulator update inside the loop.",difficulty:"core",starterCode:`function sumSquares(v) {
  let total = 0;

  for (let i = 0; i < v.length; i++) {
    // TODO: add the square of the current entry.
    total += 0;
  }

  return total;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({
    name,
    actual,
    expected,
    passed: Object.is(actual, expected),
  });
}

check('sumSquares([3, 4])', sumSquares([3, 4]), 25);
check('sumSquares([1, 2, 2])', sumSquares([1, 2, 2]), 9);
check('sumSquares([-1, -2, -3])', sumSquares([-1, -2, -3]), 14);
check('sumSquares([0, 0, 0])', sumSquares([0, 0, 0]), 0);

return results;`,hints:["Inside the loop, v[i] is the current entry.","Add v[i] times v[i] into total.","total += v[i] * v[i];"],solution:`function sumSquares(v) {
  let total = 0;

  for (let i = 0; i < v.length; i++) {
    total += v[i] * v[i];
  }

  return total;
}`,explanation:"The squared norm is the vector dotted with itself: v dot v."},{id:"vector-norm-full",stepLabel:"4.3",group:"Vector norm",title:"Vector norm",concept:"The Euclidean norm is the square root of the sum of squared entries.",objective:"Replace the final return value with the Euclidean norm.",difficulty:"core",starterCode:`function sumSquares(v) {
  let total = 0;
  for (let i = 0; i < v.length; i++) {
    total += v[i] * v[i];
  }
  return total;
}

function norm(v) {
  const squaredLength = sumSquares(v);

  // TODO: return the square root of squaredLength.
  return squaredLength;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({
    name,
    actual,
    expected,
    passed: approxEqual(actual, expected),
  });
}

check('norm([3, 4])', norm([3, 4]), 5);
check('norm([1, 2, 2])', norm([1, 2, 2]), 3);
check('norm([0, 0, 0])', norm([0, 0, 0]), 0);
check('norm([-6, 8])', norm([-6, 8]), 10);

return results;`,hints:["JavaScript has Math.sqrt for square roots.","The norm is Math.sqrt(sumSquares(v)).","return Math.sqrt(squaredLength);"],solution:`function sumSquares(v) {
  let total = 0;
  for (let i = 0; i < v.length; i++) {
    total += v[i] * v[i];
  }
  return total;
}

function norm(v) {
  const squaredLength = sumSquares(v);
  return Math.sqrt(squaredLength);
}`,explanation:"The Euclidean norm is the vector length: sqrt(v1^2 + v2^2 + ... + vn^2)."},{id:"cosine-numerator",stepLabel:"5.1",group:"Cosine similarity",title:"Cosine numerator",concept:"Cosine similarity uses the dot product as its numerator.",objective:"Replace one expression with the dot product of u and v.",difficulty:"warmup",starterCode:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function cosineNumerator(u, v) {
  // TODO: return the dot product of u and v.
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({
    name,
    actual,
    expected,
    passed: Object.is(actual, expected),
  });
}

check('numerator [1, 0] and [0, 1]', cosineNumerator([1, 0], [0, 1]), 0);
check('numerator [1, 2] and [3, 4]', cosineNumerator([1, 2], [3, 4]), 11);
check('numerator [-1, 2] and [3, 5]', cosineNumerator([-1, 2], [3, 5]), 7);

return results;`,hints:["The helper function dot(a, b) is already available.","Cosine similarity starts with u dot v.","return dot(u, v);"],solution:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function cosineNumerator(u, v) {
  return dot(u, v);
}`,explanation:"The dot product measures alignment, but its raw size also depends on vector lengths."},{id:"cosine-denominator",stepLabel:"5.2",group:"Cosine similarity",title:"Cosine denominator",concept:"Cosine similarity divides by both vector lengths so only direction remains.",objective:"Replace one expression with norm(u) times norm(v).",difficulty:"core",starterCode:`function norm(v) {
  let total = 0;
  for (let i = 0; i < v.length; i++) {
    total += v[i] * v[i];
  }
  return Math.sqrt(total);
}

function cosineDenominator(u, v) {
  // TODO: return the product of the two norms.
  return 1;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({
    name,
    actual,
    expected,
    passed: approxEqual(actual, expected),
  });
}

check('denominator [3, 4] and [1, 0]', cosineDenominator([3, 4], [1, 0]), 5);
check('denominator [3, 4] and [0, 5]', cosineDenominator([3, 4], [0, 5]), 25);
check('denominator [1, 2, 2] and [2, 0, 0]', cosineDenominator([1, 2, 2], [2, 0, 0]), 6);

return results;`,hints:["The denominator removes the effect of vector length.","Use norm(u) and norm(v).","return norm(u) * norm(v);"],solution:`function norm(v) {
  let total = 0;
  for (let i = 0; i < v.length; i++) {
    total += v[i] * v[i];
  }
  return Math.sqrt(total);
}

function cosineDenominator(u, v) {
  return norm(u) * norm(v);
}`,explanation:"Dividing by both norms turns raw dot product into directional similarity."},{id:"cosine-similarity-full",stepLabel:"5.3",group:"Cosine similarity",title:"Cosine similarity",concept:"Cosine similarity is dot product divided by the product of vector lengths.",objective:"Complete the final cosine formula.",difficulty:"core",starterCode:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function norm(v) {
  return Math.sqrt(dot(v, v));
}

function cosineSimilarity(u, v) {
  const numerator = dot(u, v);
  const denominator = norm(u) * norm(v);

  // TODO: return cosine similarity.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({
    name,
    actual,
    expected,
    passed: approxEqual(actual, expected),
  });
}

check('same direction', cosineSimilarity([1, 0], [5, 0]), 1);
check('perpendicular', cosineSimilarity([1, 0], [0, 1]), 0);
check('opposite direction', cosineSimilarity([1, 0], [-2, 0]), -1);
check('classic example', cosineSimilarity([1, 2], [3, 4]), 11 / (Math.sqrt(5) * 5));

return results;`,hints:["The numerator and denominator are already computed.","Cosine similarity = numerator / denominator.","return numerator / denominator;"],solution:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function norm(v) {
  return Math.sqrt(dot(v, v));
}

function cosineSimilarity(u, v) {
  const numerator = dot(u, v);
  const denominator = norm(u) * norm(v);
  return numerator / denominator;
}`,explanation:"Cosine similarity compares direction. It equals 1 for same direction, 0 for perpendicular, and -1 for opposite direction."},{id:"transpose-one-entry",stepLabel:"6.1",group:"Transpose",title:"Transpose one entry",concept:"Transposing swaps row and column coordinates.",objective:"Return the transposed value at T[row][col].",difficulty:"warmup",starterCode:`function transposedEntry(A, row, col) {
  // TODO: return the value that appears at T[row][col].
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

const A = [
  [1, 2, 3],
  [4, 5, 6],
];

check('T[0][0]', transposedEntry(A, 0, 0), 1);
check('T[1][0]', transposedEntry(A, 1, 0), 2);
check('T[2][1]', transposedEntry(A, 2, 1), 6);

return results;`,hints:["T[row][col] comes from A[col][row].","Transpose swaps the indices.","return A[col][row];"],solution:`function transposedEntry(A, row, col) {
  return A[col][row];
}`,explanation:"Transpose flips a matrix over its diagonal: rows become columns and columns become rows."},{id:"transpose-output-shape",stepLabel:"6.2",group:"Transpose",title:"Transpose shape",concept:"A matrix with m rows and n columns transposes into n rows and m columns.",objective:"Return the shape of the transposed matrix.",difficulty:"warmup",starterCode:`function transposeShape(A) {
  const rows = A.length;
  const cols = A[0].length;

  // TODO: return [transposedRows, transposedCols].
  return [rows, cols];
}`,testCode:`const results = [];

function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: sameArray(actual, expected),
  });
}

check('2x3 becomes 3x2', transposeShape([[1, 2, 3], [4, 5, 6]]), [3, 2]);
check('3x1 becomes 1x3', transposeShape([[1], [2], [3]]), [1, 3]);
check('1x4 becomes 4x1', transposeShape([[1, 2, 3, 4]]), [4, 1]);

return results;`,hints:["The old number of columns becomes the new number of rows.","The old number of rows becomes the new number of columns.","return [cols, rows];"],solution:`function transposeShape(A) {
  const rows = A.length;
  const cols = A[0].length;
  return [cols, rows];
}`,explanation:"Transpose swaps the shape: m x n becomes n x m."},{id:"transpose-full",stepLabel:"6.3",group:"Transpose",title:"Full transpose",concept:"Build each transposed row by reading down one original column.",objective:"Complete the value pushed into each transposed row.",difficulty:"core",starterCode:`function transpose(A) {
  const rows = A.length;
  const cols = A[0].length;
  const T = [];

  for (let j = 0; j < cols; j++) {
    const row = [];

    for (let i = 0; i < rows; i++) {
      // TODO: push the value that belongs at T[j][i].
      row.push(0);
    }

    T.push(row);
  }

  return T;
}`,testCode:`const results = [];

function sameMatrix(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: sameMatrix(actual, expected),
  });
}

check('2x3 transpose', transpose([[1, 2, 3], [4, 5, 6]]), [[1, 4], [2, 5], [3, 6]]);
check('3x1 transpose', transpose([[1], [2], [3]]), [[1, 2, 3]]);
check('1x3 transpose', transpose([[7, 8, 9]]), [[7], [8], [9]]);

return results;`,hints:["The outer loop j chooses an original column.","The inner loop i moves down the original rows.","row.push(A[i][j]);"],solution:`function transpose(A) {
  const rows = A.length;
  const cols = A[0].length;
  const T = [];

  for (let j = 0; j < cols; j++) {
    const row = [];

    for (let i = 0; i < rows; i++) {
      row.push(A[i][j]);
    }

    T.push(row);
  }

  return T;
}`,explanation:"The j-th row of the transpose is the j-th column of the original matrix."},{id:"matrix-shape-read",stepLabel:"7.1",group:"Shape compatibility",title:"Read matrix shape",concept:"A matrix shape is rows x columns.",objective:"Return [rows, columns] for a matrix.",difficulty:"warmup",starterCode:`function shape(A) {
  const rows = A.length;

  // TODO: replace 0 with the number of columns.
  const cols = 0;

  return [rows, cols];
}`,testCode:`const results = [];

function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: sameArray(actual, expected),
  });
}

check('2x3', shape([[1, 2, 3], [4, 5, 6]]), [2, 3]);
check('3x1', shape([[1], [2], [3]]), [3, 1]);
check('1x2', shape([[9, 8]]), [1, 2]);

return results;`,hints:["Rows are A.length.","Columns are the length of the first row.","const cols = A[0].length;"],solution:`function shape(A) {
  const rows = A.length;
  const cols = A[0].length;
  return [rows, cols];
}`,explanation:"A matrix with 2 rows and 3 columns has shape 2 x 3."},{id:"matrix-shape-can-multiply",stepLabel:"7.2",group:"Shape compatibility",title:"Can these multiply?",concept:"A * B is valid only when columns of A equal rows of B.",objective:"Return true when A and B have compatible shapes.",difficulty:"core",starterCode:`function canMultiply(A, B) {
  const colsA = A[0].length;
  const rowsB = B.length;

  // TODO: return whether the inner dimensions match.
  return false;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('2x3 times 3x2 is valid', canMultiply([[1,2,3],[4,5,6]], [[1,2],[3,4],[5,6]]), true);
check('2x2 times 3x2 is invalid', canMultiply([[1,2],[3,4]], [[1,2],[3,4],[5,6]]), false);
check('1x3 times 3x1 is valid', canMultiply([[1,2,3]], [[1],[2],[3]]), true);
check('3x1 times 3x1 is invalid', canMultiply([[1],[2],[3]], [[1],[2],[3]]), false);

return results;`,hints:["Only the inner dimensions matter.","A is m x n and B is n x p.","return colsA === rowsB;"],solution:`function canMultiply(A, B) {
  const colsA = A[0].length;
  const rowsB = B.length;
  return colsA === rowsB;
}`,explanation:"Matrix multiplication works when each row of A has the same length as each column of B."},{id:"matrix-shape-guard",stepLabel:"7.3",group:"Shape compatibility",title:"Guard matrix multiplication",concept:"Good matrix code checks shape compatibility before computing.",objective:"Throw an error when matrix shapes are incompatible.",difficulty:"challenge",starterCode:`function canMultiply(A, B) {
  return A[0].length === B.length;
}

function matmulShapeCheck(A, B) {
  // TODO: if shapes are incompatible, throw new Error('Incompatible shapes').
  return 'ok';
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

function catchesError(fn) {
  try {
    fn();
    return false;
  } catch (error) {
    return error.message === 'Incompatible shapes';
  }
}

check(
  'valid shape returns ok',
  matmulShapeCheck([[1,2,3]], [[1],[2],[3]]),
  'ok'
);

check(
  'invalid shape throws',
  catchesError(() => matmulShapeCheck([[1,2]], [[1,2], [3,4], [5,6]])),
  true
);

return results;`,hints:["Use canMultiply(A, B).","If canMultiply returns false, throw an Error.",`if (!canMultiply(A, B)) {
  throw new Error('Incompatible shapes');
}`],solution:`function canMultiply(A, B) {
  return A[0].length === B.length;
}

function matmulShapeCheck(A, B) {
  if (!canMultiply(A, B)) {
    throw new Error('Incompatible shapes');
  }

  return 'ok';
}`,explanation:"Shape checking turns a silent wrong computation into a clear mathematical error."},{id:"matrix-vector-one-row",stepLabel:"8.1",group:"Matrix-vector multiplication",title:"One row times vector",concept:"A matrix-vector output entry is one row of the matrix dotted with the vector.",objective:"Compute one output entry.",difficulty:"core",starterCode:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function rowTimesVector(A, x, row) {
  // TODO: return row "row" of A dotted with x.
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

const A = [
  [1, 2, 3],
  [4, 5, 6],
];

const x = [1, 2, 3];

check('row 0 times x', rowTimesVector(A, x, 0), 14);
check('row 1 times x', rowTimesVector(A, x, 1), 32);

return results;`,hints:["A[row] gives the selected row.","Use the dot helper.","return dot(A[row], x);"],solution:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function rowTimesVector(A, x, row) {
  return dot(A[row], x);
}`,explanation:"Matrix-vector multiplication applies the dot-product rule once per matrix row."},{id:"matrix-vector-full",stepLabel:"8.2",group:"Matrix-vector multiplication",title:"Matrix-vector multiplication",concept:"A matrix-vector product stacks one dot product per matrix row.",objective:"Push each row dot product into the output vector.",difficulty:"core",starterCode:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function matvec(A, x) {
  const y = [];

  for (let row = 0; row < A.length; row++) {
    // TODO: push the output entry for this row.
    y.push(0);
  }

  return y;
}`,testCode:`const results = [];

function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: sameArray(actual, expected),
  });
}

check('2x3 times 3-vector', matvec([[1,2,3],[4,5,6]], [1,2,3]), [14, 32]);
check('identity times vector', matvec([[1,0],[0,1]], [7, 8]), [7, 8]);
check('zero matrix', matvec([[0,0],[0,0]], [5, 6]), [0, 0]);

return results;`,hints:["For each row, compute dot(A[row], x).","Push the dot product into y.","y.push(dot(A[row], x));"],solution:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function matvec(A, x) {
  const y = [];

  for (let row = 0; row < A.length; row++) {
    y.push(dot(A[row], x));
  }

  return y;
}`,explanation:"Matrix-vector multiplication is the same row-column idea, but the second object has only one column."},{id:"identity-diagonal-check",stepLabel:"9.1",group:"Identity matrix",title:"Diagonal entries",concept:"In an identity matrix, diagonal entries are 1.",objective:"Return whether a row and column index are on the diagonal.",difficulty:"warmup",starterCode:`function isDiagonal(row, col) {
  // TODO: return true when row and col are the same.
  return false;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('0,0 is diagonal', isDiagonal(0, 0), true);
check('1,1 is diagonal', isDiagonal(1, 1), true);
check('0,1 is not diagonal', isDiagonal(0, 1), false);
check('2,0 is not diagonal', isDiagonal(2, 0), false);

return results;`,hints:["A diagonal entry has the same row and column index.","Compare row and col.","return row === col;"],solution:`function isDiagonal(row, col) {
  return row === col;
}`,explanation:"The identity matrix has 1s exactly where row index equals column index."},{id:"identity-entry",stepLabel:"9.2",group:"Identity matrix",title:"Identity entry",concept:"Identity entries are 1 on the diagonal and 0 everywhere else.",objective:"Return the identity matrix value for one position.",difficulty:"warmup",starterCode:`function identityEntry(row, col) {
  // TODO: return 1 on the diagonal, 0 otherwise.
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('I[0][0]', identityEntry(0, 0), 1);
check('I[1][1]', identityEntry(1, 1), 1);
check('I[0][1]', identityEntry(0, 1), 0);
check('I[2][0]', identityEntry(2, 0), 0);

return results;`,hints:["Use a conditional expression.","If row === col, return 1. Otherwise return 0.","return row === col ? 1 : 0;"],solution:`function identityEntry(row, col) {
  return row === col ? 1 : 0;
}`,explanation:"The identity matrix leaves vectors unchanged because it copies each coordinate onto itself."},{id:"identity-full",stepLabel:"9.3",group:"Identity matrix",title:"Build identity matrix",concept:"An n x n identity matrix has 1s on the diagonal and 0s elsewhere.",objective:"Push the correct entry into each row.",difficulty:"core",starterCode:`function identity(n) {
  const I = [];

  for (let row = 0; row < n; row++) {
    const values = [];

    for (let col = 0; col < n; col++) {
      // TODO: push the identity value for this row and column.
      values.push(0);
    }

    I.push(values);
  }

  return I;
}`,testCode:`const results = [];

function sameMatrix(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: sameMatrix(actual, expected),
  });
}

check('identity(1)', identity(1), [[1]]);
check('identity(2)', identity(2), [[1,0],[0,1]]);
check('identity(3)', identity(3), [[1,0,0],[0,1,0],[0,0,1]]);

return results;`,hints:["Use row === col to detect the diagonal.","Push 1 on the diagonal and 0 elsewhere.","values.push(row === col ? 1 : 0);"],solution:`function identity(n) {
  const I = [];

  for (let row = 0; row < n; row++) {
    const values = [];

    for (let col = 0; col < n; col++) {
      values.push(row === col ? 1 : 0);
    }

    I.push(values);
  }

  return I;
}`,explanation:"The identity matrix is the multiplicative do-nothing matrix: I * x = x."},{id:"projection-unit-scale",stepLabel:"10.1",group:"Projection",title:"Projection scale onto unit vector",concept:"When the basis vector is unit length, the projection scale is just a dot product.",objective:"Return the dot product of v and unitBasis.",difficulty:"core",starterCode:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function projectionScaleUnit(v, unitBasis) {
  // TODO: return the scale of v along unitBasis.
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('onto x-axis', projectionScaleUnit([3, 4], [1, 0]), 3);
check('onto y-axis', projectionScaleUnit([3, 4], [0, 1]), 4);
check('negative direction', projectionScaleUnit([-2, 5], [1, 0]), -2);

return results;`,hints:["A unit basis vector already has length 1.","The amount of v along that direction is v dot unitBasis.","return dot(v, unitBasis);"],solution:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function projectionScaleUnit(v, unitBasis) {
  return dot(v, unitBasis);
}`,explanation:"For a unit direction u, the projection scale is v dot u."},{id:"projection-unit-vector",stepLabel:"10.2",group:"Projection",title:"Projection vector onto unit direction",concept:"The projection vector is scale times the unit direction.",objective:"Replace the TODO with scale times the current basis coordinate.",difficulty:"core",starterCode:`function projectOntoUnit(v, unitBasis) {
  let scale = 0;

  for (let i = 0; i < v.length; i++) {
    scale += v[i] * unitBasis[i];
  }

  const projection = [];

  for (let i = 0; i < unitBasis.length; i++) {
    // TODO: push scale times this basis coordinate.
    projection.push(0);
  }

  return projection;
}`,testCode:`const results = [];

function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: sameArray(actual, expected),
  });
}

check('project [3,4] onto x-axis', projectOntoUnit([3,4], [1,0]), [3,0]);
check('project [3,4] onto y-axis', projectOntoUnit([3,4], [0,1]), [0,4]);
check('project [-2,5] onto x-axis', projectOntoUnit([-2,5], [1,0]), [-2,0]);

return results;`,hints:["The scale is already computed.","Each projection coordinate is scale * unitBasis[i].","projection.push(scale * unitBasis[i]);"],solution:`function projectOntoUnit(v, unitBasis) {
  let scale = 0;

  for (let i = 0; i < v.length; i++) {
    scale += v[i] * unitBasis[i];
  }

  const projection = [];

  for (let i = 0; i < unitBasis.length; i++) {
    projection.push(scale * unitBasis[i]);
  }

  return projection;
}`,explanation:"Projection keeps only the part of v that lies along the chosen unit direction."},{id:"projection-nonunit-vector",stepLabel:"10.3",group:"Projection",title:"Projection onto any vector",concept:"For a non-unit basis b, divide by b dot b before multiplying by b.",objective:"Complete the projection scale formula.",difficulty:"challenge",starterCode:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function projectOnto(v, b) {
  // TODO: replace 0 with the correct projection scale.
  const scale = 0;

  return b.map((entry) => scale * entry);
}`,testCode:`const results = [];

function approxArray(a, b, tolerance = 1e-9) {
  return a.length === b.length && a.every((value, index) => Math.abs(value - b[index]) <= tolerance);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: approxArray(actual, expected),
  });
}

check('project [3,4] onto [2,0]', projectOnto([3,4], [2,0]), [3,0]);
check('project [3,4] onto [0,2]', projectOnto([3,4], [0,2]), [0,4]);
check('project [2,2] onto [1,1]', projectOnto([2,2], [1,1]), [2,2]);
check('project [2,0] onto [1,1]', projectOnto([2,0], [1,1]), [1,1]);

return results;`,hints:["For non-unit b, the scale is (v dot b) / (b dot b).","The denominator corrects for the length of b.","const scale = dot(v, b) / dot(b, b);"],solution:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function projectOnto(v, b) {
  const scale = dot(v, b) / dot(b, b);
  return b.map((entry) => scale * entry);
}`,explanation:"Projection onto b is ((v dot b) / (b dot b)) * b. The denominator handles non-unit basis vectors."},{id:"least-squares-prediction",stepLabel:"11.1",group:"Least-squares residual",title:"Prediction Ax",concept:"Least squares compares the target vector b with the prediction Ax.",objective:"Use matrix-vector multiplication to compute Ax.",difficulty:"core",starterCode:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function matvec(A, x) {
  const y = [];

  for (let row = 0; row < A.length; row++) {
    y.push(dot(A[row], x));
  }

  return y;
}

function prediction(A, x) {
  // TODO: return Ax.
  return [];
}`,testCode:`const results = [];

function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: sameArray(actual, expected),
  });
}

check('prediction 2x2', prediction([[1,2],[3,4]], [1,1]), [3,7]);
check('prediction 2x3', prediction([[1,2,3],[4,5,6]], [1,2,3]), [14,32]);

return results;`,hints:["The helper matvec(A, x) already computes Ax.","prediction should return the model output.","return matvec(A, x);"],solution:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function matvec(A, x) {
  const y = [];

  for (let row = 0; row < A.length; row++) {
    y.push(dot(A[row], x));
  }

  return y;
}

function prediction(A, x) {
  return matvec(A, x);
}`,explanation:"In least squares, Ax is the model output that tries to match b using the columns of A."},{id:"least-squares-residual-vector",stepLabel:"11.2",group:"Least-squares residual",title:"Residual vector",concept:"The residual is target minus prediction: r = b - Ax.",objective:"Complete the residual coordinate formula.",difficulty:"core",starterCode:`function residualVector(b, yHat) {
  const residual = [];

  for (let i = 0; i < b.length; i++) {
    // TODO: push target minus prediction.
    residual.push(0);
  }

  return residual;
}`,testCode:`const results = [];

function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: sameArray(actual, expected),
  });
}

check('residual [5, 10] - [3, 7]', residualVector([5,10], [3,7]), [2,3]);
check('zero residual', residualVector([1,2,3], [1,2,3]), [0,0,0]);
check('negative residual', residualVector([1,1], [4,0]), [-3,1]);

return results;`,hints:["Residual means what is left over after prediction.","Use b[i] - yHat[i].","residual.push(b[i] - yHat[i]);"],solution:`function residualVector(b, yHat) {
  const residual = [];

  for (let i = 0; i < b.length; i++) {
    residual.push(b[i] - yHat[i]);
  }

  return residual;
}`,explanation:"The residual vector points from the prediction Ax to the observed target b."},{id:"least-squares-residual-sum-squares",stepLabel:"11.3",group:"Least-squares residual",title:"Residual sum of squares",concept:"Least squares minimizes the squared length of the residual vector.",objective:"Complete the squared-residual accumulator.",difficulty:"challenge",starterCode:`function residualSumSquares(b, yHat) {
  let total = 0;

  for (let i = 0; i < b.length; i++) {
    const residual = b[i] - yHat[i];

    // TODO: add the squared residual.
    total += 0;
  }

  return total;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('RSS [5,10] vs [3,7]', residualSumSquares([5,10], [3,7]), 13);
check('RSS zero', residualSumSquares([1,2,3], [1,2,3]), 0);
check('RSS negative residuals', residualSumSquares([1,1], [4,0]), 10);

return results;`,hints:["Squared residual means residual times residual.","Add residual * residual into total.","total += residual * residual;"],solution:`function residualSumSquares(b, yHat) {
  let total = 0;

  for (let i = 0; i < b.length; i++) {
    const residual = b[i] - yHat[i];
    total += residual * residual;
  }

  return total;
}`,explanation:"Least squares minimizes RSS, the squared length of the error vector b - Ax."},{id:"orthogonality-dot-zero",stepLabel:"12.1",group:"Orthogonality",title:"Zero dot product",concept:"Two vectors are orthogonal when their dot product is zero.",objective:"Complete the boolean check for zero dot product.",difficulty:"core",starterCode:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function hasZeroDot(a, b) {
  // TODO: return true when the dot product is exactly zero.
  return false;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('standard basis vectors', hasZeroDot([1, 0], [0, 1]), true);
check('non-orthogonal vectors', hasZeroDot([1, 2], [3, 4]), false);
check('integer orthogonal pair', hasZeroDot([2, -1], [1, 2]), true);

return results;`,hints:["Orthogonal means dot(a, b) equals zero.","Use the dot helper.","return dot(a, b) === 0;"],solution:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function hasZeroDot(a, b) {
  return dot(a, b) === 0;
}`,explanation:"Orthogonality is the geometric meaning of a zero dot product."},{id:"orthogonality-tolerance",stepLabel:"12.2",group:"Orthogonality",title:"Orthogonal with tolerance",concept:"Floating-point computations often need a tolerance instead of exact equality.",objective:"Check whether the absolute dot product is small enough.",difficulty:"core",starterCode:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function areOrthogonal(a, b, tolerance = 1e-9) {
  // TODO: return true if |dot(a, b)| is at most tolerance.
  return false;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('standard basis vectors', areOrthogonal([1, 0], [0, 1]), true);
check('opposite diagonal pair', areOrthogonal([1, 1], [1, -1]), true);
check('non-orthogonal vectors', areOrthogonal([1, 2], [3, 4]), false);
check('nearly zero dot product', areOrthogonal([1, 0], [1e-10, 1]), true);

return results;`,hints:["Use Math.abs.","Check whether the absolute dot product is <= tolerance.","return Math.abs(dot(a, b)) <= tolerance;"],solution:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function areOrthogonal(a, b, tolerance = 1e-9) {
  return Math.abs(dot(a, b)) <= tolerance;
}`,explanation:"In real numerical code, zero often means close enough to zero."},{id:"projection-residual-orthogonal",stepLabel:"12.3",group:"Orthogonality",title:"Projection residual is orthogonal",concept:"After projecting v onto b, the leftover residual is orthogonal to b.",objective:"Return the dot product between the residual and b.",difficulty:"challenge",starterCode:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function projectOnto(v, b) {
  const scale = dot(v, b) / dot(b, b);
  return b.map((entry) => scale * entry);
}

function residualAfterProjection(v, b) {
  const projection = projectOnto(v, b);
  return v.map((entry, i) => entry - projection[i]);
}

function residualDotBasis(v, b) {
  const residual = residualAfterProjection(v, b);

  // TODO: return residual dotted with b.
  return 999;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('x-axis projection residual', residualDotBasis([3, 4], [1, 0]), 0);
check('diagonal projection residual', residualDotBasis([2, 0], [1, 1]), 0);
check('non-unit projection residual', residualDotBasis([5, 2], [2, 1]), 0);

return results;`,hints:["The residual is already computed.","Use dot(residual, b).","return dot(residual, b);"],solution:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function projectOnto(v, b) {
  const scale = dot(v, b) / dot(b, b);
  return b.map((entry) => scale * entry);
}

function residualAfterProjection(v, b) {
  const projection = projectOnto(v, b);
  return v.map((entry, i) => entry - projection[i]);
}

function residualDotBasis(v, b) {
  const residual = residualAfterProjection(v, b);
  return dot(residual, b);
}`,explanation:"Projection leaves behind an error vector that is perpendicular to the projection direction."},{id:"projection-matrix-outer-product",stepLabel:"13.1",group:"Projection matrix",title:"Outer product",concept:"For a unit vector u, the projection matrix onto u is u times u^T.",objective:"Compute one entry of the outer product.",difficulty:"core",starterCode:`function outerEntry(u, row, col) {
  // TODO: return u[row] times u[col].
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('x-axis top-left', outerEntry([1, 0], 0, 0), 1);
check('x-axis off diagonal', outerEntry([1, 0], 0, 1), 0);
check('y-axis bottom-right', outerEntry([0, 1], 1, 1), 1);
check('diagonal unit vector', outerEntry([0.6, 0.8], 0, 1), 0.48);

return results;`,hints:["Outer product combines one coordinate from the row and one from the column.","Use u[row] and u[col].","return u[row] * u[col];"],solution:`function outerEntry(u, row, col) {
  return u[row] * u[col];
}`,explanation:"The outer product builds a matrix from a vector by multiplying every pair of coordinates."},{id:"projection-matrix-unit",stepLabel:"13.2",group:"Projection matrix",title:"Projection matrix onto unit vector",concept:"A projection matrix onto a unit vector u is P = u times u^T.",objective:"Push the correct outer-product entry into each row.",difficulty:"core",starterCode:`function projectionMatrixUnit(u) {
  const P = [];

  for (let row = 0; row < u.length; row++) {
    const values = [];

    for (let col = 0; col < u.length; col++) {
      // TODO: push the projection matrix entry.
      values.push(0);
    }

    P.push(values);
  }

  return P;
}`,testCode:`const results = [];

function approxMatrix(a, b, tolerance = 1e-9) {
  return a.length === b.length && a.every((row, i) => (
    row.length === b[i].length && row.every((value, j) => Math.abs(value - b[i][j]) <= tolerance)
  ));
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: approxMatrix(actual, expected),
  });
}

check('x-axis projection matrix', projectionMatrixUnit([1, 0]), [[1, 0], [0, 0]]);
check('y-axis projection matrix', projectionMatrixUnit([0, 1]), [[0, 0], [0, 1]]);
check('diagonal unit projection matrix', projectionMatrixUnit([0.6, 0.8]), [[0.36, 0.48], [0.48, 0.64]]);

return results;`,hints:["Use the outer product rule.","Each entry is u[row] * u[col].","values.push(u[row] * u[col]);"],solution:`function projectionMatrixUnit(u) {
  const P = [];

  for (let row = 0; row < u.length; row++) {
    const values = [];

    for (let col = 0; col < u.length; col++) {
      values.push(u[row] * u[col]);
    }

    P.push(values);
  }

  return P;
}`,explanation:"A projection matrix stores the projection operation as a matrix."},{id:"projection-matrix-apply",stepLabel:"13.3",group:"Projection matrix",title:"Apply projection matrix",concept:"Applying a projection matrix means matrix-vector multiplication.",objective:"Use matvec to apply P to v.",difficulty:"core",starterCode:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function matvec(A, x) {
  const y = [];

  for (let row = 0; row < A.length; row++) {
    y.push(dot(A[row], x));
  }

  return y;
}

function applyProjectionMatrix(P, v) {
  // TODO: return P times v.
  return [];
}`,testCode:`const results = [];

function approxArray(a, b, tolerance = 1e-9) {
  return a.length === b.length && a.every((value, index) => Math.abs(value - b[index]) <= tolerance);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: approxArray(actual, expected),
  });
}

check('project with x-axis matrix', applyProjectionMatrix([[1,0],[0,0]], [3,4]), [3,0]);
check('project with y-axis matrix', applyProjectionMatrix([[0,0],[0,1]], [3,4]), [0,4]);
check('project with diagonal matrix', applyProjectionMatrix([[0.5,0.5],[0.5,0.5]], [2,0]), [1,1]);

return results;`,hints:["Projection matrix application is just matrix-vector multiplication.","Use the matvec helper.","return matvec(P, v);"],solution:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function matvec(A, x) {
  const y = [];

  for (let row = 0; row < A.length; row++) {
    y.push(dot(A[row], x));
  }

  return y;
}

function applyProjectionMatrix(P, v) {
  return matvec(P, v);
}`,explanation:"Projection matrices turn geometric projection into a normal matrix-vector operation."},{id:"projection-matrix-idempotent",stepLabel:"13.4",group:"Projection matrix",title:"Projecting twice changes nothing",concept:"Projection matrices satisfy P squared = P.",objective:"Return P applied twice to v.",difficulty:"challenge",starterCode:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function matvec(A, x) {
  return A.map((row) => dot(row, x));
}

function projectTwice(P, v) {
  const once = matvec(P, v);

  // TODO: apply P to once.
  return [];
}`,testCode:`const results = [];

function approxArray(a, b, tolerance = 1e-9) {
  return a.length === b.length && a.every((value, index) => Math.abs(value - b[index]) <= tolerance);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: approxArray(actual, expected),
  });
}

check('project twice onto x-axis', projectTwice([[1,0],[0,0]], [3,4]), [3,0]);
check('project twice onto y-axis', projectTwice([[0,0],[0,1]], [3,4]), [0,4]);
check('project twice onto diagonal', projectTwice([[0.5,0.5],[0.5,0.5]], [2,0]), [1,1]);

return results;`,hints:["The variable once is already P times v.","Apply P to once using matvec.","return matvec(P, once);"],solution:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function matvec(A, x) {
  return A.map((row) => dot(row, x));
}

function projectTwice(P, v) {
  const once = matvec(P, v);
  return matvec(P, once);
}`,explanation:"After a vector is already projected onto a subspace, projecting it again does not move it."},{id:"normal-equations-left",stepLabel:"14.1",group:"Normal equations",title:"Compute A^T A",concept:"The left side of the normal equations is A^T A.",objective:"Return transpose(A) times A.",difficulty:"challenge",starterCode:`function transpose(A) {
  const rows = A.length;
  const cols = A[0].length;
  const T = [];

  for (let j = 0; j < cols; j++) {
    const row = [];
    for (let i = 0; i < rows; i++) {
      row.push(A[i][j]);
    }
    T.push(row);
  }

  return T;
}

function matrixCell(A, B, row, col) {
  let total = 0;
  for (let k = 0; k < B.length; k++) {
    total += A[row][k] * B[k][col];
  }
  return total;
}

function matmul(A, B) {
  const C = [];
  for (let i = 0; i < A.length; i++) {
    const row = [];
    for (let j = 0; j < B[0].length; j++) {
      row.push(matrixCell(A, B, i, j));
    }
    C.push(row);
  }
  return C;
}

function normalLeft(A) {
  // TODO: return A^T A.
  return [];
}`,testCode:`const results = [];

function sameMatrix(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: sameMatrix(actual, expected),
  });
}

check('line design matrix normal left', normalLeft([[1, 1], [1, 2], [1, 3]]), [[3, 6], [6, 14]]);
check('identity normal left', normalLeft([[1, 0], [0, 1]]), [[1, 0], [0, 1]]);

return results;`,hints:["First compute transpose(A).","Then multiply transpose(A) by A.","return matmul(transpose(A), A);"],solution:`function transpose(A) {
  const rows = A.length;
  const cols = A[0].length;
  const T = [];

  for (let j = 0; j < cols; j++) {
    const row = [];
    for (let i = 0; i < rows; i++) {
      row.push(A[i][j]);
    }
    T.push(row);
  }

  return T;
}

function matrixCell(A, B, row, col) {
  let total = 0;
  for (let k = 0; k < B.length; k++) {
    total += A[row][k] * B[k][col];
  }
  return total;
}

function matmul(A, B) {
  const C = [];
  for (let i = 0; i < A.length; i++) {
    const row = [];
    for (let j = 0; j < B[0].length; j++) {
      row.push(matrixCell(A, B, i, j));
    }
    C.push(row);
  }
  return C;
}

function normalLeft(A) {
  return matmul(transpose(A), A);
}`,explanation:"Normal equations use A^T A to summarize how columns of A interact with each other."},{id:"normal-equations-right",stepLabel:"14.2",group:"Normal equations",title:"Compute A^T b",concept:"The right side of the normal equations is A^T b.",objective:"Return transpose(A) times b.",difficulty:"challenge",starterCode:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function transpose(A) {
  const T = [];
  for (let j = 0; j < A[0].length; j++) {
    const row = [];
    for (let i = 0; i < A.length; i++) {
      row.push(A[i][j]);
    }
    T.push(row);
  }
  return T;
}

function matvec(A, x) {
  return A.map((row) => dot(row, x));
}

function normalRight(A, b) {
  // TODO: return A^T b.
  return [];
}`,testCode:`const results = [];

function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: sameArray(actual, expected),
  });
}

check('line design matrix normal right', normalRight([[1, 1], [1, 2], [1, 3]], [2, 3, 5]), [10, 23]);
check('identity normal right', normalRight([[1, 0], [0, 1]], [7, 8]), [7, 8]);

return results;`,hints:["The right side is A transpose times b.","Use transpose(A) and matvec.","return matvec(transpose(A), b);"],solution:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function transpose(A) {
  const T = [];
  for (let j = 0; j < A[0].length; j++) {
    const row = [];
    for (let i = 0; i < A.length; i++) {
      row.push(A[i][j]);
    }
    T.push(row);
  }
  return T;
}

function matvec(A, x) {
  return A.map((row) => dot(row, x));
}

function normalRight(A, b) {
  return matvec(transpose(A), b);
}`,explanation:"A^T b measures how each column of A aligns with the target vector b."},{id:"solve-2x2-system",stepLabel:"14.3",group:"Normal equations",title:"Solve 2x2 system",concept:"A small normal equation can be solved with the 2x2 inverse formula.",objective:"Complete the determinant formula.",difficulty:"challenge",starterCode:`function solve2x2(M, y) {
  const a = M[0][0];
  const b = M[0][1];
  const c = M[1][0];
  const d = M[1][1];

  // TODO: compute the determinant ad - bc.
  const det = 1;

  const x0 = (d * y[0] - b * y[1]) / det;
  const x1 = (-c * y[0] + a * y[1]) / det;

  return [x0, x1];
}`,testCode:`const results = [];

function approxArray(a, b, tolerance = 1e-9) {
  return a.length === b.length && a.every((value, index) => Math.abs(value - b[index]) <= tolerance);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: approxArray(actual, expected),
  });
}

check('identity system', solve2x2([[1,0],[0,1]], [7,8]), [7,8]);
check('diagonal system', solve2x2([[2,0],[0,4]], [6,8]), [3,2]);
check('full 2x2 system', solve2x2([[3,1],[1,2]], [9,8]), [2,3]);

return results;`,hints:["The determinant of [[a,b],[c,d]] is ad - bc.","Use the variables already assigned.","const det = a * d - b * c;"],solution:`function solve2x2(M, y) {
  const a = M[0][0];
  const b = M[0][1];
  const c = M[1][0];
  const d = M[1][1];

  const det = a * d - b * c;

  const x0 = (d * y[0] - b * y[1]) / det;
  const x1 = (-c * y[0] + a * y[1]) / det;

  return [x0, x1];
}`,explanation:"For tiny least-squares examples, a 2x2 solver lets learners see the whole normal-equation pipeline."},{id:"line-fit-design-matrix",stepLabel:"15.1",group:"Least-squares line fit",title:"Design matrix for a line",concept:"A line y = b + mx can be written with rows [1, x].",objective:"Push [1, x] for each input value.",difficulty:"core",starterCode:`function designMatrix(xs) {
  const A = [];

  for (let i = 0; i < xs.length; i++) {
    const x = xs[i];

    // TODO: push the row for intercept + slope.
    A.push([]);
  }

  return A;
}`,testCode:`const results = [];

function sameMatrix(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: sameMatrix(actual, expected),
  });
}

check('three x values', designMatrix([1, 2, 3]), [[1,1],[1,2],[1,3]]);
check('two x values', designMatrix([0, 5]), [[1,0],[1,5]]);

return results;`,hints:["The first entry is always 1 for the intercept.","The second entry is x for the slope.","A.push([1, x]);"],solution:`function designMatrix(xs) {
  const A = [];

  for (let i = 0; i < xs.length; i++) {
    const x = xs[i];
    A.push([1, x]);
  }

  return A;
}`,explanation:"The column of 1s lets the model learn an intercept; the x column lets it learn a slope."},{id:"line-fit-predict-one",stepLabel:"15.2",group:"Least-squares line fit",title:"Predict with intercept and slope",concept:"A fitted line predicts yHat = intercept + slope * x.",objective:"Complete the prediction formula.",difficulty:"warmup",starterCode:`function predictLine(params, x) {
  const intercept = params[0];
  const slope = params[1];

  // TODO: return intercept + slope * x.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('intercept only at x=0', predictLine([2, 3], 0), 2);
check('positive slope', predictLine([2, 3], 4), 14);
check('fractional slope', predictLine([-1, 0.5], 6), 2);

return results;`,hints:["params[0] is intercept.","params[1] is slope.","return intercept + slope * x;"],solution:`function predictLine(params, x) {
  const intercept = params[0];
  const slope = params[1];
  return intercept + slope * x;
}`,explanation:"This is the simplest linear regression prediction formula."},{id:"line-fit-normal-equations",stepLabel:"15.3",group:"Least-squares line fit",title:"Fit line with normal equations",concept:"Least squares solves (A^T A)w = A^T y.",objective:"Return the solved parameter vector.",difficulty:"challenge",starterCode:`function fitLineFromNormalEquations(left, right) {
  // left is A^T A and right is A^T y.
  // TODO: solve the 2x2 system.
  return [0, 0];
}`,testCode:`const results = [];

function approxArray(a, b, tolerance = 1e-9) {
  return a.length === b.length && a.every((value, index) => Math.abs(value - b[index]) <= tolerance);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: approxArray(actual, expected),
  });
}

check('line y = x', fitLineFromNormalEquations([[3, 6], [6, 14]], [6, 14]), [0, 1]);
check('line y = 1 + x', fitLineFromNormalEquations([[3, 6], [6, 14]], [9, 20]), [1, 1]);

return results;`,hints:["Reuse the 2x2 solve formula.","Let a, b, c, d be the entries of left, and y be right.","Return [(d*y0 - b*y1)/det, (-c*y0 + a*y1)/det]."],solution:`function fitLineFromNormalEquations(left, right) {
  const a = left[0][0];
  const b = left[0][1];
  const c = left[1][0];
  const d = left[1][1];
  const det = a * d - b * c;

  return [
    (d * right[0] - b * right[1]) / det,
    (-c * right[0] + a * right[1]) / det,
  ];
}`,explanation:"This completes the algebra bridge from matrix multiplication to linear regression."},{id:"mean-basic",stepLabel:"16.1",group:"Centering and covariance",title:"Mean",concept:"The mean is the average value.",objective:"Divide the sum by the number of entries.",difficulty:"warmup",starterCode:`function mean(values) {
  let total = 0;

  for (let i = 0; i < values.length; i++) {
    total += values[i];
  }

  // TODO: return the average.
  return total;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('mean of three values', mean([1,2,3]), 2);
check('mean of two values', mean([10,20]), 15);
check('mean around zero', mean([-1,1]), 0);

return results;`,hints:["Average means total divided by count.","The count is values.length.","return total / values.length;"],solution:`function mean(values) {
  let total = 0;

  for (let i = 0; i < values.length; i++) {
    total += values[i];
  }

  return total / values.length;
}`,explanation:"Centering and covariance both start by finding the mean."},{id:"center-vector",stepLabel:"16.2",group:"Centering and covariance",title:"Center a vector",concept:"Centering subtracts the mean so the values have average zero.",objective:"Push value minus mean into the centered vector.",difficulty:"core",starterCode:`function mean(values) {
  return values.reduce((total, value) => total + value, 0) / values.length;
}

function center(values) {
  const mu = mean(values);
  const centered = [];

  for (let i = 0; i < values.length; i++) {
    // TODO: subtract the mean from the current value.
    centered.push(0);
  }

  return centered;
}`,testCode:`const results = [];

function approxArray(a, b, tolerance = 1e-9) {
  return a.length === b.length && a.every((value, index) => Math.abs(value - b[index]) <= tolerance);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: approxArray(actual, expected),
  });
}

check('center [1,2,3]', center([1,2,3]), [-1,0,1]);
check('center [10,20]', center([10,20]), [-5,5]);
check('center [-1,1]', center([-1,1]), [-1,1]);

return results;`,hints:["The mean is stored in mu.","Centered value = original value - mean.","centered.push(values[i] - mu);"],solution:`function mean(values) {
  return values.reduce((total, value) => total + value, 0) / values.length;
}

function center(values) {
  const mu = mean(values);
  const centered = [];

  for (let i = 0; i < values.length; i++) {
    centered.push(values[i] - mu);
  }

  return centered;
}`,explanation:"Centering moves the data cloud so its average lies at zero."},{id:"covariance-basic",stepLabel:"16.3",group:"Centering and covariance",title:"Covariance",concept:"Covariance measures whether two centered variables move together.",objective:"Accumulate the product of centered coordinates.",difficulty:"challenge",starterCode:`function mean(values) {
  return values.reduce((total, value) => total + value, 0) / values.length;
}

function covariance(x, y) {
  const meanX = mean(x);
  const meanY = mean(y);
  let total = 0;

  for (let i = 0; i < x.length; i++) {
    const centeredX = x[i] - meanX;
    const centeredY = y[i] - meanY;

    // TODO: add the product of the centered values.
    total += 0;
  }

  return total / x.length;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('positive covariance', covariance([1,2,3], [1,2,3]), 2 / 3);
check('negative covariance', covariance([1,2,3], [3,2,1]), -2 / 3);
check('zero covariance with constant y', covariance([1,2,3], [5,5,5]), 0);

return results;`,hints:["Covariance multiplies centered values.","Add centeredX * centeredY.","total += centeredX * centeredY;"],solution:`function mean(values) {
  return values.reduce((total, value) => total + value, 0) / values.length;
}

function covariance(x, y) {
  const meanX = mean(x);
  const meanY = mean(y);
  let total = 0;

  for (let i = 0; i < x.length; i++) {
    const centeredX = x[i] - meanX;
    const centeredY = y[i] - meanY;
    total += centeredX * centeredY;
  }

  return total / x.length;
}`,explanation:"Positive covariance means variables tend to move together; negative covariance means they move in opposite directions."},{id:"column-mean",stepLabel:"17.1",group:"PCA bridge",title:"Column mean",concept:"PCA centers each feature column before measuring variance directions.",objective:"Compute the mean of one matrix column.",difficulty:"core",starterCode:`function columnMean(X, col) {
  let total = 0;

  for (let row = 0; row < X.length; row++) {
    // TODO: add the value from this row and column.
    total += 0;
  }

  return total / X.length;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('first column mean', columnMean([[1,2],[3,4],[5,6]], 0), 3);
check('second column mean', columnMean([[1,2],[3,4],[5,6]], 1), 4);
check('single column mean', columnMean([[10], [20]], 0), 15);

return results;`,hints:["Use X[row][col].","Add the selected column value for each row.","total += X[row][col];"],solution:`function columnMean(X, col) {
  let total = 0;

  for (let row = 0; row < X.length; row++) {
    total += X[row][col];
  }

  return total / X.length;
}`,explanation:"Column means are feature means. PCA centers features, not individual rows."},{id:"center-matrix-columns",stepLabel:"17.2",group:"PCA bridge",title:"Center matrix columns",concept:"Centering a data matrix subtracts each feature column mean.",objective:"Push the centered value for each cell.",difficulty:"challenge",starterCode:`function columnMean(X, col) {
  let total = 0;
  for (let row = 0; row < X.length; row++) {
    total += X[row][col];
  }
  return total / X.length;
}

function centerColumns(X) {
  const rows = X.length;
  const cols = X[0].length;
  const centered = [];

  for (let row = 0; row < rows; row++) {
    const values = [];

    for (let col = 0; col < cols; col++) {
      const mu = columnMean(X, col);

      // TODO: push X[row][col] minus the column mean.
      values.push(0);
    }

    centered.push(values);
  }

  return centered;
}`,testCode:`const results = [];

function approxMatrix(a, b, tolerance = 1e-9) {
  return a.length === b.length && a.every((row, i) => (
    row.length === b[i].length && row.every((value, j) => Math.abs(value - b[i][j]) <= tolerance)
  ));
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: approxMatrix(actual, expected),
  });
}

check('center 3x2 matrix', centerColumns([[1,2],[3,4],[5,6]]), [[-2,-2],[0,0],[2,2]]);
check('center 2x1 matrix', centerColumns([[10],[20]]), [[-5],[5]]);

return results;`,hints:["Each feature column gets its own mean.","Subtract mu from the current cell.","values.push(X[row][col] - mu);"],solution:`function columnMean(X, col) {
  let total = 0;
  for (let row = 0; row < X.length; row++) {
    total += X[row][col];
  }
  return total / X.length;
}

function centerColumns(X) {
  const rows = X.length;
  const cols = X[0].length;
  const centered = [];

  for (let row = 0; row < rows; row++) {
    const values = [];

    for (let col = 0; col < cols; col++) {
      const mu = columnMean(X, col);
      values.push(X[row][col] - mu);
    }

    centered.push(values);
  }

  return centered;
}`,explanation:"PCA looks for directions of spread after removing the average feature values."},{id:"pca-project-row",stepLabel:"17.3",group:"PCA bridge",title:"Project onto a component",concept:"A PCA score is a dot product between a centered data row and a component direction.",objective:"Return the dot product between row and component.",difficulty:"core",starterCode:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function pcaScore(centeredRow, component) {
  // TODO: return the score along this component.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('score on first axis', pcaScore([3, 4], [1, 0]), 3);
check('score on second axis', pcaScore([3, 4], [0, 1]), 4);
check('score on diagonal component', pcaScore([2, 2], [1 / Math.sqrt(2), 1 / Math.sqrt(2)]), 2 * Math.sqrt(2));

return results;`,hints:["A component is a direction vector.","The coordinate along that direction is a dot product.","return dot(centeredRow, component);"],solution:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function pcaScore(centeredRow, component) {
  return dot(centeredRow, component);
}`,explanation:"PCA projection turns high-dimensional centered data into coordinates along chosen directions."},{id:"gram-schmidt-subtract-projection",stepLabel:"18.1",group:"Orthonormal bases",title:"Subtract the projection",concept:"Gram-Schmidt removes the part of a vector that points in a previous basis direction.",objective:"Complete u = v - projection.",difficulty:"core",starterCode:`function subtractVectors(a, b) {
  const result = [];

  for (let i = 0; i < a.length; i++) {
    // TODO: push a[i] minus b[i].
    result.push(0);
  }

  return result;
}`,testCode:`const results = [];

function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: sameArray(actual, expected),
  });
}

check('subtract [3, 4] - [3, 0]', subtractVectors([3, 4], [3, 0]), [0, 4]);
check('subtract [2, 2] - [1, 1]', subtractVectors([2, 2], [1, 1]), [1, 1]);
check('subtract [-1, 5] - [2, 1]', subtractVectors([-1, 5], [2, 1]), [-3, 4]);

return results;`,hints:["Subtract coordinate by coordinate.","The residual keeps what is left after removing the projection.","result.push(a[i] - b[i]);"],solution:`function subtractVectors(a, b) {
  const result = [];

  for (let i = 0; i < a.length; i++) {
    result.push(a[i] - b[i]);
  }

  return result;
}`,explanation:"Gram-Schmidt repeatedly subtracts projections so the remaining vector is orthogonal to earlier basis vectors."},{id:"normalize-vector",stepLabel:"18.2",group:"Orthonormal bases",title:"Normalize a vector",concept:"Normalizing turns a vector into a unit vector without changing its direction.",objective:"Divide each coordinate by the vector norm.",difficulty:"core",starterCode:`function norm(v) {
  let total = 0;

  for (let i = 0; i < v.length; i++) {
    total += v[i] * v[i];
  }

  return Math.sqrt(total);
}

function normalize(v) {
  const length = norm(v);
  const result = [];

  for (let i = 0; i < v.length; i++) {
    // TODO: push the normalized coordinate.
    result.push(0);
  }

  return result;
}`,testCode:`const results = [];

function approxArray(a, b, tolerance = 1e-9) {
  return a.length === b.length && a.every((value, index) => Math.abs(value - b[index]) <= tolerance);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: approxArray(actual, expected),
  });
}

check('normalize [3, 4]', normalize([3, 4]), [0.6, 0.8]);
check('normalize [0, 5]', normalize([0, 5]), [0, 1]);
check('normalize [-6, 8]', normalize([-6, 8]), [-0.6, 0.8]);

return results;`,hints:["The vector length is already stored in length.","Each coordinate should be divided by length.","result.push(v[i] / length);"],solution:`function norm(v) {
  let total = 0;

  for (let i = 0; i < v.length; i++) {
    total += v[i] * v[i];
  }

  return Math.sqrt(total);
}

function normalize(v) {
  const length = norm(v);
  const result = [];

  for (let i = 0; i < v.length; i++) {
    result.push(v[i] / length);
  }

  return result;
}`,explanation:"A unit vector has length 1. Orthonormal bases are made of unit vectors that are mutually perpendicular."},{id:"gram-schmidt-one-step",stepLabel:"18.3",group:"Orthonormal bases",title:"One Gram-Schmidt step",concept:"To make a new vector orthogonal to q, subtract its projection onto q.",objective:"Return v minus its projection onto unit vector q.",difficulty:"challenge",starterCode:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function gramSchmidtResidual(v, q) {
  // q is already a unit vector.
  const scale = dot(v, q);
  const projection = q.map((entry) => scale * entry);

  // TODO: return v minus projection.
  return [];
}`,testCode:`const results = [];

function approxArray(a, b, tolerance = 1e-9) {
  return a.length === b.length && a.every((value, index) => Math.abs(value - b[index]) <= tolerance);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: approxArray(actual, expected),
  });
}

check('remove x-axis part', gramSchmidtResidual([3, 4], [1, 0]), [0, 4]);
check('remove y-axis part', gramSchmidtResidual([3, 4], [0, 1]), [3, 0]);
check('remove diagonal part', gramSchmidtResidual([2, 0], [1 / Math.sqrt(2), 1 / Math.sqrt(2)]), [1, -1]);

return results;`,hints:["The projection has already been computed.","Subtract projection[i] from v[i].","return v.map((entry, i) => entry - projection[i]);"],solution:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function gramSchmidtResidual(v, q) {
  const scale = dot(v, q);
  const projection = q.map((entry) => scale * entry);
  return v.map((entry, i) => entry - projection[i]);
}`,explanation:"This is the heart of Gram-Schmidt: remove the component already explained by a previous basis direction."},{id:"qr-extract-column",stepLabel:"19.1",group:"QR bridge",title:"Extract a column",concept:"QR works with columns of a matrix, so first you need to read a column as a vector.",objective:"Push A[row][col] for every row.",difficulty:"warmup",starterCode:`function column(A, col) {
  const values = [];

  for (let row = 0; row < A.length; row++) {
    // TODO: push the entry from this row and selected column.
    values.push(0);
  }

  return values;
}`,testCode:`const results = [];

function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: sameArray(actual, expected),
  });
}

const A = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

check('column 0', column(A, 0), [1, 4, 7]);
check('column 1', column(A, 1), [2, 5, 8]);
check('column 2', column(A, 2), [3, 6, 9]);

return results;`,hints:["A[row][col] picks one entry from the selected column.","Loop over rows while col stays fixed.","values.push(A[row][col]);"],solution:`function column(A, col) {
  const values = [];

  for (let row = 0; row < A.length; row++) {
    values.push(A[row][col]);
  }

  return values;
}`,explanation:"QR decomposition turns matrix columns into orthonormal directions."},{id:"qr-r-entry",stepLabel:"19.2",group:"QR bridge",title:"One R entry",concept:"In QR, R[i][j] measures how much column j of A points along q_i.",objective:"Return q_i dot a_j.",difficulty:"core",starterCode:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function rEntry(qi, aj) {
  // TODO: return the alignment between qi and aj.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({
    name,
    actual,
    expected,
    passed: approxEqual(actual, expected),
  });
}

check('x-axis with [3,4]', rEntry([1, 0], [3, 4]), 3);
check('y-axis with [3,4]', rEntry([0, 1], [3, 4]), 4);
check('diagonal with [2,0]', rEntry([1 / Math.sqrt(2), 1 / Math.sqrt(2)], [2, 0]), Math.sqrt(2));

return results;`,hints:["R stores dot products between Q columns and A columns.","Use dot(qi, aj).","return dot(qi, aj);"],solution:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function rEntry(qi, aj) {
  return dot(qi, aj);
}`,explanation:"R tells how to combine the orthonormal Q columns to reconstruct A."},{id:"qr-reconstruct",stepLabel:"19.3",group:"QR bridge",title:"Reconstruct with QR",concept:"If A = QR, multiplying Q and R should recover A.",objective:"Return Q times R.",difficulty:"challenge",starterCode:`function matrixCell(A, B, row, col) {
  let total = 0;
  for (let k = 0; k < B.length; k++) {
    total += A[row][k] * B[k][col];
  }
  return total;
}

function matmul(A, B) {
  const C = [];

  for (let row = 0; row < A.length; row++) {
    const values = [];

    for (let col = 0; col < B[0].length; col++) {
      values.push(matrixCell(A, B, row, col));
    }

    C.push(values);
  }

  return C;
}

function reconstructFromQR(Q, R) {
  // TODO: return Q times R.
  return [];
}`,testCode:`const results = [];

function sameMatrix(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: sameMatrix(actual, expected),
  });
}

check('identity Q', reconstructFromQR([[1, 0], [0, 1]], [[3, 4], [0, 5]]), [[3, 4], [0, 5]]);
check('simple Q and R', reconstructFromQR([[1, 0], [0, 1]], [[1, 2, 3], [4, 5, 6]]), [[1, 2, 3], [4, 5, 6]]);

return results;`,hints:["QR reconstruction is ordinary matrix multiplication.","Use the matmul helper.","return matmul(Q, R);"],solution:`function matrixCell(A, B, row, col) {
  let total = 0;
  for (let k = 0; k < B.length; k++) {
    total += A[row][k] * B[k][col];
  }
  return total;
}

function matmul(A, B) {
  const C = [];

  for (let row = 0; row < A.length; row++) {
    const values = [];

    for (let col = 0; col < B[0].length; col++) {
      values.push(matrixCell(A, B, row, col));
    }

    C.push(values);
  }

  return C;
}

function reconstructFromQR(Q, R) {
  return matmul(Q, R);
}`,explanation:"QR is useful because Q is geometrically nice and R is easy to solve with, but together they still represent the original matrix."},{id:"determinant-2x2",stepLabel:"20.1",group:"Determinant and invertibility",title:"2x2 determinant",concept:"The determinant of [[a,b],[c,d]] is ad - bc.",objective:"Complete the determinant formula.",difficulty:"core",starterCode:`function det2(M) {
  const a = M[0][0];
  const b = M[0][1];
  const c = M[1][0];
  const d = M[1][1];

  // TODO: return ad - bc.
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('identity determinant', det2([[1, 0], [0, 1]]), 1);
check('scale determinant', det2([[2, 0], [0, 3]]), 6);
check('shear determinant', det2([[1, 2], [3, 4]]), -2);
check('singular determinant', det2([[1, 2], [2, 4]]), 0);

return results;`,hints:["Use the variables a, b, c, and d.","Multiply the diagonal a*d, then subtract the off-diagonal b*c.","return a * d - b * c;"],solution:`function det2(M) {
  const a = M[0][0];
  const b = M[0][1];
  const c = M[1][0];
  const d = M[1][1];

  return a * d - b * c;
}`,explanation:"For 2D matrices, determinant measures signed area scaling."},{id:"determinant-invertible",stepLabel:"20.2",group:"Determinant and invertibility",title:"Is the matrix invertible?",concept:"A square matrix is invertible only if its determinant is nonzero.",objective:"Return whether the 2x2 matrix is invertible.",difficulty:"core",starterCode:`function det2(M) {
  const a = M[0][0];
  const b = M[0][1];
  const c = M[1][0];
  const d = M[1][1];

  return a * d - b * c;
}

function isInvertible2(M) {
  // TODO: return true when det2(M) is not zero.
  return false;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('identity is invertible', isInvertible2([[1, 0], [0, 1]]), true);
check('scale is invertible', isInvertible2([[2, 0], [0, 3]]), true);
check('rank-deficient is not invertible', isInvertible2([[1, 2], [2, 4]]), false);
check('zero matrix is not invertible', isInvertible2([[0, 0], [0, 0]]), false);

return results;`,hints:["A zero determinant means area collapses to zero.","Check det2(M) !== 0.","return det2(M) !== 0;"],solution:`function det2(M) {
  const a = M[0][0];
  const b = M[0][1];
  const c = M[1][0];
  const d = M[1][1];

  return a * d - b * c;
}

function isInvertible2(M) {
  return det2(M) !== 0;
}`,explanation:"If the determinant is zero, the transformation collapses area and cannot be reversed."},{id:"inverse-2x2",stepLabel:"20.3",group:"Determinant and invertibility",title:"2x2 inverse",concept:"The inverse of [[a,b],[c,d]] is 1/det times [[d,-b],[-c,a]].",objective:"Complete the inverse matrix entries.",difficulty:"challenge",starterCode:`function inverse2(M) {
  const a = M[0][0];
  const b = M[0][1];
  const c = M[1][0];
  const d = M[1][1];

  const det = a * d - b * c;

  // TODO: return the 2x2 inverse.
  return [
    [0, 0],
    [0, 0],
  ];
}`,testCode:`const results = [];

function approxMatrix(a, b, tolerance = 1e-9) {
  return a.length === b.length && a.every((row, i) =>
    row.length === b[i].length &&
    row.every((value, j) => Math.abs(value - b[i][j]) <= tolerance)
  );
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: approxMatrix(actual, expected),
  });
}

check('inverse identity', inverse2([[1, 0], [0, 1]]), [[1, 0], [0, 1]]);
check('inverse diagonal', inverse2([[2, 0], [0, 4]]), [[0.5, 0], [0, 0.25]]);
check('inverse [[1,2],[3,4]]', inverse2([[1, 2], [3, 4]]), [[-2, 1], [1.5, -0.5]]);

return results;`,hints:["Use the formula 1/det times [[d, -b], [-c, a]].","Each entry should be divided by det.","return [[d / det, -b / det], [-c / det, a / det]];"],solution:`function inverse2(M) {
  const a = M[0][0];
  const b = M[0][1];
  const c = M[1][0];
  const d = M[1][1];

  const det = a * d - b * c;

  return [
    [d / det, -b / det],
    [-c / det, a / det],
  ];
}`,explanation:"The inverse reverses a linear transformation when the determinant is nonzero."},{id:"change-basis-one-coordinate",stepLabel:"21.1",group:"Change of basis",title:"One coordinate in a new basis",concept:"For an orthonormal basis, a coordinate is a dot product with the basis vector.",objective:"Return v dot basisVector.",difficulty:"core",starterCode:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function coordinateInBasis(v, basisVector) {
  // TODO: return the coordinate of v along basisVector.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({
    name,
    actual,
    expected,
    passed: approxEqual(actual, expected),
  });
}

check('x-coordinate', coordinateInBasis([3, 4], [1, 0]), 3);
check('y-coordinate', coordinateInBasis([3, 4], [0, 1]), 4);
check('diagonal coordinate', coordinateInBasis([2, 0], [1 / Math.sqrt(2), 1 / Math.sqrt(2)]), Math.sqrt(2));

return results;`,hints:["In an orthonormal basis, projection coordinates are dot products.","Use the dot helper.","return dot(v, basisVector);"],solution:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function coordinateInBasis(v, basisVector) {
  return dot(v, basisVector);
}`,explanation:"A coordinate says how much of the vector points along a basis direction."},{id:"change-basis-all-coordinates",stepLabel:"21.2",group:"Change of basis",title:"All coordinates in a new basis",concept:"Coordinates in an orthonormal basis come from dotting with every basis vector.",objective:"Push each basis coordinate into the result.",difficulty:"core",starterCode:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function coordinatesInBasis(v, basisVectors) {
  const coords = [];

  for (let i = 0; i < basisVectors.length; i++) {
    // TODO: push the coordinate along this basis vector.
    coords.push(0);
  }

  return coords;
}`,testCode:`const results = [];

function approxArray(a, b, tolerance = 1e-9) {
  return a.length === b.length && a.every((value, index) => Math.abs(value - b[index]) <= tolerance);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: approxArray(actual, expected),
  });
}

check('standard basis', coordinatesInBasis([3, 4], [[1, 0], [0, 1]]), [3, 4]);
check('swapped basis', coordinatesInBasis([3, 4], [[0, 1], [1, 0]]), [4, 3]);
check('diagonal basis', coordinatesInBasis([2, 0], [[1 / Math.sqrt(2), 1 / Math.sqrt(2)], [1 / Math.sqrt(2), -1 / Math.sqrt(2)]]), [Math.sqrt(2), Math.sqrt(2)]);

return results;`,hints:["Loop over every basis vector.","Each coordinate is dot(v, basisVectors[i]).","coords.push(dot(v, basisVectors[i]));"],solution:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function coordinatesInBasis(v, basisVectors) {
  const coords = [];

  for (let i = 0; i < basisVectors.length; i++) {
    coords.push(dot(v, basisVectors[i]));
  }

  return coords;
}`,explanation:"Changing to an orthonormal basis is measuring the vector along each new direction."},{id:"change-basis-reconstruct",stepLabel:"21.3",group:"Change of basis",title:"Reconstruct from coordinates",concept:"A vector can be rebuilt by adding coordinate-scaled basis vectors.",objective:"Add coords[j] times basisVectors[j][i] to each output coordinate.",difficulty:"challenge",starterCode:`function reconstructFromBasis(coords, basisVectors) {
  const dimension = basisVectors[0].length;
  const v = Array(dimension).fill(0);

  for (let j = 0; j < basisVectors.length; j++) {
    for (let i = 0; i < dimension; i++) {
      // TODO: add this coordinate-scaled basis entry.
      v[i] += 0;
    }
  }

  return v;
}`,testCode:`const results = [];

function approxArray(a, b, tolerance = 1e-9) {
  return a.length === b.length && a.every((value, index) => Math.abs(value - b[index]) <= tolerance);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: approxArray(actual, expected),
  });
}

check('standard basis', reconstructFromBasis([3, 4], [[1, 0], [0, 1]]), [3, 4]);
check('swapped basis', reconstructFromBasis([4, 3], [[0, 1], [1, 0]]), [3, 4]);
check('diagonal basis', reconstructFromBasis([Math.sqrt(2), Math.sqrt(2)], [[1 / Math.sqrt(2), 1 / Math.sqrt(2)], [1 / Math.sqrt(2), -1 / Math.sqrt(2)]]), [2, 0]);

return results;`,hints:["Each coordinate scales one basis vector.","Add coords[j] * basisVectors[j][i] into v[i].","v[i] += coords[j] * basisVectors[j][i];"],solution:`function reconstructFromBasis(coords, basisVectors) {
  const dimension = basisVectors[0].length;
  const v = Array(dimension).fill(0);

  for (let j = 0; j < basisVectors.length; j++) {
    for (let i = 0; i < dimension; i++) {
      v[i] += coords[j] * basisVectors[j][i];
    }
  }

  return v;
}`,explanation:"Coordinates are not the vector itself; they are instructions for combining basis directions."},{id:"eigen-rayleigh-numerator",stepLabel:"22.1",group:"Eigenvalues",title:"Rayleigh numerator",concept:"The Rayleigh quotient estimates how much A scales a direction v.",objective:"Return v dot Av.",difficulty:"core",starterCode:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function rayleighNumerator(v, Av) {
  // TODO: return v dotted with Av.
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('v dot Av', rayleighNumerator([1, 0], [3, 0]), 3);
check('v dot Av 2d', rayleighNumerator([1, 2], [5, 6]), 17);
check('negative', rayleighNumerator([-1, 2], [3, 5]), 7);

return results;`,hints:["The dot helper is already available.","Rayleigh numerator is dot(v, Av).","return dot(v, Av);"],solution:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function rayleighNumerator(v, Av) {
  return dot(v, Av);
}`,explanation:"If v is an eigenvector, Av points in the same direction and the Rayleigh quotient returns its eigenvalue."},{id:"eigen-rayleigh-quotient",stepLabel:"22.2",group:"Eigenvalues",title:"Rayleigh quotient",concept:"The Rayleigh quotient is (v dot Av) / (v dot v).",objective:"Complete the quotient formula.",difficulty:"core",starterCode:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function rayleighQuotient(v, Av) {
  const numerator = dot(v, Av);
  const denominator = dot(v, v);

  // TODO: return numerator divided by denominator.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({
    name,
    actual,
    expected,
    passed: approxEqual(actual, expected),
  });
}

check('eigen direction scale 3', rayleighQuotient([1, 0], [3, 0]), 3);
check('eigen direction scale 2', rayleighQuotient([0, 2], [0, 4]), 2);
check('general vector', rayleighQuotient([1, 1], [3, 5]), 4);

return results;`,hints:["The numerator and denominator are already computed.","The quotient is numerator / denominator.","return numerator / denominator;"],solution:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function rayleighQuotient(v, Av) {
  const numerator = dot(v, Av);
  const denominator = dot(v, v);
  return numerator / denominator;
}`,explanation:"The Rayleigh quotient estimates the scaling factor of A along the direction v."},{id:"eigen-power-step",stepLabel:"22.3",group:"Eigenvalues",title:"One power iteration step",concept:"Power iteration repeatedly applies A and normalizes to find a dominant eigenvector.",objective:"Return the normalized version of Av.",difficulty:"challenge",starterCode:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function matvec(A, x) {
  return A.map((row) => dot(row, x));
}

function norm(v) {
  return Math.sqrt(dot(v, v));
}

function powerStep(A, v) {
  const Av = matvec(A, v);
  const length = norm(Av);

  // TODO: return Av normalized to unit length.
  return Av;
}`,testCode:`const results = [];

function approxArray(a, b, tolerance = 1e-9) {
  return a.length === b.length && a.every((value, index) => Math.abs(value - b[index]) <= tolerance);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: approxArray(actual, expected),
  });
}

check('diagonal matrix favors x', powerStep([[3, 0], [0, 1]], [1, 0]), [1, 0]);
check('diagonal matrix favors y', powerStep([[1, 0], [0, 4]], [0, 1]), [0, 1]);
check('scale vector', powerStep([[2, 0], [0, 2]], [3, 4]), [0.6, 0.8]);

return results;`,hints:["Av and length are already computed.","Normalize by dividing each entry of Av by length.","return Av.map((entry) => entry / length);"],solution:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function matvec(A, x) {
  return A.map((row) => dot(row, x));
}

function norm(v) {
  return Math.sqrt(dot(v, v));
}

function powerStep(A, v) {
  const Av = matvec(A, v);
  const length = norm(Av);
  return Av.map((entry) => entry / length);
}`,explanation:"Power iteration applies the matrix, then rescales the result so the vector does not explode in length."},{id:"low-rank-scaled-outer-entry",stepLabel:"23.1",group:"Low-rank approximation",title:"Scaled outer product entry",concept:"A rank-1 matrix can be written as sigma times u v^T.",objective:"Return sigma times u[row] times v[col].",difficulty:"core",starterCode:`function rankOneEntry(sigma, u, v, row, col) {
  // TODO: return sigma * u[row] * v[col].
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({
    name,
    actual,
    expected,
    passed: approxEqual(actual, expected),
  });
}

check('entry 0,0', rankOneEntry(2, [1, 0], [3, 4], 0, 0), 6);
check('entry 0,1', rankOneEntry(2, [1, 0], [3, 4], 0, 1), 8);
check('entry 1,0 zero', rankOneEntry(2, [1, 0], [3, 4], 1, 0), 0);
check('fractional', rankOneEntry(5, [0.6, 0.8], [1, 0], 1, 0), 4);

return results;`,hints:["A rank-1 approximation uses one singular value and two direction vectors.","Use sigma, u[row], and v[col].","return sigma * u[row] * v[col];"],solution:`function rankOneEntry(sigma, u, v, row, col) {
  return sigma * u[row] * v[col];
}`,explanation:"A rank-1 matrix is the outer product u v^T scaled by sigma."},{id:"low-rank-build-rank-one",stepLabel:"23.2",group:"Low-rank approximation",title:"Build a rank-1 matrix",concept:"A rank-1 approximation fills every cell with sigma * u_i * v_j.",objective:"Push the scaled outer-product entry into each row.",difficulty:"core",starterCode:`function rankOneMatrix(sigma, u, v) {
  const A = [];

  for (let row = 0; row < u.length; row++) {
    const values = [];

    for (let col = 0; col < v.length; col++) {
      // TODO: push sigma * u[row] * v[col].
      values.push(0);
    }

    A.push(values);
  }

  return A;
}`,testCode:`const results = [];

function approxMatrix(a, b, tolerance = 1e-9) {
  return a.length === b.length && a.every((row, i) =>
    row.length === b[i].length &&
    row.every((value, j) => Math.abs(value - b[i][j]) <= tolerance)
  );
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: approxMatrix(actual, expected),
  });
}

check('simple rank one', rankOneMatrix(2, [1, 0], [3, 4]), [[6, 8], [0, 0]]);
check('column rank one', rankOneMatrix(3, [1, 2], [1]), [[3], [6]]);
check('identity-like direction', rankOneMatrix(1, [1, 1], [1, -1]), [[1, -1], [1, -1]]);

return results;`,hints:["This is the same formula for every row and column.","Use sigma * u[row] * v[col].","values.push(sigma * u[row] * v[col]);"],solution:`function rankOneMatrix(sigma, u, v) {
  const A = [];

  for (let row = 0; row < u.length; row++) {
    const values = [];

    for (let col = 0; col < v.length; col++) {
      values.push(sigma * u[row] * v[col]);
    }

    A.push(values);
  }

  return A;
}`,explanation:"Low-rank approximation builds a matrix by adding a few simple rank-1 patterns."},{id:"low-rank-frobenius-error",stepLabel:"23.3",group:"Low-rank approximation",title:"Approximation error",concept:"The Frobenius error is the sum of squared entrywise differences between a matrix and its approximation.",objective:"Add the squared difference for each cell.",difficulty:"challenge",starterCode:`function frobeniusErrorSquared(A, Ahat) {
  let total = 0;

  for (let row = 0; row < A.length; row++) {
    for (let col = 0; col < A[0].length; col++) {
      const diff = A[row][col] - Ahat[row][col];

      // TODO: add squared difference.
      total += 0;
    }
  }

  return total;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('zero error', frobeniusErrorSquared([[1, 2], [3, 4]], [[1, 2], [3, 4]]), 0);
check('single difference', frobeniusErrorSquared([[1, 2], [3, 4]], [[1, 2], [3, 5]]), 1);
check('multiple differences', frobeniusErrorSquared([[1, 2], [3, 4]], [[0, 0], [0, 0]]), 30);

return results;`,hints:["Frobenius error squares every entry difference.","The difference is already stored in diff.","total += diff * diff;"],solution:`function frobeniusErrorSquared(A, Ahat) {
  let total = 0;

  for (let row = 0; row < A.length; row++) {
    for (let col = 0; col < A[0].length; col++) {
      const diff = A[row][col] - Ahat[row][col];
      total += diff * diff;
    }
  }

  return total;
}`,explanation:"Low-rank approximation keeps the most important patterns and measures what was lost with reconstruction error."},{id:"absolute-error",stepLabel:"24.1",group:"Numerical stability",title:"Absolute error",concept:"Absolute error measures how far an approximation is from the true value.",objective:"Return the absolute difference between trueValue and approxValue.",difficulty:"warmup",starterCode:`function absoluteError(trueValue, approxValue) {
  // TODO: return the absolute difference.
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('error 10 vs 8', absoluteError(10, 8), 2);
check('error 8 vs 10', absoluteError(8, 10), 2);
check('error 5 vs 5', absoluteError(5, 5), 0);
check('error -3 vs 2', absoluteError(-3, 2), 5);

return results;`,hints:["Use Math.abs.","The difference is trueValue - approxValue.","return Math.abs(trueValue - approxValue);"],solution:`function absoluteError(trueValue, approxValue) {
  return Math.abs(trueValue - approxValue);
}`,explanation:"Absolute error is the raw distance between a true value and an approximation."},{id:"relative-error",stepLabel:"24.2",group:"Numerical stability",title:"Relative error",concept:"Relative error compares error to the size of the true value.",objective:"Return absolute error divided by absolute true value.",difficulty:"core",starterCode:`function relativeError(trueValue, approxValue) {
  const error = Math.abs(trueValue - approxValue);

  // TODO: divide error by the size of trueValue.
  return error;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({
    name,
    actual,
    expected,
    passed: approxEqual(actual, expected),
  });
}

check('10 vs 9', relativeError(10, 9), 0.1);
check('100 vs 99', relativeError(100, 99), 0.01);
check('-50 vs -45', relativeError(-50, -45), 0.1);

return results;`,hints:["Relative error asks: how large is the error compared with the true value?","Use Math.abs(trueValue) in the denominator.","return error / Math.abs(trueValue);"],solution:`function relativeError(trueValue, approxValue) {
  const error = Math.abs(trueValue - approxValue);
  return error / Math.abs(trueValue);
}`,explanation:"A raw error of 1 is huge if the true value is 2, but tiny if the true value is 1,000,000."},{id:"condition-number-from-singular-values",stepLabel:"24.3",group:"Numerical stability",title:"Condition number",concept:"A condition number compares the largest and smallest singular values.",objective:"Return max singular value divided by min singular value.",difficulty:"core",starterCode:`function conditionNumber(singularValues) {
  const largest = Math.max(...singularValues);
  const smallest = Math.min(...singularValues);

  // TODO: return largest divided by smallest.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({
    name,
    actual,
    expected,
    passed: approxEqual(actual, expected),
  });
}

check('well-conditioned', conditionNumber([5, 4, 2]), 2.5);
check('identity-like', conditionNumber([1, 1, 1]), 1);
check('ill-conditioned', conditionNumber([100, 1, 0.01]), 10000);

return results;`,hints:["Condition number is largest scale divided by smallest scale.","The largest and smallest variables are already computed.","return largest / smallest;"],solution:`function conditionNumber(singularValues) {
  const largest = Math.max(...singularValues);
  const smallest = Math.min(...singularValues);
  return largest / smallest;
}`,explanation:"A high condition number means some directions are stretched much more than others, making solutions sensitive to noise."},{id:"detect-ill-conditioning",stepLabel:"24.4",group:"Numerical stability",title:"Detect ill-conditioning",concept:"A large condition number warns that small input noise may become large output error.",objective:"Return true when condition number exceeds the threshold.",difficulty:"core",starterCode:`function isIllConditioned(singularValues, threshold = 1000) {
  const largest = Math.max(...singularValues);
  const smallest = Math.min(...singularValues);
  const condition = largest / smallest;

  // TODO: return whether condition is greater than threshold.
  return false;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('identity-like not ill-conditioned', isIllConditioned([1, 1, 1]), false);
check('moderate not ill-conditioned by default', isIllConditioned([100, 2]), false);
check('large condition is ill-conditioned', isIllConditioned([100, 0.01]), true);
check('custom threshold', isIllConditioned([20, 1], 10), true);

return results;`,hints:["The condition number is already computed.","Compare condition with threshold.","return condition > threshold;"],solution:`function isIllConditioned(singularValues, threshold = 1000) {
  const largest = Math.max(...singularValues);
  const smallest = Math.min(...singularValues);
  const condition = largest / smallest;

  return condition > threshold;
}`,explanation:"Ill-conditioned systems can produce unstable answers even when the formula is mathematically correct."},{id:"pseudoinverse-invert-singular-values",stepLabel:"25.1",group:"Pseudoinverse bridge",title:"Invert singular values",concept:"The pseudoinverse inverts nonzero singular values.",objective:"Return 1 / sigma for a nonzero singular value.",difficulty:"warmup",starterCode:`function invertSingularValue(sigma) {
  // TODO: return the reciprocal of sigma.
  return sigma;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({
    name,
    actual,
    expected,
    passed: approxEqual(actual, expected),
  });
}

check('invert 2', invertSingularValue(2), 0.5);
check('invert 4', invertSingularValue(4), 0.25);
check('invert 0.5', invertSingularValue(0.5), 2);

return results;`,hints:["The reciprocal of sigma is one divided by sigma.","Use 1 / sigma.","return 1 / sigma;"],solution:`function invertSingularValue(sigma) {
  return 1 / sigma;
}`,explanation:"The pseudoinverse reverses directions that the matrix scales, but only where the scale is not zero."},{id:"pseudoinverse-threshold-singular-values",stepLabel:"25.2",group:"Pseudoinverse bridge",title:"Threshold tiny singular values",concept:"Very small singular values can amplify noise, so pseudoinverses often threshold them.",objective:"Return 0 when sigma is too small, otherwise return 1 / sigma.",difficulty:"core",starterCode:`function safeInvertSingularValue(sigma, tolerance = 1e-6) {
  // TODO: return 0 if sigma is below tolerance; otherwise return 1 / sigma.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({
    name,
    actual,
    expected,
    passed: approxEqual(actual, expected),
  });
}

check('invert 2', safeInvertSingularValue(2), 0.5);
check('invert 4', safeInvertSingularValue(4), 0.25);
check('tiny value becomes zero', safeInvertSingularValue(1e-9), 0);
check('custom tolerance', safeInvertSingularValue(0.01, 0.1), 0);

return results;`,hints:["Use an if statement or ternary expression.","If sigma < tolerance, return 0.","return sigma < tolerance ? 0 : 1 / sigma;"],solution:`function safeInvertSingularValue(sigma, tolerance = 1e-6) {
  return sigma < tolerance ? 0 : 1 / sigma;
}`,explanation:"Thresholding prevents tiny singular values from exploding into huge inverse scales."},{id:"pseudoinverse-sigma-plus",stepLabel:"25.3",group:"Pseudoinverse bridge",title:"Build Sigma-plus diagonal",concept:"Sigma-plus contains inverted singular values on the diagonal.",objective:"Push the safe inverted value on the diagonal and 0 elsewhere.",difficulty:"challenge",starterCode:`function safeInvertSingularValue(sigma, tolerance = 1e-6) {
  return sigma < tolerance ? 0 : 1 / sigma;
}

function sigmaPlus(singularValues) {
  const Splus = [];

  for (let row = 0; row < singularValues.length; row++) {
    const values = [];

    for (let col = 0; col < singularValues.length; col++) {
      // TODO: push inverted singular value on diagonal, 0 otherwise.
      values.push(999);
    }

    Splus.push(values);
  }

  return Splus;
}`,testCode:`const results = [];

function approxMatrix(a, b, tolerance = 1e-9) {
  return a.length === b.length && a.every((row, i) =>
    row.length === b[i].length &&
    row.every((value, j) => Math.abs(value - b[i][j]) <= tolerance)
  );
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: approxMatrix(actual, expected),
  });
}

check('two singular values', sigmaPlus([2, 4]), [[0.5, 0], [0, 0.25]]);
check('three singular values', sigmaPlus([1, 2, 5]), [[1,0,0],[0,0.5,0],[0,0,0.2]]);
check('tiny singular value', sigmaPlus([2, 1e-9]), [[0.5, 0], [0, 0]]);

return results;`,hints:["Use row === col to detect the diagonal.","On the diagonal, use safeInvertSingularValue(singularValues[row]).","values.push(row === col ? safeInvertSingularValue(singularValues[row]) : 0);"],solution:`function safeInvertSingularValue(sigma, tolerance = 1e-6) {
  return sigma < tolerance ? 0 : 1 / sigma;
}

function sigmaPlus(singularValues) {
  const Splus = [];

  for (let row = 0; row < singularValues.length; row++) {
    const values = [];

    for (let col = 0; col < singularValues.length; col++) {
      values.push(row === col ? safeInvertSingularValue(singularValues[row]) : 0);
    }

    Splus.push(values);
  }

  return Splus;
}`,explanation:"Sigma-plus is the diagonal scaling matrix used inside the SVD formula for the pseudoinverse."},{id:"pseudoinverse-apply",stepLabel:"25.4",group:"Pseudoinverse bridge",title:"Apply pseudoinverse",concept:"A pseudoinverse solution is x = Aplus b.",objective:"Return Aplus times b.",difficulty:"core",starterCode:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function matvec(A, x) {
  return A.map((row) => dot(row, x));
}

function solveWithPseudoinverse(Aplus, b) {
  // TODO: return Aplus times b.
  return [];
}`,testCode:`const results = [];

function approxArray(a, b, tolerance = 1e-9) {
  return a.length === b.length && a.every((value, index) => Math.abs(value - b[index]) <= tolerance);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: approxArray(actual, expected),
  });
}

check('identity pseudoinverse', solveWithPseudoinverse([[1,0],[0,1]], [7,8]), [7,8]);
check('diagonal pseudoinverse', solveWithPseudoinverse([[0.5,0],[0,0.25]], [6,8]), [3,2]);
check('rectangular-like Aplus', solveWithPseudoinverse([[1,0,0],[0,0.5,0]], [3,8,10]), [3,4]);

return results;`,hints:["Solving with a pseudoinverse is matrix-vector multiplication.","Use the matvec helper.","return matvec(Aplus, b);"],solution:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function matvec(A, x) {
  return A.map((row) => dot(row, x));
}

function solveWithPseudoinverse(Aplus, b) {
  return matvec(Aplus, b);
}`,explanation:"The pseudoinverse gives a least-squares or minimum-norm solution when an ordinary inverse is unavailable."}],R={"matrix-multiplication":["Dot product","Matrix cell","Matrix multiplication","Shape compatibility"]};function P(e){const n=R[e];if(!n)return null;const o=new Set(n);return E.filter(t=>o.has(t.group))}const J=i("math-fundamentals",{kind:"mathematical computation",signalName:"numeric fit or stability score",stages:["represent","compute","check"],stageExplanation:"Math code is clearer when representation, computation, and result checks are separate."}),D=l(J,"matrix-multiplication",()=>P("matrix-multiplication")),V=i("core-ml",{kind:"machine-learning workflow",signalName:"validation metric",stages:["split","train","evaluate"],stageExplanation:"Core ML workflows depend on clean data splits, training logic, and honest evaluation."}),I=i("model-reliability",{kind:"reliability check",signalName:"monitoring or risk score",stages:["observe","alert","triage"],stageExplanation:"Reliability systems observe behavior, alert on meaningful shifts, and triage failures."}),z=i("experimentation-causal-ml",{kind:"experiment analysis",signalName:"effect or balance score",stages:["assign","measure","compare"],stageExplanation:"Experiment code must separate assignment, measurement, and comparison to support causal claims."}),$=i("probability-stats",{kind:"probability/statistics calculation",signalName:"probability or uncertainty score",stages:["count","normalize","summarize"],stageExplanation:"Probability code often counts outcomes, normalizes them, then summarizes uncertainty."}),U=i("reinforcement-learning",{kind:"reinforcement-learning loop",signalName:"return or action-value score",stages:["observe","act","learn"],stageExplanation:"RL loops observe state, choose actions, and update behavior from feedback."}),_=l(U,"ppo-clipped-policy-gradient",()=>[{id:"ppo-policy-ratio",title:"Compute the policy ratio",concept:"PPO compares the new policy probability with the old collection-policy probability for the sampled action.",objective:"Return pi_new divided by pi_old.",difficulty:"core",starterCode:`function policyRatio(newProbability, oldProbability) {
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
}`,explanation:"The minibatch audit links the PPO formula to the lesson table: not every out-of-band ratio clips, because the advantage sign decides which side is conservative."}]),F=i("algorithms",{kind:"algorithmic data structure",signalName:"rank or membership score",stages:["insert","query","verify"],stageExplanation:"Algorithmic structures are useful when updates, queries, and checks are kept explicit."}),X=i("diffusion-models",{kind:"diffusion-model pipeline",signalName:"noise or denoising score",stages:["noise","condition","denoise"],stageExplanation:"Diffusion systems manage noise, conditioning, and denoising as separate implementation stages."}),f=[...S,...M,...T,...N,...B,...L,...D,...V,...I,...z,...$,..._,...F,...X],Q=Object.fromEntries(f.map(e=>[e.lessonId,e]));f.flatMap(e=>e.exercises);function G(e){return Q[e]||null}function Y(e){var n;return((n=G(e))==null?void 0:n.exercises)||[]}export{f as L,Y as g};
