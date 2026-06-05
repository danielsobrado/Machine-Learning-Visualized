import{a as p}from"./assessment-data-BEcQsvEZ.js";const x=77,k=new Set(["and","for","the","as","of","to","in","vs","with","from","into","overview","track","comprehensive"]),v=new Map(p.map((e,t)=>[e.id,t]));function m(e){return[...new Set(e)]}function l(e){return m(String(e).toLowerCase().split(/[^a-z0-9]+/).filter(t=>t.length>1&&!k.has(t)))}function y(e){return String(e).split(/[^a-zA-Z0-9]+/).filter(Boolean).map(a=>`${a[0].toUpperCase()}${a.slice(1)}`).join("")||"Lesson"}function u(e,t){const n=e.toLowerCase();return t.filter(a=>n.includes(a)).length}function w(e){const t=m([...l(e.id),...l(e.name)]);return t.length>0?t.slice(0,3):["lesson"]}function d(e){return`/animation/${e.id}`}function S({lesson:e,stepLabel:t,suffix:n,keyword:a,domain:o}){const r=`has${n}Keyword`;return{id:`${e.id}-keyword-check`,group:e.name,stepLabel:t,title:"Recognize the lesson keyword",concept:`${e.name} can be indexed by a stable keyword before deeper ${o.kind} logic runs.`,objective:"Return true when text contains the lesson keyword, case-insensitively.",difficulty:"warmup",starterCode:`function ${r}(text) {
  const keyword = ${JSON.stringify(a)};

  // TODO: return whether text contains keyword, ignoring case.
  return false;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('lesson reference matches', ${r}(${JSON.stringify(`${e.name} ${d(e)}`)}), true);
check('lesson route matches', ${r}(${JSON.stringify(d(e))}), true);
check('unrelated text misses', ${r}('zzzz yyyy xxxx'), false);

return results;`,hints:["Convert the incoming text to lowercase before checking.","Use text.toLowerCase().includes(keyword).","return text.toLowerCase().includes(keyword);"],solution:`function ${r}(text) {
  const keyword = ${JSON.stringify(a)};
  return text.toLowerCase().includes(keyword);
}`,explanation:`Stable keywords help route learners and examples to the right ${e.name} code path.`}}function C({lesson:e,stepLabel:t,suffix:n,terms:a,domain:o}){const r=`count${n}FocusTerms`,i=u(e.name,a),c=`${e.name} ${e.description}`,b=u(c,a);return{id:`${e.id}-focus-term-count`,group:e.name,stepLabel:t,title:"Count focus terms",concept:`${o.kind} systems often reduce text into small signals before ranking or checking.`,objective:"Count how many lesson focus terms appear in the text.",difficulty:"core",starterCode:`function ${r}(text) {
  const terms = ${JSON.stringify(a)};
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

check('title terms', ${r}(${JSON.stringify(e.name)}), ${i});
check('description terms', ${r}(${JSON.stringify(c)}), ${b});
check('no matching terms', ${r}('zzzz yyyy xxxx'), 0);

return results;`,hints:["lower and terms are already prepared.","Use lower.includes(terms[i]) inside the loop.","if (lower.includes(terms[i])) count += 1;"],solution:`function ${r}(text) {
  const terms = ${JSON.stringify(a)};
  const lower = text.toLowerCase();
  let count = 0;

  for (let i = 0; i < terms.length; i++) {
    if (lower.includes(terms[i])) count += 1;
  }

  return count;
}`,explanation:`This mirrors the small feature checks behind search, routing, and lesson-specific ${o.signalName} logic.`}}function T({lesson:e,stepLabel:t,suffix:n,domain:a}){const o=`best${n}Candidate`;return{id:`${e.id}-best-candidate`,group:e.name,stepLabel:t,title:"Select the best candidate",concept:`${a.kind} workflows often rank candidates by a score before choosing the next action.`,objective:"Return the id of the candidate with the highest score.",difficulty:"core",starterCode:`function ${o}(candidates) {
  let best = candidates[0];

  for (let i = 1; i < candidates.length; i++) {
    // TODO: update best when candidates[i] has a higher score.
  }

  return best.id;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('lesson candidate wins', ${o}([
  { id: 'baseline', score: 0.2 },
  { id: ${JSON.stringify(e.id)}, score: 0.9 },
  { id: 'distractor', score: 0.4 },
]), ${JSON.stringify(e.id)});

check('last candidate wins', ${o}([
  { id: 'first', score: 0.1 },
  { id: 'second', score: 0.3 },
  { id: 'third', score: 0.8 },
]), 'third');

return results;`,hints:["Compare candidates[i].score with best.score.","If the current score is larger, replace best.","if (candidates[i].score > best.score) best = candidates[i];"],solution:`function ${o}(candidates) {
  let best = candidates[0];

  for (let i = 1; i < candidates.length; i++) {
    if (candidates[i].score > best.score) best = candidates[i];
  }

  return best.id;
}`,explanation:`Ranking by ${a.signalName} is a reusable pattern across ${e.categoryName} lessons.`}}function O({lesson:e,stepLabel:t,suffix:n,domain:a}){const o=`has${n}PipelineStages`,r=a.stages,i=r.slice(0,-1),c=[...r].reverse();return{id:`${e.id}-pipeline-stage-check`,group:e.name,stepLabel:t,title:"Check required stages",concept:`${e.name} is easier to debug when the expected ${a.kind} stages are explicit.`,objective:"Return false when any required stage is missing.",difficulty:"challenge",starterCode:`function ${o}(stages) {
  const requiredStages = ${JSON.stringify(r)};

  for (let i = 0; i < requiredStages.length; i++) {
    // TODO: return false if stages does not include requiredStages[i].
  }

  return true;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('all stages present', ${o}(${JSON.stringify(r)}), true);
check('order does not matter', ${o}(${JSON.stringify(c)}), true);
check('missing one stage', ${o}(${JSON.stringify(i)}), false);

return results;`,hints:["Use stages.includes(requiredStages[i]).","Return false as soon as one required stage is absent.","if (!stages.includes(requiredStages[i])) return false;"],solution:`function ${o}(stages) {
  const requiredStages = ${JSON.stringify(r)};

  for (let i = 0; i < requiredStages.length; i++) {
    if (!stages.includes(requiredStages[i])) return false;
  }

  return true;
}`,explanation:`${a.stageExplanation} This check makes that dependency visible in code.`}}function A(e,t){const n=v.get(e.id),a=x+n,o=w(e),r=y(e.id);return{lessonId:e.id,lessonName:e.name,categoryId:e.categoryId,categoryName:e.categoryName,groupNumber:a,exercises:[S({lesson:e,stepLabel:`${a}.1`,suffix:r,keyword:o[0],domain:t}),C({lesson:e,stepLabel:`${a}.2`,suffix:r,terms:o,domain:t}),T({lesson:e,stepLabel:`${a}.3`,suffix:r,domain:t}),O({lesson:e,stepLabel:`${a}.4`,suffix:r,domain:t})]}}function M(e,t){return p.filter(n=>n.categoryId===e).map(n=>A(n,t))}function h(e,t,n){return e.map(a=>a.lessonId!==t?a:{...a,exercises:n(a).map((o,r)=>{var i;return{...o,group:a.lessonName,stepLabel:((i=a.exercises[r])==null?void 0:i.stepLabel)||`${a.groupNumber}.${r+1}`}})})}const j=[{id:"dot-product-first-pair",stepLabel:"1.1",group:"Dot product",title:"First matching pair",concept:"A dot product starts by multiplying entries with the same index. The first contribution comes from multiplying the two index-0 entries.",objective:"Replace one expression with the current aligned pair product inside the full matmul function.",difficulty:"warmup",starterCode:`/**
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
}`,explanation:"The pseudoinverse gives a least-squares or minimum-norm solution when an ordinary inverse is unavailable."}],q=[{id:"gd-prediction-error",stepLabel:"26.1",group:"Gradient descent least squares",title:"Prediction error",concept:"Gradient descent updates parameters using prediction error.",objective:"Return prediction minus target.",difficulty:"warmup",starterCode:`function predictionError(prediction, target) {
  // TODO: return prediction minus target.
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('overprediction', predictionError(10, 7), 3);
check('underprediction', predictionError(4, 9), -5);
check('perfect prediction', predictionError(5, 5), 0);

return results;`,hints:["Error is signed: prediction - target.","Positive means prediction was too high.","return prediction - target;"],solution:`function predictionError(prediction, target) {
  return prediction - target;
}`,explanation:"Signed error tells gradient descent which direction the prediction is wrong."},{id:"gd-one-weight-gradient",stepLabel:"26.2",group:"Gradient descent least squares",title:"One weight gradient",concept:"For squared error, the gradient contribution is error times feature value.",objective:"Return error * feature.",difficulty:"core",starterCode:`function oneWeightGradient(error, feature) {
  // TODO: return this feature's gradient contribution.
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('positive error, positive feature', oneWeightGradient(3, 2), 6);
check('negative error, positive feature', oneWeightGradient(-5, 2), -10);
check('positive error, zero feature', oneWeightGradient(3, 0), 0);
check('negative feature', oneWeightGradient(4, -2), -8);

return results;`,hints:["The gradient scales with how much this feature contributed.","Multiply error by feature.","return error * feature;"],solution:`function oneWeightGradient(error, feature) {
  return error * feature;
}`,explanation:"If a feature is large, the weight connected to it gets a larger update signal."},{id:"gd-gradient-vector",stepLabel:"26.3",group:"Gradient descent least squares",title:"Gradient vector",concept:"Each weight receives error times its matching feature.",objective:"Push error * x[i] for every feature.",difficulty:"core",starterCode:`function gradientForExample(error, x) {
  const gradient = [];

  for (let i = 0; i < x.length; i++) {
    // TODO: push the gradient for weight i.
    gradient.push(0);
  }

  return gradient;
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

check('error 3', gradientForExample(3, [1, 2, 3]), [3, 6, 9]);
check('error -2', gradientForExample(-2, [1, 0, 4]), [-2, 0, -8]);
check('zero error', gradientForExample(0, [5, 6]), [0, 0]);

return results;`,hints:["The same error multiplies every feature.","For weight i, use error * x[i].","gradient.push(error * x[i]);"],solution:`function gradientForExample(error, x) {
  const gradient = [];

  for (let i = 0; i < x.length; i++) {
    gradient.push(error * x[i]);
  }

  return gradient;
}`,explanation:"The gradient vector tells every weight how to move to reduce squared error."},{id:"gd-weight-update",stepLabel:"26.4",group:"Gradient descent least squares",title:"One gradient descent update",concept:"Gradient descent subtracts learningRate times gradient.",objective:"Update one weight coordinate.",difficulty:"core",starterCode:`function updateWeights(weights, gradient, learningRate) {
  const updated = [];

  for (let i = 0; i < weights.length; i++) {
    // TODO: subtract learningRate times gradient[i].
    updated.push(weights[i]);
  }

  return updated;
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

check('simple update', updateWeights([1, 2], [3, 4], 0.1), [0.7, 1.6]);
check('negative gradient', updateWeights([1, 2], [-1, 2], 0.5), [1.5, 1]);
check('zero gradient', updateWeights([5, 6], [0, 0], 0.1), [5, 6]);

return results;`,hints:["Gradient descent moves opposite the gradient.","New weight = old weight - learningRate * gradient.","updated.push(weights[i] - learningRate * gradient[i]);"],solution:`function updateWeights(weights, gradient, learningRate) {
  const updated = [];

  for (let i = 0; i < weights.length; i++) {
    updated.push(weights[i] - learningRate * gradient[i]);
  }

  return updated;
}`,explanation:"The learning rate controls the size of the step downhill."},{id:"logistic-logit-dot",stepLabel:"27.1",group:"Logistic regression bridge",title:"Logit is a dot product",concept:"Logistic regression first computes a linear score: w dot x + b.",objective:"Return dot(weights, x) plus bias.",difficulty:"core",starterCode:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function logit(weights, x, bias) {
  // TODO: return w dot x + bias.
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('simple logit', logit([1, 2], [3, 4], 0), 11);
check('with bias', logit([1, 2], [3, 4], -1), 10);
check('negative weight', logit([-1, 2], [3, 5], 1), 8);

return results;`,hints:["Use the dot helper.","The linear score is dot(weights, x) + bias.","return dot(weights, x) + bias;"],solution:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function logit(weights, x, bias) {
  return dot(weights, x) + bias;
}`,explanation:"Logistic regression is linear algebra plus a sigmoid. The dot product creates the score."},{id:"logistic-sigmoid",stepLabel:"27.2",group:"Logistic regression bridge",title:"Sigmoid",concept:"Sigmoid turns any real-valued logit into a value between 0 and 1.",objective:"Complete the sigmoid formula.",difficulty:"core",starterCode:`function sigmoid(z) {
  // TODO: return 1 / (1 + exp(-z)).
  return z;
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

check('sigmoid(0)', sigmoid(0), 0.5);
check('sigmoid(log 3)', sigmoid(Math.log(3)), 0.75);
check('sigmoid(-log 3)', sigmoid(-Math.log(3)), 0.25);

return results;`,hints:["Use Math.exp.","The formula is 1 / (1 + Math.exp(-z)).","return 1 / (1 + Math.exp(-z));"],solution:`function sigmoid(z) {
  return 1 / (1 + Math.exp(-z));
}`,explanation:"Sigmoid converts a linear score into a probability-like value."},{id:"logistic-predict-probability",stepLabel:"27.3",group:"Logistic regression bridge",title:"Predict probability",concept:"A logistic model predicts sigmoid(w dot x + b).",objective:"Apply sigmoid to the logit.",difficulty:"core",starterCode:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function sigmoid(z) {
  return 1 / (1 + Math.exp(-z));
}

function predictProbability(weights, x, bias) {
  const z = dot(weights, x) + bias;

  // TODO: return sigmoid of z.
  return z;
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

check('probability 0.5', predictProbability([0, 0], [3, 4], 0), 0.5);
check('probability 0.75', predictProbability([1], [Math.log(3)], 0), 0.75);
check('probability with bias', predictProbability([1], [0], Math.log(3)), 0.75);

return results;`,hints:["z is already the linear score.","Apply sigmoid(z).","return sigmoid(z);"],solution:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function sigmoid(z) {
  return 1 / (1 + Math.exp(-z));
}

function predictProbability(weights, x, bias) {
  const z = dot(weights, x) + bias;
  return sigmoid(z);
}`,explanation:"Logistic regression turns feature-weight alignment into a probability."},{id:"logistic-binary-cross-entropy",stepLabel:"27.4",group:"Logistic regression bridge",title:"Binary cross-entropy",concept:"Binary cross-entropy penalizes confident wrong probabilities heavily.",objective:"Complete the loss formula for one label and probability.",difficulty:"challenge",starterCode:`function binaryCrossEntropy(y, p) {
  // TODO: return -(y log p + (1-y) log(1-p)).
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

check('positive label p=0.5', binaryCrossEntropy(1, 0.5), -Math.log(0.5));
check('negative label p=0.5', binaryCrossEntropy(0, 0.5), -Math.log(0.5));
check('positive label p=0.8', binaryCrossEntropy(1, 0.8), -Math.log(0.8));
check('negative label p=0.2', binaryCrossEntropy(0, 0.2), -Math.log(0.8));

return results;`,hints:["Use Math.log.","The formula is negative of y log p plus (1-y) log(1-p).","return -(y * Math.log(p) + (1 - y) * Math.log(1 - p));"],solution:`function binaryCrossEntropy(y, p) {
  return -(y * Math.log(p) + (1 - y) * Math.log(1 - p));
}`,explanation:"Cross-entropy rewards high probability on the true class and punishes confident wrong predictions."},{id:"attention-one-score",stepLabel:"28.1",group:"Attention algebra bridge",title:"One attention score",concept:"One attention score is a query vector dotted with a key vector.",objective:"Return query dot key.",difficulty:"core",starterCode:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function attentionScore(query, key) {
  // TODO: return query dot key.
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('score 1', attentionScore([1, 2], [3, 4]), 11);
check('orthogonal score', attentionScore([1, 0], [0, 1]), 0);
check('negative score', attentionScore([-1, 2], [3, 5]), 7);

return results;`,hints:["Attention starts with similarity scores.","Similarity here is dot product.","return dot(query, key);"],solution:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function attentionScore(query, key) {
  return dot(query, key);
}`,explanation:"In transformer attention, QK^T is a matrix of query-key dot products."},{id:"attention-scale-score",stepLabel:"28.2",group:"Attention algebra bridge",title:"Scale attention score",concept:"Attention scores are divided by sqrt(d) to keep logits from growing too large.",objective:"Divide the raw score by Math.sqrt(d).",difficulty:"core",starterCode:`function scaleAttentionScore(rawScore, d) {
  // TODO: return rawScore divided by sqrt(d).
  return rawScore;
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

check('scale by sqrt 4', scaleAttentionScore(8, 4), 4);
check('scale by sqrt 9', scaleAttentionScore(12, 9), 4);
check('scale by sqrt 1', scaleAttentionScore(7, 1), 7);

return results;`,hints:["Use Math.sqrt(d).","Scaled dot-product attention divides by the square root of dimension.","return rawScore / Math.sqrt(d);"],solution:`function scaleAttentionScore(rawScore, d) {
  return rawScore / Math.sqrt(d);
}`,explanation:"Scaling keeps attention logits numerically stable before softmax."},{id:"attention-softmax-denominator",stepLabel:"28.3",group:"Attention algebra bridge",title:"Softmax denominator",concept:"Softmax normalizes exponentiated scores so weights sum to 1.",objective:"Accumulate Math.exp(score) for every score.",difficulty:"core",starterCode:`function softmaxDenominator(scores) {
  let total = 0;

  for (let i = 0; i < scores.length; i++) {
    // TODO: add exp of this score.
    total += 0;
  }

  return total;
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

check('zeros', softmaxDenominator([0, 0]), 2);
check('one zero', softmaxDenominator([0]), 1);
check('mixed', softmaxDenominator([0, Math.log(3)]), 4);

return results;`,hints:["Softmax uses exponentials.","Use Math.exp(scores[i]).","total += Math.exp(scores[i]);"],solution:`function softmaxDenominator(scores) {
  let total = 0;

  for (let i = 0; i < scores.length; i++) {
    total += Math.exp(scores[i]);
  }

  return total;
}`,explanation:"Softmax turns raw attention scores into normalized attention weights."},{id:"attention-softmax-weights",stepLabel:"28.4",group:"Attention algebra bridge",title:"Softmax weights",concept:"Each softmax weight is exp(score) divided by the sum of all exp(scores).",objective:"Push one normalized softmax weight per score.",difficulty:"challenge",starterCode:`function softmax(scores) {
  let denominator = 0;

  for (let i = 0; i < scores.length; i++) {
    denominator += Math.exp(scores[i]);
  }

  const weights = [];

  for (let i = 0; i < scores.length; i++) {
    // TODO: push the normalized softmax weight.
    weights.push(0);
  }

  return weights;
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

check('two equal scores', softmax([0, 0]), [0.5, 0.5]);
check('one option', softmax([0]), [1]);
check('log ratio', softmax([0, Math.log(3)]), [0.25, 0.75]);

return results;`,hints:["The denominator is already computed.","Weight i is exp(scores[i]) / denominator.","weights.push(Math.exp(scores[i]) / denominator);"],solution:`function softmax(scores) {
  let denominator = 0;

  for (let i = 0; i < scores.length; i++) {
    denominator += Math.exp(scores[i]);
  }

  const weights = [];

  for (let i = 0; i < scores.length; i++) {
    weights.push(Math.exp(scores[i]) / denominator);
  }

  return weights;
}`,explanation:"Attention weights are a probability distribution over which values to read."},{id:"attention-weighted-value-sum",stepLabel:"28.5",group:"Attention algebra bridge",title:"Weighted value sum",concept:"The attention output is a weighted sum of value vectors.",objective:"Add weight times value coordinate into the output.",difficulty:"challenge",starterCode:`function weightedValueSum(weights, values) {
  const dimension = values[0].length;
  const output = Array(dimension).fill(0);

  for (let token = 0; token < values.length; token++) {
    for (let dim = 0; dim < dimension; dim++) {
      // TODO: add this token's weighted value coordinate.
      output[dim] += 0;
    }
  }

  return output;
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

check('choose first value', weightedValueSum([1, 0], [[3, 4], [10, 20]]), [3, 4]);
check('average two values', weightedValueSum([0.5, 0.5], [[2, 4], [6, 8]]), [4, 6]);
check('weighted mix', weightedValueSum([0.25, 0.75], [[0, 4], [8, 0]]), [6, 1]);

return results;`,hints:["Each token contributes weight[token] times its value vector.","For each coordinate, add weights[token] * values[token][dim].","output[dim] += weights[token] * values[token][dim];"],solution:`function weightedValueSum(weights, values) {
  const dimension = values[0].length;
  const output = Array(dimension).fill(0);

  for (let token = 0; token < values.length; token++) {
    for (let dim = 0; dim < dimension; dim++) {
      output[dim] += weights[token] * values[token][dim];
    }
  }

  return output;
}`,explanation:"Attention does not return the most-attended token; it returns a mixture of value vectors."},{id:"derivative-line-slope",stepLabel:"29.1",group:"Derivative basics",title:"Slope of a line",concept:"The derivative of f(x) = mx + b is the constant slope m.",objective:"Return the slope m.",difficulty:"warmup",starterCode:`function derivativeOfLine(m, b, x) {
  // f(x) = m*x + b
  // TODO: return the derivative with respect to x.
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('slope 2', derivativeOfLine(2, 5, 10), 2);
check('slope -3', derivativeOfLine(-3, 1, 7), -3);
check('slope 0', derivativeOfLine(0, 100, 4), 0);

return results;`,hints:["The derivative of m*x + b is m.","b disappears because constants do not change with x.","return m;"],solution:`function derivativeOfLine(m, b, x) {
  return m;
}`,explanation:"A derivative measures local change. For a straight line, the local change is the same everywhere."},{id:"derivative-square",stepLabel:"29.2",group:"Derivative basics",title:"Derivative of x^2",concept:"The derivative of x^2 is 2x.",objective:"Return 2 * x.",difficulty:"warmup",starterCode:`function derivativeSquare(x) {
  // f(x) = x*x
  // TODO: return f'(x).
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('x=0', derivativeSquare(0), 0);
check('x=3', derivativeSquare(3), 6);
check('x=-4', derivativeSquare(-4), -8);
check('x=10', derivativeSquare(10), 20);

return results;`,hints:["Power rule: d/dx x^2 = 2x.","The slope grows as x gets farther from 0.","return 2 * x;"],solution:`function derivativeSquare(x) {
  return 2 * x;
}`,explanation:"For squared loss, gradients grow with the size of the error."},{id:"derivative-squared-error",stepLabel:"29.3",group:"Derivative basics",title:"Squared-error derivative",concept:"For loss L = (prediction - target)^2, the derivative with respect to prediction is 2(prediction - target).",objective:"Return the gradient of squared error with respect to prediction.",difficulty:"core",starterCode:`function squaredErrorGradient(prediction, target) {
  const error = prediction - target;

  // TODO: return d/dprediction of error^2.
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('prediction too high', squaredErrorGradient(10, 7), 6);
check('prediction too low', squaredErrorGradient(4, 9), -10);
check('perfect prediction', squaredErrorGradient(5, 5), 0);

return results;`,hints:["Squared error is error^2.","Derivative of error^2 with respect to prediction is 2 * error.","return 2 * error;"],solution:`function squaredErrorGradient(prediction, target) {
  const error = prediction - target;
  return 2 * error;
}`,explanation:"The gradient is positive when prediction is too high, negative when too low, and zero when perfect."},{id:"numerical-derivative",stepLabel:"29.4",group:"Derivative basics",title:"Numerical derivative",concept:"A derivative can be approximated by measuring a tiny change in function output.",objective:"Complete the finite-difference formula.",difficulty:"core",starterCode:`function numericalDerivative(f, x, h = 1e-5) {
  // TODO: return (f(x + h) - f(x)) / h.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-3) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('derivative of x^2 at 3', numericalDerivative((x) => x * x, 3), 6);
check('derivative of 2x+1 at 5', numericalDerivative((x) => 2 * x + 1, 5), 2);
check('derivative of x^3 at 2', numericalDerivative((x) => x * x * x, 2), 12);

return results;`,hints:["Look at how much f changes after a tiny step h.","Divide output change by input change.","return (f(x + h) - f(x)) / h;"],solution:`function numericalDerivative(f, x, h = 1e-5) {
  return (f(x + h) - f(x)) / h;
}`,explanation:"Numerical derivatives are useful for checking gradients, though exact backprop is usually more efficient."},{id:"chain-rule-two-links",stepLabel:"30.1",group:"Chain rule",title:"Two-link chain rule",concept:"The chain rule multiplies local derivatives along a path.",objective:"Return outerGradient * innerGradient.",difficulty:"warmup",starterCode:`function chainTwo(outerGradient, innerGradient) {
  // TODO: return the product of the two local gradients.
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('2 then 3', chainTwo(2, 3), 6);
check('-1 then 5', chainTwo(-1, 5), -5);
check('zero stops gradient', chainTwo(10, 0), 0);

return results;`,hints:["Chain rule multiplies derivatives.","If one local derivative is zero, the path gradient is zero.","return outerGradient * innerGradient;"],solution:`function chainTwo(outerGradient, innerGradient) {
  return outerGradient * innerGradient;
}`,explanation:"Backprop is repeated chain rule: gradients flow backward by multiplying local derivatives."},{id:"chain-through-square",stepLabel:"30.2",group:"Chain rule",title:"Chain through square",concept:"If y = z^2 and z depends on x, then dy/dx = 2z * dz/dx.",objective:"Return 2 * z * dzdx.",difficulty:"core",starterCode:`function chainThroughSquare(z, dzdx) {
  // y = z^2
  // TODO: return dy/dx.
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('z=3 dzdx=2', chainThroughSquare(3, 2), 12);
check('z=-4 dzdx=1', chainThroughSquare(-4, 1), -8);
check('z=5 dzdx=0', chainThroughSquare(5, 0), 0);

return results;`,hints:["Derivative of z^2 with respect to z is 2z.","Then multiply by dz/dx.","return 2 * z * dzdx;"],solution:`function chainThroughSquare(z, dzdx) {
  return 2 * z * dzdx;
}`,explanation:"The outer function contributes 2z; the inner function contributes dz/dx."},{id:"chain-through-sigmoid",stepLabel:"30.3",group:"Chain rule",title:"Chain through sigmoid",concept:"The derivative of sigmoid output s with respect to its input is s(1-s).",objective:"Return upstreamGradient * s * (1 - s).",difficulty:"core",starterCode:`function chainThroughSigmoid(sigmoidOutput, upstreamGradient) {
  // TODO: return the downstream gradient.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('s=0.5 upstream=1', chainThroughSigmoid(0.5, 1), 0.25);
check('s=0.8 upstream=2', chainThroughSigmoid(0.8, 2), 0.32);
check('s=0.1 upstream=3', chainThroughSigmoid(0.1, 3), 0.27);

return results;`,hints:["Sigmoid derivative uses the output: s * (1 - s).","Multiply by upstreamGradient.","return upstreamGradient * sigmoidOutput * (1 - sigmoidOutput);"],solution:`function chainThroughSigmoid(sigmoidOutput, upstreamGradient) {
  return upstreamGradient * sigmoidOutput * (1 - sigmoidOutput);
}`,explanation:"Sigmoid gradients shrink near 0 and 1, which is one reason saturated sigmoids can learn slowly."},{id:"chain-rule-add-paths",stepLabel:"30.4",group:"Chain rule",title:"Add gradients from multiple paths",concept:"When one variable affects loss through multiple paths, gradients add.",objective:"Return pathA + pathB.",difficulty:"core",starterCode:`function addGradientPaths(pathA, pathB) {
  // TODO: return the total gradient from both paths.
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('two positive paths', addGradientPaths(2, 3), 5);
check('opposing paths', addGradientPaths(10, -4), 6);
check('one path zero', addGradientPaths(7, 0), 7);

return results;`,hints:["Gradients from different downstream branches add together.","This happens in computation graphs with reused values.","return pathA + pathB;"],solution:`function addGradientPaths(pathA, pathB) {
  return pathA + pathB;
}`,explanation:"Backprop sums contributions when a value is used by more than one downstream operation."},{id:"neuron-weighted-input",stepLabel:"31.1",group:"One neuron",title:"Weighted input",concept:"A neuron first computes a dot product between weights and inputs.",objective:"Return dot(weights, x).",difficulty:"core",starterCode:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function weightedInput(weights, x) {
  // TODO: return the weighted sum.
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('simple weighted input', weightedInput([1, 2], [3, 4]), 11);
check('zero weight', weightedInput([0, 5], [10, 2]), 10);
check('negative weight', weightedInput([-1, 2], [3, 5]), 7);

return results;`,hints:["A neuron uses the same dot product you learned earlier.","Use the dot helper.","return dot(weights, x);"],solution:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function weightedInput(weights, x) {
  return dot(weights, x);
}`,explanation:"Every dense neuron starts as a dot product."},{id:"neuron-add-bias",stepLabel:"31.2",group:"One neuron",title:"Add bias",concept:"A bias shifts the neuron before activation.",objective:"Return weighted sum plus bias.",difficulty:"warmup",starterCode:`function preActivation(weightedSum, bias) {
  // TODO: return weightedSum plus bias.
  return weightedSum;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('positive bias', preActivation(10, 2), 12);
check('negative bias', preActivation(10, -3), 7);
check('zero bias', preActivation(5, 0), 5);

return results;`,hints:["Bias is added after the weighted sum.","Return weightedSum + bias.","return weightedSum + bias;"],solution:`function preActivation(weightedSum, bias) {
  return weightedSum + bias;
}`,explanation:"Bias lets the neuron shift its decision boundary or activation threshold."},{id:"neuron-relu-forward",stepLabel:"31.3",group:"One neuron",title:"ReLU activation",concept:"ReLU keeps positive values and turns negative values into zero.",objective:"Return max(0, z).",difficulty:"warmup",starterCode:`function relu(z) {
  // TODO: return max(0, z).
  return z;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('positive', relu(3), 3);
check('negative', relu(-4), 0);
check('zero', relu(0), 0);

return results;`,hints:["Use Math.max.","ReLU is max(0, z).","return Math.max(0, z);"],solution:`function relu(z) {
  return Math.max(0, z);
}`,explanation:"ReLU adds nonlinearity by gating off negative pre-activations."},{id:"neuron-forward-full",stepLabel:"31.4",group:"One neuron",title:"Full neuron forward pass",concept:"A simple neuron computes ReLU(w dot x + b).",objective:"Return relu(dot(weights, x) + bias).",difficulty:"core",starterCode:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function relu(z) {
  return Math.max(0, z);
}

function neuronForward(weights, x, bias) {
  // TODO: return ReLU of weighted input plus bias.
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('positive neuron', neuronForward([1, 2], [3, 4], -5), 6);
check('negative clipped', neuronForward([1, 1], [1, 1], -5), 0);
check('zero boundary', neuronForward([1, 1], [1, 1], -2), 0);

return results;`,hints:["First compute dot(weights, x) + bias.","Then pass it through relu.","return relu(dot(weights, x) + bias);"],solution:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function relu(z) {
  return Math.max(0, z);
}

function neuronForward(weights, x, bias) {
  return relu(dot(weights, x) + bias);
}`,explanation:"Dense neural networks are built from many versions of this pattern."},{id:"backprop-bias-gradient",stepLabel:"32.1",group:"One-neuron backprop",title:"Bias gradient",concept:"For z = w dot x + b, the derivative of z with respect to b is 1.",objective:"Return upstreamGradient.",difficulty:"warmup",starterCode:`function biasGradient(upstreamGradient) {
  // TODO: return dL/db.
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('upstream 3', biasGradient(3), 3);
check('upstream -2', biasGradient(-2), -2);
check('upstream 0', biasGradient(0), 0);

return results;`,hints:["Bias is added directly.","dz/db = 1, so dL/db = upstreamGradient * 1.","return upstreamGradient;"],solution:`function biasGradient(upstreamGradient) {
  return upstreamGradient;
}`,explanation:"Bias receives the same upstream gradient because it shifts z by one unit per one unit of bias."},{id:"backprop-one-weight",stepLabel:"32.2",group:"One-neuron backprop",title:"One weight gradient",concept:"For z = w dot x + b, dL/dw_i = upstreamGradient * x_i.",objective:"Return upstreamGradient * inputValue.",difficulty:"core",starterCode:`function weightGradient(upstreamGradient, inputValue) {
  // TODO: return dL/dw for one weight.
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('input 2 upstream 3', weightGradient(3, 2), 6);
check('input 0 upstream 3', weightGradient(3, 0), 0);
check('negative upstream', weightGradient(-2, 5), -10);

return results;`,hints:["A weight is multiplied by its input.","The input scales the gradient for that weight.","return upstreamGradient * inputValue;"],solution:`function weightGradient(upstreamGradient, inputValue) {
  return upstreamGradient * inputValue;
}`,explanation:"Weights connected to larger inputs receive larger gradient signals."},{id:"backprop-weight-vector",stepLabel:"32.3",group:"One-neuron backprop",title:"Weight-gradient vector",concept:"Each weight gradient is upstreamGradient times the matching input.",objective:"Push upstreamGradient * x[i] for each weight.",difficulty:"core",starterCode:`function weightGradients(upstreamGradient, x) {
  const gradients = [];

  for (let i = 0; i < x.length; i++) {
    // TODO: push the gradient for weight i.
    gradients.push(0);
  }

  return gradients;
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

check('upstream 3', weightGradients(3, [1, 2, 3]), [3, 6, 9]);
check('upstream -2', weightGradients(-2, [1, 0, 4]), [-2, 0, -8]);
check('upstream 0', weightGradients(0, [5, 6]), [0, 0]);

return results;`,hints:["Loop over the input vector.","Each gradient is upstreamGradient times x[i].","gradients.push(upstreamGradient * x[i]);"],solution:`function weightGradients(upstreamGradient, x) {
  const gradients = [];

  for (let i = 0; i < x.length; i++) {
    gradients.push(upstreamGradient * x[i]);
  }

  return gradients;
}`,explanation:"Backprop through a dense neuron produces one gradient per weight."},{id:"backprop-input-gradient",stepLabel:"32.4",group:"One-neuron backprop",title:"Input gradients",concept:"The gradient into each input is upstreamGradient times the matching weight.",objective:"Push upstreamGradient * weights[i].",difficulty:"core",starterCode:`function inputGradients(upstreamGradient, weights) {
  const gradients = [];

  for (let i = 0; i < weights.length; i++) {
    // TODO: push the gradient for input i.
    gradients.push(0);
  }

  return gradients;
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

check('upstream 3', inputGradients(3, [1, 2, 3]), [3, 6, 9]);
check('upstream -2', inputGradients(-2, [1, 0, 4]), [-2, 0, -8]);
check('upstream 0', inputGradients(0, [5, 6]), [0, 0]);

return results;`,hints:["Inputs receive gradients through weights.","Each input gradient is upstreamGradient times weights[i].","gradients.push(upstreamGradient * weights[i]);"],solution:`function inputGradients(upstreamGradient, weights) {
  const gradients = [];

  for (let i = 0; i < weights.length; i++) {
    gradients.push(upstreamGradient * weights[i]);
  }

  return gradients;
}`,explanation:"This is how gradients flow backward from one layer into the previous layer."},{id:"relu-derivative",stepLabel:"33.1",group:"Activation gradients",title:"ReLU derivative",concept:"ReLU passes gradient only when the input was positive.",objective:"Return 1 for positive z, otherwise 0.",difficulty:"warmup",starterCode:`function reluDerivative(z) {
  // TODO: return 1 if z > 0, otherwise 0.
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('positive', reluDerivative(3), 1);
check('negative', reluDerivative(-4), 0);
check('zero', reluDerivative(0), 0);

return results;`,hints:["ReLU is active only when z > 0.","Use a ternary expression.","return z > 0 ? 1 : 0;"],solution:`function reluDerivative(z) {
  return z > 0 ? 1 : 0;
}`,explanation:"A negative ReLU input blocks gradient, which can create dead units."},{id:"relu-backprop",stepLabel:"33.2",group:"Activation gradients",title:"Backprop through ReLU",concept:"The upstream gradient is kept only if ReLU was active.",objective:"Multiply upstreamGradient by the ReLU derivative.",difficulty:"core",starterCode:`function reluDerivative(z) {
  return z > 0 ? 1 : 0;
}

function reluBackward(upstreamGradient, z) {
  // TODO: return upstreamGradient times reluDerivative(z).
  return upstreamGradient;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('active ReLU', reluBackward(5, 3), 5);
check('inactive ReLU', reluBackward(5, -3), 0);
check('zero ReLU', reluBackward(5, 0), 0);
check('negative upstream active', reluBackward(-2, 4), -2);

return results;`,hints:["Backprop multiplies by local derivative.","reluDerivative(z) is either 1 or 0.","return upstreamGradient * reluDerivative(z);"],solution:`function reluDerivative(z) {
  return z > 0 ? 1 : 0;
}

function reluBackward(upstreamGradient, z) {
  return upstreamGradient * reluDerivative(z);
}`,explanation:"ReLU either passes the gradient through unchanged or blocks it entirely."},{id:"sigmoid-derivative-output",stepLabel:"33.3",group:"Activation gradients",title:"Sigmoid derivative",concept:"If s = sigmoid(z), then ds/dz = s(1-s).",objective:"Return s * (1 - s).",difficulty:"core",starterCode:`function sigmoidDerivativeFromOutput(s) {
  // TODO: return s * (1 - s).
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('s=0.5', sigmoidDerivativeFromOutput(0.5), 0.25);
check('s=0.8', sigmoidDerivativeFromOutput(0.8), 0.16);
check('s=0.1', sigmoidDerivativeFromOutput(0.1), 0.09);

return results;`,hints:["Use the sigmoid output s directly.","Derivative is s times one minus s.","return s * (1 - s);"],solution:`function sigmoidDerivativeFromOutput(s) {
  return s * (1 - s);
}`,explanation:"Sigmoid gradients are largest near 0.5 and small near saturated outputs 0 or 1."},{id:"sigmoid-backprop",stepLabel:"33.4",group:"Activation gradients",title:"Backprop through sigmoid",concept:"Sigmoid backprop multiplies upstream gradient by s(1-s).",objective:"Return upstreamGradient * s * (1 - s).",difficulty:"core",starterCode:`function sigmoidBackward(upstreamGradient, sigmoidOutput) {
  // TODO: apply the sigmoid local derivative.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('s=0.5 upstream=1', sigmoidBackward(1, 0.5), 0.25);
check('s=0.8 upstream=2', sigmoidBackward(2, 0.8), 0.32);
check('s=0.1 upstream=3', sigmoidBackward(3, 0.1), 0.27);

return results;`,hints:["Local derivative is sigmoidOutput * (1 - sigmoidOutput).","Multiply by upstreamGradient.","return upstreamGradient * sigmoidOutput * (1 - sigmoidOutput);"],solution:`function sigmoidBackward(upstreamGradient, sigmoidOutput) {
  return upstreamGradient * sigmoidOutput * (1 - sigmoidOutput);
}`,explanation:"Sigmoid saturation can shrink gradients during backprop."},{id:"one-hot-target",stepLabel:"34.1",group:"Softmax cross-entropy",title:"One-hot target",concept:"Classification targets are often represented as one-hot vectors.",objective:"Return 1 at targetIndex and 0 elsewhere.",difficulty:"warmup",starterCode:`function oneHot(numClasses, targetIndex) {
  const y = [];

  for (let i = 0; i < numClasses; i++) {
    // TODO: push 1 for the target index, otherwise 0.
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

check('class 0 of 3', oneHot(3, 0), [1, 0, 0]);
check('class 1 of 3', oneHot(3, 1), [0, 1, 0]);
check('class 2 of 4', oneHot(4, 2), [0, 0, 1, 0]);

return results;`,hints:["Compare i with targetIndex.","Push 1 if they match, otherwise 0.","y.push(i === targetIndex ? 1 : 0);"],solution:`function oneHot(numClasses, targetIndex) {
  const y = [];

  for (let i = 0; i < numClasses; i++) {
    y.push(i === targetIndex ? 1 : 0);
  }

  return y;
}`,explanation:"A one-hot vector says which class is the true class."},{id:"cross-entropy-one-hot",stepLabel:"34.2",group:"Softmax cross-entropy",title:"Cross-entropy from true class probability",concept:"For a one-hot label, cross-entropy is -log(probability of the true class).",objective:"Return -Math.log(probabilities[targetIndex]).",difficulty:"core",starterCode:`function crossEntropyFromTarget(probabilities, targetIndex) {
  // TODO: return negative log probability of the true class.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('p=0.5', crossEntropyFromTarget([0.5, 0.5], 0), -Math.log(0.5));
check('p=0.8', crossEntropyFromTarget([0.1, 0.8, 0.1], 1), -Math.log(0.8));
check('p=0.25', crossEntropyFromTarget([0.25, 0.25, 0.5], 0), -Math.log(0.25));

return results;`,hints:["Only the probability assigned to the true class matters for one-hot cross-entropy.","Use probabilities[targetIndex].","return -Math.log(probabilities[targetIndex]);"],solution:`function crossEntropyFromTarget(probabilities, targetIndex) {
  return -Math.log(probabilities[targetIndex]);
}`,explanation:"Cross-entropy strongly penalizes assigning low probability to the true class."},{id:"softmax-cross-entropy-gradient",stepLabel:"34.3",group:"Softmax cross-entropy",title:"Softmax + CE gradient",concept:"For softmax followed by cross-entropy, the logit gradient is probabilities minus one-hot target.",objective:"Push probabilities[i] - target[i].",difficulty:"challenge",starterCode:`function softmaxCrossEntropyGradient(probabilities, targetIndex) {
  const gradient = [];

  for (let i = 0; i < probabilities.length; i++) {
    const target = i === targetIndex ? 1 : 0;

    // TODO: push probability minus target.
    gradient.push(0);
  }

  return gradient;
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

check('binary target 0', softmaxCrossEntropyGradient([0.7, 0.3], 0), [-0.3, 0.3]);
check('binary target 1', softmaxCrossEntropyGradient([0.7, 0.3], 1), [0.7, -0.7]);
check('three classes', softmaxCrossEntropyGradient([0.1, 0.8, 0.1], 1), [0.1, -0.2, 0.1]);

return results;`,hints:["This is the famous simplification: gradient = p - y.","target is already 1 for the true class and 0 otherwise.","gradient.push(probabilities[i] - target);"],solution:`function softmaxCrossEntropyGradient(probabilities, targetIndex) {
  const gradient = [];

  for (let i = 0; i < probabilities.length; i++) {
    const target = i === targetIndex ? 1 : 0;
    gradient.push(probabilities[i] - target);
  }

  return gradient;
}`,explanation:"The true class gets pushed up when its probability is too low; other classes get pushed down."},{id:"softmax-gradient-sum-zero",stepLabel:"34.4",group:"Softmax cross-entropy",title:"Softmax gradient sums to zero",concept:"Softmax logits compete: increasing one class decreases others, so gradients sum to zero.",objective:"Return the sum of the gradient entries.",difficulty:"core",starterCode:`function gradientSum(gradient) {
  let total = 0;

  for (let i = 0; i < gradient.length; i++) {
    // TODO: add the current gradient entry.
    total += 0;
  }

  return total;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('binary gradient', gradientSum([-0.3, 0.3]), 0);
check('three-class gradient', gradientSum([0.1, -0.2, 0.1]), 0);
check('general sum', gradientSum([0.25, 0.25, -0.5]), 0);

return results;`,hints:["Loop over the gradient entries.","Add each entry into total.","total += gradient[i];"],solution:`function gradientSum(gradient) {
  let total = 0;

  for (let i = 0; i < gradient.length; i++) {
    total += gradient[i];
  }

  return total;
}`,explanation:"Softmax probabilities are coupled; probability mass shifts between classes."},{id:"batch-size",stepLabel:"35.1",group:"Batch matrix shapes",title:"Batch size",concept:"A batch matrix has one row per example.",objective:"Return the number of examples in X.",difficulty:"warmup",starterCode:`function batchSize(X) {
  // TODO: return the number of rows.
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('two examples', batchSize([[1, 2], [3, 4]]), 2);
check('three examples', batchSize([[1], [2], [3]]), 3);
check('one example', batchSize([[5, 6, 7]]), 1);

return results;`,hints:["Rows are examples.","The number of rows is X.length.","return X.length;"],solution:`function batchSize(X) {
  return X.length;
}`,explanation:"In many ML libraries, a data batch X has shape batch x features."},{id:"feature-count",stepLabel:"35.2",group:"Batch matrix shapes",title:"Feature count",concept:"A batch matrix has one column per input feature.",objective:"Return the number of columns in X.",difficulty:"warmup",starterCode:`function featureCount(X) {
  // TODO: return the number of features.
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('two features', featureCount([[1, 2], [3, 4]]), 2);
check('one feature', featureCount([[1], [2], [3]]), 1);
check('three features', featureCount([[5, 6, 7]]), 3);

return results;`,hints:["Features are columns.","The first row length gives the number of features.","return X[0].length;"],solution:`function featureCount(X) {
  return X[0].length;
}`,explanation:"The feature count determines how many input weights each neuron needs."},{id:"dense-output-shape",stepLabel:"35.3",group:"Batch matrix shapes",title:"Dense layer output shape",concept:"If X is batch x inputDim and W is inputDim x outputDim, then XW is batch x outputDim.",objective:"Return [batchSize, outputDim].",difficulty:"core",starterCode:`function denseOutputShape(X, W) {
  const batch = X.length;
  const outputDim = W[0].length;

  // TODO: return the output shape.
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

check('2x3 times 3x4', denseOutputShape([[1,2,3],[4,5,6]], [[1,2,3,4],[5,6,7,8],[9,10,11,12]]), [2, 4]);
check('1x2 times 2x3', denseOutputShape([[1,2]], [[1,2,3],[4,5,6]]), [1, 3]);
check('3x1 times 1x2', denseOutputShape([[1],[2],[3]], [[4,5]]), [3, 2]);

return results;`,hints:["Rows come from X.","Output columns come from W.","return [batch, outputDim];"],solution:`function denseOutputShape(X, W) {
  const batch = X.length;
  const outputDim = W[0].length;
  return [batch, outputDim];
}`,explanation:"Dense layers are matrix multiplication with a batch dimension."},{id:"dense-shape-compatible",stepLabel:"35.4",group:"Batch matrix shapes",title:"Dense layer shape check",concept:"The feature count of X must match the input dimension of W.",objective:"Return whether X and W can multiply.",difficulty:"core",starterCode:`function denseShapesCompatible(X, W) {
  const inputFeatures = X[0].length;
  const weightInputDim = W.length;

  // TODO: return whether the inner dimensions match.
  return false;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('2x3 and 3x4 compatible', denseShapesCompatible([[1,2,3],[4,5,6]], [[1,2,3,4],[5,6,7,8],[9,10,11,12]]), true);
check('2x2 and 3x4 incompatible', denseShapesCompatible([[1,2],[3,4]], [[1,2,3,4],[5,6,7,8],[9,10,11,12]]), false);
check('1x2 and 2x1 compatible', denseShapesCompatible([[1,2]], [[3],[4]]), true);

return results;`,hints:["The inner dimensions must match.","Compare X[0].length with W.length.","return inputFeatures === weightInputDim;"],solution:`function denseShapesCompatible(X, W) {
  const inputFeatures = X[0].length;
  const weightInputDim = W.length;
  return inputFeatures === weightInputDim;
}`,explanation:"Many neural-network bugs are shape bugs. This check catches the most common dense-layer mismatch."},{id:"dense-add-bias-each-row",stepLabel:"35.5",group:"Batch matrix shapes",title:"Add bias to each row",concept:"Dense-layer bias is added to every example in the batch.",objective:"Add bias[col] to each output cell.",difficulty:"challenge",starterCode:`function addBias(Y, bias) {
  const result = [];

  for (let row = 0; row < Y.length; row++) {
    const values = [];

    for (let col = 0; col < Y[0].length; col++) {
      // TODO: add the bias for this output feature.
      values.push(Y[row][col]);
    }

    result.push(values);
  }

  return result;
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

check('add bias to two rows', addBias([[1,2],[3,4]], [10,20]), [[11,22],[13,24]]);
check('zero bias', addBias([[1,2,3]], [0,0,0]), [[1,2,3]]);
check('negative bias', addBias([[5,5]], [-1,2]), [[4,7]]);

return results;`,hints:["Bias has one value per output column.","Use bias[col].","values.push(Y[row][col] + bias[col]);"],solution:`function addBias(Y, bias) {
  const result = [];

  for (let row = 0; row < Y.length; row++) {
    const values = [];

    for (let col = 0; col < Y[0].length; col++) {
      values.push(Y[row][col] + bias[col]);
    }

    result.push(values);
  }

  return result;
}`,explanation:"Bias broadcasts across the batch: every example gets the same output-feature offsets."},{id:"dense-one-output-neuron",stepLabel:"36.1",group:"Mini neural network layer",title:"One dense output",concept:"One dense-layer output is one input vector dotted with one weight vector plus bias.",objective:"Return dot(x, weights) + bias.",difficulty:"core",starterCode:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function denseOne(x, weights, bias) {
  // TODO: return dot(x, weights) + bias.
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('simple dense output', denseOne([1, 2], [3, 4], 0), 11);
check('with bias', denseOne([1, 2], [3, 4], -1), 10);
check('negative weight', denseOne([-1, 2], [3, 5], 1), 8);

return results;`,hints:["A dense neuron is a dot product plus a bias.","Use the dot helper.","return dot(x, weights) + bias;"],solution:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function denseOne(x, weights, bias) {
  return dot(x, weights) + bias;
}`,explanation:"A dense layer is many versions of this one-neuron calculation."},{id:"dense-multiple-outputs",stepLabel:"36.2",group:"Mini neural network layer",title:"Multiple dense outputs",concept:"A dense layer has one weight vector and one bias per output feature.",objective:"Push one output for each output weight vector.",difficulty:"core",starterCode:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function denseLayer(x, weightColumns, biases) {
  const outputs = [];

  for (let j = 0; j < weightColumns.length; j++) {
    // TODO: push dot(x, weightColumns[j]) + biases[j].
    outputs.push(0);
  }

  return outputs;
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

check('two outputs', denseLayer([1, 2], [[3, 4], [5, 6]], [0, 1]), [11, 18]);
check('three outputs', denseLayer([2, 1], [[1, 0], [0, 1], [1, 1]], [0, 0, -1]), [2, 1, 2]);

return results;`,hints:["Each output j has its own weight vector and bias.","Use dot(x, weightColumns[j]) + biases[j].","outputs.push(dot(x, weightColumns[j]) + biases[j]);"],solution:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function denseLayer(x, weightColumns, biases) {
  const outputs = [];

  for (let j = 0; j < weightColumns.length; j++) {
    outputs.push(dot(x, weightColumns[j]) + biases[j]);
  }

  return outputs;
}`,explanation:"A dense layer maps one input vector to several output features by using several weight vectors."},{id:"dense-relu-vector",stepLabel:"36.3",group:"Mini neural network layer",title:"ReLU on a vector",concept:"Neural layers apply activations element by element.",objective:"Push Math.max(0, values[i]) for every coordinate.",difficulty:"warmup",starterCode:`function reluVector(values) {
  const activated = [];

  for (let i = 0; i < values.length; i++) {
    // TODO: push ReLU of values[i].
    activated.push(values[i]);
  }

  return activated;
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

check('mixed values', reluVector([-2, 0, 3]), [0, 0, 3]);
check('all positive', reluVector([1, 2, 3]), [1, 2, 3]);
check('all negative', reluVector([-1, -2]), [0, 0]);

return results;`,hints:["ReLU is max(0, value).","Use Math.max(0, values[i]).","activated.push(Math.max(0, values[i]));"],solution:`function reluVector(values) {
  const activated = [];

  for (let i = 0; i < values.length; i++) {
    activated.push(Math.max(0, values[i]));
  }

  return activated;
}`,explanation:"Activations usually apply coordinate by coordinate after a linear transformation."},{id:"two-layer-mini-network",stepLabel:"36.4",group:"Mini neural network layer",title:"Two-layer mini network",concept:"A simple network can be dense -> ReLU -> dense.",objective:"Feed hidden activations into the output layer.",difficulty:"challenge",starterCode:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function reluVector(values) {
  return values.map((value) => Math.max(0, value));
}

function denseLayer(x, weightColumns, biases) {
  return weightColumns.map((weights, j) => dot(x, weights) + biases[j]);
}

function twoLayerNetwork(x, hiddenWeights, hiddenBiases, outputWeights, outputBiases) {
  const hiddenPre = denseLayer(x, hiddenWeights, hiddenBiases);
  const hidden = reluVector(hiddenPre);

  // TODO: return the output dense layer applied to hidden.
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

check('two-layer network', twoLayerNetwork([1, 2], [[1, 0], [0, 1]], [0, 0], [[1, 1]], [0]), [3]);
check('hidden ReLU clips negative', twoLayerNetwork([-1, 2], [[1, 0], [0, 1]], [0, 0], [[1, 1]], [0]), [2]);

return results;`,hints:["The hidden activations are already computed.","Use denseLayer(hidden, outputWeights, outputBiases).","return denseLayer(hidden, outputWeights, outputBiases);"],solution:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function reluVector(values) {
  return values.map((value) => Math.max(0, value));
}

function denseLayer(x, weightColumns, biases) {
  return weightColumns.map((weights, j) => dot(x, weights) + biases[j]);
}

function twoLayerNetwork(x, hiddenWeights, hiddenBiases, outputWeights, outputBiases) {
  const hiddenPre = denseLayer(x, hiddenWeights, hiddenBiases);
  const hidden = reluVector(hiddenPre);
  return denseLayer(hidden, outputWeights, outputBiases);
}`,explanation:"Stacking layers means using one layer output as the next layer input."},{id:"training-loop-one-prediction",stepLabel:"37.1",group:"Training loop mechanics",title:"One prediction",concept:"Training begins with a prediction from current parameters.",objective:"Return weight * x + bias.",difficulty:"warmup",starterCode:`function predictLinear(x, weight, bias) {
  // TODO: return weight * x + bias.
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('predict 2*3+1', predictLinear(3, 2, 1), 7);
check('predict -1*4+2', predictLinear(4, -1, 2), -2);
check('bias only', predictLinear(10, 0, 5), 5);

return results;`,hints:["Linear prediction is slope times input plus bias.","Use weight * x + bias.","return weight * x + bias;"],solution:`function predictLinear(x, weight, bias) {
  return weight * x + bias;
}`,explanation:"A training loop repeatedly predicts, measures error, computes gradients, and updates parameters."},{id:"training-loop-one-loss",stepLabel:"37.2",group:"Training loop mechanics",title:"One-example loss",concept:"Squared error loss measures prediction error squared.",objective:"Return (prediction - target)^2.",difficulty:"warmup",starterCode:`function squaredLoss(prediction, target) {
  const error = prediction - target;

  // TODO: return squared error.
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('error 3', squaredLoss(10, 7), 9);
check('error -5', squaredLoss(4, 9), 25);
check('perfect', squaredLoss(5, 5), 0);

return results;`,hints:["Squared error means error times error.","The error variable is already computed.","return error * error;"],solution:`function squaredLoss(prediction, target) {
  const error = prediction - target;
  return error * error;
}`,explanation:"The loss is the number the training loop tries to reduce."},{id:"training-loop-average-loss",stepLabel:"37.3",group:"Training loop mechanics",title:"Average batch loss",concept:"Batch loss averages losses over examples.",objective:"Divide total loss by the number of examples.",difficulty:"core",starterCode:`function averageLoss(losses) {
  let total = 0;

  for (let i = 0; i < losses.length; i++) {
    total += losses[i];
  }

  // TODO: return the average loss.
  return total;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('average [1,2,3]', averageLoss([1, 2, 3]), 2);
check('average [10,20]', averageLoss([10, 20]), 15);
check('average zeros', averageLoss([0, 0, 0]), 0);

return results;`,hints:["Average means total divided by count.","The count is losses.length.","return total / losses.length;"],solution:`function averageLoss(losses) {
  let total = 0;

  for (let i = 0; i < losses.length; i++) {
    total += losses[i];
  }

  return total / losses.length;
}`,explanation:"Training reports average loss so batches of different sizes are comparable."},{id:"training-loop-step-summary",stepLabel:"37.4",group:"Training loop mechanics",title:"One training step",concept:"A training step computes prediction, error, gradients, and updated parameters.",objective:"Return updated weight after one gradient step.",difficulty:"challenge",starterCode:`function oneStepWeightUpdate(x, target, weight, bias, learningRate) {
  const prediction = weight * x + bias;
  const error = prediction - target;

  // Gradient of squared error without the factor 2 for simplicity.
  const weightGradient = error * x;

  // TODO: return updated weight.
  return weight;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('update decreases high prediction', oneStepWeightUpdate(2, 3, 2, 0, 0.1), 1.8);
check('update increases low prediction', oneStepWeightUpdate(2, 10, 2, 0, 0.1), 3.2);
check('perfect no update', oneStepWeightUpdate(2, 4, 2, 0, 0.1), 2);

return results;`,hints:["Gradient descent subtracts learningRate * gradient.","The weightGradient is already computed.","return weight - learningRate * weightGradient;"],solution:`function oneStepWeightUpdate(x, target, weight, bias, learningRate) {
  const prediction = weight * x + bias;
  const error = prediction - target;
  const weightGradient = error * x;

  return weight - learningRate * weightGradient;
}`,explanation:"One training step nudges parameters opposite the gradient."},{id:"optimizer-sgd-update",stepLabel:"38.1",group:"Optimizer updates",title:"SGD update",concept:"Stochastic gradient descent subtracts learningRate times gradient.",objective:"Return parameter - learningRate * gradient.",difficulty:"warmup",starterCode:`function sgdUpdate(parameter, gradient, learningRate) {
  // TODO: return the updated parameter.
  return parameter;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('positive gradient', sgdUpdate(1, 3, 0.1), 0.7);
check('negative gradient', sgdUpdate(1, -2, 0.5), 2);
check('zero gradient', sgdUpdate(5, 0, 0.1), 5);

return results;`,hints:["Move opposite the gradient.","Subtract learningRate * gradient.","return parameter - learningRate * gradient;"],solution:`function sgdUpdate(parameter, gradient, learningRate) {
  return parameter - learningRate * gradient;
}`,explanation:"SGD is the simplest optimizer: follow the negative gradient."},{id:"optimizer-momentum-velocity",stepLabel:"38.2",group:"Optimizer updates",title:"Momentum velocity",concept:"Momentum keeps a moving velocity of recent gradients.",objective:"Return beta * velocity + gradient.",difficulty:"core",starterCode:`function updateVelocity(velocity, gradient, beta) {
  // TODO: combine old velocity and current gradient.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('new velocity', updateVelocity(0, 3, 0.9), 3);
check('carry velocity', updateVelocity(10, 3, 0.9), 12);
check('negative gradient', updateVelocity(5, -2, 0.8), 2);

return results;`,hints:["Momentum mixes previous velocity with current gradient.","Use beta * velocity + gradient.","return beta * velocity + gradient;"],solution:`function updateVelocity(velocity, gradient, beta) {
  return beta * velocity + gradient;
}`,explanation:"Momentum smooths updates by remembering previous gradient direction."},{id:"optimizer-momentum-update",stepLabel:"38.3",group:"Optimizer updates",title:"Momentum update",concept:"Momentum updates parameters using velocity rather than the raw current gradient only.",objective:"Subtract learningRate times velocity.",difficulty:"core",starterCode:`function momentumParameterUpdate(parameter, velocity, learningRate) {
  // TODO: update parameter using velocity.
  return parameter;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('velocity 3', momentumParameterUpdate(1, 3, 0.1), 0.7);
check('negative velocity', momentumParameterUpdate(1, -2, 0.5), 2);
check('zero velocity', momentumParameterUpdate(5, 0, 0.1), 5);

return results;`,hints:["Velocity acts like the gradient direction to follow.","Subtract learningRate * velocity.","return parameter - learningRate * velocity;"],solution:`function momentumParameterUpdate(parameter, velocity, learningRate) {
  return parameter - learningRate * velocity;
}`,explanation:"Momentum can accelerate updates in consistent directions and damp zig-zagging."},{id:"optimizer-adam-first-moment",stepLabel:"38.4",group:"Optimizer updates",title:"Adam first moment",concept:"Adam keeps an exponential moving average of gradients.",objective:"Return beta1 * m + (1 - beta1) * gradient.",difficulty:"core",starterCode:`function adamFirstMoment(m, gradient, beta1) {
  // TODO: update the first moment estimate.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('first moment from zero', adamFirstMoment(0, 10, 0.9), 1);
check('carry moment', adamFirstMoment(5, 10, 0.9), 5.5);
check('negative gradient', adamFirstMoment(1, -9, 0.8), -1);

return results;`,hints:["Adam first moment is a weighted average of old m and new gradient.","Use beta1 for old m and 1 - beta1 for gradient.","return beta1 * m + (1 - beta1) * gradient;"],solution:`function adamFirstMoment(m, gradient, beta1) {
  return beta1 * m + (1 - beta1) * gradient;
}`,explanation:"Adam first moment behaves like momentum but with exponential averaging."},{id:"optimizer-adam-second-moment",stepLabel:"38.5",group:"Optimizer updates",title:"Adam second moment",concept:"Adam tracks an exponential moving average of squared gradients.",objective:"Return beta2 * v + (1 - beta2) * gradient squared.",difficulty:"core",starterCode:`function adamSecondMoment(v, gradient, beta2) {
  // TODO: update the second moment estimate.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('second moment from zero', adamSecondMoment(0, 10, 0.99), 1);
check('carry second moment', adamSecondMoment(5, 10, 0.9), 14.5);
check('negative gradient squares', adamSecondMoment(0, -3, 0.9), 0.9);

return results;`,hints:["Use gradient * gradient.","Mix old v with squared gradient.","return beta2 * v + (1 - beta2) * gradient * gradient;"],solution:`function adamSecondMoment(v, gradient, beta2) {
  return beta2 * v + (1 - beta2) * gradient * gradient;
}`,explanation:"Adam uses the second moment to scale updates by recent gradient magnitude."},{id:"regularization-l2-penalty",stepLabel:"39.1",group:"Regularization",title:"L2 penalty",concept:"L2 regularization penalizes large weights by adding lambda times sum of squared weights.",objective:"Accumulate weight squared.",difficulty:"core",starterCode:`function l2Penalty(weights, lambda) {
  let sumSquares = 0;

  for (let i = 0; i < weights.length; i++) {
    // TODO: add squared weight.
    sumSquares += 0;
  }

  return lambda * sumSquares;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('simple L2', l2Penalty([3, 4], 1), 25);
check('lambda half', l2Penalty([3, 4], 0.5), 12.5);
check('zero weights', l2Penalty([0, 0], 10), 0);

return results;`,hints:["L2 uses squared weights.","Add weights[i] * weights[i].","sumSquares += weights[i] * weights[i];"],solution:`function l2Penalty(weights, lambda) {
  let sumSquares = 0;

  for (let i = 0; i < weights.length; i++) {
    sumSquares += weights[i] * weights[i];
  }

  return lambda * sumSquares;
}`,explanation:"L2 discourages very large weights, often improving generalization."},{id:"regularization-l2-gradient",stepLabel:"39.2",group:"Regularization",title:"L2 gradient",concept:"The derivative of lambda times w squared with respect to w is 2 * lambda * w.",objective:"Push 2 * lambda * weight.",difficulty:"core",starterCode:`function l2Gradient(weights, lambda) {
  const gradients = [];

  for (let i = 0; i < weights.length; i++) {
    // TODO: push the L2 gradient for this weight.
    gradients.push(0);
  }

  return gradients;
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

check('lambda 1', l2Gradient([3, 4], 1), [6, 8]);
check('lambda half', l2Gradient([3, 4], 0.5), [3, 4]);
check('negative weights', l2Gradient([-1, 2], 1), [-2, 4]);

return results;`,hints:["Derivative of w squared is 2w.","Multiply by lambda.","gradients.push(2 * lambda * weights[i]);"],solution:`function l2Gradient(weights, lambda) {
  const gradients = [];

  for (let i = 0; i < weights.length; i++) {
    gradients.push(2 * lambda * weights[i]);
  }

  return gradients;
}`,explanation:"L2 gradient pulls weights toward zero."},{id:"regularization-dropout-mask",stepLabel:"39.3",group:"Regularization",title:"Apply dropout mask",concept:"Dropout removes selected activations during training.",objective:"Multiply each activation by its mask value.",difficulty:"warmup",starterCode:`function applyDropoutMask(activations, mask) {
  const dropped = [];

  for (let i = 0; i < activations.length; i++) {
    // TODO: multiply activation by mask.
    dropped.push(activations[i]);
  }

  return dropped;
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

check('drop middle', applyDropoutMask([1, 2, 3], [1, 0, 1]), [1, 0, 3]);
check('drop all', applyDropoutMask([1, 2], [0, 0]), [0, 0]);
check('keep all', applyDropoutMask([1, 2], [1, 1]), [1, 2]);

return results;`,hints:["Mask values are 0 or 1.","Multiply activations[i] by mask[i].","dropped.push(activations[i] * mask[i]);"],solution:`function applyDropoutMask(activations, mask) {
  const dropped = [];

  for (let i = 0; i < activations.length; i++) {
    dropped.push(activations[i] * mask[i]);
  }

  return dropped;
}`,explanation:"Dropout forces the network not to rely too heavily on any one activation."},{id:"regularization-inverted-dropout",stepLabel:"39.4",group:"Regularization",title:"Inverted dropout scaling",concept:"Inverted dropout divides kept activations by keep probability.",objective:"Apply mask and divide by keepProbability.",difficulty:"core",starterCode:`function invertedDropout(activations, mask, keepProbability) {
  const output = [];

  for (let i = 0; i < activations.length; i++) {
    // TODO: apply inverted dropout scaling.
    output.push(activations[i]);
  }

  return output;
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

check('keep prob 0.5', invertedDropout([1, 2, 3], [1, 0, 1], 0.5), [2, 0, 6]);
check('keep prob 1', invertedDropout([1, 2], [1, 1], 1), [1, 2]);
check('drop all', invertedDropout([1, 2], [0, 0], 0.5), [0, 0]);

return results;`,hints:["First multiply by mask[i].","Then divide by keepProbability.","output.push((activations[i] * mask[i]) / keepProbability);"],solution:`function invertedDropout(activations, mask, keepProbability) {
  const output = [];

  for (let i = 0; i < activations.length; i++) {
    output.push((activations[i] * mask[i]) / keepProbability);
  }

  return output;
}`,explanation:"Inverted dropout keeps expected activation scale roughly stable during training."},{id:"matmul-backprop-a-entry",stepLabel:"40.1",group:"Matrix multiplication backprop",title:"Gradient for A entry",concept:"If C[i][j] = sum over k of A[i][k] * B[k][j], then the derivative with respect to A[i][k] is B[k][j].",objective:"Return B[k][j].",difficulty:"core",starterCode:`function gradCellWithRespectToA(B, k, j) {
  // TODO: return the derivative of C[i][j] with respect to A[i][k].
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

const B = [
  [2, 1, 3],
  [1, 4, 2],
];

check('k=0 j=0', gradCellWithRespectToA(B, 0, 0), 2);
check('k=0 j=2', gradCellWithRespectToA(B, 0, 2), 3);
check('k=1 j=1', gradCellWithRespectToA(B, 1, 1), 4);

return results;`,hints:["A[i][k] is multiplied by B[k][j].","The derivative with respect to A[i][k] is B[k][j].","return B[k][j];"],solution:`function gradCellWithRespectToA(B, k, j) {
  return B[k][j];
}`,explanation:"Backprop through multiplication sends the other factor backward."},{id:"matmul-backprop-b-entry",stepLabel:"40.2",group:"Matrix multiplication backprop",title:"Gradient for B entry",concept:"If C[i][j] = sum over k of A[i][k] * B[k][j], then the derivative with respect to B[k][j] is A[i][k].",objective:"Return A[i][k].",difficulty:"core",starterCode:`function gradCellWithRespectToB(A, i, k) {
  // TODO: return the derivative of C[i][j] with respect to B[k][j].
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

const A = [
  [1, 2],
  [3, 1],
];

check('i=0 k=0', gradCellWithRespectToB(A, 0, 0), 1);
check('i=0 k=1', gradCellWithRespectToB(A, 0, 1), 2);
check('i=1 k=0', gradCellWithRespectToB(A, 1, 0), 3);

return results;`,hints:["B[k][j] is multiplied by A[i][k].","The derivative with respect to B[k][j] is A[i][k].","return A[i][k];"],solution:`function gradCellWithRespectToB(A, i, k) {
  return A[i][k];
}`,explanation:"Again, the gradient through multiplication sends the other factor backward."},{id:"matmul-backprop-dA",stepLabel:"40.3",group:"Matrix multiplication backprop",title:"dA from dC",concept:"For C = AB, the gradient with respect to A is dC times B transposed.",objective:"Return matmul(dC, transpose(B)).",difficulty:"challenge",starterCode:`function transpose(A) {
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

function gradA(dC, B) {
  // TODO: return dC times B transposed.
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

check('dA simple', gradA([[1, 0]], [[2, 3], [4, 5]]), [[2, 4]]);
check('dA two rows', gradA([[1, 1], [0, 1]], [[2, 3], [4, 5]]), [[5, 9], [3, 5]]);

return results;`,hints:["The formula is dA = dC times B transpose.","Use transpose(B).","return matmul(dC, transpose(B));"],solution:`function transpose(A) {
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

function gradA(dC, B) {
  return matmul(dC, transpose(B));
}`,explanation:"Matrix backprop uses transposes to send gradients to the correct side of the multiplication."},{id:"matmul-backprop-dB",stepLabel:"40.4",group:"Matrix multiplication backprop",title:"dB from dC",concept:"For C = AB, the gradient with respect to B is A transposed times dC.",objective:"Return matmul(transpose(A), dC).",difficulty:"challenge",starterCode:`function transpose(A) {
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

function gradB(A, dC) {
  // TODO: return A transposed times dC.
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

check('dB simple', gradB([[2, 4]], [[1, 0]]), [[2, 0], [4, 0]]);
check('dB two examples', gradB([[1, 2], [3, 4]], [[1, 0], [0, 1]]), [[1, 3], [2, 4]]);

return results;`,hints:["The formula is dB = A transpose times dC.","Use transpose(A).","return matmul(transpose(A), dC);"],solution:`function transpose(A) {
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

function gradB(A, dC) {
  return matmul(transpose(A), dC);
}`,explanation:"This is the dense-layer weight-gradient formula used in neural-network training."},{id:"lstm-gates-f-i",stepLabel:"31.1",group:"Forget and input gates",title:"LSTM Forget and Input Gates",concept:"An LSTM cell uses sigmoid forget and input gates to control how much past memory to keep and how much new input to write.",objective:"Inside lstmCell, compute forget gate f and input gate i from x, hPrev, and params.",difficulty:"warmup",starterCode:`/**
 * Runs one LSTM cell forward pass and returns the new hidden/cell states plus gate diagnostics.
 * @param {number} x - Current input scalar.
 * @param {number} hPrev - Previous hidden state.
 * @param {number} cPrev - Previous cell state.
 * @param {{ wf: number, uf: number, bf: number, wi: number, ui: number, bi: number, wc: number, uc: number, bc: number, wo: number, uo: number, bo: number }} params - Gate parameters.
 * @returns {{ h: number, c: number, f: number, i: number, o: number, cCand: number }} New states and gate values.
 */
function lstmCell(x, hPrev, cPrev, params) {
  const sigmoid = (v) => 1 / (1 + Math.exp(-v));

  let f = 0;
  let i = 0;
  // TODO: set f and i using sigmoid on their pre-activation scores.

  const cCand = Math.tanh(params.wc * x + params.uc * hPrev + params.bc);
  const c = f * cPrev + i * cCand;
  const o = sigmoid(params.wo * x + params.uo * hPrev + params.bo);
  const h = o * Math.tanh(c);

  return { h, c, f, i, o, cCand };
}`,testCode:`const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const p = { wf: 0.5, uf: 0.5, bf: 0, wi: -0.5, ui: 1, bi: 0.2, wc: 0.8, uc: 0.2, bc: -0.1, wo: 0.5, uo: 0.5, bo: -0.2 };
const out = lstmCell(1, 1, 0, p);
check('forget gate', out.f, 0.731058);
check('input gate', out.i, 0.668187);
return results;`,hints:["Forget pre-activation: params.wf * x + params.uf * hPrev + params.bf.","Input pre-activation: params.wi * x + params.ui * hPrev + params.bi.","Apply sigmoid to both scores."],solution:`/**
 * Runs one LSTM cell forward pass and returns the new hidden/cell states plus gate diagnostics.
 * @param {number} x - Current input scalar.
 * @param {number} hPrev - Previous hidden state.
 * @param {number} cPrev - Previous cell state.
 * @param {{ wf: number, uf: number, bf: number, wi: number, ui: number, bi: number, wc: number, uc: number, bc: number, wo: number, uo: number, bo: number }} params - Gate parameters.
 * @returns {{ h: number, c: number, f: number, i: number, o: number, cCand: number }} New states and gate values.
 */
function lstmCell(x, hPrev, cPrev, params) {
  const sigmoid = (v) => 1 / (1 + Math.exp(-v));

  const f = sigmoid(params.wf * x + params.uf * hPrev + params.bf);
  const i = sigmoid(params.wi * x + params.ui * hPrev + params.bi);

  const cCand = Math.tanh(params.wc * x + params.uc * hPrev + params.bc);
  const c = f * cPrev + i * cCand;
  const o = sigmoid(params.wo * x + params.uo * hPrev + params.bo);
  const h = o * Math.tanh(c);

  return { h, c, f, i, o, cCand };
}`,explanation:"Forget and input gates are continuous valves that regulate memory flow without saturating like vanilla RNN activations."},{id:"lstm-candidate-state",stepLabel:"31.2",group:"Candidate cell",title:"LSTM Candidate Cell State",concept:"The candidate cell state cCand proposes new memory content, squashed into [-1, 1] with tanh before the input gate scales it.",objective:"Inside lstmCell, compute cCand = tanh(wc * x + uc * hPrev + bc).",difficulty:"warmup",starterCode:`/**
 * Runs one LSTM cell forward pass and returns the new hidden/cell states plus gate diagnostics.
 * @param {number} x - Current input scalar.
 * @param {number} hPrev - Previous hidden state.
 * @param {number} cPrev - Previous cell state.
 * @param {{ wf: number, uf: number, bf: number, wi: number, ui: number, bi: number, wc: number, uc: number, bc: number, wo: number, uo: number, bo: number }} params - Gate parameters.
 * @returns {{ h: number, c: number, f: number, i: number, o: number, cCand: number }} New states and gate values.
 */
function lstmCell(x, hPrev, cPrev, params) {
  const sigmoid = (v) => 1 / (1 + Math.exp(-v));

  const f = sigmoid(params.wf * x + params.uf * hPrev + params.bf);
  const i = sigmoid(params.wi * x + params.ui * hPrev + params.bi);

  let cCand = 0;
  // TODO: set cCand with Math.tanh on the candidate pre-activation.

  const c = f * cPrev + i * cCand;
  const o = sigmoid(params.wo * x + params.uo * hPrev + params.bo);
  const h = o * Math.tanh(c);

  return { h, c, f, i, o, cCand };
}`,testCode:`const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const p = { wf: 0, uf: 0, bf: 0, wi: 0, ui: 0, bi: 0, wc: 0.8, uc: 0.2, bc: -0.1, wo: 0, uo: 0, bo: 0 };
check('candidate positive', lstmCell(1, 2, 0, p).cCand, 0.800499);
check('candidate zero', lstmCell(0, 0, 0, p).cCand, -0.099667);
return results;`,hints:["Candidate score is params.wc * x + params.uc * hPrev + params.bc.","Return Math.tanh(score)."],solution:`/**
 * Runs one LSTM cell forward pass and returns the new hidden/cell states plus gate diagnostics.
 * @param {number} x - Current input scalar.
 * @param {number} hPrev - Previous hidden state.
 * @param {number} cPrev - Previous cell state.
 * @param {{ wf: number, uf: number, bf: number, wi: number, ui: number, bi: number, wc: number, uc: number, bc: number, wo: number, uo: number, bo: number }} params - Gate parameters.
 * @returns {{ h: number, c: number, f: number, i: number, o: number, cCand: number }} New states and gate values.
 */
function lstmCell(x, hPrev, cPrev, params) {
  const sigmoid = (v) => 1 / (1 + Math.exp(-v));

  const f = sigmoid(params.wf * x + params.uf * hPrev + params.bf);
  const i = sigmoid(params.wi * x + params.ui * hPrev + params.bi);

  const cCand = Math.tanh(params.wc * x + params.uc * hPrev + params.bc);
  const c = f * cPrev + i * cCand;
  const o = sigmoid(params.wo * x + params.uo * hPrev + params.bo);
  const h = o * Math.tanh(c);

  return { h, c, f, i, o, cCand };
}`,explanation:"Tanh bounds candidate values so long unrolled sequences stay numerically stable."},{id:"lstm-state-fusion",stepLabel:"31.3",group:"Cell state update",title:"LSTM Cell State Fusion",concept:"The new cell state combines gated history and gated candidate information: c = f * cPrev + i * cCand.",objective:"Inside lstmCell, fuse cPrev and cCand with gates f and i.",difficulty:"core",starterCode:`/**
 * Runs one LSTM cell forward pass and returns the new hidden/cell states plus gate diagnostics.
 * @param {number} x - Current input scalar.
 * @param {number} hPrev - Previous hidden state.
 * @param {number} cPrev - Previous cell state.
 * @param {{ wf: number, uf: number, bf: number, wi: number, ui: number, bi: number, wc: number, uc: number, bc: number, wo: number, uo: number, bo: number }} params - Gate parameters.
 * @returns {{ h: number, c: number, f: number, i: number, o: number, cCand: number }} New states and gate values.
 */
function lstmCell(x, hPrev, cPrev, params) {
  const sigmoid = (v) => 1 / (1 + Math.exp(-v));

  const f = sigmoid(params.wf * x + params.uf * hPrev + params.bf);
  const i = sigmoid(params.wi * x + params.ui * hPrev + params.bi);
  const cCand = Math.tanh(params.wc * x + params.uc * hPrev + params.bc);

  let c = 0;
  // TODO: update cell state with c = f * cPrev + i * cCand.

  const o = sigmoid(params.wo * x + params.uo * hPrev + params.bo);
  const h = o * Math.tanh(c);

  return { h, c, f, i, o, cCand };
}`,testCode:`const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const p = { wf: 0, uf: 0, bf: 0, wi: 0, ui: 0, bi: 0, wc: 0, uc: 0, bc: 0, wo: 0, uo: 0, bo: 0 };
check('fusion standard', lstmCell(0, 0, 2, { ...p, wf: 0, uf: 0, bf: 20, wi: 0, ui: 0, bi: -20, wc: 1, uc: 0, bc: 0 }).c, 2.0);
check('full forget', lstmCell(0, 0, 10, { ...p, wf: 0, uf: 0, bf: -20, wi: 0, ui: 0, bi: -20, wc: 1, uc: 0, bc: 0 }).c, 0);
check('keep only history', lstmCell(0, 0, 10, { ...p, wf: 0, uf: 0, bf: 20, wi: 0, ui: 0, bi: -20, wc: 0, uc: 0, bc: 0 }).c, 10);
return results;`,hints:["Scale cPrev by f and cCand by i.","Add the two scaled terms."],solution:`/**
 * Runs one LSTM cell forward pass and returns the new hidden/cell states plus gate diagnostics.
 * @param {number} x - Current input scalar.
 * @param {number} hPrev - Previous hidden state.
 * @param {number} cPrev - Previous cell state.
 * @param {{ wf: number, uf: number, bf: number, wi: number, ui: number, bi: number, wc: number, uc: number, bc: number, wo: number, uo: number, bo: number }} params - Gate parameters.
 * @returns {{ h: number, c: number, f: number, i: number, o: number, cCand: number }} New states and gate values.
 */
function lstmCell(x, hPrev, cPrev, params) {
  const sigmoid = (v) => 1 / (1 + Math.exp(-v));

  const f = sigmoid(params.wf * x + params.uf * hPrev + params.bf);
  const i = sigmoid(params.wi * x + params.ui * hPrev + params.bi);
  const cCand = Math.tanh(params.wc * x + params.uc * hPrev + params.bc);
  const c = f * cPrev + i * cCand;
  const o = sigmoid(params.wo * x + params.uo * hPrev + params.bo);
  const h = o * Math.tanh(c);

  return { h, c, f, i, o, cCand };
}`,explanation:"Linear cell updates let gradients flow across long horizons without repeated saturating nonlinearities."},{id:"lstm-hidden-output",stepLabel:"31.4",group:"Output gate & hidden output",title:"LSTM Hidden Output Generation",concept:"The output gate filters the tanh-compressed cell state to produce the hidden output: h = o * tanh(c).",objective:"Inside lstmCell, compute output gate o and hidden state h from the updated cell state.",difficulty:"challenge",starterCode:`/**
 * Runs one LSTM cell forward pass and returns the new hidden/cell states plus gate diagnostics.
 * @param {number} x - Current input scalar.
 * @param {number} hPrev - Previous hidden state.
 * @param {number} cPrev - Previous cell state.
 * @param {{ wf: number, uf: number, bf: number, wi: number, ui: number, bi: number, wc: number, uc: number, bc: number, wo: number, uo: number, bo: number }} params - Gate parameters.
 * @returns {{ h: number, c: number, f: number, i: number, o: number, cCand: number }} New states and gate values.
 */
function lstmCell(x, hPrev, cPrev, params) {
  const sigmoid = (v) => 1 / (1 + Math.exp(-v));

  const f = sigmoid(params.wf * x + params.uf * hPrev + params.bf);
  const i = sigmoid(params.wi * x + params.ui * hPrev + params.bi);
  const cCand = Math.tanh(params.wc * x + params.uc * hPrev + params.bc);
  const c = f * cPrev + i * cCand;

  let o = 0;
  let h = 0;
  // TODO: compute output gate o and hidden output h = o * Math.tanh(c).

  return { h, c, f, i, o, cCand };
}`,testCode:`const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const p = { wf: 0, uf: 0, bf: 20, wi: 0, ui: 0, bi: -20, wc: 0, uc: 0, bc: 0, wo: 0.5, uo: 0.5, bo: -0.2 };
const out = lstmCell(1, 2, 3, p);
check('output gate', out.o, 0.785835);
check('hidden output', out.h, 0.781949);
return results;`,hints:["Output gate uses sigmoid(wo * x + uo * hPrev + bo).","Hidden state is o multiplied by tanh(c)."],solution:`/**
 * Runs one LSTM cell forward pass and returns the new hidden/cell states plus gate diagnostics.
 * @param {number} x - Current input scalar.
 * @param {number} hPrev - Previous hidden state.
 * @param {number} cPrev - Previous cell state.
 * @param {{ wf: number, uf: number, bf: number, wi: number, ui: number, bi: number, wc: number, uc: number, bc: number, wo: number, uo: number, bo: number }} params - Gate parameters.
 * @returns {{ h: number, c: number, f: number, i: number, o: number, cCand: number }} New states and gate values.
 */
function lstmCell(x, hPrev, cPrev, params) {
  const sigmoid = (v) => 1 / (1 + Math.exp(-v));

  const f = sigmoid(params.wf * x + params.uf * hPrev + params.bf);
  const i = sigmoid(params.wi * x + params.ui * hPrev + params.bi);
  const cCand = Math.tanh(params.wc * x + params.uc * hPrev + params.bc);
  const c = f * cPrev + i * cCand;
  const o = sigmoid(params.wo * x + params.uo * hPrev + params.bo);
  const h = o * Math.tanh(c);

  return { h, c, f, i, o, cCand };
}`,explanation:"The output gate exposes only the relevant slice of cell memory as the hidden representation passed to the next timestep."},{id:"conv2d-output-size",stepLabel:"32.1",group:"Output size formula",title:"Conv2D output dimension",concept:"The output dimension of a 2D convolution is: outputSize = Math.floor((inputSize - kernelSize + 2 * padding) / stride) + 1.",objective:"Compute the output dimension height/width.",difficulty:"warmup",starterCode:`function getConv2dOutputDim(inputSize, kernelSize, padding, stride) {
  // TODO: calculate and return output size
  return 0;
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('conv same size', getConv2dOutputDim(32, 3, 1, 1), 32);
check('conv downsample', getConv2dOutputDim(32, 4, 0, 2), 15);
return results;`,hints:["Apply the formula: Math.floor((inputSize - kernelSize + 2 * padding) / stride) + 1."],solution:`function getConv2dOutputDim(inputSize, kernelSize, padding, stride) {
  return Math.floor((inputSize - kernelSize + 2 * padding) / stride) + 1;
}`,explanation:"Correct output dimensions are crucial to allocate the correct tensor shapes during a forward pass."},{id:"conv2d-dot-patch",stepLabel:"32.2",group:"One patch dot product",title:"Conv2D patch dot product",concept:"At each sliding window step, Conv2D multiplies kernel weights and input image patch coordinates element-wise and sums them.",objective:"Calculate the sum of element-wise products of a 2x2 image patch and kernel.",difficulty:"core",starterCode:`function conv2dPatchDot(patch, kernel) {
  let sum = 0;
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 2; c++) {
      // TODO: multiply patch[r][c] by kernel[r][c] and accumulate in sum
      sum += 0;
    }
  }
  return sum;
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('dot patch basic', conv2dPatchDot([[1, 2], [3, 4]], [[0.5, 0], [0, 0.5]]), 2.5); // 1*0.5 + 4*0.5 = 2.5
return results;`,hints:["Multiply patch[r][c] by kernel[r][c].","Add it to sum.","sum += patch[r][c] * kernel[r][c];"],solution:`function conv2dPatchDot(patch, kernel) {
  let sum = 0;
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 2; c++) {
      sum += patch[r][c] * kernel[r][c];
    }
  }
  return sum;
}`,explanation:"2D sliding window dot products extract translation-invariant spatial features from inputs."},{id:"max-pooling-2d-window",stepLabel:"33.1",group:"Window max",title:"Max pooling window selection",concept:"Max pooling downsamples representations by selecting the maximum value in local sliding windows (e.g. 2x2).",objective:"Return the maximum value in a 2x2 patch.",difficulty:"warmup",starterCode:`function getPatchMax(patch2x2) {
  // TODO: find the maximum value in the 2D array patch2x2
  return 0;
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('max positive', getPatchMax([[1, 5], [2, 3]]), 5);
check('max negative', getPatchMax([[-1, -5], [-2, -3]]), -1);
return results;`,hints:["Flatten the 2D array or check all elements manually.","Use Math.max(patch2x2[0][0], patch2x2[0][1], patch2x2[1][0], patch2x2[1][1])."],solution:`function getPatchMax(patch2x2) {
  return Math.max(patch2x2[0][0], patch2x2[0][1], patch2x2[1][0], patch2x2[1][1]);
}`,explanation:"Max pooling extracts the strongest activation from each window, ensuring model robustness to translation shifts."},{id:"conv-relu-activation",stepLabel:"34.1",group:"ReLU clip",title:"Conv + ReLU activation",concept:"A Conv + ReLU layer performs linear convolution and then clips all negative output coordinates to 0.",objective:"Apply the ReLU activation function: max(0, x).",difficulty:"warmup",starterCode:`function relu(x) {
  // TODO: return x if x is positive, otherwise 0
  return 0;
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('relu positive', relu(5), 5);
check('relu negative', relu(-10), 0);
return results;`,hints:["Use Math.max(0, x)."],solution:`function relu(x) {
  return Math.max(0, x);
}`,explanation:"ReLU introduces non-linear decision boundaries, enabling neural networks to model non-linear mappings."},{id:"init-he-std",stepLabel:"35.1",group:"He std",title:"He initialization standard deviation",concept:"He initialization (Kaiming init) scales random weights to prevent vanishing/exploding gradients in ReLU networks. Std = sqrt(2 / fanIn).",objective:"Compute the standard deviation for He initialization.",difficulty:"warmup",starterCode:`function getHeStd(fanIn) {
  // TODO: return standard deviation sqrt(2 / fanIn)
  return 0;
}`,testCode:`const results = [];
function approxEqual(a, b, tol = 1e-5) {
  return Math.abs(a - b) <= tol;
}
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('fanIn 512', getHeStd(512), 0.0625); // sqrt(2/512) = sqrt(1/256) = 1/16 = 0.0625
return results;`,hints:["Use Math.sqrt.","return Math.sqrt(2 / fanIn);"],solution:`function getHeStd(fanIn) {
  return Math.sqrt(2 / fanIn);
}`,explanation:"Scaling weights by He standard deviation maintains constant activation variance across layers."},{id:"vae-kl-loss-term",stepLabel:"36.1",group:"KL closed form",title:"VAE KL divergence term",concept:"Variational Autoencoders use a Kullback-Leibler (KL) divergence loss term to force latent vectors to fit a standard Normal distribution: KL = -0.5 * (1 + logvar - mu^2 - exp(logvar)).",objective:"Compute the KL loss contribution for a single latent dimension coordinate.",difficulty:"core",starterCode:`function vaeKlDivergence(mu, logvar) {
  // TODO: compute -0.5 * (1 + logvar - mu^2 - exp(logvar))
  return 0;
}`,testCode:`const results = [];
function approxEqual(a, b, tol = 1e-5) {
  return Math.abs(a - b) <= tol;
}
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('zero latent stats', vaeKlDivergence(0, 0), 0); // -0.5 * (1 + 0 - 0 - 1) = 0
check('skewed latent stats', vaeKlDivergence(1.0, -1.0), 0.6839397); // -0.5 * (1 - 1 - 1 - e^-1) = -0.5 * (-1 - 0.367879) = 0.683939
return results;`,hints:["Use Math.exp(logvar).","The formula is: -0.5 * (1 + logvar - mu * mu - Math.exp(logvar))."],solution:`function vaeKlDivergence(mu, logvar) {
  return -0.5 * (1 + logvar - mu * mu - Math.exp(logvar));
}`,explanation:"KL divergence acts as a regularizer, shaping the latent space into a continuous, smooth distribution suitable for generation."},{id:"multimodal-llm-project",stepLabel:"37.1",group:"Linear project",title:"Multimodal token projection",concept:"Multimodal LLMs project visual token embeddings into the text vocabulary hidden space using a learned projection matrix.",objective:"Compute projection: output[j] = sum of patch[d] * projector[d][j].",difficulty:"challenge",starterCode:`function projectPatch(patch, projector, outDim) {
  const projected = Array(outDim).fill(0);
  for (let j = 0; j < outDim; j++) {
    let sum = 0;
    for (let d = 0; d < patch.length; d++) {
      // TODO: multiply patch[d] by projector[d][j] and accumulate in sum
      sum += 0;
    }
    projected[j] = sum;
  }
  return projected;
}`,testCode:`const results = [];
function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual, expected) });
}
check('project 2D to 3D', projectPatch([1, 2], [[0.5, 0, 1], [0, 0.5, 2]], 3), [0.5, 1, 5]);
return results;`,hints:["Multiply patch[d] by projector[d][j].","sum += patch[d] * projector[d][j];"],solution:`function projectPatch(patch, projector, outDim) {
  const projected = Array(outDim).fill(0);
  for (let j = 0; j < outDim; j++) {
    let sum = 0;
    for (let d = 0; d < patch.length; d++) {
      sum += patch[d] * projector[d][j];
    }
    projected[j] = sum;
  }
  return projected;
}`,explanation:"A projection layer translates modality-specific embeddings so the baseline LLM transformer layers can process them."}],L=[{id:"transformer-token-embedding-lookup",stepLabel:"41.1",group:"Transformer mini-block shapes",title:"Token embedding lookup",concept:"A token ID selects one row from the embedding table.",objective:"Return embeddingTable[tokenId].",difficulty:"warmup",starterCode:`function lookupEmbedding(embeddingTable, tokenId) {
  // TODO: return the embedding vector for tokenId.
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

const E = [
  [1, 0],
  [0, 1],
  [2, 3],
];

check('token 0', lookupEmbedding(E, 0), [1, 0]);
check('token 1', lookupEmbedding(E, 1), [0, 1]);
check('token 2', lookupEmbedding(E, 2), [2, 3]);

return results;`,hints:["The embedding table is indexed by token ID.","Return the row at tokenId.","return embeddingTable[tokenId];"],solution:`function lookupEmbedding(embeddingTable, tokenId) {
  return embeddingTable[tokenId];
}`,explanation:"Token IDs become vectors by selecting rows from an embedding matrix."},{id:"transformer-add-position",stepLabel:"41.2",group:"Transformer mini-block shapes",title:"Add positional embedding",concept:"Token embeddings and position embeddings are added coordinate by coordinate.",objective:"Push tokenEmbedding[i] + positionEmbedding[i].",difficulty:"warmup",starterCode:`function addPosition(tokenEmbedding, positionEmbedding) {
  const result = [];

  for (let i = 0; i < tokenEmbedding.length; i++) {
    // TODO: add token and position coordinate.
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

check('add position', addPosition([1, 2], [10, 20]), [11, 22]);
check('zero position', addPosition([1, 2, 3], [0, 0, 0]), [1, 2, 3]);
check('negative position', addPosition([5, 5], [-1, 2]), [4, 7]);

return results;`,hints:["Embeddings have the same dimension.","Add coordinate by coordinate.","result.push(tokenEmbedding[i] + positionEmbedding[i]);"],solution:`function addPosition(tokenEmbedding, positionEmbedding) {
  const result = [];

  for (let i = 0; i < tokenEmbedding.length; i++) {
    result.push(tokenEmbedding[i] + positionEmbedding[i]);
  }

  return result;
}`,explanation:"Position information lets equal tokens behave differently at different sequence positions."},{id:"transformer-project-query",stepLabel:"41.3",group:"Transformer mini-block shapes",title:"Project to query vector",concept:"A query vector is a linear projection of the hidden state.",objective:"Return hidden times Wq using row dot products.",difficulty:"core",starterCode:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function project(hidden, weightColumns) {
  const output = [];

  for (let j = 0; j < weightColumns.length; j++) {
    // TODO: push dot(hidden, weightColumns[j]).
    output.push(0);
  }

  return output;
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

check('project hidden', project([1, 2], [[3, 4], [5, 6]]), [11, 17]);
check('identity projection', project([7, 8], [[1, 0], [0, 1]]), [7, 8]);

return results;`,hints:["Each output coordinate has its own weight column.","Use dot(hidden, weightColumns[j]).","output.push(dot(hidden, weightColumns[j]));"],solution:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function project(hidden, weightColumns) {
  const output = [];

  for (let j = 0; j < weightColumns.length; j++) {
    output.push(dot(hidden, weightColumns[j]));
  }

  return output;
}`,explanation:"Transformers create Q, K, and V vectors through learned linear projections."},{id:"transformer-attention-score-shape",stepLabel:"41.4",group:"Transformer mini-block shapes",title:"Attention score shape",concept:"Q times K transposed produces one score for every query token and key token pair.",objective:"Return [numQueries, numKeys].",difficulty:"core",starterCode:`function attentionScoreShape(Q, K) {
  const numQueries = Q.length;
  const numKeys = K.length;

  // TODO: return the shape of Q times K transposed.
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

check('3 queries 3 keys', attentionScoreShape([[1],[2],[3]], [[1],[2],[3]]), [3, 3]);
check('2 queries 4 keys', attentionScoreShape([[1],[2]], [[1],[2],[3],[4]]), [2, 4]);
check('1 query 5 keys', attentionScoreShape([[1]], [[1],[2],[3],[4],[5]]), [1, 5]);

return results;`,hints:["Rows come from queries.","Columns come from keys.","return [numQueries, numKeys];"],solution:`function attentionScoreShape(Q, K) {
  const numQueries = Q.length;
  const numKeys = K.length;

  return [numQueries, numKeys];
}`,explanation:"Attention score matrices grow with sequence length squared in full attention."},{id:"transformer-causal-mask-check",stepLabel:"41.5",group:"Transformer mini-block shapes",title:"Causal mask visibility",concept:"In causal attention, a query position can read only keys at the same or earlier positions.",objective:"Return true if keyPosition <= queryPosition.",difficulty:"core",starterCode:`function canAttendCausally(queryPosition, keyPosition) {
  // TODO: return whether query can see key.
  return false;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('same position visible', canAttendCausally(2, 2), true);
check('past visible', canAttendCausally(2, 0), true);
check('future hidden', canAttendCausally(2, 3), false);
check('first token cannot see second', canAttendCausally(0, 1), false);

return results;`,hints:["Causal attention blocks future keys.","A key is visible if keyPosition is less than or equal to queryPosition.","return keyPosition <= queryPosition;"],solution:`function canAttendCausally(queryPosition, keyPosition) {
  return keyPosition <= queryPosition;
}`,explanation:"Causal masking prevents next-token models from seeing future answers."},{id:"self-attention-one-query-scores",stepLabel:"42.1",group:"Mini self-attention",title:"Scores for one query",concept:"A query compares itself to every key using dot products.",objective:"Push dot(query, keys[i]) for every key.",difficulty:"core",starterCode:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function attentionScoresForQuery(query, keys) {
  const scores = [];

  for (let i = 0; i < keys.length; i++) {
    // TODO: push dot(query, keys[i]).
    scores.push(0);
  }

  return scores;
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

check('query against two keys', attentionScoresForQuery([1, 2], [[3, 4], [5, 6]]), [11, 17]);
check('orthogonal key', attentionScoresForQuery([1, 0], [[1, 0], [0, 1]]), [1, 0]);

return results;`,hints:["Each score is one dot product.","Compare the query with each key vector.","scores.push(dot(query, keys[i]));"],solution:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function attentionScoresForQuery(query, keys) {
  const scores = [];

  for (let i = 0; i < keys.length; i++) {
    scores.push(dot(query, keys[i]));
  }

  return scores;
}`,explanation:"Self-attention starts by asking how strongly this query matches each key."},{id:"self-attention-scale-scores",stepLabel:"42.2",group:"Mini self-attention",title:"Scale attention scores",concept:"Scaled dot-product attention divides scores by sqrt(d).",objective:"Divide every score by Math.sqrt(d).",difficulty:"core",starterCode:`function scaleScores(scores, d) {
  const scaled = [];

  for (let i = 0; i < scores.length; i++) {
    // TODO: push scores[i] divided by sqrt(d).
    scaled.push(scores[i]);
  }

  return scaled;
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

check('scale by sqrt 4', scaleScores([8, 4], 4), [4, 2]);
check('scale by sqrt 9', scaleScores([12, 3], 9), [4, 1]);
check('scale by sqrt 1', scaleScores([7, -2], 1), [7, -2]);

return results;`,hints:["Use Math.sqrt(d).","Each score gets divided by the same scale.","scaled.push(scores[i] / Math.sqrt(d));"],solution:`function scaleScores(scores, d) {
  const scaled = [];

  for (let i = 0; i < scores.length; i++) {
    scaled.push(scores[i] / Math.sqrt(d));
  }

  return scaled;
}`,explanation:"Scaling prevents large dot products from making softmax too sharp too early."},{id:"self-attention-causal-mask-scores",stepLabel:"42.3",group:"Mini self-attention",title:"Apply causal mask",concept:"Causal attention hides future positions by setting their scores to -Infinity.",objective:"Keep visible scores and mask future scores.",difficulty:"core",starterCode:`function applyCausalMask(scores, queryPosition) {
  const masked = [];

  for (let keyPosition = 0; keyPosition < scores.length; keyPosition++) {
    // TODO: keep scores[keyPosition] if keyPosition <= queryPosition, otherwise -Infinity.
    masked.push(scores[keyPosition]);
  }

  return masked;
}`,testCode:`const results = [];

function sameArraySpecial(a, b) {
  return a.length === b.length && a.every((value, index) => Object.is(value, b[index]));
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: sameArraySpecial(actual, expected),
  });
}

check('query at position 0', applyCausalMask([1, 2, 3], 0), [1, -Infinity, -Infinity]);
check('query at position 1', applyCausalMask([1, 2, 3], 1), [1, 2, -Infinity]);
check('query at position 2', applyCausalMask([1, 2, 3], 2), [1, 2, 3]);

return results;`,hints:["A token can attend to itself and the past.","Future key positions are greater than queryPosition.","masked.push(keyPosition <= queryPosition ? scores[keyPosition] : -Infinity);"],solution:`function applyCausalMask(scores, queryPosition) {
  const masked = [];

  for (let keyPosition = 0; keyPosition < scores.length; keyPosition++) {
    masked.push(keyPosition <= queryPosition ? scores[keyPosition] : -Infinity);
  }

  return masked;
}`,explanation:"Causal masking prevents next-token models from seeing future tokens."},{id:"self-attention-stable-softmax",stepLabel:"42.4",group:"Mini self-attention",title:"Stable softmax",concept:"Stable softmax subtracts the maximum score before exponentiating.",objective:"Use Math.exp(scores[i] - maxScore).",difficulty:"challenge",starterCode:`function stableSoftmax(scores) {
  const maxScore = Math.max(...scores);
  let denominator = 0;

  for (let i = 0; i < scores.length; i++) {
    // TODO: add exp(scores[i] - maxScore).
    denominator += 0;
  }

  const weights = [];
  for (let i = 0; i < scores.length; i++) {
    weights.push(Math.exp(scores[i] - maxScore) / denominator);
  }

  return weights;
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

check('two equal scores', stableSoftmax([0, 0]), [0.5, 0.5]);
check('log ratio', stableSoftmax([0, Math.log(3)]), [0.25, 0.75]);
check('large scores stay stable', stableSoftmax([1000, 1000]), [0.5, 0.5]);

return results;`,hints:["Subtracting maxScore does not change the softmax probabilities.","It prevents overflow for large scores.","denominator += Math.exp(scores[i] - maxScore);"],solution:`function stableSoftmax(scores) {
  const maxScore = Math.max(...scores);
  let denominator = 0;

  for (let i = 0; i < scores.length; i++) {
    denominator += Math.exp(scores[i] - maxScore);
  }

  const weights = [];
  for (let i = 0; i < scores.length; i++) {
    weights.push(Math.exp(scores[i] - maxScore) / denominator);
  }

  return weights;
}`,explanation:"Stable softmax is the same math, but safer numerically."},{id:"self-attention-weighted-value-sum",stepLabel:"42.5",group:"Mini self-attention",title:"Weighted value sum",concept:"Attention output is a weighted mixture of value vectors.",objective:"Add weights[token] * values[token][dim] into output[dim].",difficulty:"challenge",starterCode:`function weightedValueSum(weights, values) {
  const dimension = values[0].length;
  const output = Array(dimension).fill(0);

  for (let token = 0; token < values.length; token++) {
    for (let dim = 0; dim < dimension; dim++) {
      // TODO: add this token's weighted value coordinate.
      output[dim] += 0;
    }
  }

  return output;
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

check('choose first value', weightedValueSum([1, 0], [[3, 4], [10, 20]]), [3, 4]);
check('average two values', weightedValueSum([0.5, 0.5], [[2, 4], [6, 8]]), [4, 6]);
check('weighted mix', weightedValueSum([0.25, 0.75], [[0, 4], [8, 0]]), [6, 1]);

return results;`,hints:["Each value vector contributes according to its attention weight.","For each dimension, add weights[token] times values[token][dim].","output[dim] += weights[token] * values[token][dim];"],solution:`function weightedValueSum(weights, values) {
  const dimension = values[0].length;
  const output = Array(dimension).fill(0);

  for (let token = 0; token < values.length; token++) {
    for (let dim = 0; dim < dimension; dim++) {
      output[dim] += weights[token] * values[token][dim];
    }
  }

  return output;
}`,explanation:"Attention does not copy one token. It mixes value vectors using attention weights."},{id:"layernorm-feature-mean",stepLabel:"43.1",group:"LayerNorm and RMSNorm",title:"Feature mean",concept:"LayerNorm computes statistics across features of one token.",objective:"Return the average of the feature vector.",difficulty:"warmup",starterCode:`function featureMean(x) {
  let total = 0;

  for (let i = 0; i < x.length; i++) {
    total += x[i];
  }

  // TODO: return the average.
  return total;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('mean [1,2,3]', featureMean([1, 2, 3]), 2);
check('mean [10,20]', featureMean([10, 20]), 15);
check('mean [-1,1]', featureMean([-1, 1]), 0);

return results;`,hints:["Average is total divided by number of features.","The number of features is x.length.","return total / x.length;"],solution:`function featureMean(x) {
  let total = 0;

  for (let i = 0; i < x.length; i++) {
    total += x[i];
  }

  return total / x.length;
}`,explanation:"LayerNorm normalizes one token vector at a time, not a whole batch."},{id:"layernorm-feature-variance",stepLabel:"43.2",group:"LayerNorm and RMSNorm",title:"Feature variance",concept:"Variance measures average squared distance from the mean.",objective:"Add squared centered values.",difficulty:"core",starterCode:`function featureVariance(x) {
  const mean = x.reduce((total, value) => total + value, 0) / x.length;
  let total = 0;

  for (let i = 0; i < x.length; i++) {
    const centered = x[i] - mean;

    // TODO: add centered squared.
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

check('variance [1,2,3]', featureVariance([1, 2, 3]), 2 / 3);
check('variance [10,20]', featureVariance([10, 20]), 25);
check('variance constant', featureVariance([5, 5, 5]), 0);

return results;`,hints:["Variance uses squared centered values.","centered is already computed.","total += centered * centered;"],solution:`function featureVariance(x) {
  const mean = x.reduce((total, value) => total + value, 0) / x.length;
  let total = 0;

  for (let i = 0; i < x.length; i++) {
    const centered = x[i] - mean;
    total += centered * centered;
  }

  return total / x.length;
}`,explanation:"LayerNorm uses variance to rescale features to a stable range."},{id:"layernorm-normalize-vector",stepLabel:"43.3",group:"LayerNorm and RMSNorm",title:"Normalize one token vector",concept:"LayerNorm subtracts mean and divides by standard deviation.",objective:"Push (x[i] - mean) / sqrt(variance + eps).",difficulty:"challenge",starterCode:`function layerNormNoAffine(x, eps = 1e-5) {
  const mean = x.reduce((total, value) => total + value, 0) / x.length;
  const variance = x.reduce((total, value) => {
    const centered = value - mean;
    return total + centered * centered;
  }, 0) / x.length;

  const normalized = [];

  for (let i = 0; i < x.length; i++) {
    // TODO: push the normalized feature.
    normalized.push(0);
  }

  return normalized;
}`,testCode:`const results = [];

function approxArray(a, b, tolerance = 1e-5) {
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

check('normalize [1,2,3]', layerNormNoAffine([1, 2, 3], 0), [-1.224744871, 0, 1.224744871]);
check('normalize [10,20]', layerNormNoAffine([10, 20], 0), [-1, 1]);

return results;`,hints:["Standard deviation is Math.sqrt(variance + eps).","Subtract mean first, then divide by std.","normalized.push((x[i] - mean) / Math.sqrt(variance + eps));"],solution:`function layerNormNoAffine(x, eps = 1e-5) {
  const mean = x.reduce((total, value) => total + value, 0) / x.length;
  const variance = x.reduce((total, value) => {
    const centered = value - mean;
    return total + centered * centered;
  }, 0) / x.length;

  const normalized = [];

  for (let i = 0; i < x.length; i++) {
    normalized.push((x[i] - mean) / Math.sqrt(variance + eps));
  }

  return normalized;
}`,explanation:"LayerNorm stabilizes the scale of each token representation before the next transformation."},{id:"rmsnorm-denominator",stepLabel:"43.4",group:"LayerNorm and RMSNorm",title:"RMSNorm denominator",concept:"RMSNorm divides by root mean square without subtracting the mean.",objective:"Return sqrt(mean square + eps).",difficulty:"core",starterCode:`function rmsDenominator(x, eps = 1e-5) {
  let meanSquare = 0;

  for (let i = 0; i < x.length; i++) {
    meanSquare += x[i] * x[i];
  }

  meanSquare = meanSquare / x.length;

  // TODO: return root mean square denominator.
  return meanSquare;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('rms [3,4] eps 0', rmsDenominator([3, 4], 0), Math.sqrt(12.5));
check('rms [1,1] eps 0', rmsDenominator([1, 1], 0), 1);
check('rms [0,0] eps 1', rmsDenominator([0, 0], 1), 1);

return results;`,hints:["RMS means root mean square.","Use Math.sqrt(meanSquare + eps).","return Math.sqrt(meanSquare + eps);"],solution:`function rmsDenominator(x, eps = 1e-5) {
  let meanSquare = 0;

  for (let i = 0; i < x.length; i++) {
    meanSquare += x[i] * x[i];
  }

  meanSquare = meanSquare / x.length;

  return Math.sqrt(meanSquare + eps);
}`,explanation:"RMSNorm stabilizes scale without centering features."},{id:"residual-add-vector",stepLabel:"44.1",group:"Residual stream mechanics",title:"Add residual",concept:"A residual connection adds a block output back to the original stream.",objective:"Push x[i] + update[i].",difficulty:"warmup",starterCode:`function addResidual(x, update) {
  const result = [];

  for (let i = 0; i < x.length; i++) {
    // TODO: add original stream and update.
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

check('simple residual', addResidual([1, 2], [10, 20]), [11, 22]);
check('zero update', addResidual([1, 2, 3], [0, 0, 0]), [1, 2, 3]);
check('negative update', addResidual([5, 5], [-1, 2]), [4, 7]);

return results;`,hints:["Residual means original plus update.","Add coordinate by coordinate.","result.push(x[i] + update[i]);"],solution:`function addResidual(x, update) {
  const result = [];

  for (let i = 0; i < x.length; i++) {
    result.push(x[i] + update[i]);
  }

  return result;
}`,explanation:"Residual connections let each block write an update into the shared representation stream."},{id:"residual-scaled-update",stepLabel:"44.2",group:"Residual stream mechanics",title:"Scaled residual update",concept:"Sometimes updates are scaled before being added to the residual stream.",objective:"Push x[i] + scale * update[i].",difficulty:"core",starterCode:`function addScaledResidual(x, update, scale) {
  const result = [];

  for (let i = 0; i < x.length; i++) {
    // TODO: add scaled update to x.
    result.push(x[i]);
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

check('scale 0.5', addScaledResidual([1, 2], [10, 20], 0.5), [6, 12]);
check('scale 0', addScaledResidual([1, 2], [10, 20], 0), [1, 2]);
check('scale 1', addScaledResidual([1, 2], [10, 20], 1), [11, 22]);

return results;`,hints:["The update is multiplied by scale before adding.","Use x[i] + scale * update[i].","result.push(x[i] + scale * update[i]);"],solution:`function addScaledResidual(x, update, scale) {
  const result = [];

  for (let i = 0; i < x.length; i++) {
    result.push(x[i] + scale * update[i]);
  }

  return result;
}`,explanation:"Scaling residual updates can help control signal size in deep networks."},{id:"residual-prenorm-block",stepLabel:"44.3",group:"Residual stream mechanics",title:"Pre-norm residual block",concept:"A pre-norm block normalizes before the sublayer, then adds the sublayer output back to the stream.",objective:"Return x plus sublayer(normedX).",difficulty:"challenge",starterCode:`function addVectors(a, b) {
  return a.map((value, i) => value + b[i]);
}

function preNormBlock(x, normedX, sublayer) {
  const update = sublayer(normedX);

  // TODO: return residual stream after the update.
  return update;
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

check('identity update', preNormBlock([1, 2], [10, 20], (h) => [h[0], h[1]]), [11, 22]);
check('zero update', preNormBlock([1, 2], [10, 20], () => [0, 0]), [1, 2]);

return results;`,hints:["Residual block returns original x plus update.","update is already computed.","return addVectors(x, update);"],solution:`function addVectors(a, b) {
  return a.map((value, i) => value + b[i]);
}

function preNormBlock(x, normedX, sublayer) {
  const update = sublayer(normedX);
  return addVectors(x, update);
}`,explanation:"Pre-norm transformers normalize the stream before attention or MLP, then add the block output back."},{id:"swiglu-silu",stepLabel:"45.1",group:"MLP and SwiGLU",title:"SiLU activation",concept:"SiLU is x * sigmoid(x), used inside SwiGLU-style MLPs.",objective:"Return x * sigmoid(x).",difficulty:"core",starterCode:`function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

function silu(x) {
  // TODO: return x times sigmoid(x).
  return x;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('silu 0', silu(0), 0);
check('silu log 3', silu(Math.log(3)), Math.log(3) * 0.75);
check('silu -log 3', silu(-Math.log(3)), -Math.log(3) * 0.25);

return results;`,hints:["SiLU gates x by sigmoid(x).","sigmoid(x) is already available.","return x * sigmoid(x);"],solution:`function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

function silu(x) {
  return x * sigmoid(x);
}`,explanation:"SiLU is a smooth gate: positive values mostly pass, negative values are softened."},{id:"swiglu-elementwise-gate",stepLabel:"45.2",group:"MLP and SwiGLU",title:"Elementwise gate",concept:"Gated MLPs multiply one hidden stream by another gate stream element by element.",objective:"Push values[i] * gates[i].",difficulty:"warmup",starterCode:`function elementwiseGate(values, gates) {
  const output = [];

  for (let i = 0; i < values.length; i++) {
    // TODO: multiply matching entries.
    output.push(values[i]);
  }

  return output;
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

check('simple gate', elementwiseGate([1, 2, 3], [10, 0, 2]), [10, 0, 6]);
check('all keep', elementwiseGate([1, 2], [1, 1]), [1, 2]);
check('all block', elementwiseGate([1, 2], [0, 0]), [0, 0]);

return results;`,hints:["This is elementwise multiplication.","Use values[i] * gates[i].","output.push(values[i] * gates[i]);"],solution:`function elementwiseGate(values, gates) {
  const output = [];

  for (let i = 0; i < values.length; i++) {
    output.push(values[i] * gates[i]);
  }

  return output;
}`,explanation:"Gating lets one stream decide how much of another stream passes through."},{id:"swiglu-hidden",stepLabel:"45.3",group:"MLP and SwiGLU",title:"SwiGLU hidden activation",concept:"SwiGLU combines a value stream with a SiLU-activated gate stream.",objective:"Push value[i] * silu(gate[i]).",difficulty:"challenge",starterCode:`function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

function silu(x) {
  return x * sigmoid(x);
}

function swigluHidden(values, gates) {
  const output = [];

  for (let i = 0; i < values.length; i++) {
    // TODO: multiply values[i] by silu(gates[i]).
    output.push(0);
  }

  return output;
}`,testCode:`const results = [];

function approxArray(a, b, tolerance = 1e-9) {
  return a.length === b.length && a.every((value, index) => Math.abs(value - b[index]) <= tolerance);
}

function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

function siluRef(x) {
  return x * sigmoid(x);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: approxArray(actual, expected),
  });
}

check('swiglu simple', swigluHidden([2, 3], [0, Math.log(3)]), [0, 3 * siluRef(Math.log(3))]);
check('zero values', swigluHidden([0, 0], [10, 10]), [0, 0]);

return results;`,hints:["Apply SiLU to the gate stream.","Then multiply by the value stream.","output.push(values[i] * silu(gates[i]));"],solution:`function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

function silu(x) {
  return x * sigmoid(x);
}

function swigluHidden(values, gates) {
  const output = [];

  for (let i = 0; i < values.length; i++) {
    output.push(values[i] * silu(gates[i]));
  }

  return output;
}`,explanation:"SwiGLU is a modern gated MLP pattern used in many transformer variants."},{id:"mlp-output-projection",stepLabel:"45.4",group:"MLP and SwiGLU",title:"MLP output projection",concept:"After hidden activation, an MLP projects back to the model dimension.",objective:"Return denseLayer(hidden, outputWeights, outputBiases).",difficulty:"core",starterCode:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function denseLayer(x, weightColumns, biases) {
  return weightColumns.map((weights, j) => dot(x, weights) + biases[j]);
}

function mlpOutput(hidden, outputWeights, outputBiases) {
  // TODO: project hidden back to output dimension.
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

check('project hidden to 2 outputs', mlpOutput([1, 2], [[3, 4], [5, 6]], [0, 1]), [11, 18]);
check('identity projection', mlpOutput([7, 8], [[1, 0], [0, 1]], [0, 0]), [7, 8]);

return results;`,hints:["The helper denseLayer is already available.","Use hidden as the input vector.","return denseLayer(hidden, outputWeights, outputBiases);"],solution:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function denseLayer(x, weightColumns, biases) {
  return weightColumns.map((weights, j) => dot(x, weights) + biases[j]);
}

function mlpOutput(hidden, outputWeights, outputBiases) {
  return denseLayer(hidden, outputWeights, outputBiases);
}`,explanation:"Transformer MLPs expand, activate or gate, then project back into the residual stream dimension."},{id:"transformer-attention-residual-update",stepLabel:"46.1",group:"Tiny transformer block",title:"Attention residual update",concept:"The attention sublayer writes an update into the residual stream.",objective:"Return x + attentionOutput.",difficulty:"warmup",starterCode:`function addVectors(a, b) {
  return a.map((value, i) => value + b[i]);
}

function attentionResidual(x, attentionOutput) {
  // TODO: return residual stream after attention.
  return attentionOutput;
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

check('attention update', attentionResidual([1, 2], [10, 20]), [11, 22]);
check('zero update', attentionResidual([1, 2], [0, 0]), [1, 2]);

return results;`,hints:["Residual means original stream plus update.","Use addVectors.","return addVectors(x, attentionOutput);"],solution:`function addVectors(a, b) {
  return a.map((value, i) => value + b[i]);
}

function attentionResidual(x, attentionOutput) {
  return addVectors(x, attentionOutput);
}`,explanation:"Attention reads from the sequence and writes an update back into each token residual stream."},{id:"transformer-mlp-residual-update",stepLabel:"46.2",group:"Tiny transformer block",title:"MLP residual update",concept:"After attention, the MLP sublayer also writes into the residual stream.",objective:"Return streamAfterAttention + mlpOutput.",difficulty:"warmup",starterCode:`function addVectors(a, b) {
  return a.map((value, i) => value + b[i]);
}

function mlpResidual(streamAfterAttention, mlpOutput) {
  // TODO: return residual stream after MLP.
  return mlpOutput;
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

check('mlp update', mlpResidual([11, 22], [3, 4]), [14, 26]);
check('zero update', mlpResidual([11, 22], [0, 0]), [11, 22]);

return results;`,hints:["The MLP update is added to the current stream.","Use addVectors.","return addVectors(streamAfterAttention, mlpOutput);"],solution:`function addVectors(a, b) {
  return a.map((value, i) => value + b[i]);
}

function mlpResidual(streamAfterAttention, mlpOutput) {
  return addVectors(streamAfterAttention, mlpOutput);
}`,explanation:"Transformer blocks usually contain two residual writes: attention, then MLP."},{id:"transformer-prenorm-block-forward",stepLabel:"46.3",group:"Tiny transformer block",title:"Pre-norm transformer block",concept:"A pre-norm transformer block normalizes before attention and before MLP.",objective:"Return x + attention(norm1(x)) + mlp(norm2(afterAttention)).",difficulty:"challenge",starterCode:`function addVectors(a, b) {
  return a.map((value, i) => value + b[i]);
}

function tinyPreNormBlock(x, norm1, attention, norm2, mlp) {
  const attentionInput = norm1(x);
  const attentionOutput = attention(attentionInput);
  const afterAttention = addVectors(x, attentionOutput);

  const mlpInput = norm2(afterAttention);
  const mlpOutput = mlp(mlpInput);

  // TODO: return afterAttention plus mlpOutput.
  return mlpOutput;
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

check('simple block', tinyPreNormBlock([1, 2], (x) => x, () => [10, 20], (x) => x, () => [3, 4]), [14, 26]);
check('zero updates', tinyPreNormBlock([1, 2], (x) => x, () => [0, 0], (x) => x, () => [0, 0]), [1, 2]);

return results;`,hints:["afterAttention is already x plus attention output.","The final step adds mlpOutput to afterAttention.","return addVectors(afterAttention, mlpOutput);"],solution:`function addVectors(a, b) {
  return a.map((value, i) => value + b[i]);
}

function tinyPreNormBlock(x, norm1, attention, norm2, mlp) {
  const attentionInput = norm1(x);
  const attentionOutput = attention(attentionInput);
  const afterAttention = addVectors(x, attentionOutput);

  const mlpInput = norm2(afterAttention);
  const mlpOutput = mlp(mlpInput);

  return addVectors(afterAttention, mlpOutput);
}`,explanation:"This is the transformer-block skeleton: normalize, attention, residual, normalize, MLP, residual."},{id:"transformer-stack-two-blocks",stepLabel:"46.4",group:"Tiny transformer block",title:"Stack two blocks",concept:"Transformer depth comes from feeding one block output into the next block.",objective:"Return block2(block1(x)).",difficulty:"core",starterCode:`function stackTwoBlocks(x, block1, block2) {
  const afterBlock1 = block1(x);

  // TODO: feed afterBlock1 into block2.
  return afterBlock1;
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

check('two additive blocks', stackTwoBlocks([1, 2], (x) => x.map((v) => v + 10), (x) => x.map((v) => v * 2)), [22, 24]);
check('identity then shift', stackTwoBlocks([1, 2], (x) => x, (x) => x.map((v) => v + 1)), [2, 3]);

return results;`,hints:["Depth means sequential composition.","block2 receives the output of block1.","return block2(afterBlock1);"],solution:`function stackTwoBlocks(x, block1, block2) {
  const afterBlock1 = block1(x);
  return block2(afterBlock1);
}`,explanation:"Deep transformers repeatedly update the residual stream through many blocks."},{id:"debug-attention-weights-sum",stepLabel:"47.1",group:"Transformer debugging checks",title:"Attention weights sum to one",concept:"Softmax attention weights should sum to 1.",objective:"Return the sum of weights.",difficulty:"warmup",starterCode:`function sumWeights(weights) {
  let total = 0;

  for (let i = 0; i < weights.length; i++) {
    // TODO: add each weight.
    total += 0;
  }

  return total;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('two weights', sumWeights([0.5, 0.5]), 1);
check('three weights', sumWeights([0.2, 0.3, 0.5]), 1);
check('one weight', sumWeights([1]), 1);

return results;`,hints:["Loop over all weights.","Add weights[i] into total.","total += weights[i];"],solution:`function sumWeights(weights) {
  let total = 0;

  for (let i = 0; i < weights.length; i++) {
    total += weights[i];
  }

  return total;
}`,explanation:"If attention weights do not sum to one, the softmax or mask logic is likely broken."},{id:"debug-causal-leak",stepLabel:"47.2",group:"Transformer debugging checks",title:"Detect future attention leak",concept:"A causal mask fails if any query attends to a future key.",objective:"Return true if keyPosition is greater than queryPosition.",difficulty:"core",starterCode:`function isFutureLeak(queryPosition, keyPosition) {
  // TODO: return true when key is in the future.
  return false;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('past is not leak', isFutureLeak(3, 1), false);
check('same position is not leak', isFutureLeak(3, 3), false);
check('future is leak', isFutureLeak(3, 4), true);
check('first query cannot see second key', isFutureLeak(0, 1), true);

return results;`,hints:["Future means keyPosition is greater than queryPosition.","Same position is allowed in causal attention.","return keyPosition > queryPosition;"],solution:`function isFutureLeak(queryPosition, keyPosition) {
  return keyPosition > queryPosition;
}`,explanation:"Future leakage lets next-token models cheat during training."},{id:"debug-residual-norm-explosion",stepLabel:"47.3",group:"Transformer debugging checks",title:"Detect residual norm explosion",concept:"Very large residual norms can indicate unstable updates.",objective:"Return true when norm exceeds threshold.",difficulty:"core",starterCode:`function norm(v) {
  let total = 0;
  for (let i = 0; i < v.length; i++) {
    total += v[i] * v[i];
  }
  return Math.sqrt(total);
}

function residualNormTooLarge(stream, threshold) {
  // TODO: return whether norm(stream) is greater than threshold.
  return false;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('small stream', residualNormTooLarge([3, 4], 10), false);
check('large stream', residualNormTooLarge([30, 40], 10), true);
check('equal threshold is not greater', residualNormTooLarge([3, 4], 5), false);

return results;`,hints:["Use the norm helper.","Compare norm(stream) with threshold.","return norm(stream) > threshold;"],solution:`function norm(v) {
  let total = 0;
  for (let i = 0; i < v.length; i++) {
    total += v[i] * v[i];
  }
  return Math.sqrt(total);
}

function residualNormTooLarge(stream, threshold) {
  return norm(stream) > threshold;
}`,explanation:"Monitoring residual stream norms can help diagnose instability in deep networks."},{id:"debug-attention-shape-mismatch",stepLabel:"47.4",group:"Transformer debugging checks",title:"Detect Q/K dimension mismatch",concept:"Queries and keys must have the same feature dimension for dot products.",objective:"Return whether queryDim equals keyDim.",difficulty:"core",starterCode:`function attentionDimsCompatible(query, key) {
  const queryDim = query.length;
  const keyDim = key.length;

  // TODO: return whether dimensions match.
  return false;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('same dimension', attentionDimsCompatible([1, 2], [3, 4]), true);
check('different dimension', attentionDimsCompatible([1, 2, 3], [4, 5]), false);
check('one-dimensional same', attentionDimsCompatible([1], [2]), true);

return results;`,hints:["Dot products require matching lengths.","Compare queryDim and keyDim.","return queryDim === keyDim;"],solution:`function attentionDimsCompatible(query, key) {
  const queryDim = query.length;
  const keyDim = key.length;

  return queryDim === keyDim;
}`,explanation:"Many transformer bugs are shape bugs: Q and K must line up for similarity scores."},{id:"rope-rotate-2d",stepLabel:"4.1",group:"Rotate 2D block",title:"Rotate 2D vector",concept:"Rotary Position Embeddings (RoPE) rotate pairs of dimensions in query/key vectors by an angle representing the position.",objective:"Implement 2D rotation: [x0 * cos - x1 * sin, x0 * sin + x1 * cos].",difficulty:"warmup",starterCode:`function rotate2d(x0, x1, cos, sin) {
  // TODO: return the 2D rotated vector array [newX0, newX1]
  return [];
}`,testCode:`const results = [];
function approxArray(a, b, tol = 1e-5) {
  return a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) <= tol);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: approxArray(actual, expected) });
}
check('rotate 0', rotate2d(1, 0, 0, 1), [0, 1]); // theta = pi/2
check('rotate identity', rotate2d(1, 2, 1, 0), [1, 2]); // theta = 0
return results;`,hints:["The first coordinate is x0 * cos - x1 * sin.","The second coordinate is x0 * sin + x1 * cos.","return [x0 * cos - x1 * sin, x0 * sin + x1 * cos];"],solution:`function rotate2d(x0, x1, cos, sin) {
  return [x0 * cos - x1 * sin, x0 * sin + x1 * cos];
}`,explanation:"Rotating in 2D pairs is the fundamental building block of Rotary Embeddings."},{id:"rope-apply-head",stepLabel:"4.2",group:"Apply to head dimension",title:"Apply RoPE to head",concept:"RoPE divides the query/key vector into 2D chunks, rotating each chunk with its specific cosine/sine frequencies.",objective:"Rotate each 2D chunk of the head vector using cos[i] and sin[i].",difficulty:"core",starterCode:`function applyRoPE(x, cos, sin) {
  const rotated = [];
  for (let i = 0; i < x.length; i += 2) {
    const x0 = x[i];
    const x1 = x[i+1];
    const c = cos[i/2];
    const s = sin[i/2];
    // TODO: compute rotated elements and push them to rotated array
    rotated.push(0, 0);
  }
  return rotated;
}`,testCode:`const results = [];
function approxArray(a, b, tol = 1e-5) {
  return a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) <= tol);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: approxArray(actual, expected) });
}
check('apply rope 4D', applyRoPE([1, 0, 0, 1], [0, 1], [1, 0]), [0, 1, 0, 1]);
return results;`,hints:["The rotated coordinates for chunk i/2 are: x0 * c - x1 * s and x0 * s + x1 * c.","Push those two coordinates instead of the placeholders.","rotated[i] = x0 * c - x1 * s; rotated[i+1] = x0 * s + x1 * c;"],solution:`function applyRoPE(x, cos, sin) {
  const rotated = [];
  for (let i = 0; i < x.length; i += 2) {
    const x0 = x[i];
    const x1 = x[i+1];
    const c = cos[i/2];
    const s = sin[i/2];
    rotated.push(x0 * c - x1 * s, x0 * s + x1 * c);
  }
  return rotated;
}`,explanation:"RoPE applies different rotation angles to different frequency channels, encoding absolute positions as relative rotation differences."},{id:"transformer-ffn-dim",stepLabel:"5.1",group:"FFN expansion ratio",title:"FFN intermediate dimension",concept:"Modern transformer architectures use different FFN intermediate dimension scales. For SwiGLU, it is typically round(8/3 * d), whereas standard MLP uses 4 * d.",objective:"Calculate the FFN hidden dimension. For swiglu, it is Math.round(expansionRatio * d_model * 2/3), otherwise expansionRatio * d_model.",difficulty:"warmup",starterCode:`function getFFNIntermediateDim(dModel, expansionRatio, isSwiGLU) {
  // TODO: return the intermediate dimension of the FFN block
  return 0;
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('standard ffn', getFFNIntermediateDim(4096, 4, false), 16384);
check('swiglu ffn', getFFNIntermediateDim(4096, 4, true), 10923);
return results;`,hints:["If isSwiGLU is true, multiply dModel * expansionRatio * 2 / 3 and round.","Otherwise, multiply dModel * expansionRatio.","return isSwiGLU ? Math.round(dModel * expansionRatio * 2 / 3) : dModel * expansionRatio;"],solution:`function getFFNIntermediateDim(dModel, expansionRatio, isSwiGLU) {
  return isSwiGLU ? Math.round(dModel * expansionRatio * 2 / 3) : dModel * expansionRatio;
}`,explanation:"SwiGLU uses three weight matrices (gate, up, and down projections) compared to MLPs two, so its intermediate dimension is scaled down by 2/3 to keep parameter counts comparable."},{id:"transformer-block-params",stepLabel:"5.2",group:"Parameter estimate",title:"Estimate block parameter count",concept:"A single standard transformer block contains parameters in the self-attention projections (Q, K, V, Out) and the FFN linear layers.",objective:"Compute total weight parameters in attention (4 * dModel^2) and FFN (2 * dModel * dFFN).",difficulty:"core",starterCode:`function estimateBlockParams(dModel, dFFN) {
  const attnParams = 4 * dModel * dModel;
  // TODO: compute FFN parameters (2 * dModel * dFFN) and return the total
  const ffnParams = 0;
  return attnParams + ffnParams;
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('estimate llama 7b size block', estimateBlockParams(4096, 11008), 157286400);
return results;`,hints:["The FFN has an up-projection/gate (dModel -> dFFN) and a down-projection (dFFN -> dModel).","For standard MLP, the parameters are 2 * dModel * dFFN.","const ffnParams = 2 * dModel * dFFN;"],solution:`function estimateBlockParams(dModel, dFFN) {
  const attnParams = 4 * dModel * dModel;
  const ffnParams = 2 * dModel * dFFN;
  return attnParams + ffnParams;
}`,explanation:"Self-attention and FFN projections constitute the vast majority of parameters in a transformer block."},{id:"coconut-latent-residual",stepLabel:"6.1",group:"Latent residual add",title:"Latent residual addition",concept:"Coconut (Chain of Continuous Thought) updates sequence representations in the hidden latent space by adding latent thought vectors.",objective:"Add the thought vector to the hidden vector element-wise.",difficulty:"warmup",starterCode:`function latentResidualAdd(hidden, thought) {
  const result = [];
  for (let i = 0; i < hidden.length; i++) {
    // TODO: add hidden[i] and thought[i]
    result.push(0);
  }
  return result;
}`,testCode:`const results = [];
function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual, expected) });
}
check('residual add', latentResidualAdd([1, 2], [10, 20]), [11, 22]);
return results;`,hints:["Add hidden[i] and thought[i].","Push that sum to the result array."],solution:`function latentResidualAdd(hidden, thought) {
  const result = [];
  for (let i = 0; i < hidden.length; i++) {
    result.push(hidden[i] + thought[i]);
  }
  return result;
}`,explanation:"Latent thought updates behave similarly to residual connections, shifting hidden representations without losing past context."},{id:"coconut-latent-gate",stepLabel:"6.2",group:"Gate blend",title:"Gated latent blend",concept:"Latent steps are often gated so the model can dynamically control how much new reasoning to inject into the state.",objective:"Compute the gated blend: output = (1 - g) * hidden + g * thought.",difficulty:"core",starterCode:`function gatedLatentBlend(hidden, thought, gate) {
  const result = [];
  for (let i = 0; i < hidden.length; i++) {
    // TODO: compute gated blend coordinate
    const val = 0;
    result.push(val);
  }
  return result;
}`,testCode:`const results = [];
function approxArray(a, b, tol = 1e-5) {
  return a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) <= tol);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: approxArray(actual, expected) });
}
check('gate 0.5', gatedLatentBlend([2, 4], [10, 20], 0.5), [6, 12]);
check('gate 0.1', gatedLatentBlend([2, 4], [10, 20], 0.1), [2.8, 5.6]);
return results;`,hints:["Use the formula: (1 - gate) * hidden[i] + gate * thought[i].","Store this in val."],solution:`function gatedLatentBlend(hidden, thought, gate) {
  const result = [];
  for (let i = 0; i < hidden.length; i++) {
    const val = (1 - gate) * hidden[i] + gate * thought[i];
    result.push(val);
  }
  return result;
}`,explanation:"Gating lets the model pass the original representations unmodified if no immediate continuous thinking is required."},{id:"gqa-group-index",stepLabel:"7.1",group:"KV head index",title:"GQA KV head indexing",concept:"Grouped-Query Attention maps query heads to shared KV heads. If we have Hq query heads and Hkv key-value heads, head Q corresponds to KV head Q / (Hq / Hkv).",objective:"Return the index of the KV head corresponding to queryHeadIndex.",difficulty:"warmup",starterCode:`function getKVHeadIndex(queryHeadIndex, numQueryHeads, numKVHeads) {
  const groupSize = numQueryHeads / numKVHeads;
  // TODO: return the index of the key-value head for queryHeadIndex
  return 0;
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('GQA 8 heads to 2 KV', getKVHeadIndex(5, 8, 2), 1);
check('GQA 8 heads to 8 KV (MHA)', getKVHeadIndex(5, 8, 8), 5);
check('GQA 8 heads to 1 KV (MQA)', getKVHeadIndex(7, 8, 1), 0);
return results;`,hints:["Divide queryHeadIndex by groupSize.","Take the floor of the result using Math.floor.","return Math.floor(queryHeadIndex / groupSize);"],solution:`function getKVHeadIndex(queryHeadIndex, numQueryHeads, numKVHeads) {
  const groupSize = numQueryHeads / numKVHeads;
  return Math.floor(queryHeadIndex / groupSize);
}`,explanation:"Dividing query heads into chunks allows sharing KV heads, reducing KV cache size and memory traffic during generation."},{id:"gqa-expand-kv",stepLabel:"7.2",group:"Repeat/broadcast rule",title:"GQA KV expansion",concept:"During computation, GQA repeats Key/Value states so that their heads match the number of Query heads.",objective:"Repeat Key/Value vectors along the head dimension for a single token.",difficulty:"core",starterCode:`function expandKV(kvHeads, numQueryHeads, numKVHeads) {
  const groupSize = numQueryHeads / numKVHeads;
  const expanded = [];
  
  for (let q = 0; q < numQueryHeads; q++) {
    // TODO: find the correct KV head index and push it to expanded
    const kvIdx = 0;
    expanded.push(kvHeads[kvIdx]);
  }
  
  return expanded;
}`,testCode:`const results = [];
function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual, expected) });
}
const kv = [[1, 2], [3, 4]]; // 2 KV heads
check('GQA repeat 4 query heads', expandKV(kv, 4, 2), [[1, 2], [1, 2], [3, 4], [3, 4]]);
return results;`,hints:["KV head index is Math.floor(q / groupSize).","Set kvIdx to this computed index."],solution:`function expandKV(kvHeads, numQueryHeads, numKVHeads) {
  const groupSize = numQueryHeads / numKVHeads;
  const expanded = [];
  
  for (let q = 0; q < numQueryHeads; q++) {
    const kvIdx = Math.floor(q / groupSize);
    expanded.push(kvHeads[kvIdx]);
  }
  
  return expanded;
}`,explanation:"Repeating KV heads aligns vectors shape-wise so standard multi-head dot product attention can proceed."},{id:"kv-cache-append-step",stepLabel:"8.1",group:"Cache append",title:"KV Cache Append Step",concept:"Autoregressive decoding appends each new token Key and Value projection to persistent caches so past tokens are never recomputed.",objective:"Inside decodeKVCacheStep, append the projected k and v vectors to keyCache and valueCache.",difficulty:"warmup",starterCode:`/**
 * Runs one autoregressive decode step: project x to Q/K/V, append to cache, attend over history.
 * @param {number[]} x - Current token embedding of size dModel.
 * @param {number[][]} Wq - Query weights [headDim, dModel].
 * @param {number[][]} Wk - Key weights [headDim, dModel].
 * @param {number[][]} Wv - Value weights [headDim, dModel].
 * @param {number[][]} keyCache - Historical keys updated in place.
 * @param {number[][]} valueCache - Historical values updated in place.
 * @returns {number[]} Attention output vector of size headDim.
 */
function decodeKVCacheStep(x, Wq, Wk, Wv, keyCache, valueCache) {
  const dModel = x.length;
  const headDim = Wq.length;
  const q = Array(headDim).fill(0);
  const k = Array(headDim).fill(0);
  const v = Array(headDim).fill(0);

  for (let i = 0; i < headDim; i++) {
    for (let j = 0; j < dModel; j++) {
      q[i] += Wq[i][j] * x[j];
      k[i] += Wk[i][j] * x[j];
      v[i] += Wv[i][j] * x[j];
    }
  }

  // TODO: append k to keyCache and v to valueCache.

  const n = keyCache.length;
  const scale = 1 / Math.sqrt(headDim);
  const output = Array(headDim).fill(0);
  if (n === 0) return output;

  const scores = [];
  for (let j = 0; j < n; j++) {
    let dot = 0;
    for (let m = 0; m < headDim; m++) {
      dot += q[m] * keyCache[j][m];
    }
    scores.push(dot * scale);
  }

  const maxScore = Math.max(...scores);
  const exps = scores.map((s) => Math.exp(s - maxScore));
  const sumExp = exps.reduce((sum, val) => sum + val, 0);
  const weights = exps.map((e) => e / sumExp);

  for (let j = 0; j < n; j++) {
    for (let m = 0; m < headDim; m++) {
      output[m] += weights[j] * valueCache[j][m];
    }
  }

  return output;
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
const x = [1, 0];
const W = [[1, 0], [0, 1]];
const kC = [];
const vC = [];
decodeKVCacheStep(x, W, W, W, kC, vC);
check('cache length after append', kC.length, 1);
check('key stored', JSON.stringify(kC[0]), JSON.stringify([1, 0]));
check('value stored', JSON.stringify(vC[0]), JSON.stringify([1, 0]));
return results;`,hints:["Use keyCache.push(k) after projection.","Use valueCache.push(v) as well.","The attention code below reads the updated cache length."],solution:`/**
 * Runs one autoregressive decode step: project x to Q/K/V, append to cache, attend over history.
 * @param {number[]} x - Current token embedding of size dModel.
 * @param {number[][]} Wq - Query weights [headDim, dModel].
 * @param {number[][]} Wk - Key weights [headDim, dModel].
 * @param {number[][]} Wv - Value weights [headDim, dModel].
 * @param {number[][]} keyCache - Historical keys updated in place.
 * @param {number[][]} valueCache - Historical values updated in place.
 * @returns {number[]} Attention output vector of size headDim.
 */
function decodeKVCacheStep(x, Wq, Wk, Wv, keyCache, valueCache) {
  const dModel = x.length;
  const headDim = Wq.length;
  const q = Array(headDim).fill(0);
  const k = Array(headDim).fill(0);
  const v = Array(headDim).fill(0);

  for (let i = 0; i < headDim; i++) {
    for (let j = 0; j < dModel; j++) {
      q[i] += Wq[i][j] * x[j];
      k[i] += Wk[i][j] * x[j];
      v[i] += Wv[i][j] * x[j];
    }
  }

  keyCache.push(k);
  valueCache.push(v);

  const n = keyCache.length;
  const scale = 1 / Math.sqrt(headDim);
  const output = Array(headDim).fill(0);
  if (n === 0) return output;

  const scores = [];
  for (let j = 0; j < n; j++) {
    let dot = 0;
    for (let m = 0; m < headDim; m++) {
      dot += q[m] * keyCache[j][m];
    }
    scores.push(dot * scale);
  }

  const maxScore = Math.max(...scores);
  const exps = scores.map((s) => Math.exp(s - maxScore));
  const sumExp = exps.reduce((sum, val) => sum + val, 0);
  const weights = exps.map((e) => e / sumExp);

  for (let j = 0; j < n; j++) {
    for (let m = 0; m < headDim; m++) {
      output[m] += weights[j] * valueCache[j][m];
    }
  }

  return output;
}`,explanation:"Caching keys and values is what makes autoregressive generation linear in history instead of quadratic."},{id:"kv-cache-slicing",stepLabel:"8.2",group:"Sequence slicing",title:"Scaled Dot-Product Attention Scale",concept:"Scaled dot-product attention divides logits by sqrt(headDim) so dot products stay well-conditioned as head size grows.",objective:"Inside decodeKVCacheStep, compute scale = 1 / Math.sqrt(headDim) before building attention scores.",difficulty:"core",starterCode:`/**
 * Runs one autoregressive decode step: project x to Q/K/V, append to cache, attend over history.
 * @param {number[]} x - Current token embedding of size dModel.
 * @param {number[][]} Wq - Query weights [headDim, dModel].
 * @param {number[][]} Wk - Key weights [headDim, dModel].
 * @param {number[][]} Wv - Value weights [headDim, dModel].
 * @param {number[][]} keyCache - Historical keys updated in place.
 * @param {number[][]} valueCache - Historical values updated in place.
 * @returns {number[]} Attention output vector of size headDim.
 */
function decodeKVCacheStep(x, Wq, Wk, Wv, keyCache, valueCache) {
  const dModel = x.length;
  const headDim = Wq.length;
  const q = Array(headDim).fill(0);
  const k = Array(headDim).fill(0);
  const v = Array(headDim).fill(0);

  for (let i = 0; i < headDim; i++) {
    for (let j = 0; j < dModel; j++) {
      q[i] += Wq[i][j] * x[j];
      k[i] += Wk[i][j] * x[j];
      v[i] += Wv[i][j] * x[j];
    }
  }

  keyCache.push(k);
  valueCache.push(v);

  const n = keyCache.length;
  let scale = 0;
  // TODO: set scale to 1 / Math.sqrt(headDim).

  const output = Array(headDim).fill(0);
  if (n === 0) return output;

  const scores = [];
  for (let j = 0; j < n; j++) {
    let dot = 0;
    for (let m = 0; m < headDim; m++) {
      dot += q[m] * keyCache[j][m];
    }
    scores.push(dot * scale);
  }

  const maxScore = Math.max(...scores);
  const exps = scores.map((s) => Math.exp(s - maxScore));
  const sumExp = exps.reduce((sum, val) => sum + val, 0);
  const weights = exps.map((e) => e / sumExp);

  for (let j = 0; j < n; j++) {
    for (let m = 0; m < headDim; m++) {
      output[m] += weights[j] * valueCache[j][m];
    }
  }

  return output;
}`,testCode:`const results = [];
function approxEqual(a, b, tol = 1e-4) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const x = [1, 0];
const W = [[1, 0], [0, 1]];
const out = decodeKVCacheStep(x, W, W, W, [[0, 1]], [[5, 5]]);
check('scale affects softmax blend', out[0], 2.320954);
return results;`,hints:["Use Math.sqrt(headDim) in the denominator.","scale = 1 / Math.sqrt(headDim).","Multiply each raw dot product by scale when building scores."],solution:`/**
 * Runs one autoregressive decode step: project x to Q/K/V, append to cache, attend over history.
 * @param {number[]} x - Current token embedding of size dModel.
 * @param {number[][]} Wq - Query weights [headDim, dModel].
 * @param {number[][]} Wk - Key weights [headDim, dModel].
 * @param {number[][]} Wv - Value weights [headDim, dModel].
 * @param {number[][]} keyCache - Historical keys updated in place.
 * @param {number[][]} valueCache - Historical values updated in place.
 * @returns {number[]} Attention output vector of size headDim.
 */
function decodeKVCacheStep(x, Wq, Wk, Wv, keyCache, valueCache) {
  const dModel = x.length;
  const headDim = Wq.length;
  const q = Array(headDim).fill(0);
  const k = Array(headDim).fill(0);
  const v = Array(headDim).fill(0);

  for (let i = 0; i < headDim; i++) {
    for (let j = 0; j < dModel; j++) {
      q[i] += Wq[i][j] * x[j];
      k[i] += Wk[i][j] * x[j];
      v[i] += Wv[i][j] * x[j];
    }
  }

  keyCache.push(k);
  valueCache.push(v);

  const n = keyCache.length;
  const scale = 1 / Math.sqrt(headDim);
  const output = Array(headDim).fill(0);
  if (n === 0) return output;

  const scores = [];
  for (let j = 0; j < n; j++) {
    let dot = 0;
    for (let m = 0; m < headDim; m++) {
      dot += q[m] * keyCache[j][m];
    }
    scores.push(dot * scale);
  }

  const maxScore = Math.max(...scores);
  const exps = scores.map((s) => Math.exp(s - maxScore));
  const sumExp = exps.reduce((sum, val) => sum + val, 0);
  const weights = exps.map((e) => e / sumExp);

  for (let j = 0; j < n; j++) {
    for (let m = 0; m < headDim; m++) {
      output[m] += weights[j] * valueCache[j][m];
    }
  }

  return output;
}`,explanation:"The attention scale keeps logits stable so softmax weights remain informative as head dimension grows."},{id:"kv-cache-attention-blend",stepLabel:"8.3",group:"Cached cross-attention",title:"KV Cache Attention Blending",concept:"Cached attention softmax-normalizes query-key scores and blends value vectors into the output representation for the current token.",objective:"Inside decodeKVCacheStep, compute softmax weights and blend valueCache into output.",difficulty:"core",starterCode:`/**
 * Runs one autoregressive decode step: project x to Q/K/V, append to cache, attend over history.
 * @param {number[]} x - Current token embedding of size dModel.
 * @param {number[][]} Wq - Query weights [headDim, dModel].
 * @param {number[][]} Wk - Key weights [headDim, dModel].
 * @param {number[][]} Wv - Value weights [headDim, dModel].
 * @param {number[][]} keyCache - Historical keys updated in place.
 * @param {number[][]} valueCache - Historical values updated in place.
 * @returns {number[]} Attention output vector of size headDim.
 */
function decodeKVCacheStep(x, Wq, Wk, Wv, keyCache, valueCache) {
  const dModel = x.length;
  const headDim = Wq.length;
  const q = Array(headDim).fill(0);
  const k = Array(headDim).fill(0);
  const v = Array(headDim).fill(0);

  for (let i = 0; i < headDim; i++) {
    for (let j = 0; j < dModel; j++) {
      q[i] += Wq[i][j] * x[j];
      k[i] += Wk[i][j] * x[j];
      v[i] += Wv[i][j] * x[j];
    }
  }

  keyCache.push(k);
  valueCache.push(v);

  const n = keyCache.length;
  const scale = 1 / Math.sqrt(headDim);
  const output = Array(headDim).fill(0);
  if (n === 0) return output;

  const scores = [];
  for (let j = 0; j < n; j++) {
    let dot = 0;
    for (let m = 0; m < headDim; m++) {
      dot += q[m] * keyCache[j][m];
    }
    scores.push(dot * scale);
  }

  // TODO: softmax scores into weights and blend valueCache rows into output.

  return output;
}`,testCode:`const results = [];
function approxEqual(a, b, tol = 1e-3) { return Math.abs(a - b) <= tol; }
function approxArray(a, b) { return a.length === b.length && a.every((v, i) => approxEqual(v, b[i])); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: approxArray(actual, expected) });
}
const qx = [1, 0];
const W = [[1, 0], [0, 1]];
check('attention blend', decodeKVCacheStep(qx, W, W, W, [[1, 0], [0, 1]], [[10, 20], [30, 40]]), [10.345507, 15.933274]);
return results;`,hints:["Subtract max score before exponentiating for numerical stability.","Normalize exponentials to get softmax weights.","Accumulate weights[j] * valueCache[j][m] into output[m]."],solution:`/**
 * Runs one autoregressive decode step: project x to Q/K/V, append to cache, attend over history.
 * @param {number[]} x - Current token embedding of size dModel.
 * @param {number[][]} Wq - Query weights [headDim, dModel].
 * @param {number[][]} Wk - Key weights [headDim, dModel].
 * @param {number[][]} Wv - Value weights [headDim, dModel].
 * @param {number[][]} keyCache - Historical keys updated in place.
 * @param {number[][]} valueCache - Historical values updated in place.
 * @returns {number[]} Attention output vector of size headDim.
 */
function decodeKVCacheStep(x, Wq, Wk, Wv, keyCache, valueCache) {
  const dModel = x.length;
  const headDim = Wq.length;
  const q = Array(headDim).fill(0);
  const k = Array(headDim).fill(0);
  const v = Array(headDim).fill(0);

  for (let i = 0; i < headDim; i++) {
    for (let j = 0; j < dModel; j++) {
      q[i] += Wq[i][j] * x[j];
      k[i] += Wk[i][j] * x[j];
      v[i] += Wv[i][j] * x[j];
    }
  }

  keyCache.push(k);
  valueCache.push(v);

  const n = keyCache.length;
  const scale = 1 / Math.sqrt(headDim);
  const output = Array(headDim).fill(0);
  if (n === 0) return output;

  const scores = [];
  for (let j = 0; j < n; j++) {
    let dot = 0;
    for (let m = 0; m < headDim; m++) {
      dot += q[m] * keyCache[j][m];
    }
    scores.push(dot * scale);
  }

  const maxScore = Math.max(...scores);
  const exps = scores.map((s) => Math.exp(s - maxScore));
  const sumExp = exps.reduce((sum, val) => sum + val, 0);
  const weights = exps.map((e) => e / sumExp);

  for (let j = 0; j < n; j++) {
    for (let m = 0; m < headDim; m++) {
      output[m] += weights[j] * valueCache[j][m];
    }
  }

  return output;
}`,explanation:"Softmax blending turns cached keys and values into the contextual representation for the current query token."},{id:"kv-cache-generation",stepLabel:"8.4",group:"Autoregressive generation step",title:"Autoregressive KV Cache Generation",concept:"A full decode step projects the token embedding to Q/K/V, appends K and V to the cache, and runs scaled attention over all cached history.",objective:"Inside decodeKVCacheStep, implement the matrix-vector projections for q, k, and v from x.",difficulty:"challenge",starterCode:`/**
 * Runs one autoregressive decode step: project x to Q/K/V, append to cache, attend over history.
 * @param {number[]} x - Current token embedding of size dModel.
 * @param {number[][]} Wq - Query weights [headDim, dModel].
 * @param {number[][]} Wk - Key weights [headDim, dModel].
 * @param {number[][]} Wv - Value weights [headDim, dModel].
 * @param {number[][]} keyCache - Historical keys updated in place.
 * @param {number[][]} valueCache - Historical values updated in place.
 * @returns {number[]} Attention output vector of size headDim.
 */
function decodeKVCacheStep(x, Wq, Wk, Wv, keyCache, valueCache) {
  const dModel = x.length;
  const headDim = Wq.length;
  const q = Array(headDim).fill(0);
  const k = Array(headDim).fill(0);
  const v = Array(headDim).fill(0);

  for (let i = 0; i < headDim; i++) {
    for (let j = 0; j < dModel; j++) {
      // TODO: accumulate q[i], k[i], and v[i] from x[j] and the weight rows.
    }
  }

  keyCache.push(k);
  valueCache.push(v);

  const n = keyCache.length;
  const scale = 1 / Math.sqrt(headDim);
  const output = Array(headDim).fill(0);
  if (n === 0) return output;

  const scores = [];
  for (let j = 0; j < n; j++) {
    let dot = 0;
    for (let m = 0; m < headDim; m++) {
      dot += q[m] * keyCache[j][m];
    }
    scores.push(dot * scale);
  }

  const maxScore = Math.max(...scores);
  const exps = scores.map((s) => Math.exp(s - maxScore));
  const sumExp = exps.reduce((sum, val) => sum + val, 0);
  const weights = exps.map((e) => e / sumExp);

  for (let j = 0; j < n; j++) {
    for (let m = 0; m < headDim; m++) {
      output[m] += weights[j] * valueCache[j][m];
    }
  }

  return output;
}`,testCode:`const results = [];
function approxEqual(a, b, tol = 1e-4) { return Math.abs(a - b) <= tol; }
function approxArray(a, b) { return a.length === b.length && a.every((v, i) => approxEqual(v, b[i])); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: approxArray(actual, expected) });
}
const x = [1.0, 2.0];
const Wq = [[1, 0], [0, 1]];
const Wk = [[0.5, 0], [0, 0.5]];
const Wv = [[2, 0], [0, 2]];
const kC = [[0.5, 1.0]];
const vC = [[2.0, 4.0]];
const out = decodeKVCacheStep(x, Wq, Wk, Wv, kC, vC);
check('full decode output', out, [2.0, 4.0]);
results.push({ name: 'cache grows', actual: kC.length, expected: 2, passed: kC.length === 2 });
return results;`,hints:["Each projection is a matrix-vector product: q[i] += Wq[i][j] * x[j].","Apply the same pattern for k with Wk and v with Wv.","The cache append and attention code below should remain unchanged."],solution:`/**
 * Runs one autoregressive decode step: project x to Q/K/V, append to cache, attend over history.
 * @param {number[]} x - Current token embedding of size dModel.
 * @param {number[][]} Wq - Query weights [headDim, dModel].
 * @param {number[][]} Wk - Key weights [headDim, dModel].
 * @param {number[][]} Wv - Value weights [headDim, dModel].
 * @param {number[][]} keyCache - Historical keys updated in place.
 * @param {number[][]} valueCache - Historical values updated in place.
 * @returns {number[]} Attention output vector of size headDim.
 */
function decodeKVCacheStep(x, Wq, Wk, Wv, keyCache, valueCache) {
  const dModel = x.length;
  const headDim = Wq.length;
  const q = Array(headDim).fill(0);
  const k = Array(headDim).fill(0);
  const v = Array(headDim).fill(0);

  for (let i = 0; i < headDim; i++) {
    for (let j = 0; j < dModel; j++) {
      q[i] += Wq[i][j] * x[j];
      k[i] += Wk[i][j] * x[j];
      v[i] += Wv[i][j] * x[j];
    }
  }

  keyCache.push(k);
  valueCache.push(v);

  const n = keyCache.length;
  const scale = 1 / Math.sqrt(headDim);
  const output = Array(headDim).fill(0);
  if (n === 0) return output;

  const scores = [];
  for (let j = 0; j < n; j++) {
    let dot = 0;
    for (let m = 0; m < headDim; m++) {
      dot += q[m] * keyCache[j][m];
    }
    scores.push(dot * scale);
  }

  const maxScore = Math.max(...scores);
  const exps = scores.map((s) => Math.exp(s - maxScore));
  const sumExp = exps.reduce((sum, val) => sum + val, 0);
  const weights = exps.map((e) => e / sumExp);

  for (let j = 0; j < n; j++) {
    for (let m = 0; m < headDim; m++) {
      output[m] += weights[j] * valueCache[j][m];
    }
  }

  return output;
}`,explanation:"Projection, cache append, and cached attention together form one autoregressive generation step."},{id:"flash-max-update",stepLabel:"9.1",group:"Row max update",title:"FlashAttention max update",concept:"FlashAttention operates in blocks. To maintain correct Softmax outputs, it updates the running maximum for each row as new blocks are loaded.",objective:"Compute the new maximum of two values.",difficulty:"warmup",starterCode:`function updateRowMax(oldMax, blockMax) {
  // TODO: return the maximum of oldMax and blockMax
  return 0;
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('update max positive', updateRowMax(5, 8), 8);
check('update max negative', updateRowMax(-10, -2), -2);
return results;`,hints:["Use Math.max.","return Math.max(oldMax, blockMax);"],solution:`function updateRowMax(oldMax, blockMax) {
  return Math.max(oldMax, blockMax);
}`,explanation:"Subtracting row maximums protects exponents from overflow."},{id:"flash-sum-update",stepLabel:"9.2",group:"Running sum",title:"FlashAttention sum update",concept:"To update the running Softmax denominator incrementally, FlashAttention scales the old sum and the block sum by the difference in their maximums.",objective:"Compute the updated denominator: oldSum * e^(oldMax - newMax) + blockSum * e^(blockMax - newMax).",difficulty:"core",starterCode:`function updateRowSum(oldSum, blockSum, oldMax, blockMax, newMax) {
  // TODO: return the updated Softmax sum denominator
  return 0;
}`,testCode:`const results = [];
function approxEqual(a, b, tol = 1e-5) {
  return Math.abs(a - b) <= tol;
}
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('same max sum update', updateRowSum(2.0, 1.0, 5.0, 5.0, 5.0), 3.0);
check('different max sum update', updateRowSum(1.0, 1.0, 5.0, 6.0, 6.0), 1.367879);
return results;`,hints:["Use Math.exp(oldMax - newMax) and Math.exp(blockMax - newMax).","The formula is: oldSum * Math.exp(oldMax - newMax) + blockSum * Math.exp(blockMax - newMax)."],solution:`function updateRowSum(oldSum, blockSum, oldMax, blockMax, newMax) {
  return oldSum * Math.exp(oldMax - newMax) + blockSum * Math.exp(blockMax - newMax);
}`,explanation:"Scaling old sums ensures the Softmax denominators stay mathematically equivalent to standard Softmax while loading in chunks."},{id:"specsparse-prefix-length",stepLabel:"SSA.1",group:"Draft prefix length",title:"Accepted Draft Prefix",concept:"SpecSA verification begins by finding how many draft tokens match the target model prefix before the first mismatch.",objective:"Inside specSparseVerifyStep, compute acceptedPrefix as the longest matching prefix length.",difficulty:"warmup",starterCode:`/**
 * Runs one SpecSA sparse verification step: prefix accept, criticality scoring, block selection, IO accounting.
 * @param {number[]} draftTokens - Tokens proposed by the draft model.
 * @param {number[]} targetTokens - Tokens from the target verification pass.
 * @param {number[]} firstLogits - Collect-2-Query first-row scores per KV block.
 * @param {number[]} bonusLogits - Collect-2-Query bonus-row scores per KV block.
 * @param {number} topK - Number of critical blocks to read.
 * @param {number} totalBlocks - Total KV blocks available in cache.
 * @param {number} tokensPerBlock - Tokens stored in each KV block.
 * @returns {{ acceptedPrefix: number, criticality: number[], selectedBlocks: number[], blocksSkipped: number, kvRowsRead: number }}
 */
function specSparseVerifyStep(draftTokens, targetTokens, firstLogits, bonusLogits, topK, totalBlocks, tokensPerBlock) {
  let acceptedPrefix = 0;
  // TODO: increment while draftTokens[acceptedPrefix] === targetTokens[acceptedPrefix].

  const numBlocks = firstLogits.length;
  const criticality = Array(numBlocks).fill(0);
  for (let i = 0; i < numBlocks; i++) {
    criticality[i] = (firstLogits[i] + bonusLogits[i]) / 2;
  }

  const ranked = criticality.map((score, idx) => ({ idx, score }));
  ranked.sort((a, b) => b.score - a.score || a.idx - b.idx);
  const selectedBlocks = ranked.slice(0, topK).map((entry) => entry.idx);

  const blocksSkipped = totalBlocks - selectedBlocks.length;
  const kvRowsRead = selectedBlocks.length * tokensPerBlock;

  return { acceptedPrefix, criticality, selectedBlocks, blocksSkipped, kvRowsRead };
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('stops at mismatch', specSparseVerifyStep([1, 2, 9, 4], [1, 2, 3, 4], [0], [0], 1, 1, 1).acceptedPrefix, 2);
check('full match', specSparseVerifyStep([5, 6, 7], [5, 6, 7], [0], [0], 1, 1, 1).acceptedPrefix, 3);
check('short target', specSparseVerifyStep([5, 6, 7], [5, 6], [0], [0], 1, 1, 1).acceptedPrefix, 2);
return results;`,hints:["Compare tokens at the same index while both arrays have elements.","Stop at the first unequal token or when either sequence ends.","Use a while loop that checks draftTokens[acceptedPrefix] === targetTokens[acceptedPrefix]."],solution:`/**
 * Runs one SpecSA sparse verification step: prefix accept, criticality scoring, block selection, IO accounting.
 * @param {number[]} draftTokens - Tokens proposed by the draft model.
 * @param {number[]} targetTokens - Tokens from the target verification pass.
 * @param {number[]} firstLogits - Collect-2-Query first-row scores per KV block.
 * @param {number[]} bonusLogits - Collect-2-Query bonus-row scores per KV block.
 * @param {number} topK - Number of critical blocks to read.
 * @param {number} totalBlocks - Total KV blocks available in cache.
 * @param {number} tokensPerBlock - Tokens stored in each KV block.
 * @returns {{ acceptedPrefix: number, criticality: number[], selectedBlocks: number[], blocksSkipped: number, kvRowsRead: number }}
 */
function specSparseVerifyStep(draftTokens, targetTokens, firstLogits, bonusLogits, topK, totalBlocks, tokensPerBlock) {
  let acceptedPrefix = 0;
  while (
    acceptedPrefix < draftTokens.length
    && acceptedPrefix < targetTokens.length
    && draftTokens[acceptedPrefix] === targetTokens[acceptedPrefix]
  ) {
    acceptedPrefix += 1;
  }

  const numBlocks = firstLogits.length;
  const criticality = Array(numBlocks).fill(0);
  for (let i = 0; i < numBlocks; i++) {
    criticality[i] = (firstLogits[i] + bonusLogits[i]) / 2;
  }

  const ranked = criticality.map((score, idx) => ({ idx, score }));
  ranked.sort((a, b) => b.score - a.score || a.idx - b.idx);
  const selectedBlocks = ranked.slice(0, topK).map((entry) => entry.idx);

  const blocksSkipped = totalBlocks - selectedBlocks.length;
  const kvRowsRead = selectedBlocks.length * tokensPerBlock;

  return { acceptedPrefix, criticality, selectedBlocks, blocksSkipped, kvRowsRead };
}`,explanation:"Prefix acceptance tells SpecSA how many draft tokens can be committed before sparse KV verification runs."},{id:"specsparse-criticality-avg",stepLabel:"SSA.2",group:"Criticality average",title:"Collect-2-Query Criticality",concept:"SpecSA averages Collect-2-Query first and bonus logits per block to estimate which KV regions matter most.",objective:"Inside specSparseVerifyStep, set criticality[i] to the average of firstLogits[i] and bonusLogits[i].",difficulty:"core",starterCode:`/**
 * Runs one SpecSA sparse verification step: prefix accept, criticality scoring, block selection, IO accounting.
 * @param {number[]} draftTokens - Tokens proposed by the draft model.
 * @param {number[]} targetTokens - Tokens from the target verification pass.
 * @param {number[]} firstLogits - Collect-2-Query first-row scores per KV block.
 * @param {number[]} bonusLogits - Collect-2-Query bonus-row scores per KV block.
 * @param {number} topK - Number of critical blocks to read.
 * @param {number} totalBlocks - Total KV blocks available in cache.
 * @param {number} tokensPerBlock - Tokens stored in each KV block.
 * @returns {{ acceptedPrefix: number, criticality: number[], selectedBlocks: number[], blocksSkipped: number, kvRowsRead: number }}
 */
function specSparseVerifyStep(draftTokens, targetTokens, firstLogits, bonusLogits, topK, totalBlocks, tokensPerBlock) {
  let acceptedPrefix = 0;
  while (
    acceptedPrefix < draftTokens.length
    && acceptedPrefix < targetTokens.length
    && draftTokens[acceptedPrefix] === targetTokens[acceptedPrefix]
  ) {
    acceptedPrefix += 1;
  }

  const numBlocks = firstLogits.length;
  const criticality = Array(numBlocks).fill(0);
  for (let i = 0; i < numBlocks; i++) {
    // TODO: criticality[i] = average of firstLogits[i] and bonusLogits[i].
  }

  const ranked = criticality.map((score, idx) => ({ idx, score }));
  ranked.sort((a, b) => b.score - a.score || a.idx - b.idx);
  const selectedBlocks = ranked.slice(0, topK).map((entry) => entry.idx);

  const blocksSkipped = totalBlocks - selectedBlocks.length;
  const kvRowsRead = selectedBlocks.length * tokensPerBlock;

  return { acceptedPrefix, criticality, selectedBlocks, blocksSkipped, kvRowsRead };
}`,testCode:`const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function sameArray(a, b) { return a.length === b.length && a.every((v, i) => approxEqual(v, b[i])); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual, expected) });
}
check('averages logits', specSparseVerifyStep([], [], [1, 5, 2, 0], [1, 1, 6, 0], 1, 4, 1).criticality, [1, 3, 4, 0]);
return results;`,hints:["Add the two logits and divide by 2.","Process every block index from 0 to numBlocks - 1.","criticality[i] = (firstLogits[i] + bonusLogits[i]) / 2;"],solution:`/**
 * Runs one SpecSA sparse verification step: prefix accept, criticality scoring, block selection, IO accounting.
 * @param {number[]} draftTokens - Tokens proposed by the draft model.
 * @param {number[]} targetTokens - Tokens from the target verification pass.
 * @param {number[]} firstLogits - Collect-2-Query first-row scores per KV block.
 * @param {number[]} bonusLogits - Collect-2-Query bonus-row scores per KV block.
 * @param {number} topK - Number of critical blocks to read.
 * @param {number} totalBlocks - Total KV blocks available in cache.
 * @param {number} tokensPerBlock - Tokens stored in each KV block.
 * @returns {{ acceptedPrefix: number, criticality: number[], selectedBlocks: number[], blocksSkipped: number, kvRowsRead: number }}
 */
function specSparseVerifyStep(draftTokens, targetTokens, firstLogits, bonusLogits, topK, totalBlocks, tokensPerBlock) {
  let acceptedPrefix = 0;
  while (
    acceptedPrefix < draftTokens.length
    && acceptedPrefix < targetTokens.length
    && draftTokens[acceptedPrefix] === targetTokens[acceptedPrefix]
  ) {
    acceptedPrefix += 1;
  }

  const numBlocks = firstLogits.length;
  const criticality = Array(numBlocks).fill(0);
  for (let i = 0; i < numBlocks; i++) {
    criticality[i] = (firstLogits[i] + bonusLogits[i]) / 2;
  }

  const ranked = criticality.map((score, idx) => ({ idx, score }));
  ranked.sort((a, b) => b.score - a.score || a.idx - b.idx);
  const selectedBlocks = ranked.slice(0, topK).map((entry) => entry.idx);

  const blocksSkipped = totalBlocks - selectedBlocks.length;
  const kvRowsRead = selectedBlocks.length * tokensPerBlock;

  return { acceptedPrefix, criticality, selectedBlocks, blocksSkipped, kvRowsRead };
}`,explanation:"Averaging both Collect-2-Query rows yields a single criticality score per KV block."},{id:"specsparse-topk-blocks",stepLabel:"SSA.3",group:"Top-k block selection",title:"Select Critical KV Blocks",concept:"SpecSA reads only the top-k blocks ranked by criticality instead of the full KV cache.",objective:"Inside specSparseVerifyStep, fill selectedBlocks with the topK highest-criticality block indices (break ties by lower index).",difficulty:"core",starterCode:`/**
 * Runs one SpecSA sparse verification step: prefix accept, criticality scoring, block selection, IO accounting.
 * @param {number[]} draftTokens - Tokens proposed by the draft model.
 * @param {number[]} targetTokens - Tokens from the target verification pass.
 * @param {number[]} firstLogits - Collect-2-Query first-row scores per KV block.
 * @param {number[]} bonusLogits - Collect-2-Query bonus-row scores per KV block.
 * @param {number} topK - Number of critical blocks to read.
 * @param {number} totalBlocks - Total KV blocks available in cache.
 * @param {number} tokensPerBlock - Tokens stored in each KV block.
 * @returns {{ acceptedPrefix: number, criticality: number[], selectedBlocks: number[], blocksSkipped: number, kvRowsRead: number }}
 */
function specSparseVerifyStep(draftTokens, targetTokens, firstLogits, bonusLogits, topK, totalBlocks, tokensPerBlock) {
  let acceptedPrefix = 0;
  while (
    acceptedPrefix < draftTokens.length
    && acceptedPrefix < targetTokens.length
    && draftTokens[acceptedPrefix] === targetTokens[acceptedPrefix]
  ) {
    acceptedPrefix += 1;
  }

  const numBlocks = firstLogits.length;
  const criticality = Array(numBlocks).fill(0);
  for (let i = 0; i < numBlocks; i++) {
    criticality[i] = (firstLogits[i] + bonusLogits[i]) / 2;
  }

  const selectedBlocks = [];
  // TODO: pick topK block indices with highest criticality; break ties by lower index.

  const blocksSkipped = totalBlocks - selectedBlocks.length;
  const kvRowsRead = selectedBlocks.length * tokensPerBlock;

  return { acceptedPrefix, criticality, selectedBlocks, blocksSkipped, kvRowsRead };
}`,testCode:`const results = [];
function sameArray(a, b) { return a.length === b.length && a.every((v, i) => Object.is(v, b[i])); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual, expected) });
}
check('top two blocks', specSparseVerifyStep([], [], [1, 5, 2, 0], [1, 1, 6, 0], 2, 4, 1).selectedBlocks, [2, 1]);
check('clamps to available', specSparseVerifyStep([], [], [2, 5], [0, 0], 5, 2, 1).selectedBlocks, [1, 0]);
return results;`,hints:["Pair each index with its criticality score, then sort descending by score.","When scores tie, prefer the smaller block index.","Take the first topK entries from the sorted list and map back to indices."],solution:`/**
 * Runs one SpecSA sparse verification step: prefix accept, criticality scoring, block selection, IO accounting.
 * @param {number[]} draftTokens - Tokens proposed by the draft model.
 * @param {number[]} targetTokens - Tokens from the target verification pass.
 * @param {number[]} firstLogits - Collect-2-Query first-row scores per KV block.
 * @param {number[]} bonusLogits - Collect-2-Query bonus-row scores per KV block.
 * @param {number} topK - Number of critical blocks to read.
 * @param {number} totalBlocks - Total KV blocks available in cache.
 * @param {number} tokensPerBlock - Tokens stored in each KV block.
 * @returns {{ acceptedPrefix: number, criticality: number[], selectedBlocks: number[], blocksSkipped: number, kvRowsRead: number }}
 */
function specSparseVerifyStep(draftTokens, targetTokens, firstLogits, bonusLogits, topK, totalBlocks, tokensPerBlock) {
  let acceptedPrefix = 0;
  while (
    acceptedPrefix < draftTokens.length
    && acceptedPrefix < targetTokens.length
    && draftTokens[acceptedPrefix] === targetTokens[acceptedPrefix]
  ) {
    acceptedPrefix += 1;
  }

  const numBlocks = firstLogits.length;
  const criticality = Array(numBlocks).fill(0);
  for (let i = 0; i < numBlocks; i++) {
    criticality[i] = (firstLogits[i] + bonusLogits[i]) / 2;
  }

  const ranked = criticality.map((score, idx) => ({ idx, score }));
  ranked.sort((a, b) => b.score - a.score || a.idx - b.idx);
  const selectedBlocks = ranked.slice(0, topK).map((entry) => entry.idx);

  const blocksSkipped = totalBlocks - selectedBlocks.length;
  const kvRowsRead = selectedBlocks.length * tokensPerBlock;

  return { acceptedPrefix, criticality, selectedBlocks, blocksSkipped, kvRowsRead };
}`,explanation:"Top-k block selection is the core sparse read pattern that avoids loading the entire KV cache."},{id:"specsparse-blocks-skipped",stepLabel:"SSA.4",group:"KV blocks skipped",title:"KV Blocks Skipped",concept:"The speedup from SpecSA comes from skipping blocks that were not selected for verification.",objective:"Inside specSparseVerifyStep, set blocksSkipped to totalBlocks minus the number of selected blocks.",difficulty:"core",starterCode:`/**
 * Runs one SpecSA sparse verification step: prefix accept, criticality scoring, block selection, IO accounting.
 * @param {number[]} draftTokens - Tokens proposed by the draft model.
 * @param {number[]} targetTokens - Tokens from the target verification pass.
 * @param {number[]} firstLogits - Collect-2-Query first-row scores per KV block.
 * @param {number[]} bonusLogits - Collect-2-Query bonus-row scores per KV block.
 * @param {number} topK - Number of critical blocks to read.
 * @param {number} totalBlocks - Total KV blocks available in cache.
 * @param {number} tokensPerBlock - Tokens stored in each KV block.
 * @returns {{ acceptedPrefix: number, criticality: number[], selectedBlocks: number[], blocksSkipped: number, kvRowsRead: number }}
 */
function specSparseVerifyStep(draftTokens, targetTokens, firstLogits, bonusLogits, topK, totalBlocks, tokensPerBlock) {
  let acceptedPrefix = 0;
  while (
    acceptedPrefix < draftTokens.length
    && acceptedPrefix < targetTokens.length
    && draftTokens[acceptedPrefix] === targetTokens[acceptedPrefix]
  ) {
    acceptedPrefix += 1;
  }

  const numBlocks = firstLogits.length;
  const criticality = Array(numBlocks).fill(0);
  for (let i = 0; i < numBlocks; i++) {
    criticality[i] = (firstLogits[i] + bonusLogits[i]) / 2;
  }

  const ranked = criticality.map((score, idx) => ({ idx, score }));
  ranked.sort((a, b) => b.score - a.score || a.idx - b.idx);
  const selectedBlocks = ranked.slice(0, topK).map((entry) => entry.idx);

  let blocksSkipped = 0;
  // TODO: blocksSkipped = totalBlocks - selectedBlocks.length

  const kvRowsRead = selectedBlocks.length * tokensPerBlock;

  return { acceptedPrefix, criticality, selectedBlocks, blocksSkipped, kvRowsRead };
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('skips unselected', specSparseVerifyStep([], [], [1, 5, 2, 0], [1, 1, 6, 0], 2, 8, 64).blocksSkipped, 6);
check('reads all when k equals total', specSparseVerifyStep([], [], [2, 5], [0, 0], 2, 2, 10).blocksSkipped, 0);
return results;`,hints:["Subtract the number of selected blocks from totalBlocks.","selectedBlocks.length is the count of blocks actually read.","blocksSkipped = totalBlocks - selectedBlocks.length;"],solution:`/**
 * Runs one SpecSA sparse verification step: prefix accept, criticality scoring, block selection, IO accounting.
 * @param {number[]} draftTokens - Tokens proposed by the draft model.
 * @param {number[]} targetTokens - Tokens from the target verification pass.
 * @param {number[]} firstLogits - Collect-2-Query first-row scores per KV block.
 * @param {number[]} bonusLogits - Collect-2-Query bonus-row scores per KV block.
 * @param {number} topK - Number of critical blocks to read.
 * @param {number} totalBlocks - Total KV blocks available in cache.
 * @param {number} tokensPerBlock - Tokens stored in each KV block.
 * @returns {{ acceptedPrefix: number, criticality: number[], selectedBlocks: number[], blocksSkipped: number, kvRowsRead: number }}
 */
function specSparseVerifyStep(draftTokens, targetTokens, firstLogits, bonusLogits, topK, totalBlocks, tokensPerBlock) {
  let acceptedPrefix = 0;
  while (
    acceptedPrefix < draftTokens.length
    && acceptedPrefix < targetTokens.length
    && draftTokens[acceptedPrefix] === targetTokens[acceptedPrefix]
  ) {
    acceptedPrefix += 1;
  }

  const numBlocks = firstLogits.length;
  const criticality = Array(numBlocks).fill(0);
  for (let i = 0; i < numBlocks; i++) {
    criticality[i] = (firstLogits[i] + bonusLogits[i]) / 2;
  }

  const ranked = criticality.map((score, idx) => ({ idx, score }));
  ranked.sort((a, b) => b.score - a.score || a.idx - b.idx);
  const selectedBlocks = ranked.slice(0, topK).map((entry) => entry.idx);

  let blocksSkipped = 0;
  blocksSkipped = totalBlocks - selectedBlocks.length;

  const kvRowsRead = selectedBlocks.length * tokensPerBlock;

  return { acceptedPrefix, criticality, selectedBlocks, blocksSkipped, kvRowsRead };
}`,explanation:"Blocks skipped quantifies how much KV IO SpecSA avoids compared with dense attention."},{id:"specsparse-kv-rows-read",stepLabel:"SSA.5",group:"Effective KV rows read",title:"Effective KV Rows Read",concept:"Each selected block contributes tokensPerBlock KV rows. Multiplying gives the effective sparse read volume.",objective:"Inside specSparseVerifyStep, set kvRowsRead to selectedBlocks.length * tokensPerBlock.",difficulty:"core",starterCode:`/**
 * Runs one SpecSA sparse verification step: prefix accept, criticality scoring, block selection, IO accounting.
 * @param {number[]} draftTokens - Tokens proposed by the draft model.
 * @param {number[]} targetTokens - Tokens from the target verification pass.
 * @param {number[]} firstLogits - Collect-2-Query first-row scores per KV block.
 * @param {number[]} bonusLogits - Collect-2-Query bonus-row scores per KV block.
 * @param {number} topK - Number of critical blocks to read.
 * @param {number} totalBlocks - Total KV blocks available in cache.
 * @param {number} tokensPerBlock - Tokens stored in each KV block.
 * @returns {{ acceptedPrefix: number, criticality: number[], selectedBlocks: number[], blocksSkipped: number, kvRowsRead: number }}
 */
function specSparseVerifyStep(draftTokens, targetTokens, firstLogits, bonusLogits, topK, totalBlocks, tokensPerBlock) {
  let acceptedPrefix = 0;
  while (
    acceptedPrefix < draftTokens.length
    && acceptedPrefix < targetTokens.length
    && draftTokens[acceptedPrefix] === targetTokens[acceptedPrefix]
  ) {
    acceptedPrefix += 1;
  }

  const numBlocks = firstLogits.length;
  const criticality = Array(numBlocks).fill(0);
  for (let i = 0; i < numBlocks; i++) {
    criticality[i] = (firstLogits[i] + bonusLogits[i]) / 2;
  }

  const ranked = criticality.map((score, idx) => ({ idx, score }));
  ranked.sort((a, b) => b.score - a.score || a.idx - b.idx);
  const selectedBlocks = ranked.slice(0, topK).map((entry) => entry.idx);

  const blocksSkipped = totalBlocks - selectedBlocks.length;
  let kvRowsRead = 0;
  // TODO: kvRowsRead = selectedBlocks.length * tokensPerBlock

  return { acceptedPrefix, criticality, selectedBlocks, blocksSkipped, kvRowsRead };
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('sparse read volume', specSparseVerifyStep([], [], [1, 5, 2, 0], [1, 1, 6, 0], 2, 8, 64).kvRowsRead, 128);
check('single block', specSparseVerifyStep([], [], [3], [1], 1, 4, 32).kvRowsRead, 32);
return results;`,hints:["Multiply the number of selected blocks by tokensPerBlock.","This counts token rows loaded from KV cache during sparse verification.","kvRowsRead = selectedBlocks.length * tokensPerBlock;"],solution:`/**
 * Runs one SpecSA sparse verification step: prefix accept, criticality scoring, block selection, IO accounting.
 * @param {number[]} draftTokens - Tokens proposed by the draft model.
 * @param {number[]} targetTokens - Tokens from the target verification pass.
 * @param {number[]} firstLogits - Collect-2-Query first-row scores per KV block.
 * @param {number[]} bonusLogits - Collect-2-Query bonus-row scores per KV block.
 * @param {number} topK - Number of critical blocks to read.
 * @param {number} totalBlocks - Total KV blocks available in cache.
 * @param {number} tokensPerBlock - Tokens stored in each KV block.
 * @returns {{ acceptedPrefix: number, criticality: number[], selectedBlocks: number[], blocksSkipped: number, kvRowsRead: number }}
 */
function specSparseVerifyStep(draftTokens, targetTokens, firstLogits, bonusLogits, topK, totalBlocks, tokensPerBlock) {
  let acceptedPrefix = 0;
  while (
    acceptedPrefix < draftTokens.length
    && acceptedPrefix < targetTokens.length
    && draftTokens[acceptedPrefix] === targetTokens[acceptedPrefix]
  ) {
    acceptedPrefix += 1;
  }

  const numBlocks = firstLogits.length;
  const criticality = Array(numBlocks).fill(0);
  for (let i = 0; i < numBlocks; i++) {
    criticality[i] = (firstLogits[i] + bonusLogits[i]) / 2;
  }

  const ranked = criticality.map((score, idx) => ({ idx, score }));
  ranked.sort((a, b) => b.score - a.score || a.idx - b.idx);
  const selectedBlocks = ranked.slice(0, topK).map((entry) => entry.idx);

  const blocksSkipped = totalBlocks - selectedBlocks.length;
  let kvRowsRead = 0;
  kvRowsRead = selectedBlocks.length * tokensPerBlock;

  return { acceptedPrefix, criticality, selectedBlocks, blocksSkipped, kvRowsRead };
}`,explanation:"Effective KV rows read connects block-level sparsity to the actual memory traffic saved at inference time."},{id:"speculative-accept-check",stepLabel:"10.1",group:"Accept/reject rule",title:"Speculative decoding acceptance check",concept:"In speculative decoding, the larger target model accepts a token proposed by the draft model with probability min(1, P_target(x)/P_draft(x)).",objective:"Return true if randVal <= pTarget / pDraft, otherwise false.",difficulty:"warmup",starterCode:`function acceptDraftToken(pTarget, pDraft, randVal) {
  // TODO: return whether the token is accepted based on the probability ratio
  return false;
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('target higher', acceptDraftToken(0.8, 0.4, 0.9), true); // ratio 2.0 >= 0.9
check('draft higher below u', acceptDraftToken(0.3, 0.6, 0.4), true); // ratio 0.5 >= 0.4
check('draft higher above u', acceptDraftToken(0.3, 0.6, 0.7), false); // ratio 0.5 < 0.7
return results;`,hints:["Compute target-to-draft ratio: pTarget / pDraft.","Check if randVal is less than or equal to this ratio.","return randVal <= (pTarget / pDraft);"],solution:`function acceptDraftToken(pTarget, pDraft, randVal) {
  return randVal <= (pTarget / pDraft);
}`,explanation:"Acceptance sampling allows speculative decoding to maintain the exact distribution of the larger model while accelerating generation."},{id:"turboquant-cache-bits",stepLabel:"TQ.1",group:"Cache memory formula",title:"Quantized KV Cache Size",concept:"TurboQuant stores KV cache at reduced bit width. Total bits scale with layers, tokens, heads, head dimension, and bits per value.",objective:"Inside turboQuantKVStep, compute cacheBits = layers * tokens * kvHeads * headDim * 2 * bitsPerValue.",difficulty:"warmup",starterCode:`/**
 * Runs one TurboQuant KV evaluation step: cache sizing, nearest quantization, reconstruction, dot error, compression ratio.
 * @param {number[]} query - Query vector for attention score error check.
 * @param {number[]} originalKey - Original high-precision key vector.
 * @param {number[]} codebook - Sorted quantization levels for each coordinate.
 * @param {number} bitsPerValue - Effective bits per stored KV coordinate.
 * @param {number} layers - Transformer layer count.
 * @param {number} tokens - Context length in tokens.
 * @param {number} kvHeads - Number of KV attention heads.
 * @param {number} headDim - Dimension per KV head.
 * @returns {{ cacheBits: number, indices: number[], reconstructed: number[], dotError: number, compressionRatio: number, fullCacheBits: number }}
 */
function turboQuantKVStep(query, originalKey, codebook, bitsPerValue, layers, tokens, kvHeads, headDim) {
  const fp16Bits = 16;
  const fullCacheBits = layers * tokens * kvHeads * headDim * 2 * fp16Bits;

  let cacheBits = 0;
  // TODO: cacheBits = layers * tokens * kvHeads * headDim * 2 * bitsPerValue

  function dot(a, b) {
    let sum = 0;
    for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
    return sum;
  }

  const d = originalKey.length;
  const indices = Array(d).fill(0);
  for (let i = 0; i < d; i++) {
    let bestIdx = 0;
    let minDist = Math.abs(originalKey[i] - codebook[0]);
    for (let j = 1; j < codebook.length; j++) {
      const dist = Math.abs(originalKey[i] - codebook[j]);
      if (dist < minDist) {
        minDist = dist;
        bestIdx = j;
      }
    }
    indices[i] = bestIdx;
  }

  const reconstructed = Array(d).fill(0);
  for (let i = 0; i < d; i++) {
    reconstructed[i] = codebook[indices[i]];
  }

  const dotError = Math.abs(dot(query, originalKey) - dot(query, reconstructed));
  const compressionRatio = fullCacheBits / cacheBits;

  return { cacheBits, indices, reconstructed, dotError, compressionRatio, fullCacheBits };
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('4-bit cache', turboQuantKVStep([1], [0], [-1, 0, 1], 4, 32, 2048, 8, 128).cacheBits, 536870912);
check('8-bit cache', turboQuantKVStep([1], [0], [-1, 0, 1], 8, 2, 10, 1, 4).cacheBits, 1280);
return results;`,hints:["Multiply layers, tokens, kvHeads, headDim, 2 (K and V), and bitsPerValue.","The factor 2 accounts for both key and value tensors.","cacheBits = layers * tokens * kvHeads * headDim * 2 * bitsPerValue;"],solution:`/**
 * Runs one TurboQuant KV evaluation step: cache sizing, nearest quantization, reconstruction, dot error, compression ratio.
 * @param {number[]} query - Query vector for attention score error check.
 * @param {number[]} originalKey - Original high-precision key vector.
 * @param {number[]} codebook - Sorted quantization levels for each coordinate.
 * @param {number} bitsPerValue - Effective bits per stored KV coordinate.
 * @param {number} layers - Transformer layer count.
 * @param {number} tokens - Context length in tokens.
 * @param {number} kvHeads - Number of KV attention heads.
 * @param {number} headDim - Dimension per KV head.
 * @returns {{ cacheBits: number, indices: number[], reconstructed: number[], dotError: number, compressionRatio: number, fullCacheBits: number }}
 */
function turboQuantKVStep(query, originalKey, codebook, bitsPerValue, layers, tokens, kvHeads, headDim) {
  const fp16Bits = 16;
  const fullCacheBits = layers * tokens * kvHeads * headDim * 2 * fp16Bits;

  let cacheBits = 0;
  cacheBits = layers * tokens * kvHeads * headDim * 2 * bitsPerValue;

  function dot(a, b) {
    let sum = 0;
    for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
    return sum;
  }

  const d = originalKey.length;
  const indices = Array(d).fill(0);
  for (let i = 0; i < d; i++) {
    let bestIdx = 0;
    let minDist = Math.abs(originalKey[i] - codebook[0]);
    for (let j = 1; j < codebook.length; j++) {
      const dist = Math.abs(originalKey[i] - codebook[j]);
      if (dist < minDist) {
        minDist = dist;
        bestIdx = j;
      }
    }
    indices[i] = bestIdx;
  }

  const reconstructed = Array(d).fill(0);
  for (let i = 0; i < d; i++) {
    reconstructed[i] = codebook[indices[i]];
  }

  const dotError = Math.abs(dot(query, originalKey) - dot(query, reconstructed));
  const compressionRatio = fullCacheBits / cacheBits;

  return { cacheBits, indices, reconstructed, dotError, compressionRatio, fullCacheBits };
}`,explanation:"KV cache memory dominates long-context inference; TurboQuant shrinks it by storing fewer bits per coordinate."},{id:"turboquant-nearest-code",stepLabel:"TQ.2",group:"Nearest codebook entry",title:"Nearest Codebook Index",concept:"Each key coordinate is mapped to the nearest TurboQuant codebook level before index encoding.",objective:"Inside turboQuantKVStep, update bestIdx when codebook[j] is closer to originalKey[i].",difficulty:"core",starterCode:`/**
 * Runs one TurboQuant KV evaluation step: cache sizing, nearest quantization, reconstruction, dot error, compression ratio.
 * @param {number[]} query - Query vector for attention score error check.
 * @param {number[]} originalKey - Original high-precision key vector.
 * @param {number[]} codebook - Sorted quantization levels for each coordinate.
 * @param {number} bitsPerValue - Effective bits per stored KV coordinate.
 * @param {number} layers - Transformer layer count.
 * @param {number} tokens - Context length in tokens.
 * @param {number} kvHeads - Number of KV attention heads.
 * @param {number} headDim - Dimension per KV head.
 * @returns {{ cacheBits: number, indices: number[], reconstructed: number[], dotError: number, compressionRatio: number, fullCacheBits: number }}
 */
function turboQuantKVStep(query, originalKey, codebook, bitsPerValue, layers, tokens, kvHeads, headDim) {
  const fp16Bits = 16;
  const fullCacheBits = layers * tokens * kvHeads * headDim * 2 * fp16Bits;
  const cacheBits = layers * tokens * kvHeads * headDim * 2 * bitsPerValue;

  function dot(a, b) {
    let sum = 0;
    for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
    return sum;
  }

  const d = originalKey.length;
  const indices = Array(d).fill(0);
  for (let i = 0; i < d; i++) {
    let bestIdx = 0;
    let minDist = Math.abs(originalKey[i] - codebook[0]);
    for (let j = 1; j < codebook.length; j++) {
      // TODO: update bestIdx and minDist when codebook[j] is closer to originalKey[i].
    }
    indices[i] = bestIdx;
  }

  const reconstructed = Array(d).fill(0);
  for (let i = 0; i < d; i++) {
    reconstructed[i] = codebook[indices[i]];
  }

  const dotError = Math.abs(dot(query, originalKey) - dot(query, reconstructed));
  const compressionRatio = fullCacheBits / cacheBits;

  return { cacheBits, indices, reconstructed, dotError, compressionRatio, fullCacheBits };
}`,testCode:`const results = [];
function sameArray(a, b) { return a.length === b.length && a.every((v, i) => Object.is(v, b[i])); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual, expected) });
}
check('nearest levels', turboQuantKVStep([1], [0.2, 0.8], [-1, 0, 1], 4, 1, 1, 1, 2).indices, [1, 2]);
check('negative coord', turboQuantKVStep([1], [-0.9], [-1, 0, 1], 4, 1, 1, 1, 1).indices, [0]);
return results;`,hints:["Compute dist = Math.abs(originalKey[i] - codebook[j]).","Replace bestIdx when dist is strictly less than minDist.","Update minDist together with bestIdx."],solution:`/**
 * Runs one TurboQuant KV evaluation step: cache sizing, nearest quantization, reconstruction, dot error, compression ratio.
 * @param {number[]} query - Query vector for attention score error check.
 * @param {number[]} originalKey - Original high-precision key vector.
 * @param {number[]} codebook - Sorted quantization levels for each coordinate.
 * @param {number} bitsPerValue - Effective bits per stored KV coordinate.
 * @param {number} layers - Transformer layer count.
 * @param {number} tokens - Context length in tokens.
 * @param {number} kvHeads - Number of KV attention heads.
 * @param {number} headDim - Dimension per KV head.
 * @returns {{ cacheBits: number, indices: number[], reconstructed: number[], dotError: number, compressionRatio: number, fullCacheBits: number }}
 */
function turboQuantKVStep(query, originalKey, codebook, bitsPerValue, layers, tokens, kvHeads, headDim) {
  const fp16Bits = 16;
  const fullCacheBits = layers * tokens * kvHeads * headDim * 2 * fp16Bits;
  const cacheBits = layers * tokens * kvHeads * headDim * 2 * bitsPerValue;

  function dot(a, b) {
    let sum = 0;
    for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
    return sum;
  }

  const d = originalKey.length;
  const indices = Array(d).fill(0);
  for (let i = 0; i < d; i++) {
    let bestIdx = 0;
    let minDist = Math.abs(originalKey[i] - codebook[0]);
    for (let j = 1; j < codebook.length; j++) {
      const dist = Math.abs(originalKey[i] - codebook[j]);
      if (dist < minDist) {
        minDist = dist;
        bestIdx = j;
      }
    }
    indices[i] = bestIdx;
  }

  const reconstructed = Array(d).fill(0);
  for (let i = 0; i < d; i++) {
    reconstructed[i] = codebook[indices[i]];
  }

  const dotError = Math.abs(dot(query, originalKey) - dot(query, reconstructed));
  const compressionRatio = fullCacheBits / cacheBits;

  return { cacheBits, indices, reconstructed, dotError, compressionRatio, fullCacheBits };
}`,explanation:"Nearest-neighbor quantization picks the codebook entry that minimizes per-coordinate reconstruction error."},{id:"turboquant-dequant-reconstruct",stepLabel:"TQ.3",group:"Dequant reconstruction",title:"Dequantize Key Vector",concept:"Stored indices are decoded back to floating-point values by table lookup into the TurboQuant codebook.",objective:"Inside turboQuantKVStep, set reconstructed[i] = codebook[indices[i]].",difficulty:"core",starterCode:`/**
 * Runs one TurboQuant KV evaluation step: cache sizing, nearest quantization, reconstruction, dot error, compression ratio.
 * @param {number[]} query - Query vector for attention score error check.
 * @param {number[]} originalKey - Original high-precision key vector.
 * @param {number[]} codebook - Sorted quantization levels for each coordinate.
 * @param {number} bitsPerValue - Effective bits per stored KV coordinate.
 * @param {number} layers - Transformer layer count.
 * @param {number} tokens - Context length in tokens.
 * @param {number} kvHeads - Number of KV attention heads.
 * @param {number} headDim - Dimension per KV head.
 * @returns {{ cacheBits: number, indices: number[], reconstructed: number[], dotError: number, compressionRatio: number, fullCacheBits: number }}
 */
function turboQuantKVStep(query, originalKey, codebook, bitsPerValue, layers, tokens, kvHeads, headDim) {
  const fp16Bits = 16;
  const fullCacheBits = layers * tokens * kvHeads * headDim * 2 * fp16Bits;
  const cacheBits = layers * tokens * kvHeads * headDim * 2 * bitsPerValue;

  function dot(a, b) {
    let sum = 0;
    for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
    return sum;
  }

  const d = originalKey.length;
  const indices = Array(d).fill(0);
  for (let i = 0; i < d; i++) {
    let bestIdx = 0;
    let minDist = Math.abs(originalKey[i] - codebook[0]);
    for (let j = 1; j < codebook.length; j++) {
      const dist = Math.abs(originalKey[i] - codebook[j]);
      if (dist < minDist) {
        minDist = dist;
        bestIdx = j;
      }
    }
    indices[i] = bestIdx;
  }

  const reconstructed = Array(d).fill(0);
  for (let i = 0; i < d; i++) {
    // TODO: reconstructed[i] = codebook[indices[i]]
  }

  const dotError = Math.abs(dot(query, originalKey) - dot(query, reconstructed));
  const compressionRatio = fullCacheBits / cacheBits;

  return { cacheBits, indices, reconstructed, dotError, compressionRatio, fullCacheBits };
}`,testCode:`const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function sameArray(a, b) { return a.length === b.length && a.every((v, i) => approxEqual(v, b[i])); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual, expected) });
}
check('lookup reconstruction', turboQuantKVStep([1], [0.2], [-1, 0, 1], 4, 1, 1, 1, 1).reconstructed, [0]);
check('multi dim', turboQuantKVStep([1], [0.2, -0.9], [-1, 0, 1], 4, 1, 1, 1, 2).reconstructed, [0, -1]);
return results;`,hints:["Each stored index points to one codebook level.","Lookup is a direct array read: codebook[indices[i]].","Assign inside the loop over dimensions."],solution:`/**
 * Runs one TurboQuant KV evaluation step: cache sizing, nearest quantization, reconstruction, dot error, compression ratio.
 * @param {number[]} query - Query vector for attention score error check.
 * @param {number[]} originalKey - Original high-precision key vector.
 * @param {number[]} codebook - Sorted quantization levels for each coordinate.
 * @param {number} bitsPerValue - Effective bits per stored KV coordinate.
 * @param {number} layers - Transformer layer count.
 * @param {number} tokens - Context length in tokens.
 * @param {number} kvHeads - Number of KV attention heads.
 * @param {number} headDim - Dimension per KV head.
 * @returns {{ cacheBits: number, indices: number[], reconstructed: number[], dotError: number, compressionRatio: number, fullCacheBits: number }}
 */
function turboQuantKVStep(query, originalKey, codebook, bitsPerValue, layers, tokens, kvHeads, headDim) {
  const fp16Bits = 16;
  const fullCacheBits = layers * tokens * kvHeads * headDim * 2 * fp16Bits;
  const cacheBits = layers * tokens * kvHeads * headDim * 2 * bitsPerValue;

  function dot(a, b) {
    let sum = 0;
    for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
    return sum;
  }

  const d = originalKey.length;
  const indices = Array(d).fill(0);
  for (let i = 0; i < d; i++) {
    let bestIdx = 0;
    let minDist = Math.abs(originalKey[i] - codebook[0]);
    for (let j = 1; j < codebook.length; j++) {
      const dist = Math.abs(originalKey[i] - codebook[j]);
      if (dist < minDist) {
        minDist = dist;
        bestIdx = j;
      }
    }
    indices[i] = bestIdx;
  }

  const reconstructed = Array(d).fill(0);
  for (let i = 0; i < d; i++) {
    reconstructed[i] = codebook[indices[i]];
  }

  const dotError = Math.abs(dot(query, originalKey) - dot(query, reconstructed));
  const compressionRatio = fullCacheBits / cacheBits;

  return { cacheBits, indices, reconstructed, dotError, compressionRatio, fullCacheBits };
}`,explanation:"Dequant reconstruction turns compact indices back into approximate key vectors for attention."},{id:"turboquant-dot-error",stepLabel:"TQ.4",group:"Dot-product error",title:"Attention Score Error",concept:"Quantization quality is measured by how much q·k changes after keys are reconstructed from codes.",objective:"Inside turboQuantKVStep, set dotError to |dot(query, originalKey) - dot(query, reconstructed)|.",difficulty:"core",starterCode:`/**
 * Runs one TurboQuant KV evaluation step: cache sizing, nearest quantization, reconstruction, dot error, compression ratio.
 * @param {number[]} query - Query vector for attention score error check.
 * @param {number[]} originalKey - Original high-precision key vector.
 * @param {number[]} codebook - Sorted quantization levels for each coordinate.
 * @param {number} bitsPerValue - Effective bits per stored KV coordinate.
 * @param {number} layers - Transformer layer count.
 * @param {number} tokens - Context length in tokens.
 * @param {number} kvHeads - Number of KV attention heads.
 * @param {number} headDim - Dimension per KV head.
 * @returns {{ cacheBits: number, indices: number[], reconstructed: number[], dotError: number, compressionRatio: number, fullCacheBits: number }}
 */
function turboQuantKVStep(query, originalKey, codebook, bitsPerValue, layers, tokens, kvHeads, headDim) {
  const fp16Bits = 16;
  const fullCacheBits = layers * tokens * kvHeads * headDim * 2 * fp16Bits;
  const cacheBits = layers * tokens * kvHeads * headDim * 2 * bitsPerValue;

  function dot(a, b) {
    let sum = 0;
    for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
    return sum;
  }

  const d = originalKey.length;
  const indices = Array(d).fill(0);
  for (let i = 0; i < d; i++) {
    let bestIdx = 0;
    let minDist = Math.abs(originalKey[i] - codebook[0]);
    for (let j = 1; j < codebook.length; j++) {
      const dist = Math.abs(originalKey[i] - codebook[j]);
      if (dist < minDist) {
        minDist = dist;
        bestIdx = j;
      }
    }
    indices[i] = bestIdx;
  }

  const reconstructed = Array(d).fill(0);
  for (let i = 0; i < d; i++) {
    reconstructed[i] = codebook[indices[i]];
  }

  let dotError = 0;
  // TODO: dotError = absolute difference between dot(query, originalKey) and dot(query, reconstructed)

  const compressionRatio = fullCacheBits / cacheBits;

  return { cacheBits, indices, reconstructed, dotError, compressionRatio, fullCacheBits };
}`,testCode:`const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('score error', turboQuantKVStep([1, 0], [2, 3], [-1, 0, 1], 4, 1, 1, 1, 2).dotError, 1);
check('exact reconstruction', turboQuantKVStep([1, 2], [1, 2], [-1, 0, 1, 2], 4, 1, 1, 1, 2).dotError, 0);
return results;`,hints:["Use the local dot helper on query with originalKey and reconstructed.","Take the absolute value of the difference.","dotError = Math.abs(dot(query, originalKey) - dot(query, reconstructed));"],solution:`/**
 * Runs one TurboQuant KV evaluation step: cache sizing, nearest quantization, reconstruction, dot error, compression ratio.
 * @param {number[]} query - Query vector for attention score error check.
 * @param {number[]} originalKey - Original high-precision key vector.
 * @param {number[]} codebook - Sorted quantization levels for each coordinate.
 * @param {number} bitsPerValue - Effective bits per stored KV coordinate.
 * @param {number} layers - Transformer layer count.
 * @param {number} tokens - Context length in tokens.
 * @param {number} kvHeads - Number of KV attention heads.
 * @param {number} headDim - Dimension per KV head.
 * @returns {{ cacheBits: number, indices: number[], reconstructed: number[], dotError: number, compressionRatio: number, fullCacheBits: number }}
 */
function turboQuantKVStep(query, originalKey, codebook, bitsPerValue, layers, tokens, kvHeads, headDim) {
  const fp16Bits = 16;
  const fullCacheBits = layers * tokens * kvHeads * headDim * 2 * fp16Bits;
  const cacheBits = layers * tokens * kvHeads * headDim * 2 * bitsPerValue;

  function dot(a, b) {
    let sum = 0;
    for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
    return sum;
  }

  const d = originalKey.length;
  const indices = Array(d).fill(0);
  for (let i = 0; i < d; i++) {
    let bestIdx = 0;
    let minDist = Math.abs(originalKey[i] - codebook[0]);
    for (let j = 1; j < codebook.length; j++) {
      const dist = Math.abs(originalKey[i] - codebook[j]);
      if (dist < minDist) {
        minDist = dist;
        bestIdx = j;
      }
    }
    indices[i] = bestIdx;
  }

  const reconstructed = Array(d).fill(0);
  for (let i = 0; i < d; i++) {
    reconstructed[i] = codebook[indices[i]];
  }

  let dotError = 0;
  dotError = Math.abs(dot(query, originalKey) - dot(query, reconstructed));

  const compressionRatio = fullCacheBits / cacheBits;

  return { cacheBits, indices, reconstructed, dotError, compressionRatio, fullCacheBits };
}`,explanation:"Dot-product error links quantization noise directly to attention score drift during inference."},{id:"turboquant-compression-ratio",stepLabel:"TQ.5",group:"Compression ratio",title:"KV Cache Compression Ratio",concept:"Compression ratio compares full FP16 KV storage against TurboQuant bit-packed storage.",objective:"Inside turboQuantKVStep, set compressionRatio = fullCacheBits / cacheBits.",difficulty:"core",starterCode:`/**
 * Runs one TurboQuant KV evaluation step: cache sizing, nearest quantization, reconstruction, dot error, compression ratio.
 * @param {number[]} query - Query vector for attention score error check.
 * @param {number[]} originalKey - Original high-precision key vector.
 * @param {number[]} codebook - Sorted quantization levels for each coordinate.
 * @param {number} bitsPerValue - Effective bits per stored KV coordinate.
 * @param {number} layers - Transformer layer count.
 * @param {number} tokens - Context length in tokens.
 * @param {number} kvHeads - Number of KV attention heads.
 * @param {number} headDim - Dimension per KV head.
 * @returns {{ cacheBits: number, indices: number[], reconstructed: number[], dotError: number, compressionRatio: number, fullCacheBits: number }}
 */
function turboQuantKVStep(query, originalKey, codebook, bitsPerValue, layers, tokens, kvHeads, headDim) {
  const fp16Bits = 16;
  const fullCacheBits = layers * tokens * kvHeads * headDim * 2 * fp16Bits;
  const cacheBits = layers * tokens * kvHeads * headDim * 2 * bitsPerValue;

  function dot(a, b) {
    let sum = 0;
    for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
    return sum;
  }

  const d = originalKey.length;
  const indices = Array(d).fill(0);
  for (let i = 0; i < d; i++) {
    let bestIdx = 0;
    let minDist = Math.abs(originalKey[i] - codebook[0]);
    for (let j = 1; j < codebook.length; j++) {
      const dist = Math.abs(originalKey[i] - codebook[j]);
      if (dist < minDist) {
        minDist = dist;
        bestIdx = j;
      }
    }
    indices[i] = bestIdx;
  }

  const reconstructed = Array(d).fill(0);
  for (let i = 0; i < d; i++) {
    reconstructed[i] = codebook[indices[i]];
  }

  const dotError = Math.abs(dot(query, originalKey) - dot(query, reconstructed));
  let compressionRatio = 0;
  // TODO: compressionRatio = fullCacheBits / cacheBits

  return { cacheBits, indices, reconstructed, dotError, compressionRatio, fullCacheBits };
}`,testCode:`const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('4-bit vs fp16', turboQuantKVStep([1], [0], [-1, 0, 1], 4, 32, 2048, 8, 128).compressionRatio, 4);
check('8-bit vs fp16', turboQuantKVStep([1], [0], [-1, 0, 1], 8, 1, 1, 1, 1).compressionRatio, 2);
return results;`,hints:["Divide full FP16 cache bits by quantized cache bits.","Fewer bits per value yields a larger compression ratio.","compressionRatio = fullCacheBits / cacheBits;"],solution:`/**
 * Runs one TurboQuant KV evaluation step: cache sizing, nearest quantization, reconstruction, dot error, compression ratio.
 * @param {number[]} query - Query vector for attention score error check.
 * @param {number[]} originalKey - Original high-precision key vector.
 * @param {number[]} codebook - Sorted quantization levels for each coordinate.
 * @param {number} bitsPerValue - Effective bits per stored KV coordinate.
 * @param {number} layers - Transformer layer count.
 * @param {number} tokens - Context length in tokens.
 * @param {number} kvHeads - Number of KV attention heads.
 * @param {number} headDim - Dimension per KV head.
 * @returns {{ cacheBits: number, indices: number[], reconstructed: number[], dotError: number, compressionRatio: number, fullCacheBits: number }}
 */
function turboQuantKVStep(query, originalKey, codebook, bitsPerValue, layers, tokens, kvHeads, headDim) {
  const fp16Bits = 16;
  const fullCacheBits = layers * tokens * kvHeads * headDim * 2 * fp16Bits;
  const cacheBits = layers * tokens * kvHeads * headDim * 2 * bitsPerValue;

  function dot(a, b) {
    let sum = 0;
    for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
    return sum;
  }

  const d = originalKey.length;
  const indices = Array(d).fill(0);
  for (let i = 0; i < d; i++) {
    let bestIdx = 0;
    let minDist = Math.abs(originalKey[i] - codebook[0]);
    for (let j = 1; j < codebook.length; j++) {
      const dist = Math.abs(originalKey[i] - codebook[j]);
      if (dist < minDist) {
        minDist = dist;
        bestIdx = j;
      }
    }
    indices[i] = bestIdx;
  }

  const reconstructed = Array(d).fill(0);
  for (let i = 0; i < d; i++) {
    reconstructed[i] = codebook[indices[i]];
  }

  const dotError = Math.abs(dot(query, originalKey) - dot(query, reconstructed));
  let compressionRatio = 0;
  compressionRatio = fullCacheBits / cacheBits;

  return { cacheBits, indices, reconstructed, dotError, compressionRatio, fullCacheBits };
}`,explanation:"Compression ratio summarizes the memory win from TurboQuant relative to dense FP16 KV caches."},{id:"quantize-find-nearest",stepLabel:"11.1",group:"Nearest codebook entry",title:"Nearest quantization level",concept:"Quantization compresses values by mapping floats to the nearest predefined codebook scale level.",objective:"Find the index in codebook levels that minimizes absolute distance to value.",difficulty:"warmup",starterCode:`function nearestQuantizationIndex(value, levels) {
  let bestIdx = 0;
  let minDist = Math.abs(value - levels[0]);
  
  for (let i = 1; i < levels.length; i++) {
    // TODO: update bestIdx if levels[i] is closer to value
  }
  
  return bestIdx;
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('quantize near 0.2', nearestQuantizationIndex(0.2, [-1, 0, 1]), 1); // 0 is nearest
check('quantize near 0.8', nearestQuantizationIndex(0.8, [-1, 0, 1]), 2); // 1 is nearest
return results;`,hints:["Calculate distance using Math.abs(value - levels[i]).","If this distance is less than minDist, update bestIdx and minDist."],solution:`function nearestQuantizationIndex(value, levels) {
  let bestIdx = 0;
  let minDist = Math.abs(value - levels[0]);
  
  for (let i = 1; i < levels.length; i++) {
    const dist = Math.abs(value - levels[i]);
    if (dist < minDist) {
      minDist = dist;
      bestIdx = i;
    }
  }
  
  return bestIdx;
}`,explanation:"Mapping floating-point weights to indexes of codebook levels compresses neural networks with minimal loss of accuracy."},{id:"quantmatmul-shape-guard",stepLabel:"EIC.1",group:"Shape guard",title:"Quantized Dot Shape Check",concept:"Quantized matmul kernels must reject mismatched vector lengths before INT8 accumulation.",objective:"Inside quantizedMatmulStep, return valid: false when a.length !== b.length.",difficulty:"warmup",starterCode:`/**
 * Runs one quantized dot-product step: validate shapes, INT8 accumulate, apply per-channel or global scales.
 * @param {number[]} a - Quantized INT8 vector A.
 * @param {number[]} b - Quantized INT8 vector B.
 * @param {number|number[]} scaleA - Global scale or per-channel scales for A.
 * @param {number|number[]} scaleB - Global scale or per-channel scales for B.
 * @returns {{ valid: boolean, intDot: number, scaled: number }} Validation flag and dot outputs.
 */
function quantizedMatmulStep(a, b, scaleA, scaleB) {
  if (a.length !== b.length) {
    // TODO: return invalid result with zeroed outputs.
    return { valid: true, intDot: 0, scaled: 0 };
  }

  let intDot = 0;
  for (let i = 0; i < a.length; i++) {
    intDot += a[i] * b[i];
  }

  let scaled = 0;
  if (Array.isArray(scaleA) && Array.isArray(scaleB)) {
    for (let i = 0; i < a.length; i++) {
      scaled += a[i] * b[i] * scaleA[i] * scaleB[i];
    }
  } else {
    scaled = intDot * scaleA * scaleB;
  }

  return { valid: true, intDot, scaled };
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('mismatch rejected', quantizedMatmulStep([1, 2], [3], 0.1, 0.1).valid, false);
check('match accepted', quantizedMatmulStep([1, 2], [3, 4], 0.1, 0.1).valid, true);
check('empty vectors valid', quantizedMatmulStep([], [], 1, 1).valid, true);
return results;`,hints:["When lengths differ, return valid: false immediately.","Set intDot and scaled to 0 for invalid inputs.","Only run accumulation when a.length === b.length."],solution:`/**
 * Runs one quantized dot-product step: validate shapes, INT8 accumulate, apply per-channel or global scales.
 * @param {number[]} a - Quantized INT8 vector A.
 * @param {number[]} b - Quantized INT8 vector B.
 * @param {number|number[]} scaleA - Global scale or per-channel scales for A.
 * @param {number|number[]} scaleB - Global scale or per-channel scales for B.
 * @returns {{ valid: boolean, intDot: number, scaled: number }} Validation flag and dot outputs.
 */
function quantizedMatmulStep(a, b, scaleA, scaleB) {
  if (a.length !== b.length) {
    return { valid: false, intDot: 0, scaled: 0 };
  }

  let intDot = 0;
  for (let i = 0; i < a.length; i++) {
    intDot += a[i] * b[i];
  }

  let scaled = 0;
  if (Array.isArray(scaleA) && Array.isArray(scaleB)) {
    for (let i = 0; i < a.length; i++) {
      scaled += a[i] * b[i] * scaleA[i] * scaleB[i];
    }
  } else {
    scaled = intDot * scaleA * scaleB;
  }

  return { valid: true, intDot, scaled };
}`,explanation:"Shape guards prevent silent wrong answers when compressed weight layouts do not align."},{id:"quantmatmul-int8-dot",stepLabel:"EIC.2",group:"INT8 dot",title:"INT8 Dot Accumulation",concept:"Efficient inference kernels accumulate dot products in integer arithmetic before any dequantization.",objective:"Inside quantizedMatmulStep, compute intDot as the sum of element-wise products a[i] * b[i].",difficulty:"core",starterCode:`/**
 * Runs one quantized dot-product step: validate shapes, INT8 accumulate, apply per-channel or global scales.
 * @param {number[]} a - Quantized INT8 vector A.
 * @param {number[]} b - Quantized INT8 vector B.
 * @param {number|number[]} scaleA - Global scale or per-channel scales for A.
 * @param {number|number[]} scaleB - Global scale or per-channel scales for B.
 * @returns {{ valid: boolean, intDot: number, scaled: number }} Validation flag and dot outputs.
 */
function quantizedMatmulStep(a, b, scaleA, scaleB) {
  if (a.length !== b.length) {
    return { valid: false, intDot: 0, scaled: 0 };
  }

  let intDot = 0;
  for (let i = 0; i < a.length; i++) {
    // TODO: accumulate a[i] * b[i] into intDot.
  }

  let scaled = 0;
  if (Array.isArray(scaleA) && Array.isArray(scaleB)) {
    for (let i = 0; i < a.length; i++) {
      scaled += a[i] * b[i] * scaleA[i] * scaleB[i];
    }
  } else {
    scaled = intDot * scaleA * scaleB;
  }

  return { valid: true, intDot, scaled };
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('integer dot', quantizedMatmulStep([10, -5, 3], [2, 4, 1], 1, 1).intDot, 10 * 2 + (-5) * 4 + 3 * 1);
check('negative products', quantizedMatmulStep([-2, 7], [5, -1], 1, 1).intDot, -17);
return results;`,hints:["Multiply matching indices and add into intDot inside the loop.","INT8 values are still numbers in JavaScript — accumulate normally.","intDot += a[i] * b[i];"],solution:`/**
 * Runs one quantized dot-product step: validate shapes, INT8 accumulate, apply per-channel or global scales.
 * @param {number[]} a - Quantized INT8 vector A.
 * @param {number[]} b - Quantized INT8 vector B.
 * @param {number|number[]} scaleA - Global scale or per-channel scales for A.
 * @param {number|number[]} scaleB - Global scale or per-channel scales for B.
 * @returns {{ valid: boolean, intDot: number, scaled: number }} Validation flag and dot outputs.
 */
function quantizedMatmulStep(a, b, scaleA, scaleB) {
  if (a.length !== b.length) {
    return { valid: false, intDot: 0, scaled: 0 };
  }

  let intDot = 0;
  for (let i = 0; i < a.length; i++) {
    intDot += a[i] * b[i];
  }

  let scaled = 0;
  if (Array.isArray(scaleA) && Array.isArray(scaleB)) {
    for (let i = 0; i < a.length; i++) {
      scaled += a[i] * b[i] * scaleA[i] * scaleB[i];
    }
  } else {
    scaled = intDot * scaleA * scaleB;
  }

  return { valid: true, intDot, scaled };
}`,explanation:"Integer accumulation is the fast path; dequantization happens only after the dot is complete."},{id:"quantmatmul-dequant-fuse",stepLabel:"EIC.3",group:"Dequant fuse",title:"Fused Global Dequantization",concept:"When scales are scalar per tensor, hardware fuses dequant as intDot * scaleA * scaleB after the INT8 dot.",objective:"Inside quantizedMatmulStep, when scales are numbers, set scaled = intDot * scaleA * scaleB.",difficulty:"core",starterCode:`/**
 * Runs one quantized dot-product step: validate shapes, INT8 accumulate, apply per-channel or global scales.
 * @param {number[]} a - Quantized INT8 vector A.
 * @param {number[]} b - Quantized INT8 vector B.
 * @param {number|number[]} scaleA - Global scale or per-channel scales for A.
 * @param {number|number[]} scaleB - Global scale or per-channel scales for B.
 * @returns {{ valid: boolean, intDot: number, scaled: number }} Validation flag and dot outputs.
 */
function quantizedMatmulStep(a, b, scaleA, scaleB) {
  if (a.length !== b.length) {
    return { valid: false, intDot: 0, scaled: 0 };
  }

  let intDot = 0;
  for (let i = 0; i < a.length; i++) {
    intDot += a[i] * b[i];
  }

  let scaled = 0;
  if (Array.isArray(scaleA) && Array.isArray(scaleB)) {
    for (let i = 0; i < a.length; i++) {
      scaled += a[i] * b[i] * scaleA[i] * scaleB[i];
    }
  } else {
    // TODO: scaled = intDot * scaleA * scaleB
  }

  return { valid: true, intDot, scaled };
}`,testCode:`const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('fused global scale', quantizedMatmulStep([10, -5], [20, 30], 0.1, 0.05).scaled, 0.25);
check('unit scales', quantizedMatmulStep([3, 4], [5, 6], 1, 1).scaled, 39);
return results;`,hints:["Use the else branch for scalar scaleA and scaleB.","Multiply intDot by both scales once.","scaled = intDot * scaleA * scaleB;"],solution:`/**
 * Runs one quantized dot-product step: validate shapes, INT8 accumulate, apply per-channel or global scales.
 * @param {number[]} a - Quantized INT8 vector A.
 * @param {number[]} b - Quantized INT8 vector B.
 * @param {number|number[]} scaleA - Global scale or per-channel scales for A.
 * @param {number|number[]} scaleB - Global scale or per-channel scales for B.
 * @returns {{ valid: boolean, intDot: number, scaled: number }} Validation flag and dot outputs.
 */
function quantizedMatmulStep(a, b, scaleA, scaleB) {
  if (a.length !== b.length) {
    return { valid: false, intDot: 0, scaled: 0 };
  }

  let intDot = 0;
  for (let i = 0; i < a.length; i++) {
    intDot += a[i] * b[i];
  }

  let scaled = 0;
  if (Array.isArray(scaleA) && Array.isArray(scaleB)) {
    for (let i = 0; i < a.length; i++) {
      scaled += a[i] * b[i] * scaleA[i] * scaleB[i];
    }
  } else {
    scaled = intDot * scaleA * scaleB;
  }

  return { valid: true, intDot, scaled };
}`,explanation:"Fusing global scales after INT8 matmul avoids per-element float work during accumulation."},{id:"quantmatmul-per-channel",stepLabel:"EIC.4",group:"Per-channel scale",title:"Per-Channel Dequantization",concept:"Per-channel quantization stores a scale per row or column, applying scaleA[i] * scaleB[i] per product.",objective:"Inside quantizedMatmulStep, when scales are arrays, sum a[i] * b[i] * scaleA[i] * scaleB[i].",difficulty:"core",starterCode:`/**
 * Runs one quantized dot-product step: validate shapes, INT8 accumulate, apply per-channel or global scales.
 * @param {number[]} a - Quantized INT8 vector A.
 * @param {number[]} b - Quantized INT8 vector B.
 * @param {number|number[]} scaleA - Global scale or per-channel scales for A.
 * @param {number|number[]} scaleB - Global scale or per-channel scales for B.
 * @returns {{ valid: boolean, intDot: number, scaled: number }} Validation flag and dot outputs.
 */
function quantizedMatmulStep(a, b, scaleA, scaleB) {
  if (a.length !== b.length) {
    return { valid: false, intDot: 0, scaled: 0 };
  }

  let intDot = 0;
  for (let i = 0; i < a.length; i++) {
    intDot += a[i] * b[i];
  }

  let scaled = 0;
  if (Array.isArray(scaleA) && Array.isArray(scaleB)) {
    for (let i = 0; i < a.length; i++) {
      // TODO: add a[i] * b[i] * scaleA[i] * scaleB[i] to scaled.
    }
  } else {
    scaled = intDot * scaleA * scaleB;
  }

  return { valid: true, intDot, scaled };
}`,testCode:`const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('per-channel fuse', quantizedMatmulStep([10, 5], [2, 4], [0.1, 0.2], [0.5, 0.25]).scaled, 10 * 2 * 0.1 * 0.5 + 5 * 4 * 0.2 * 0.25);
check('uniform channel scales', quantizedMatmulStep([3, 1], [2, 8], [0.5, 0.5], [2, 2]).scaled, 14);
return results;`,hints:["Each index carries its own scale pair.","Accumulate scaled partial products in the array branch.","scaled += a[i] * b[i] * scaleA[i] * scaleB[i];"],solution:`/**
 * Runs one quantized dot-product step: validate shapes, INT8 accumulate, apply per-channel or global scales.
 * @param {number[]} a - Quantized INT8 vector A.
 * @param {number[]} b - Quantized INT8 vector B.
 * @param {number|number[]} scaleA - Global scale or per-channel scales for A.
 * @param {number|number[]} scaleB - Global scale or per-channel scales for B.
 * @returns {{ valid: boolean, intDot: number, scaled: number }} Validation flag and dot outputs.
 */
function quantizedMatmulStep(a, b, scaleA, scaleB) {
  if (a.length !== b.length) {
    return { valid: false, intDot: 0, scaled: 0 };
  }

  let intDot = 0;
  for (let i = 0; i < a.length; i++) {
    intDot += a[i] * b[i];
  }

  let scaled = 0;
  if (Array.isArray(scaleA) && Array.isArray(scaleB)) {
    for (let i = 0; i < a.length; i++) {
      scaled += a[i] * b[i] * scaleA[i] * scaleB[i];
    }
  } else {
    scaled = intDot * scaleA * scaleB;
  }

  return { valid: true, intDot, scaled };
}`,explanation:"Per-channel scales recover accuracy when different weight channels need different dynamic ranges."},{id:"quantized-dot-scale",stepLabel:"13.1",group:"Dequant fuse",title:"Scale quantized dot product",concept:"To speed up execution, hardware performs dot products in INT8 and then scales the output back to FLOAT using per-channel scale factors.",objective:"Compute integer dot product of a and b, then scale the result by scaleA * scaleB.",difficulty:"core",starterCode:`function quantizedDotScale(a, b, scaleA, scaleB) {
  let intDot = 0;
  for (let i = 0; i < a.length; i++) {
    intDot += a[i] * b[i];
  }
  // TODO: return intDot multiplied by the combined scales
  return 0;
}`,testCode:`const results = [];
function approxEqual(a, b, tol = 1e-5) {
  return Math.abs(a - b) <= tol;
}
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('scale quantized dot', quantizedDotScale([10, -5], [20, 30], 0.1, 0.05), 0.25);
return results;`,hints:["Multiply intDot by scaleA.","Then multiply by scaleB.","return intDot * scaleA * scaleB;"],solution:`function quantizedDotScale(a, b, scaleA, scaleB) {
  let intDot = 0;
  for (let i = 0; i < a.length; i++) {
    intDot += a[i] * b[i];
  }
  return intDot * scaleA * scaleB;
}`,explanation:"Fusing scales after matrix operations reduces floating-point overhead."},{id:"bert-mlm-masking",stepLabel:"14.1",group:"80-10-10 masking rule",title:"BERT MLM 80/10/10 Masking Rule",concept:"BERT corrupts 15% of selected tokens using 80% [MASK], 10% random replacement, and 10% unchanged tokens.",objective:"Inside bertMlmStep, apply the 80/10/10 rule on maskIndices using randVals and randTokens.",difficulty:"warmup",starterCode:`/**
 * Runs one BERT MLM training step: corrupt tokens, build mask, compute loss and predictions.
 * @param {number[]} tokens - Input token IDs.
 * @param {number[]} labels - Ground-truth label IDs.
 * @param {number[]} maskIndices - Positions selected for MLM corruption.
 * @param {number[]} randVals - Uniform values in [0,1) for 80/10/10 decisions.
 * @param {number[]} randTokens - Random vocab IDs for the 10% replacement branch.
 * @param {number[][]} logits - Vocabulary logits [seqLen, vocabSize].
 * @returns {{ corrupted: number[], attnMask: number[][], loss: number, predictions: number[] }} Step outputs.
 */
function bertMlmStep(tokens, labels, maskIndices, randVals, randTokens, logits) {
  const corrupted = [...tokens];
  // TODO: apply 80% mask token 103, 10% random token, 10% unchanged on maskIndices.

  const seqLen = tokens.length;
  const attnMask = Array.from({ length: seqLen }, () => Array(seqLen).fill(0));
  for (let i = 0; i < seqLen; i++) {
    for (let j = 0; j < seqLen; j++) {
      if (tokens[i] !== 0 && tokens[j] !== 0) attnMask[i][j] = 1;
    }
  }

  const predictions = logits.map((row) => {
    let maxIdx = 0;
    for (let j = 1; j < row.length; j++) {
      if (row[j] > row[maxIdx]) maxIdx = j;
    }
    return maxIdx;
  });

  let loss = 0;
  if (maskIndices.length > 0) {
    for (let m = 0; m < maskIndices.length; m++) {
      const idx = maskIndices[m];
      const row = logits[idx];
      const target = labels[idx];
      const maxLogit = Math.max(...row);
      const exps = row.map((l) => Math.exp(l - maxLogit));
      const sumExp = exps.reduce((s, v) => s + v, 0);
      loss -= Math.log(exps[target] / sumExp);
    }
    loss /= maskIndices.length;
  }

  return { corrupted, attnMask, loss, predictions };
}`,testCode:`const results = [];
function sameArray(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual, expected) });
}
const tokens = [10, 20, 30, 40, 50];
const logits = tokens.map(() => [0, 0]);
const out = bertMlmStep(tokens, tokens, [0, 1, 2], [0.5, 0.85, 0.95], [5, 99, 12], logits);
check('80-10-10 corruption', out.corrupted, [103, 99, 30, 40, 50]);
return results;`,hints:["randVals[i] < 0.8 means replace with token 103.","Between 0.8 and 0.9 use randTokens[i].","Otherwise leave corrupted[idx] unchanged."],solution:`/**
 * Runs one BERT MLM training step: corrupt tokens, build mask, compute loss and predictions.
 * @param {number[]} tokens - Input token IDs.
 * @param {number[]} labels - Ground-truth label IDs.
 * @param {number[]} maskIndices - Positions selected for MLM corruption.
 * @param {number[]} randVals - Uniform values in [0,1) for 80/10/10 decisions.
 * @param {number[]} randTokens - Random vocab IDs for the 10% replacement branch.
 * @param {number[][]} logits - Vocabulary logits [seqLen, vocabSize].
 * @returns {{ corrupted: number[], attnMask: number[][], loss: number, predictions: number[] }} Step outputs.
 */
function bertMlmStep(tokens, labels, maskIndices, randVals, randTokens, logits) {
  const corrupted = [...tokens];
  for (let i = 0; i < maskIndices.length; i++) {
    const idx = maskIndices[i];
    const r = randVals[i];
    if (r < 0.8) {
      corrupted[idx] = 103;
    } else if (r < 0.9) {
      corrupted[idx] = randTokens[i];
    }
  }

  const seqLen = tokens.length;
  const attnMask = Array.from({ length: seqLen }, () => Array(seqLen).fill(0));
  for (let i = 0; i < seqLen; i++) {
    for (let j = 0; j < seqLen; j++) {
      if (tokens[i] !== 0 && tokens[j] !== 0) attnMask[i][j] = 1;
    }
  }

  const predictions = logits.map((row) => {
    let maxIdx = 0;
    for (let j = 1; j < row.length; j++) {
      if (row[j] > row[maxIdx]) maxIdx = j;
    }
    return maxIdx;
  });

  let loss = 0;
  if (maskIndices.length > 0) {
    for (let m = 0; m < maskIndices.length; m++) {
      const idx = maskIndices[m];
      const row = logits[idx];
      const target = labels[idx];
      const maxLogit = Math.max(...row);
      const exps = row.map((l) => Math.exp(l - maxLogit));
      const sumExp = exps.reduce((s, v) => s + v, 0);
      loss -= Math.log(exps[target] / sumExp);
    }
    loss /= maskIndices.length;
  }

  return { corrupted, attnMask, loss, predictions };
}`,explanation:"80/10/10 corruption teaches BERT to recover tokens from masks while still seeing the original token sometimes at train time."},{id:"bert-bidirectional-mask",stepLabel:"14.2",group:"Bidirectional attention mask",title:"BERT Bidirectional Attention Mask",concept:"BERT attends bidirectionally, but padding tokens (ID 0) must be blocked from both attending and being attended to.",objective:"Inside bertMlmStep, set attnMask[i][j] = 1 only when neither token i nor j is padding.",difficulty:"core",starterCode:`/**
 * Runs one BERT MLM training step: corrupt tokens, build mask, compute loss and predictions.
 * @param {number[]} tokens - Input token IDs.
 * @param {number[]} labels - Ground-truth label IDs.
 * @param {number[]} maskIndices - Positions selected for MLM corruption.
 * @param {number[]} randVals - Uniform values in [0,1) for 80/10/10 decisions.
 * @param {number[]} randTokens - Random vocab IDs for the 10% replacement branch.
 * @param {number[][]} logits - Vocabulary logits [seqLen, vocabSize].
 * @returns {{ corrupted: number[], attnMask: number[][], loss: number, predictions: number[] }} Step outputs.
 */
function bertMlmStep(tokens, labels, maskIndices, randVals, randTokens, logits) {
  const corrupted = [...tokens];
  for (let i = 0; i < maskIndices.length; i++) {
    const idx = maskIndices[i];
    const r = randVals[i];
    if (r < 0.8) corrupted[idx] = 103;
    else if (r < 0.9) corrupted[idx] = randTokens[i];
  }

  const seqLen = tokens.length;
  const attnMask = Array.from({ length: seqLen }, () => Array(seqLen).fill(0));
  // TODO: fill attnMask[i][j] = 1 when tokens[i] !== 0 && tokens[j] !== 0.

  const predictions = logits.map((row) => {
    let maxIdx = 0;
    for (let j = 1; j < row.length; j++) {
      if (row[j] > row[maxIdx]) maxIdx = j;
    }
    return maxIdx;
  });

  let loss = 0;
  if (maskIndices.length > 0) {
    for (let m = 0; m < maskIndices.length; m++) {
      const idx = maskIndices[m];
      const row = logits[idx];
      const target = labels[idx];
      const maxLogit = Math.max(...row);
      const exps = row.map((l) => Math.exp(l - maxLogit));
      const sumExp = exps.reduce((s, v) => s + v, 0);
      loss -= Math.log(exps[target] / sumExp);
    }
    loss /= maskIndices.length;
  }

  return { corrupted, attnMask, loss, predictions };
}`,testCode:`const results = [];
function sameArray(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual, expected) });
}
const logits = [[0, 0], [0, 0], [0, 0]];
const out = bertMlmStep([10, 20, 0], [0, 1, 0], [], [], [], logits);
check('padding blocked', out.attnMask, [[1, 1, 0], [1, 1, 0], [0, 0, 0]]);
return results;`,hints:["Loop over every pair (i, j).","Set mask entry to 1 only when both tokens are non-zero."],solution:`/**
 * Runs one BERT MLM training step: corrupt tokens, build mask, compute loss and predictions.
 * @param {number[]} tokens - Input token IDs.
 * @param {number[]} labels - Ground-truth label IDs.
 * @param {number[]} maskIndices - Positions selected for MLM corruption.
 * @param {number[]} randVals - Uniform values in [0,1) for 80/10/10 decisions.
 * @param {number[]} randTokens - Random vocab IDs for the 10% replacement branch.
 * @param {number[][]} logits - Vocabulary logits [seqLen, vocabSize].
 * @returns {{ corrupted: number[], attnMask: number[][], loss: number, predictions: number[] }} Step outputs.
 */
function bertMlmStep(tokens, labels, maskIndices, randVals, randTokens, logits) {
  const corrupted = [...tokens];
  for (let i = 0; i < maskIndices.length; i++) {
    const idx = maskIndices[i];
    const r = randVals[i];
    if (r < 0.8) corrupted[idx] = 103;
    else if (r < 0.9) corrupted[idx] = randTokens[i];
  }

  const seqLen = tokens.length;
  const attnMask = Array.from({ length: seqLen }, () => Array(seqLen).fill(0));
  for (let i = 0; i < seqLen; i++) {
    for (let j = 0; j < seqLen; j++) {
      if (tokens[i] !== 0 && tokens[j] !== 0) attnMask[i][j] = 1;
    }
  }

  const predictions = logits.map((row) => {
    let maxIdx = 0;
    for (let j = 1; j < row.length; j++) {
      if (row[j] > row[maxIdx]) maxIdx = j;
    }
    return maxIdx;
  });

  let loss = 0;
  if (maskIndices.length > 0) {
    for (let m = 0; m < maskIndices.length; m++) {
      const idx = maskIndices[m];
      const row = logits[idx];
      const target = labels[idx];
      const maxLogit = Math.max(...row);
      const exps = row.map((l) => Math.exp(l - maxLogit));
      const sumExp = exps.reduce((s, v) => s + v, 0);
      loss -= Math.log(exps[target] / sumExp);
    }
    loss /= maskIndices.length;
  }

  return { corrupted, attnMask, loss, predictions };
}`,explanation:"Padding masks stop inactive positions from polluting bidirectional context."},{id:"bert-mlm-loss",stepLabel:"14.3",group:"MLM cross-entropy loss",title:"BERT MLM Cross-Entropy Loss",concept:"MLM loss averages cross-entropy only at masked positions, ignoring uncorrupted tokens.",objective:"Inside bertMlmStep, compute average cross-entropy loss over maskIndices.",difficulty:"core",starterCode:`/**
 * Runs one BERT MLM training step: corrupt tokens, build mask, compute loss and predictions.
 * @param {number[]} tokens - Input token IDs.
 * @param {number[]} labels - Ground-truth label IDs.
 * @param {number[]} maskIndices - Positions selected for MLM corruption.
 * @param {number[]} randVals - Uniform values in [0,1) for 80/10/10 decisions.
 * @param {number[]} randTokens - Random vocab IDs for the 10% replacement branch.
 * @param {number[][]} logits - Vocabulary logits [seqLen, vocabSize].
 * @returns {{ corrupted: number[], attnMask: number[][], loss: number, predictions: number[] }} Step outputs.
 */
function bertMlmStep(tokens, labels, maskIndices, randVals, randTokens, logits) {
  const corrupted = [...tokens];
  for (let i = 0; i < maskIndices.length; i++) {
    const idx = maskIndices[i];
    const r = randVals[i];
    if (r < 0.8) corrupted[idx] = 103;
    else if (r < 0.9) corrupted[idx] = randTokens[i];
  }

  const seqLen = tokens.length;
  const attnMask = Array.from({ length: seqLen }, () => Array(seqLen).fill(0));
  for (let i = 0; i < seqLen; i++) {
    for (let j = 0; j < seqLen; j++) {
      if (tokens[i] !== 0 && tokens[j] !== 0) attnMask[i][j] = 1;
    }
  }

  const predictions = logits.map((row) => {
    let maxIdx = 0;
    for (let j = 1; j < row.length; j++) {
      if (row[j] > row[maxIdx]) maxIdx = j;
    }
    return maxIdx;
  });

  let loss = 0;
  // TODO: average cross-entropy loss over maskIndices using stable softmax on logits[idx].

  return { corrupted, attnMask, loss, predictions };
}`,testCode:`const results = [];
function approxEqual(a, b, tol = 1e-4) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const logits = [[2, 0], [0, 2], [1, 1]];
const out = bertMlmStep([1, 2, 3], [0, 1, 0], [0, 2], [0.1, 0.1], [9, 9], logits);
check('mlm loss average', out.loss, 0.410037);
return results;`,hints:["For each masked index, softmax the logit row stably.","Accumulate -log(prob[target]) and divide by maskIndices.length."],solution:`/**
 * Runs one BERT MLM training step: corrupt tokens, build mask, compute loss and predictions.
 * @param {number[]} tokens - Input token IDs.
 * @param {number[]} labels - Ground-truth label IDs.
 * @param {number[]} maskIndices - Positions selected for MLM corruption.
 * @param {number[]} randVals - Uniform values in [0,1) for 80/10/10 decisions.
 * @param {number[]} randTokens - Random vocab IDs for the 10% replacement branch.
 * @param {number[][]} logits - Vocabulary logits [seqLen, vocabSize].
 * @returns {{ corrupted: number[], attnMask: number[][], loss: number, predictions: number[] }} Step outputs.
 */
function bertMlmStep(tokens, labels, maskIndices, randVals, randTokens, logits) {
  const corrupted = [...tokens];
  for (let i = 0; i < maskIndices.length; i++) {
    const idx = maskIndices[i];
    const r = randVals[i];
    if (r < 0.8) corrupted[idx] = 103;
    else if (r < 0.9) corrupted[idx] = randTokens[i];
  }

  const seqLen = tokens.length;
  const attnMask = Array.from({ length: seqLen }, () => Array(seqLen).fill(0));
  for (let i = 0; i < seqLen; i++) {
    for (let j = 0; j < seqLen; j++) {
      if (tokens[i] !== 0 && tokens[j] !== 0) attnMask[i][j] = 1;
    }
  }

  const predictions = logits.map((row) => {
    let maxIdx = 0;
    for (let j = 1; j < row.length; j++) {
      if (row[j] > row[maxIdx]) maxIdx = j;
    }
    return maxIdx;
  });

  let loss = 0;
  if (maskIndices.length > 0) {
    for (let m = 0; m < maskIndices.length; m++) {
      const idx = maskIndices[m];
      const row = logits[idx];
      const target = labels[idx];
      const maxLogit = Math.max(...row);
      const exps = row.map((l) => Math.exp(l - maxLogit));
      const sumExp = exps.reduce((s, v) => s + v, 0);
      loss -= Math.log(exps[target] / sumExp);
    }
    loss /= maskIndices.length;
  }

  return { corrupted, attnMask, loss, predictions };
}`,explanation:"Restricting loss to masked positions is what makes BERT learn to reconstruct context rather than copy visible tokens."},{id:"bert-mlm-forward",stepLabel:"14.4",group:"BERT MLM step",title:"Complete BERT MLM Forward Step",concept:"A complete BERT MLM step returns corrupted inputs, bidirectional mask, masked loss, and argmax predictions from logits.",objective:"Inside bertMlmStep, compute argmax predictions for every sequence position.",difficulty:"challenge",starterCode:`/**
 * Runs one BERT MLM training step: corrupt tokens, build mask, compute loss and predictions.
 * @param {number[]} tokens - Input token IDs.
 * @param {number[]} labels - Ground-truth label IDs.
 * @param {number[]} maskIndices - Positions selected for MLM corruption.
 * @param {number[]} randVals - Uniform values in [0,1) for 80/10/10 decisions.
 * @param {number[]} randTokens - Random vocab IDs for the 10% replacement branch.
 * @param {number[][]} logits - Vocabulary logits [seqLen, vocabSize].
 * @returns {{ corrupted: number[], attnMask: number[][], loss: number, predictions: number[] }} Step outputs.
 */
function bertMlmStep(tokens, labels, maskIndices, randVals, randTokens, logits) {
  const corrupted = [...tokens];
  for (let i = 0; i < maskIndices.length; i++) {
    const idx = maskIndices[i];
    const r = randVals[i];
    if (r < 0.8) corrupted[idx] = 103;
    else if (r < 0.9) corrupted[idx] = randTokens[i];
  }

  const seqLen = tokens.length;
  const attnMask = Array.from({ length: seqLen }, () => Array(seqLen).fill(0));
  for (let i = 0; i < seqLen; i++) {
    for (let j = 0; j < seqLen; j++) {
      if (tokens[i] !== 0 && tokens[j] !== 0) attnMask[i][j] = 1;
    }
  }

  const predictions = [];
  // TODO: for each logits row, push the argmax vocab index.

  let loss = 0;
  if (maskIndices.length > 0) {
    for (let m = 0; m < maskIndices.length; m++) {
      const idx = maskIndices[m];
      const row = logits[idx];
      const target = labels[idx];
      const maxLogit = Math.max(...row);
      const exps = row.map((l) => Math.exp(l - maxLogit));
      const sumExp = exps.reduce((s, v) => s + v, 0);
      loss -= Math.log(exps[target] / sumExp);
    }
    loss /= maskIndices.length;
  }

  return { corrupted, attnMask, loss, predictions };
}`,testCode:`const results = [];
function approxEqual(a, b, tol = 1e-4) { return Math.abs(a - b) <= tol; }
function sameArray(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual.predictions, expected.predictions) && approxEqual(actual.loss, expected.loss) });
}
const logits = [[2, 0], [0, 2], [1, 1]];
const out = bertMlmStep([10, 20, 0], [0, 1, 0], [0, 1], [0.1, 0.1], [9, 9], logits);
check('full bert step', out, { predictions: [0, 1, 0], loss: 0.126928 });
return results;`,hints:["Scan each logit row for the maximum value index.","Push that argmax index into predictions."],solution:`/**
 * Runs one BERT MLM training step: corrupt tokens, build mask, compute loss and predictions.
 * @param {number[]} tokens - Input token IDs.
 * @param {number[]} labels - Ground-truth label IDs.
 * @param {number[]} maskIndices - Positions selected for MLM corruption.
 * @param {number[]} randVals - Uniform values in [0,1) for 80/10/10 decisions.
 * @param {number[]} randTokens - Random vocab IDs for the 10% replacement branch.
 * @param {number[][]} logits - Vocabulary logits [seqLen, vocabSize].
 * @returns {{ corrupted: number[], attnMask: number[][], loss: number, predictions: number[] }} Step outputs.
 */
function bertMlmStep(tokens, labels, maskIndices, randVals, randTokens, logits) {
  const corrupted = [...tokens];
  for (let i = 0; i < maskIndices.length; i++) {
    const idx = maskIndices[i];
    const r = randVals[i];
    if (r < 0.8) corrupted[idx] = 103;
    else if (r < 0.9) corrupted[idx] = randTokens[i];
  }

  const seqLen = tokens.length;
  const attnMask = Array.from({ length: seqLen }, () => Array(seqLen).fill(0));
  for (let i = 0; i < seqLen; i++) {
    for (let j = 0; j < seqLen; j++) {
      if (tokens[i] !== 0 && tokens[j] !== 0) attnMask[i][j] = 1;
    }
  }

  const predictions = logits.map((row) => {
    let maxIdx = 0;
    for (let j = 1; j < row.length; j++) {
      if (row[j] > row[maxIdx]) maxIdx = j;
    }
    return maxIdx;
  });

  let loss = 0;
  if (maskIndices.length > 0) {
    for (let m = 0; m < maskIndices.length; m++) {
      const idx = maskIndices[m];
      const row = logits[idx];
      const target = labels[idx];
      const maxLogit = Math.max(...row);
      const exps = row.map((l) => Math.exp(l - maxLogit));
      const sumExp = exps.reduce((s, v) => s + v, 0);
      loss -= Math.log(exps[target] / sumExp);
    }
    loss /= maskIndices.length;
  }

  return { corrupted, attnMask, loss, predictions };
}`,explanation:"Returning corruption, mask, loss, and predictions together mirrors one BERT MLM training forward pass."},{id:"moe-softmax-gate",stepLabel:"MoE.1",group:"Softmax gate",title:"Router Softmax Gate",concept:"MoE routers convert raw expert logits into routing probabilities with a numerically stable softmax.",objective:"Inside moeRouterStep, fill gateProbs with softmax(logits).",difficulty:"warmup",starterCode:`/**
 * Runs one MoE router step: softmax gate, top-k routing, load tally, weighted expert combine.
 * @param {number[]} logits - Raw router logits per expert.
 * @param {number} k - Number of experts to activate per token.
 * @param {number[][]} expertOutputs - Expert output vectors indexed by expert id.
 * @param {number[]} batchAssignments - Flat list of expert ids chosen across the batch (for load counts).
 * @returns {{ gateProbs: number[], topExperts: number[], topWeights: number[], loadCounts: number[], combined: number[] }}
 */
function moeRouterStep(logits, k, expertOutputs, batchAssignments) {
  const maxLogit = Math.max(...logits);
  const exps = logits.map((l) => Math.exp(l - maxLogit));
  const sumExp = exps.reduce((s, v) => s + v, 0);
  const gateProbs = [];
  // TODO: push exps[i] / sumExp into gateProbs for each expert.

  const ranked = gateProbs.map((p, idx) => ({ idx, p }));
  ranked.sort((a, b) => b.p - a.p || a.idx - b.idx);
  const topExperts = ranked.slice(0, k).map((entry) => entry.idx);

  let weightSum = 0;
  const topWeights = topExperts.map((idx) => gateProbs[idx]);
  for (const w of topWeights) weightSum += w;
  for (let i = 0; i < topWeights.length; i++) topWeights[i] /= weightSum;

  const loadCounts = Array(logits.length).fill(0);
  for (const expertIdx of batchAssignments) loadCounts[expertIdx] += 1;

  const dim = expertOutputs[0].length;
  const combined = Array(dim).fill(0);
  for (let i = 0; i < topExperts.length; i++) {
    const expertIdx = topExperts[i];
    const weight = topWeights[i];
    for (let d = 0; d < dim; d++) combined[d] += weight * expertOutputs[expertIdx][d];
  }

  return { gateProbs, topExperts, topWeights, loadCounts, combined };
}`,testCode:`const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function sameArray(a, b) { return a.length === b.length && a.every((v, i) => approxEqual(v, b[i])); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual, expected) });
}
const experts = [[1], [0], [0]];
check('softmax gate', moeRouterStep([0, 1, 0], 1, experts, []).gateProbs, [0.211942594, 0.576117915, 0.211942594]);
check('probabilities sum to one', moeRouterStep([2, 1, 3], 2, experts, []).gateProbs.reduce((s, v) => s + v, 0), 1);
return results;`,hints:["Subtract maxLogit before exp for stability (already done in exps).","Divide each exponential by sumExp.","gateProbs.push(exps[i] / sumExp);"],solution:`/**
 * Runs one MoE router step: softmax gate, top-k routing, load tally, weighted expert combine.
 * @param {number[]} logits - Raw router logits per expert.
 * @param {number} k - Number of experts to activate per token.
 * @param {number[][]} expertOutputs - Expert output vectors indexed by expert id.
 * @param {number[]} batchAssignments - Flat list of expert ids chosen across the batch (for load counts).
 * @returns {{ gateProbs: number[], topExperts: number[], topWeights: number[], loadCounts: number[], combined: number[] }}
 */
function moeRouterStep(logits, k, expertOutputs, batchAssignments) {
  const maxLogit = Math.max(...logits);
  const exps = logits.map((l) => Math.exp(l - maxLogit));
  const sumExp = exps.reduce((s, v) => s + v, 0);
  const gateProbs = [];
  for (let i = 0; i < logits.length; i++) gateProbs.push(exps[i] / sumExp);

  const ranked = gateProbs.map((p, idx) => ({ idx, p }));
  ranked.sort((a, b) => b.p - a.p || a.idx - b.idx);
  const topExperts = ranked.slice(0, k).map((entry) => entry.idx);

  let weightSum = 0;
  const topWeights = topExperts.map((idx) => gateProbs[idx]);
  for (const w of topWeights) weightSum += w;
  for (let i = 0; i < topWeights.length; i++) topWeights[i] /= weightSum;

  const loadCounts = Array(logits.length).fill(0);
  for (const expertIdx of batchAssignments) loadCounts[expertIdx] += 1;

  const dim = expertOutputs[0].length;
  const combined = Array(dim).fill(0);
  for (let i = 0; i < topExperts.length; i++) {
    const expertIdx = topExperts[i];
    const weight = topWeights[i];
    for (let d = 0; d < dim; d++) combined[d] += weight * expertOutputs[expertIdx][d];
  }

  return { gateProbs, topExperts, topWeights, loadCounts, combined };
}`,explanation:"Softmax gate probabilities determine which experts compete for each token."},{id:"moe-topk-pick",stepLabel:"MoE.2",group:"Top-k pick",title:"Top-k Expert Selection",concept:"MoE layers route each token to the k experts with the highest gate probabilities.",objective:"Inside moeRouterStep, fill topExperts with the k highest gateProbs indices (tie-break lower index).",difficulty:"core",starterCode:`/**
 * Runs one MoE router step: softmax gate, top-k routing, load tally, weighted expert combine.
 * @param {number[]} logits - Raw router logits per expert.
 * @param {number} k - Number of experts to activate per token.
 * @param {number[][]} expertOutputs - Expert output vectors indexed by expert id.
 * @param {number[]} batchAssignments - Flat list of expert ids chosen across the batch (for load counts).
 * @returns {{ gateProbs: number[], topExperts: number[], topWeights: number[], loadCounts: number[], combined: number[] }}
 */
function moeRouterStep(logits, k, expertOutputs, batchAssignments) {
  const maxLogit = Math.max(...logits);
  const exps = logits.map((l) => Math.exp(l - maxLogit));
  const sumExp = exps.reduce((s, v) => s + v, 0);
  const gateProbs = [];
  for (let i = 0; i < logits.length; i++) gateProbs.push(exps[i] / sumExp);

  const topExperts = [];
  // TODO: select k expert indices with highest gateProbs; break ties by lower index.

  let weightSum = 0;
  const topWeights = topExperts.map((idx) => gateProbs[idx]);
  for (const w of topWeights) weightSum += w;
  for (let i = 0; i < topWeights.length; i++) topWeights[i] /= weightSum;

  const loadCounts = Array(logits.length).fill(0);
  for (const expertIdx of batchAssignments) loadCounts[expertIdx] += 1;

  const dim = expertOutputs[0].length;
  const combined = Array(dim).fill(0);
  for (let i = 0; i < topExperts.length; i++) {
    const expertIdx = topExperts[i];
    const weight = topWeights[i];
    for (let d = 0; d < dim; d++) combined[d] += weight * expertOutputs[expertIdx][d];
  }

  return { gateProbs, topExperts, topWeights, loadCounts, combined };
}`,testCode:`const results = [];
function sameArray(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual, expected) });
}
const experts = [[0], [0], [0], [0]];
check('top-2 experts', moeRouterStep([0.2, 0.8, 0.1, 0.9], 2, experts, []).topExperts, [3, 1]);
check('top-1 expert', moeRouterStep([1, 3, 2], 1, [[1], [2], [3]], []).topExperts, [1]);
return results;`,hints:["Pair each probability with its expert index, then sort descending.","When probabilities tie, prefer the smaller expert index.","Take the first k indices from the sorted list."],solution:`/**
 * Runs one MoE router step: softmax gate, top-k routing, load tally, weighted expert combine.
 * @param {number[]} logits - Raw router logits per expert.
 * @param {number} k - Number of experts to activate per token.
 * @param {number[][]} expertOutputs - Expert output vectors indexed by expert id.
 * @param {number[]} batchAssignments - Flat list of expert ids chosen across the batch (for load counts).
 * @returns {{ gateProbs: number[], topExperts: number[], topWeights: number[], loadCounts: number[], combined: number[] }}
 */
function moeRouterStep(logits, k, expertOutputs, batchAssignments) {
  const maxLogit = Math.max(...logits);
  const exps = logits.map((l) => Math.exp(l - maxLogit));
  const sumExp = exps.reduce((s, v) => s + v, 0);
  const gateProbs = [];
  for (let i = 0; i < logits.length; i++) gateProbs.push(exps[i] / sumExp);

  const ranked = gateProbs.map((p, idx) => ({ idx, p }));
  ranked.sort((a, b) => b.p - a.p || a.idx - b.idx);
  const topExperts = ranked.slice(0, k).map((entry) => entry.idx);

  let weightSum = 0;
  const topWeights = topExperts.map((idx) => gateProbs[idx]);
  for (const w of topWeights) weightSum += w;
  for (let i = 0; i < topWeights.length; i++) topWeights[i] /= weightSum;

  const loadCounts = Array(logits.length).fill(0);
  for (const expertIdx of batchAssignments) loadCounts[expertIdx] += 1;

  const dim = expertOutputs[0].length;
  const combined = Array(dim).fill(0);
  for (let i = 0; i < topExperts.length; i++) {
    const expertIdx = topExperts[i];
    const weight = topWeights[i];
    for (let d = 0; d < dim; d++) combined[d] += weight * expertOutputs[expertIdx][d];
  }

  return { gateProbs, topExperts, topWeights, loadCounts, combined };
}`,explanation:"Top-k routing keeps compute sparse while still allowing multiple experts per token."},{id:"moe-load-counts",stepLabel:"MoE.3",group:"Load per expert",title:"Expert Load Counts",concept:"Load-balancing monitors how many tokens each expert receives across a batch.",objective:"Inside moeRouterStep, increment loadCounts[expertIdx] for every entry in batchAssignments.",difficulty:"core",starterCode:`/**
 * Runs one MoE router step: softmax gate, top-k routing, load tally, weighted expert combine.
 * @param {number[]} logits - Raw router logits per expert.
 * @param {number} k - Number of experts to activate per token.
 * @param {number[][]} expertOutputs - Expert output vectors indexed by expert id.
 * @param {number[]} batchAssignments - Flat list of expert ids chosen across the batch (for load counts).
 * @returns {{ gateProbs: number[], topExperts: number[], topWeights: number[], loadCounts: number[], combined: number[] }}
 */
function moeRouterStep(logits, k, expertOutputs, batchAssignments) {
  const maxLogit = Math.max(...logits);
  const exps = logits.map((l) => Math.exp(l - maxLogit));
  const sumExp = exps.reduce((s, v) => s + v, 0);
  const gateProbs = [];
  for (let i = 0; i < logits.length; i++) gateProbs.push(exps[i] / sumExp);

  const ranked = gateProbs.map((p, idx) => ({ idx, p }));
  ranked.sort((a, b) => b.p - a.p || a.idx - b.idx);
  const topExperts = ranked.slice(0, k).map((entry) => entry.idx);

  let weightSum = 0;
  const topWeights = topExperts.map((idx) => gateProbs[idx]);
  for (const w of topWeights) weightSum += w;
  for (let i = 0; i < topWeights.length; i++) topWeights[i] /= weightSum;

  const loadCounts = Array(logits.length).fill(0);
  // TODO: for each expertIdx in batchAssignments, increment loadCounts[expertIdx].

  const dim = expertOutputs[0].length;
  const combined = Array(dim).fill(0);
  for (let i = 0; i < topExperts.length; i++) {
    const expertIdx = topExperts[i];
    const weight = topWeights[i];
    for (let d = 0; d < dim; d++) combined[d] += weight * expertOutputs[expertIdx][d];
  }

  return { gateProbs, topExperts, topWeights, loadCounts, combined };
}`,testCode:`const results = [];
function sameArray(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual, expected) });
}
const experts = [[0], [0], [0], [0]];
check('batch load tally', moeRouterStep([0, 0, 0, 0], 1, experts, [3, 1, 3, 0]).loadCounts, [1, 1, 0, 2]);
check('empty batch', moeRouterStep([1, 2], 1, [[0], [0]], []).loadCounts, [0, 0]);
return results;`,hints:["Each batchAssignments entry is one expert dispatch.","Increment the counter at that expert index.","loadCounts[expertIdx] += 1;"],solution:`/**
 * Runs one MoE router step: softmax gate, top-k routing, load tally, weighted expert combine.
 * @param {number[]} logits - Raw router logits per expert.
 * @param {number} k - Number of experts to activate per token.
 * @param {number[][]} expertOutputs - Expert output vectors indexed by expert id.
 * @param {number[]} batchAssignments - Flat list of expert ids chosen across the batch (for load counts).
 * @returns {{ gateProbs: number[], topExperts: number[], topWeights: number[], loadCounts: number[], combined: number[] }}
 */
function moeRouterStep(logits, k, expertOutputs, batchAssignments) {
  const maxLogit = Math.max(...logits);
  const exps = logits.map((l) => Math.exp(l - maxLogit));
  const sumExp = exps.reduce((s, v) => s + v, 0);
  const gateProbs = [];
  for (let i = 0; i < logits.length; i++) gateProbs.push(exps[i] / sumExp);

  const ranked = gateProbs.map((p, idx) => ({ idx, p }));
  ranked.sort((a, b) => b.p - a.p || a.idx - b.idx);
  const topExperts = ranked.slice(0, k).map((entry) => entry.idx);

  let weightSum = 0;
  const topWeights = topExperts.map((idx) => gateProbs[idx]);
  for (const w of topWeights) weightSum += w;
  for (let i = 0; i < topWeights.length; i++) topWeights[i] /= weightSum;

  const loadCounts = Array(logits.length).fill(0);
  for (const expertIdx of batchAssignments) loadCounts[expertIdx] += 1;

  const dim = expertOutputs[0].length;
  const combined = Array(dim).fill(0);
  for (let i = 0; i < topExperts.length; i++) {
    const expertIdx = topExperts[i];
    const weight = topWeights[i];
    for (let d = 0; d < dim; d++) combined[d] += weight * expertOutputs[expertIdx][d];
  }

  return { gateProbs, topExperts, topWeights, loadCounts, combined };
}`,explanation:"Tracking per-expert load reveals imbalance that hurts throughput and triggers auxiliary losses."},{id:"moe-weighted-combine",stepLabel:"MoE.4",group:"Weighted combine",title:"Weighted Expert Output",concept:"MoE output is the weighted sum of selected expert transforms, using renormalized gate weights.",objective:"Inside moeRouterStep, accumulate combined[d] += topWeights[i] * expertOutputs[topExperts[i]][d].",difficulty:"core",starterCode:`/**
 * Runs one MoE router step: softmax gate, top-k routing, load tally, weighted expert combine.
 * @param {number[]} logits - Raw router logits per expert.
 * @param {number} k - Number of experts to activate per token.
 * @param {number[][]} expertOutputs - Expert output vectors indexed by expert id.
 * @param {number[]} batchAssignments - Flat list of expert ids chosen across the batch (for load counts).
 * @returns {{ gateProbs: number[], topExperts: number[], topWeights: number[], loadCounts: number[], combined: number[] }}
 */
function moeRouterStep(logits, k, expertOutputs, batchAssignments) {
  const maxLogit = Math.max(...logits);
  const exps = logits.map((l) => Math.exp(l - maxLogit));
  const sumExp = exps.reduce((s, v) => s + v, 0);
  const gateProbs = [];
  for (let i = 0; i < logits.length; i++) gateProbs.push(exps[i] / sumExp);

  const ranked = gateProbs.map((p, idx) => ({ idx, p }));
  ranked.sort((a, b) => b.p - a.p || a.idx - b.idx);
  const topExperts = ranked.slice(0, k).map((entry) => entry.idx);

  let weightSum = 0;
  const topWeights = topExperts.map((idx) => gateProbs[idx]);
  for (const w of topWeights) weightSum += w;
  for (let i = 0; i < topWeights.length; i++) topWeights[i] /= weightSum;

  const loadCounts = Array(logits.length).fill(0);
  for (const expertIdx of batchAssignments) loadCounts[expertIdx] += 1;

  const dim = expertOutputs[0].length;
  const combined = Array(dim).fill(0);
  for (let i = 0; i < topExperts.length; i++) {
    const expertIdx = topExperts[i];
    const weight = topWeights[i];
    for (let d = 0; d < dim; d++) {
      // TODO: add weight * expertOutputs[expertIdx][d] into combined[d].
    }
  }

  return { gateProbs, topExperts, topWeights, loadCounts, combined };
}`,testCode:`const results = [];
function approxArray(a, b, tol = 1e-5) {
  return a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) <= tol);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: approxArray(actual, expected) });
}
const experts = [[1, 0], [0, 1], [2, 2]];
check('weighted mix', moeRouterStep([1, 1, -10], 2, [[1, 0], [0, 1], [9, 9]], []).combined, [0.5, 0.5]);
check('single expert', moeRouterStep([5, 1], 1, [[3, 4], [10, 10]], []).combined, [3, 4]);
return results;`,hints:["Loop over selected experts and output dimensions.","Multiply each expert vector by its renormalized gate weight.","combined[d] += weight * expertOutputs[expertIdx][d];"],solution:`/**
 * Runs one MoE router step: softmax gate, top-k routing, load tally, weighted expert combine.
 * @param {number[]} logits - Raw router logits per expert.
 * @param {number} k - Number of experts to activate per token.
 * @param {number[][]} expertOutputs - Expert output vectors indexed by expert id.
 * @param {number[]} batchAssignments - Flat list of expert ids chosen across the batch (for load counts).
 * @returns {{ gateProbs: number[], topExperts: number[], topWeights: number[], loadCounts: number[], combined: number[] }}
 */
function moeRouterStep(logits, k, expertOutputs, batchAssignments) {
  const maxLogit = Math.max(...logits);
  const exps = logits.map((l) => Math.exp(l - maxLogit));
  const sumExp = exps.reduce((s, v) => s + v, 0);
  const gateProbs = [];
  for (let i = 0; i < logits.length; i++) gateProbs.push(exps[i] / sumExp);

  const ranked = gateProbs.map((p, idx) => ({ idx, p }));
  ranked.sort((a, b) => b.p - a.p || a.idx - b.idx);
  const topExperts = ranked.slice(0, k).map((entry) => entry.idx);

  let weightSum = 0;
  const topWeights = topExperts.map((idx) => gateProbs[idx]);
  for (const w of topWeights) weightSum += w;
  for (let i = 0; i < topWeights.length; i++) topWeights[i] /= weightSum;

  const loadCounts = Array(logits.length).fill(0);
  for (const expertIdx of batchAssignments) loadCounts[expertIdx] += 1;

  const dim = expertOutputs[0].length;
  const combined = Array(dim).fill(0);
  for (let i = 0; i < topExperts.length; i++) {
    const expertIdx = topExperts[i];
    const weight = topWeights[i];
    for (let d = 0; d < dim; d++) combined[d] += weight * expertOutputs[expertIdx][d];
  }

  return { gateProbs, topExperts, topWeights, loadCounts, combined };
}`,explanation:"Weighted combination merges specialist expert outputs back into the shared residual stream."},{id:"moe-topk-indices",stepLabel:"15.1",group:"Top-k pick",title:"MoE router top-k selection",concept:"Mixture of Experts routes tokens to the top-k experts with the highest routing scores.",objective:"Select indices of the top k routing values.",difficulty:"core",starterCode:`function getTopKExperts(logits, k) {
  const indexed = logits.map((val, idx) => ({ val, idx }));
  indexed.sort((a, b) => b.val - a.val);
  
  const topK = [];
  for (let i = 0; i < k; i++) {
    // TODO: push the index of the i-th best expert to topK array
    topK.push(0);
  }
  return topK;
}`,testCode:`const results = [];
function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual, expected) });
}
check('top-2 experts', getTopKExperts([0.2, 0.8, 0.1, 0.9], 2), [3, 1]); // indexes 3 and 1
return results;`,hints:["The sorted elements are inside the indexed array.","The index of the i-th element is indexed[i].idx.","topK[i] = indexed[i].idx;"],solution:`function getTopKExperts(logits, k) {
  const indexed = logits.map((val, idx) => ({ val, idx }));
  indexed.sort((a, b) => b.val - a.val);
  
  const topK = [];
  for (let i = 0; i < k; i++) {
    topK.push(indexed[i].idx);
  }
  return topK;
}`,explanation:"Routing tokens to only a subset of experts limits active parameters per token, enabling massive model capacity with low computational costs."},{id:"lora-scaling-factor",stepLabel:"16.1",group:"Alpha scaling",title:"LoRA scaling factor",concept:"Low-Rank Adaptation (LoRA) scales low-rank updates by a factor of alpha / rank to maintain consistent learning scales when rank changes.",objective:"Compute the scaling factor alpha divided by rank.",difficulty:"warmup",starterCode:`function getLoraScale(alpha, rank) {
  // TODO: return the scaling factor
  return 0;
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('scale alpha 32 rank 8', getLoraScale(32, 8), 4);
check('scale alpha 16 rank 16', getLoraScale(16, 16), 1);
return results;`,hints:["Divide alpha by rank.","return alpha / rank;"],solution:`function getLoraScale(alpha, rank) {
  return alpha / rank;
}`,explanation:"Alpha scaling allows changing LoRA rank without needing to retune learning rate hyperparameters."},{id:"lora-forward-add",stepLabel:"16.2",group:"Effective delta add",title:"LoRA output update",concept:"LoRA updates the forward pass output: y = W_base * x + (alpha / r) * B * (A * x).",objective:"Incorporate the low-rank delta output into the baseline output vector.",difficulty:"core",starterCode:`function addLoraDelta(yBase, loraDelta, scale) {
  const output = [];
  for (let i = 0; i < yBase.length; i++) {
    // TODO: add scale * loraDelta[i] to yBase[i]
    output.push(0);
  }
  return output;
}`,testCode:`const results = [];
function approxArray(a, b, tol = 1e-5) {
  return a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) <= tol);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: approxArray(actual, expected) });
}
check('apply lora delta', addLoraDelta([2.0, 3.0], [0.5, -0.2], 4.0), [4.0, 2.2]);
return results;`,hints:["Multiply scale by loraDelta[i] and add to yBase[i].","Push the result to the output array."],solution:`function addLoraDelta(yBase, loraDelta, scale) {
  const output = [];
  for (let i = 0; i < yBase.length; i++) {
    output.push(yBase[i] + scale * loraDelta[i]);
  }
  return output;
}`,explanation:"Low-rank updates are computed in parallel to base weights and added at output, leaving baseline weights frozen."},{id:"nsa-block-grid",stepLabel:"NSA.1",group:"Block grid",title:"Sequence Block Grid",concept:"Native Sparse Attention partitions the sequence into fixed-size blocks; the final block may be shorter.",objective:"Inside sparseBlockMaskStep, fill blockRanges with half-open intervals [start, end) covering seqLen.",difficulty:"warmup",starterCode:`/**
 * Runs one NSA block-selection step: tile sequence, pick top blocks, scatter attended tokens, count region.
 * @param {number} seqLen - Total sequence length.
 * @param {number} blockSize - Tokens per block (last block may be shorter).
 * @param {number[]} blockScores - Importance score per block.
 * @param {number} topK - Number of key blocks to keep.
 * @returns {{ numBlocks: number, blockRanges: number[][], topBlocks: number[], attendedTokens: number[], effectiveRegion: number }}
 */
function sparseBlockMaskStep(seqLen, blockSize, blockScores, topK) {
  const numBlocks = Math.ceil(seqLen / blockSize);
  const blockRanges = [];
  // TODO: push [start, end) ranges that cover [0, seqLen) in steps of blockSize.

  const ranked = blockScores.map((score, idx) => ({ idx, score }));
  ranked.sort((a, b) => b.score - a.score || a.idx - b.idx);
  const topBlocks = ranked.slice(0, topK).map((entry) => entry.idx);

  const attendedTokens = [];
  const sortedBlocks = [...topBlocks].sort((a, b) => a - b);
  for (const blockId of sortedBlocks) {
    const [start, end] = blockRanges[blockId];
    for (let t = start; t < end; t++) attendedTokens.push(t);
  }

  const effectiveRegion = attendedTokens.length * seqLen;

  return { numBlocks, blockRanges, topBlocks, attendedTokens, effectiveRegion };
}`,testCode:`const results = [];
function sameArray(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual, expected) });
}
check('block ranges', sparseBlockMaskStep(10, 4, [0, 0, 0], 1).blockRanges, [[0, 4], [4, 8], [8, 10]]);
check('num blocks', sparseBlockMaskStep(10, 4, [0, 0, 0], 1).numBlocks, 3);
check('exact fit', sparseBlockMaskStep(8, 4, [0, 0], 1).blockRanges, [[0, 4], [4, 8]]);
return results;`,hints:["Walk start from 0 while start < seqLen.","Each end is min(start + blockSize, seqLen).","Push [start, end) then set start = end."],solution:`/**
 * Runs one NSA block-selection step: tile sequence, pick top blocks, scatter attended tokens, count region.
 * @param {number} seqLen - Total sequence length.
 * @param {number} blockSize - Tokens per block (last block may be shorter).
 * @param {number[]} blockScores - Importance score per block.
 * @param {number} topK - Number of key blocks to keep.
 * @returns {{ numBlocks: number, blockRanges: number[][], topBlocks: number[], attendedTokens: number[], effectiveRegion: number }}
 */
function sparseBlockMaskStep(seqLen, blockSize, blockScores, topK) {
  const numBlocks = Math.ceil(seqLen / blockSize);
  const blockRanges = [];
  let start = 0;
  while (start < seqLen) {
    const end = Math.min(start + blockSize, seqLen);
    blockRanges.push([start, end]);
    start = end;
  }

  const ranked = blockScores.map((score, idx) => ({ idx, score }));
  ranked.sort((a, b) => b.score - a.score || a.idx - b.idx);
  const topBlocks = ranked.slice(0, topK).map((entry) => entry.idx);

  const attendedTokens = [];
  const sortedBlocks = [...topBlocks].sort((a, b) => a - b);
  for (const blockId of sortedBlocks) {
    const [rangeStart, rangeEnd] = blockRanges[blockId];
    for (let t = rangeStart; t < rangeEnd; t++) attendedTokens.push(t);
  }

  const effectiveRegion = attendedTokens.length * seqLen;

  return { numBlocks, blockRanges, topBlocks, attendedTokens, effectiveRegion };
}`,explanation:"Block tiling is the first step in NSA: attention sparsity is defined over blocks, not individual token pairs upfront."},{id:"nsa-topk-blocks",stepLabel:"NSA.2",group:"Top-k blocks",title:"Top-k Block Selection",concept:"NSA scores each block (for example with compressed keys) and keeps only the top-k blocks for fine attention.",objective:"Inside sparseBlockMaskStep, fill topBlocks with the k highest blockScores indices.",difficulty:"core",starterCode:`/**
 * Runs one NSA block-selection step: tile sequence, pick top blocks, scatter attended tokens, count region.
 * @param {number} seqLen - Total sequence length.
 * @param {number} blockSize - Tokens per block (last block may be shorter).
 * @param {number[]} blockScores - Importance score per block.
 * @param {number} topK - Number of key blocks to keep.
 * @returns {{ numBlocks: number, blockRanges: number[][], topBlocks: number[], attendedTokens: number[], effectiveRegion: number }}
 */
function sparseBlockMaskStep(seqLen, blockSize, blockScores, topK) {
  const numBlocks = Math.ceil(seqLen / blockSize);
  const blockRanges = [];
  let start = 0;
  while (start < seqLen) {
    const end = Math.min(start + blockSize, seqLen);
    blockRanges.push([start, end]);
    start = end;
  }

  const topBlocks = [];
  // TODO: pick topK block indices with highest blockScores; break ties by lower index.

  const attendedTokens = [];
  const sortedBlocks = [...topBlocks].sort((a, b) => a - b);
  for (const blockId of sortedBlocks) {
    const [rangeStart, rangeEnd] = blockRanges[blockId];
    for (let t = rangeStart; t < rangeEnd; t++) attendedTokens.push(t);
  }

  const effectiveRegion = attendedTokens.length * seqLen;

  return { numBlocks, blockRanges, topBlocks, attendedTokens, effectiveRegion };
}`,testCode:`const results = [];
function sameArray(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual, expected) });
}
check('top blocks', sparseBlockMaskStep(16, 4, [0.1, 4.0, 2.0, 9.0], 2).topBlocks, [3, 1]);
check('clamp k', sparseBlockMaskStep(8, 4, [2, 5], 5).topBlocks, [1, 0]);
return results;`,hints:["Pair each score with its block index and sort descending.","Break equal scores by choosing the smaller block index.","Slice the first topK entries and map to indices."],solution:`/**
 * Runs one NSA block-selection step: tile sequence, pick top blocks, scatter attended tokens, count region.
 * @param {number} seqLen - Total sequence length.
 * @param {number} blockSize - Tokens per block (last block may be shorter).
 * @param {number[]} blockScores - Importance score per block.
 * @param {number} topK - Number of key blocks to keep.
 * @returns {{ numBlocks: number, blockRanges: number[][], topBlocks: number[], attendedTokens: number[], effectiveRegion: number }}
 */
function sparseBlockMaskStep(seqLen, blockSize, blockScores, topK) {
  const numBlocks = Math.ceil(seqLen / blockSize);
  const blockRanges = [];
  let start = 0;
  while (start < seqLen) {
    const end = Math.min(start + blockSize, seqLen);
    blockRanges.push([start, end]);
    start = end;
  }

  const ranked = blockScores.map((score, idx) => ({ idx, score }));
  ranked.sort((a, b) => b.score - a.score || a.idx - b.idx);
  const topBlocks = ranked.slice(0, topK).map((entry) => entry.idx);

  const attendedTokens = [];
  const sortedBlocks = [...topBlocks].sort((a, b) => a - b);
  for (const blockId of sortedBlocks) {
    const [rangeStart, rangeEnd] = blockRanges[blockId];
    for (let t = rangeStart; t < rangeEnd; t++) attendedTokens.push(t);
  }

  const effectiveRegion = attendedTokens.length * seqLen;

  return { numBlocks, blockRanges, topBlocks, attendedTokens, effectiveRegion };
}`,explanation:"Top-k block selection is where NSA trades full quadratic attention for a sparse key subset."},{id:"nsa-mask-scatter",stepLabel:"NSA.3",group:"Mask scatter",title:"Scatter Attended Token Indices",concept:"Selected blocks expand into the concrete key token indices that sparse attention is allowed to read.",objective:"Inside sparseBlockMaskStep, append every token index from each selected block into attendedTokens.",difficulty:"core",starterCode:`/**
 * Runs one NSA block-selection step: tile sequence, pick top blocks, scatter attended tokens, count region.
 * @param {number} seqLen - Total sequence length.
 * @param {number} blockSize - Tokens per block (last block may be shorter).
 * @param {number[]} blockScores - Importance score per block.
 * @param {number} topK - Number of key blocks to keep.
 * @returns {{ numBlocks: number, blockRanges: number[][], topBlocks: number[], attendedTokens: number[], effectiveRegion: number }}
 */
function sparseBlockMaskStep(seqLen, blockSize, blockScores, topK) {
  const numBlocks = Math.ceil(seqLen / blockSize);
  const blockRanges = [];
  let start = 0;
  while (start < seqLen) {
    const end = Math.min(start + blockSize, seqLen);
    blockRanges.push([start, end]);
    start = end;
  }

  const ranked = blockScores.map((score, idx) => ({ idx, score }));
  ranked.sort((a, b) => b.score - a.score || a.idx - b.idx);
  const topBlocks = ranked.slice(0, topK).map((entry) => entry.idx);

  const attendedTokens = [];
  const sortedBlocks = [...topBlocks].sort((a, b) => a - b);
  for (const blockId of sortedBlocks) {
    const [rangeStart, rangeEnd] = blockRanges[blockId];
    // TODO: push each token index from rangeStart (inclusive) to rangeEnd (exclusive).
  }

  const effectiveRegion = attendedTokens.length * seqLen;

  return { numBlocks, blockRanges, topBlocks, attendedTokens, effectiveRegion };
}`,testCode:`const results = [];
function sameArray(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual, expected) });
}
check('expand blocks', sparseBlockMaskStep(15, 4, [0, 9, 0, 8], 2).attendedTokens, [4, 5, 6, 7, 12, 13, 14]);
check('single short block', sparseBlockMaskStep(5, 4, [1, 10], 1).attendedTokens, [4]);
return results;`,hints:["Process selected blocks in ascending order for stable token lists.","Each block range is half-open: include start, exclude end.","attendedTokens.push(t) for t in [rangeStart, rangeEnd)."],solution:`/**
 * Runs one NSA block-selection step: tile sequence, pick top blocks, scatter attended tokens, count region.
 * @param {number} seqLen - Total sequence length.
 * @param {number} blockSize - Tokens per block (last block may be shorter).
 * @param {number[]} blockScores - Importance score per block.
 * @param {number} topK - Number of key blocks to keep.
 * @returns {{ numBlocks: number, blockRanges: number[][], topBlocks: number[], attendedTokens: number[], effectiveRegion: number }}
 */
function sparseBlockMaskStep(seqLen, blockSize, blockScores, topK) {
  const numBlocks = Math.ceil(seqLen / blockSize);
  const blockRanges = [];
  let start = 0;
  while (start < seqLen) {
    const end = Math.min(start + blockSize, seqLen);
    blockRanges.push([start, end]);
    start = end;
  }

  const ranked = blockScores.map((score, idx) => ({ idx, score }));
  ranked.sort((a, b) => b.score - a.score || a.idx - b.idx);
  const topBlocks = ranked.slice(0, topK).map((entry) => entry.idx);

  const attendedTokens = [];
  const sortedBlocks = [...topBlocks].sort((a, b) => a - b);
  for (const blockId of sortedBlocks) {
    const [rangeStart, rangeEnd] = blockRanges[blockId];
    for (let t = rangeStart; t < rangeEnd; t++) attendedTokens.push(t);
  }

  const effectiveRegion = attendedTokens.length * seqLen;

  return { numBlocks, blockRanges, topBlocks, attendedTokens, effectiveRegion };
}`,explanation:"Mask scatter turns block-level sparsity into the exact token columns attention may use."},{id:"nsa-effective-region",stepLabel:"NSA.4",group:"Effective attention region",title:"Effective Attention Region",concept:"The effective sparse region size is the number of attended key tokens times query positions (seqLen).",objective:"Inside sparseBlockMaskStep, set effectiveRegion = attendedTokens.length * seqLen.",difficulty:"core",starterCode:`/**
 * Runs one NSA block-selection step: tile sequence, pick top blocks, scatter attended tokens, count region.
 * @param {number} seqLen - Total sequence length.
 * @param {number} blockSize - Tokens per block (last block may be shorter).
 * @param {number[]} blockScores - Importance score per block.
 * @param {number} topK - Number of key blocks to keep.
 * @returns {{ numBlocks: number, blockRanges: number[][], topBlocks: number[], attendedTokens: number[], effectiveRegion: number }}
 */
function sparseBlockMaskStep(seqLen, blockSize, blockScores, topK) {
  const numBlocks = Math.ceil(seqLen / blockSize);
  const blockRanges = [];
  let start = 0;
  while (start < seqLen) {
    const end = Math.min(start + blockSize, seqLen);
    blockRanges.push([start, end]);
    start = end;
  }

  const ranked = blockScores.map((score, idx) => ({ idx, score }));
  ranked.sort((a, b) => b.score - a.score || a.idx - b.idx);
  const topBlocks = ranked.slice(0, topK).map((entry) => entry.idx);

  const attendedTokens = [];
  const sortedBlocks = [...topBlocks].sort((a, b) => a - b);
  for (const blockId of sortedBlocks) {
    const [rangeStart, rangeEnd] = blockRanges[blockId];
    for (let t = rangeStart; t < rangeEnd; t++) attendedTokens.push(t);
  }

  let effectiveRegion = 0;
  // TODO: effectiveRegion = attendedTokens.length * seqLen

  return { numBlocks, blockRanges, topBlocks, attendedTokens, effectiveRegion };
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('sparse region', sparseBlockMaskStep(15, 4, [0, 9, 0, 8], 2).effectiveRegion, 6 * 15);
check('full block pick', sparseBlockMaskStep(8, 4, [10, 1], 1).effectiveRegion, 4 * 8);
check('beats dense pair count sanity', sparseBlockMaskStep(100, 10, [5, 9, 1, 2, 3, 4, 5, 6, 7, 8], 2).effectiveRegion < 100 * 100, true);
return results;`,hints:["attendedTokens.length counts selected key tokens.","Multiply by seqLen query positions for total allowed pairs.","effectiveRegion = attendedTokens.length * seqLen;"],solution:`/**
 * Runs one NSA block-selection step: tile sequence, pick top blocks, scatter attended tokens, count region.
 * @param {number} seqLen - Total sequence length.
 * @param {number} blockSize - Tokens per block (last block may be shorter).
 * @param {number[]} blockScores - Importance score per block.
 * @param {number} topK - Number of key blocks to keep.
 * @returns {{ numBlocks: number, blockRanges: number[][], topBlocks: number[], attendedTokens: number[], effectiveRegion: number }}
 */
function sparseBlockMaskStep(seqLen, blockSize, blockScores, topK) {
  const numBlocks = Math.ceil(seqLen / blockSize);
  const blockRanges = [];
  let start = 0;
  while (start < seqLen) {
    const end = Math.min(start + blockSize, seqLen);
    blockRanges.push([start, end]);
    start = end;
  }

  const ranked = blockScores.map((score, idx) => ({ idx, score }));
  ranked.sort((a, b) => b.score - a.score || a.idx - b.idx);
  const topBlocks = ranked.slice(0, topK).map((entry) => entry.idx);

  const attendedTokens = [];
  const sortedBlocks = [...topBlocks].sort((a, b) => a - b);
  for (const blockId of sortedBlocks) {
    const [rangeStart, rangeEnd] = blockRanges[blockId];
    for (let t = rangeStart; t < rangeEnd; t++) attendedTokens.push(t);
  }

  let effectiveRegion = 0;
  effectiveRegion = attendedTokens.length * seqLen;

  return { numBlocks, blockRanges, topBlocks, attendedTokens, effectiveRegion };
}`,explanation:"Effective region size shows how much less work sparse block attention does versus dense seqLen squared."},{id:"sparse-block-attention-check",stepLabel:"18.1",group:"Block grid",title:"Sparse block check",concept:"Native Sparse Attention restricts queries to attend only to selected key blocks, saving massive quadratic compute.",objective:"Return true if activeBlocks array contains kBlock index, otherwise false.",difficulty:"warmup",starterCode:`function isBlockAttended(kBlock, activeBlocks) {
  // TODO: return whether kBlock is inside activeBlocks array
  return false;
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('block active', isBlockAttended(2, [0, 2, 5]), true);
check('block inactive', isBlockAttended(3, [0, 2, 5]), false);
return results;`,hints:["Use the .includes() method on arrays.","return activeBlocks.includes(kBlock);"],solution:`function isBlockAttended(kBlock, activeBlocks) {
  return activeBlocks.includes(kBlock);
}`,explanation:"Hashing or routing queries to specific key blocks creates a sparse attention pattern that handles long context lengths."}],B=[{id:"lm-vocab-size",stepLabel:"48.1",group:"Mini vocabulary and logits",title:"Vocabulary size",concept:"A language model predicts one score per vocabulary token.",objective:"Return the number of tokens in the vocabulary.",difficulty:"warmup",starterCode:`function vocabSize(vocab) {
  // TODO: return the number of tokens.
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('three-token vocab', vocabSize(['cat', 'dog', 'fish']), 3);
check('one-token vocab', vocabSize(['<eos>']), 1);
check('five-token vocab', vocabSize(['a', 'b', 'c', 'd', 'e']), 5);

return results;`,hints:["The vocabulary is an array.","Array length gives the number of tokens.","return vocab.length;"],solution:`function vocabSize(vocab) {
  return vocab.length;
}`,explanation:"A model with vocabulary size V produces V logits at each prediction position."},{id:"lm-argmax-logit",stepLabel:"48.2",group:"Mini vocabulary and logits",title:"Argmax logit",concept:"Greedy decoding chooses the token with the largest logit.",objective:"Return the index of the largest logit.",difficulty:"core",starterCode:`function argmax(logits) {
  let bestIndex = 0;
  let bestValue = logits[0];

  for (let i = 1; i < logits.length; i++) {
    // TODO: update bestIndex and bestValue when logits[i] is larger.
  }

  return bestIndex;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('largest at index 0', argmax([5, 1, 2]), 0);
check('largest at index 1', argmax([1, 5, 2]), 1);
check('largest at index 2', argmax([-3, -2, -1]), 2);

return results;`,hints:["Compare logits[i] with bestValue.","If logits[i] is larger, update both bestValue and bestIndex.",`if (logits[i] > bestValue) {
  bestValue = logits[i];
  bestIndex = i;
}`],solution:`function argmax(logits) {
  let bestIndex = 0;
  let bestValue = logits[0];

  for (let i = 1; i < logits.length; i++) {
    if (logits[i] > bestValue) {
      bestValue = logits[i];
      bestIndex = i;
    }
  }

  return bestIndex;
}`,explanation:"Argmax decoding is deterministic: it always picks the highest-scoring token."},{id:"lm-decode-argmax-token",stepLabel:"48.3",group:"Mini vocabulary and logits",title:"Decode predicted token",concept:"A predicted token ID becomes text by indexing into the vocabulary.",objective:"Return vocab[argmax(logits)].",difficulty:"core",starterCode:`function argmax(logits) {
  let bestIndex = 0;
  let bestValue = logits[0];

  for (let i = 1; i < logits.length; i++) {
    if (logits[i] > bestValue) {
      bestValue = logits[i];
      bestIndex = i;
    }
  }

  return bestIndex;
}

function greedyToken(vocab, logits) {
  // TODO: return the vocabulary token with the largest logit.
  return '';
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

const vocab = ['cat', 'dog', 'fish'];

check('predict cat', greedyToken(vocab, [5, 1, 2]), 'cat');
check('predict dog', greedyToken(vocab, [1, 5, 2]), 'dog');
check('predict fish', greedyToken(vocab, [-3, -2, -1]), 'fish');

return results;`,hints:["First get the best token index.","Then use that index to read from vocab.","return vocab[argmax(logits)];"],solution:`function argmax(logits) {
  let bestIndex = 0;
  let bestValue = logits[0];

  for (let i = 1; i < logits.length; i++) {
    if (logits[i] > bestValue) {
      bestValue = logits[i];
      bestIndex = i;
    }
  }

  return bestIndex;
}

function greedyToken(vocab, logits) {
  return vocab[argmax(logits)];
}`,explanation:"The model predicts token IDs. The tokenizer vocabulary maps those IDs back to text pieces."},{id:"lm-logits-to-probabilities",stepLabel:"48.4",group:"Mini vocabulary and logits",title:"Logits to probabilities",concept:"Softmax converts arbitrary logits into probabilities that sum to 1.",objective:"Return stable softmax probabilities.",difficulty:"challenge",starterCode:`function softmax(logits) {
  const maxLogit = Math.max(...logits);
  let denominator = 0;

  for (let i = 0; i < logits.length; i++) {
    denominator += Math.exp(logits[i] - maxLogit);
  }

  const probabilities = [];

  for (let i = 0; i < logits.length; i++) {
    // TODO: push normalized probability for logits[i].
    probabilities.push(0);
  }

  return probabilities;
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

check('equal logits', softmax([0, 0]), [0.5, 0.5]);
check('log ratio', softmax([0, Math.log(3)]), [0.25, 0.75]);
check('large equal logits', softmax([1000, 1000]), [0.5, 0.5]);

return results;`,hints:["Use the same shifted exponentials as the denominator.","Probability = exp(logit - maxLogit) / denominator.","probabilities.push(Math.exp(logits[i] - maxLogit) / denominator);"],solution:`function softmax(logits) {
  const maxLogit = Math.max(...logits);
  let denominator = 0;

  for (let i = 0; i < logits.length; i++) {
    denominator += Math.exp(logits[i] - maxLogit);
  }

  const probabilities = [];

  for (let i = 0; i < logits.length; i++) {
    probabilities.push(Math.exp(logits[i] - maxLogit) / denominator);
  }

  return probabilities;
}`,explanation:"Logits are raw scores. Softmax turns them into a probability distribution over tokens."},{id:"sequence-target-probability",stepLabel:"49.1",group:"Cross-entropy over sequence positions",title:"Target token probability",concept:"At one position, the loss uses the probability assigned to the true next token.",objective:"Return probabilities[targetTokenId].",difficulty:"warmup",starterCode:`function targetProbability(probabilities, targetTokenId) {
  // TODO: return probability of the target token.
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('target 0', targetProbability([0.7, 0.2, 0.1], 0), 0.7);
check('target 1', targetProbability([0.7, 0.2, 0.1], 1), 0.2);
check('target 2', targetProbability([0.7, 0.2, 0.1], 2), 0.1);

return results;`,hints:["targetTokenId is an array index.","Read that probability from the probabilities array.","return probabilities[targetTokenId];"],solution:`function targetProbability(probabilities, targetTokenId) {
  return probabilities[targetTokenId];
}`,explanation:"Cross-entropy only cares how much probability the model assigned to the correct token."},{id:"sequence-nll-one-position",stepLabel:"49.2",group:"Cross-entropy over sequence positions",title:"Negative log-likelihood",concept:"Token loss is -log(probability assigned to the true token).",objective:"Return -Math.log(targetProbability).",difficulty:"core",starterCode:`function tokenNLL(targetProbability) {
  // TODO: return negative log likelihood.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('p=0.5', tokenNLL(0.5), -Math.log(0.5));
check('p=0.8', tokenNLL(0.8), -Math.log(0.8));
check('p=0.25', tokenNLL(0.25), -Math.log(0.25));

return results;`,hints:["Use Math.log.","The loss is negative log probability.","return -Math.log(targetProbability);"],solution:`function tokenNLL(targetProbability) {
  return -Math.log(targetProbability);
}`,explanation:"Confident correct predictions have low loss; low probability on the true token gives high loss."},{id:"sequence-average-token-loss",stepLabel:"49.3",group:"Cross-entropy over sequence positions",title:"Average token loss",concept:"Language-model loss is usually averaged across predicted positions.",objective:"Return average of token losses.",difficulty:"core",starterCode:`function averageTokenLoss(tokenLosses) {
  let total = 0;

  for (let i = 0; i < tokenLosses.length; i++) {
    total += tokenLosses[i];
  }

  // TODO: return average loss.
  return total;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('average [1,2,3]', averageTokenLoss([1, 2, 3]), 2);
check('average two losses', averageTokenLoss([0.5, 1.5]), 1);
check('zero losses', averageTokenLoss([0, 0, 0]), 0);

return results;`,hints:["Average means total divided by count.","The count is tokenLosses.length.","return total / tokenLosses.length;"],solution:`function averageTokenLoss(tokenLosses) {
  let total = 0;

  for (let i = 0; i < tokenLosses.length; i++) {
    total += tokenLosses[i];
  }

  return total / tokenLosses.length;
}`,explanation:"A sequence loss summarizes many next-token prediction losses into one training number."},{id:"sequence-perplexity",stepLabel:"49.4",group:"Cross-entropy over sequence positions",title:"Perplexity",concept:"Perplexity is exp(average cross-entropy loss).",objective:"Return Math.exp(averageLoss).",difficulty:"core",starterCode:`function perplexity(averageLoss) {
  // TODO: return exp of averageLoss.
  return averageLoss;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('loss 0', perplexity(0), 1);
check('loss log 2', perplexity(Math.log(2)), 2);
check('loss log 10', perplexity(Math.log(10)), 10);

return results;`,hints:["Use Math.exp.","Perplexity = e raised to average loss.","return Math.exp(averageLoss);"],solution:`function perplexity(averageLoss) {
  return Math.exp(averageLoss);
}`,explanation:"Perplexity loosely means how many choices the model is confused among on average."},{id:"lm-select-position-logits",stepLabel:"50.1",group:"Tiny language-model loss",title:"Select position logits",concept:"A language model produces one logit vector per sequence position.",objective:"Return logitsByPosition[position].",difficulty:"warmup",starterCode:`function positionLogits(logitsByPosition, position) {
  // TODO: return logits for this sequence position.
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

const logits = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

check('position 0', positionLogits(logits, 0), [1, 2, 3]);
check('position 1', positionLogits(logits, 1), [4, 5, 6]);
check('position 2', positionLogits(logits, 2), [7, 8, 9]);

return results;`,hints:["Position is an array index.","Each row is the logits for one position.","return logitsByPosition[position];"],solution:`function positionLogits(logitsByPosition, position) {
  return logitsByPosition[position];
}`,explanation:"For a sequence of length T, the model returns T logit vectors, one for each position."},{id:"lm-one-position-loss",stepLabel:"50.2",group:"Tiny language-model loss",title:"One-position loss",concept:"One LM loss position is cross-entropy between logits and the true next token ID.",objective:"Convert logits to probabilities, then return -log target probability.",difficulty:"challenge",starterCode:`function softmax(logits) {
  const maxLogit = Math.max(...logits);
  let denominator = 0;

  for (let i = 0; i < logits.length; i++) {
    denominator += Math.exp(logits[i] - maxLogit);
  }

  return logits.map((logit) => Math.exp(logit - maxLogit) / denominator);
}

function onePositionLoss(logits, targetTokenId) {
  const probabilities = softmax(logits);

  // TODO: return negative log probability of targetTokenId.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('target 0 equal logits', onePositionLoss([0, 0], 0), -Math.log(0.5));
check('target 1 log ratio', onePositionLoss([0, Math.log(3)], 1), -Math.log(0.75));
check('target 0 log ratio', onePositionLoss([0, Math.log(3)], 0), -Math.log(0.25));

return results;`,hints:["The target probability is probabilities[targetTokenId].","Loss is -Math.log(target probability).","return -Math.log(probabilities[targetTokenId]);"],solution:`function softmax(logits) {
  const maxLogit = Math.max(...logits);
  let denominator = 0;

  for (let i = 0; i < logits.length; i++) {
    denominator += Math.exp(logits[i] - maxLogit);
  }

  return logits.map((logit) => Math.exp(logit - maxLogit) / denominator);
}

function onePositionLoss(logits, targetTokenId) {
  const probabilities = softmax(logits);
  return -Math.log(probabilities[targetTokenId]);
}`,explanation:"The model is trained to put high probability on the true next token."},{id:"lm-average-loss",stepLabel:"50.3",group:"Tiny language-model loss",title:"Average language-model loss",concept:"The final LM loss averages next-token losses across positions.",objective:"Accumulate onePositionLoss for each position and divide by count.",difficulty:"challenge",starterCode:`function softmax(logits) {
  const maxLogit = Math.max(...logits);
  const exps = logits.map((x) => Math.exp(x - maxLogit));
  const denom = exps.reduce((a, b) => a + b, 0);
  return exps.map((x) => x / denom);
}

function onePositionLoss(logits, targetTokenId) {
  const probabilities = softmax(logits);
  return -Math.log(probabilities[targetTokenId]);
}

function languageModelLoss(logitsByPosition, targetTokenIds) {
  let total = 0;

  for (let position = 0; position < targetTokenIds.length; position++) {
    // TODO: add loss for this position.
    total += 0;
  }

  return total / targetTokenIds.length;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('two positions equal logits', languageModelLoss([[0, 0], [0, 0]], [0, 1]), -Math.log(0.5));
check('two positions log ratios', languageModelLoss([[0, Math.log(3)], [Math.log(3), 0]], [1, 0]), -Math.log(0.75));

return results;`,hints:["Use onePositionLoss(logitsByPosition[position], targetTokenIds[position]).","Add it to total.","total += onePositionLoss(logitsByPosition[position], targetTokenIds[position]);"],solution:`function softmax(logits) {
  const maxLogit = Math.max(...logits);
  const exps = logits.map((x) => Math.exp(x - maxLogit));
  const denom = exps.reduce((a, b) => a + b, 0);
  return exps.map((x) => x / denom);
}

function onePositionLoss(logits, targetTokenId) {
  const probabilities = softmax(logits);
  return -Math.log(probabilities[targetTokenId]);
}

function languageModelLoss(logitsByPosition, targetTokenIds) {
  let total = 0;

  for (let position = 0; position < targetTokenIds.length; position++) {
    total += onePositionLoss(logitsByPosition[position], targetTokenIds[position]);
  }

  return total / targetTokenIds.length;
}`,explanation:"Language modeling is many small classification losses, one for each predicted next token."},{id:"teacher-forcing-previous-token",stepLabel:"51.1",group:"Teacher forcing",title:"True previous token",concept:"Teacher forcing feeds the true previous token during training.",objective:"Return trueTokens[position - 1].",difficulty:"warmup",starterCode:`function previousTrueToken(trueTokens, position) {
  // position is greater than 0.
  // TODO: return the true previous token.
  return null;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('previous at position 1', previousTrueToken(['A', 'B', 'C'], 1), 'A');
check('previous at position 2', previousTrueToken(['A', 'B', 'C'], 2), 'B');
check('previous at position 3', previousTrueToken(['A', 'B', 'C', 'D'], 3), 'C');

return results;`,hints:["Previous position is position - 1.","Index into trueTokens.","return trueTokens[position - 1];"],solution:`function previousTrueToken(trueTokens, position) {
  return trueTokens[position - 1];
}`,explanation:"During training, teacher forcing gives the model the correct previous context instead of its own sampled mistakes."},{id:"teacher-forcing-inputs",stepLabel:"51.2",group:"Teacher forcing",title:"Teacher-forced inputs",concept:"Training inputs are usually shifted right: start token followed by all true tokens except the last.",objective:"Build [startToken, ...tokensWithoutLast].",difficulty:"core",starterCode:`function teacherForcedInputs(tokens, startToken) {
  const inputs = [startToken];

  for (let i = 0; i < tokens.length - 1; i++) {
    // TODO: append the true token at position i.
    inputs.push(null);
  }

  return inputs;
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

check('ABC', teacherForcedInputs(['A', 'B', 'C'], '<bos>'), ['<bos>', 'A', 'B']);
check('one token', teacherForcedInputs(['A'], '<bos>'), ['<bos>']);
check('four tokens', teacherForcedInputs(['A', 'B', 'C', 'D'], '<bos>'), ['<bos>', 'A', 'B', 'C']);

return results;`,hints:["The loop already stops before the last token.","Push tokens[i].","inputs.push(tokens[i]);"],solution:`function teacherForcedInputs(tokens, startToken) {
  const inputs = [startToken];

  for (let i = 0; i < tokens.length - 1; i++) {
    inputs.push(tokens[i]);
  }

  return inputs;
}`,explanation:"Teacher forcing trains the model to predict token t using the true tokens before t."},{id:"teacher-forcing-targets",stepLabel:"51.3",group:"Teacher forcing",title:"Teacher-forced targets",concept:"For next-token training, targets are the original token sequence.",objective:"Return a copy of tokens.",difficulty:"warmup",starterCode:`function teacherForcedTargets(tokens) {
  // TODO: return the target tokens.
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

check('ABC', teacherForcedTargets(['A', 'B', 'C']), ['A', 'B', 'C']);
check('one token', teacherForcedTargets(['A']), ['A']);

return results;`,hints:["Targets are the true sequence.","Return a shallow copy so you do not mutate the input.","return tokens.slice();"],solution:`function teacherForcedTargets(tokens) {
  return tokens.slice();
}`,explanation:"Inputs are shifted right; targets are the true next tokens to predict."},{id:"causal-labels-drop-first",stepLabel:"52.1",group:"Causal label shifting",title:"Drop first token for labels",concept:"In causal LM training, each position predicts the next token.",objective:"Return tokens from index 1 onward.",difficulty:"warmup",starterCode:`function nextTokenLabels(tokens) {
  // TODO: return all tokens except the first.
  return tokens;
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

check('ABC labels', nextTokenLabels(['A', 'B', 'C']), ['B', 'C']);
check('AB labels', nextTokenLabels(['A', 'B']), ['B']);
check('one token labels', nextTokenLabels(['A']), []);

return results;`,hints:["The first token has no previous token predicting it in this simple setup.","Use slice starting at index 1.","return tokens.slice(1);"],solution:`function nextTokenLabels(tokens) {
  return tokens.slice(1);
}`,explanation:"For sequence A B C, the model can learn A -> B and B -> C."},{id:"causal-inputs-drop-last",stepLabel:"52.2",group:"Causal label shifting",title:"Drop last token for inputs",concept:"The last token has no next-token target inside the sequence.",objective:"Return all tokens except the last.",difficulty:"warmup",starterCode:`function causalInputs(tokens) {
  // TODO: return all tokens except the last.
  return tokens;
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

check('ABC inputs', causalInputs(['A', 'B', 'C']), ['A', 'B']);
check('AB inputs', causalInputs(['A', 'B']), ['A']);
check('one token inputs', causalInputs(['A']), []);

return results;`,hints:["Use slice from the start to length - 1.","The last token is a target, not an input for a next token within this sequence.","return tokens.slice(0, tokens.length - 1);"],solution:`function causalInputs(tokens) {
  return tokens.slice(0, tokens.length - 1);
}`,explanation:"Causal inputs and next-token labels are offset by one position."},{id:"causal-input-label-pairs",stepLabel:"52.3",group:"Causal label shifting",title:"Input-label pairs",concept:"Causal language modeling turns a sequence into pairs: current token -> next token.",objective:"Push [tokens[i], tokens[i + 1]].",difficulty:"core",starterCode:`function causalPairs(tokens) {
  const pairs = [];

  for (let i = 0; i < tokens.length - 1; i++) {
    // TODO: push current token and next token as a pair.
    pairs.push([]);
  }

  return pairs;
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

check('ABC pairs', causalPairs(['A', 'B', 'C']), [['A', 'B'], ['B', 'C']]);
check('AB pairs', causalPairs(['A', 'B']), [['A', 'B']]);
check('one token pairs', causalPairs(['A']), []);

return results;`,hints:["Each pair is current token and next token.","Use tokens[i] and tokens[i + 1].","pairs.push([tokens[i], tokens[i + 1]]);"],solution:`function causalPairs(tokens) {
  const pairs = [];

  for (let i = 0; i < tokens.length - 1; i++) {
    pairs.push([tokens[i], tokens[i + 1]]);
  }

  return pairs;
}`,explanation:"Next-token prediction is supervised learning over shifted token pairs."},{id:"token-training-logit-gradient",stepLabel:"53.1",group:"Mini token training step",title:"Logit gradient",concept:"For softmax + cross-entropy, gradient is probabilities minus one-hot target.",objective:"Push probabilities[i] - target.",difficulty:"core",starterCode:`function logitGradient(probabilities, targetId) {
  const gradient = [];

  for (let i = 0; i < probabilities.length; i++) {
    const target = i === targetId ? 1 : 0;

    // TODO: push probability minus target.
    gradient.push(0);
  }

  return gradient;
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

check('target 0', logitGradient([0.7, 0.3], 0), [-0.3, 0.3]);
check('target 1', logitGradient([0.7, 0.3], 1), [0.7, -0.7]);
check('three classes', logitGradient([0.1, 0.8, 0.1], 1), [0.1, -0.2, 0.1]);

return results;`,hints:["The formula is p - y.","target is 1 for the true class and 0 otherwise.","gradient.push(probabilities[i] - target);"],solution:`function logitGradient(probabilities, targetId) {
  const gradient = [];

  for (let i = 0; i < probabilities.length; i++) {
    const target = i === targetId ? 1 : 0;
    gradient.push(probabilities[i] - target);
  }

  return gradient;
}`,explanation:"The true token logit is pushed up, and competing token logits are pushed down."},{id:"token-training-update-logit",stepLabel:"53.2",group:"Mini token training step",title:"Update one logit",concept:"A gradient step subtracts learningRate times gradient from a parameter.",objective:"Return logit - learningRate * gradient.",difficulty:"warmup",starterCode:`function updateLogit(logit, gradient, learningRate) {
  // TODO: return updated logit.
  return logit;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('negative gradient increases logit', updateLogit(1, -0.3, 0.1), 1.03);
check('positive gradient decreases logit', updateLogit(1, 0.7, 0.1), 0.93);
check('zero gradient no change', updateLogit(5, 0, 0.1), 5);

return results;`,hints:["Gradient descent subtracts the gradient step.","Use logit - learningRate * gradient.","return logit - learningRate * gradient;"],solution:`function updateLogit(logit, gradient, learningRate) {
  return logit - learningRate * gradient;
}`,explanation:"When the true class gradient is negative, subtracting it increases that logit."},{id:"token-training-update-all-logits",stepLabel:"53.3",group:"Mini token training step",title:"Update all logits",concept:"One token-prediction training step updates every vocabulary logit.",objective:"Push logits[i] - learningRate * gradients[i].",difficulty:"core",starterCode:`function updateAllLogits(logits, gradients, learningRate) {
  const updated = [];

  for (let i = 0; i < logits.length; i++) {
    // TODO: update this logit.
    updated.push(logits[i]);
  }

  return updated;
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

check('binary update', updateAllLogits([1, 1], [-0.3, 0.3], 0.1), [1.03, 0.97]);
check('three-class update', updateAllLogits([0, 0, 0], [0.1, -0.2, 0.1], 0.5), [-0.05, 0.1, -0.05]);

return results;`,hints:["Use the same SGD rule for every logit.","Subtract learningRate * gradients[i].","updated.push(logits[i] - learningRate * gradients[i]);"],solution:`function updateAllLogits(logits, gradients, learningRate) {
  const updated = [];

  for (let i = 0; i < logits.length; i++) {
    updated.push(logits[i] - learningRate * gradients[i]);
  }

  return updated;
}`,explanation:"A training step increases the true token score and lowers competing scores."},{id:"sampling-cumulative-pick",stepLabel:"54.1",group:"Sampling from logits",title:"Pick from cumulative probabilities",concept:"Sampling chooses the first cumulative probability that exceeds a random number.",objective:"Return the first index where cumulative probability exceeds r.",difficulty:"core",starterCode:`function sampleFromProbabilities(probabilities, r) {
  let cumulative = 0;

  for (let i = 0; i < probabilities.length; i++) {
    cumulative += probabilities[i];

    // TODO: return i when r is less than cumulative.
  }

  return probabilities.length - 1;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('r in first bucket', sampleFromProbabilities([0.2, 0.3, 0.5], 0.1), 0);
check('r in second bucket', sampleFromProbabilities([0.2, 0.3, 0.5], 0.25), 1);
check('r in third bucket', sampleFromProbabilities([0.2, 0.3, 0.5], 0.8), 2);

return results;`,hints:["cumulative is the probability mass up to index i.","If r < cumulative, choose i.","if (r < cumulative) return i;"],solution:`function sampleFromProbabilities(probabilities, r) {
  let cumulative = 0;

  for (let i = 0; i < probabilities.length; i++) {
    cumulative += probabilities[i];

    if (r < cumulative) return i;
  }

  return probabilities.length - 1;
}`,explanation:"Sampling turns a probability distribution into one selected token ID."},{id:"sampling-token-from-vocab",stepLabel:"54.2",group:"Sampling from logits",title:"Sample token from vocabulary",concept:"After sampling a token ID, decode it through the vocabulary.",objective:"Return vocab[sampledIndex].",difficulty:"warmup",starterCode:`function sampleFromProbabilities(probabilities, r) {
  let cumulative = 0;

  for (let i = 0; i < probabilities.length; i++) {
    cumulative += probabilities[i];
    if (r < cumulative) return i;
  }

  return probabilities.length - 1;
}

function sampleToken(vocab, probabilities, r) {
  const sampledIndex = sampleFromProbabilities(probabilities, r);

  // TODO: return the token at sampledIndex.
  return '';
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

const vocab = ['cat', 'dog', 'fish'];

check('sample cat', sampleToken(vocab, [0.2, 0.3, 0.5], 0.1), 'cat');
check('sample dog', sampleToken(vocab, [0.2, 0.3, 0.5], 0.25), 'dog');
check('sample fish', sampleToken(vocab, [0.2, 0.3, 0.5], 0.8), 'fish');

return results;`,hints:["sampledIndex is already computed.","Use it to index into vocab.","return vocab[sampledIndex];"],solution:`function sampleFromProbabilities(probabilities, r) {
  let cumulative = 0;

  for (let i = 0; i < probabilities.length; i++) {
    cumulative += probabilities[i];
    if (r < cumulative) return i;
  }

  return probabilities.length - 1;
}

function sampleToken(vocab, probabilities, r) {
  const sampledIndex = sampleFromProbabilities(probabilities, r);
  return vocab[sampledIndex];
}`,explanation:"Sampling can produce different valid continuations from the same model distribution."},{id:"sampling-greedy-or-sample",stepLabel:"54.3",group:"Sampling from logits",title:"Greedy or sample",concept:"Generation can choose the highest-probability token or sample from the distribution.",objective:'Use greedy when mode is "greedy", otherwise sample.',difficulty:"core",starterCode:`function argmax(values) {
  let bestIndex = 0;
  let bestValue = values[0];

  for (let i = 1; i < values.length; i++) {
    if (values[i] > bestValue) {
      bestValue = values[i];
      bestIndex = i;
    }
  }

  return bestIndex;
}

function sampleFromProbabilities(probabilities, r) {
  let cumulative = 0;
  for (let i = 0; i < probabilities.length; i++) {
    cumulative += probabilities[i];
    if (r < cumulative) return i;
  }
  return probabilities.length - 1;
}

function chooseTokenId(probabilities, mode, r) {
  // TODO: if mode is "greedy", return argmax; otherwise sample.
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('greedy chooses largest', chooseTokenId([0.2, 0.3, 0.5], 'greedy', 0.1), 2);
check('sample first bucket', chooseTokenId([0.2, 0.3, 0.5], 'sample', 0.1), 0);
check('sample second bucket', chooseTokenId([0.2, 0.3, 0.5], 'sample', 0.25), 1);

return results;`,hints:["Greedy ignores r and picks argmax.","Sampling uses sampleFromProbabilities.",'return mode === "greedy" ? argmax(probabilities) : sampleFromProbabilities(probabilities, r);'],solution:`function argmax(values) {
  let bestIndex = 0;
  let bestValue = values[0];

  for (let i = 1; i < values.length; i++) {
    if (values[i] > bestValue) {
      bestValue = values[i];
      bestIndex = i;
    }
  }

  return bestIndex;
}

function sampleFromProbabilities(probabilities, r) {
  let cumulative = 0;
  for (let i = 0; i < probabilities.length; i++) {
    cumulative += probabilities[i];
    if (r < cumulative) return i;
  }
  return probabilities.length - 1;
}

function chooseTokenId(probabilities, mode, r) {
  return mode === "greedy" ? argmax(probabilities) : sampleFromProbabilities(probabilities, r);
}`,explanation:"Greedy decoding is stable but can be dull; sampling is more diverse but less predictable."},{id:"temperature-scale-logits",stepLabel:"55.1",group:"Temperature and top-k / top-p",title:"Temperature-scaled logits",concept:"Temperature divides logits before softmax. Lower temperature sharpens; higher temperature flattens.",objective:"Push logits[i] / temperature.",difficulty:"core",starterCode:`function applyTemperature(logits, temperature) {
  const scaled = [];

  for (let i = 0; i < logits.length; i++) {
    // TODO: divide logit by temperature.
    scaled.push(logits[i]);
  }

  return scaled;
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

check('temperature 1', applyTemperature([2, 4], 1), [2, 4]);
check('temperature 2', applyTemperature([2, 4], 2), [1, 2]);
check('temperature 0.5', applyTemperature([2, 4], 0.5), [4, 8]);

return results;`,hints:["Temperature rescales every logit.","Divide by temperature.","scaled.push(logits[i] / temperature);"],solution:`function applyTemperature(logits, temperature) {
  const scaled = [];

  for (let i = 0; i < logits.length; i++) {
    scaled.push(logits[i] / temperature);
  }

  return scaled;
}`,explanation:"Temperature changes how sharp the final softmax distribution becomes."},{id:"top-k-indices",stepLabel:"55.2",group:"Temperature and top-k / top-p",title:"Top-k indices",concept:"Top-k sampling keeps only the k highest-scoring tokens.",objective:"Return indices of the top k logits.",difficulty:"challenge",starterCode:`function topKIndices(logits, k) {
  const indexed = logits.map((value, index) => ({ value, index }));

  indexed.sort((a, b) => b.value - a.value);

  // TODO: return the first k indices.
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

check('top 1', topKIndices([1, 5, 3], 1), [1]);
check('top 2', topKIndices([1, 5, 3], 2), [1, 2]);
check('top 3', topKIndices([-1, -5, 0], 3), [2, 0, 1]);

return results;`,hints:["indexed is already sorted from largest to smallest.","Take the first k entries and return their index fields.","return indexed.slice(0, k).map((item) => item.index);"],solution:`function topKIndices(logits, k) {
  const indexed = logits.map((value, index) => ({ value, index }));

  indexed.sort((a, b) => b.value - a.value);

  return indexed.slice(0, k).map((item) => item.index);
}`,explanation:"Top-k prevents low-ranked tokens from being sampled at all."},{id:"top-k-mask-logits",stepLabel:"55.3",group:"Temperature and top-k / top-p",title:"Mask non-top-k logits",concept:"Tokens outside top-k are masked to -Infinity before softmax.",objective:"Keep logits in allowed indices, otherwise -Infinity.",difficulty:"challenge",starterCode:`function maskToTopK(logits, allowedIndices) {
  const masked = [];

  for (let i = 0; i < logits.length; i++) {
    // TODO: keep logits[i] only if i is in allowedIndices.
    masked.push(logits[i]);
  }

  return masked;
}`,testCode:`const results = [];

function sameArraySpecial(a, b) {
  return a.length === b.length && a.every((value, index) => Object.is(value, b[index]));
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: sameArraySpecial(actual, expected),
  });
}

check('keep indices 1 and 2', maskToTopK([1, 5, 3], [1, 2]), [-Infinity, 5, 3]);
check('keep index 0', maskToTopK([1, 5, 3], [0]), [1, -Infinity, -Infinity]);

return results;`,hints:["Use allowedIndices.includes(i).","Keep the logit when allowed; otherwise use -Infinity.","masked.push(allowedIndices.includes(i) ? logits[i] : -Infinity);"],solution:`function maskToTopK(logits, allowedIndices) {
  const masked = [];

  for (let i = 0; i < logits.length; i++) {
    masked.push(allowedIndices.includes(i) ? logits[i] : -Infinity);
  }

  return masked;
}`,explanation:"Masking before softmax makes excluded tokens receive zero probability."},{id:"top-p-cutoff",stepLabel:"55.4",group:"Temperature and top-k / top-p",title:"Top-p cutoff",concept:"Top-p keeps the smallest set of high-probability tokens whose cumulative mass reaches p.",objective:"Return how many sorted probabilities are needed to reach p.",difficulty:"challenge",starterCode:`function topPCount(sortedProbabilities, p) {
  let cumulative = 0;

  for (let i = 0; i < sortedProbabilities.length; i++) {
    cumulative += sortedProbabilities[i];

    // TODO: return i + 1 once cumulative reaches p.
  }

  return sortedProbabilities.length;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('one token enough', topPCount([0.8, 0.1, 0.1], 0.7), 1);
check('two tokens needed', topPCount([0.5, 0.3, 0.2], 0.8), 2);
check('all tokens needed', topPCount([0.4, 0.3, 0.2, 0.1], 0.95), 4);

return results;`,hints:["sortedProbabilities are already largest to smallest.","When cumulative >= p, return the number of tokens included.","if (cumulative >= p) return i + 1;"],solution:`function topPCount(sortedProbabilities, p) {
  let cumulative = 0;

  for (let i = 0; i < sortedProbabilities.length; i++) {
    cumulative += sortedProbabilities[i];

    if (cumulative >= p) return i + 1;
  }

  return sortedProbabilities.length;
}`,explanation:"Top-p adapts the candidate set size to the shape of the probability distribution."},{id:"eagle-self-trust-check",stepLabel:"17.1",group:"Self-trust threshold",title:"EAGLE speculative self-trust check",concept:"EAGLE speculative decoding dynamically extends draft trees. If the draft models confidence is higher than a self-trust threshold, it accepts the draft step.",objective:"Return true if confidence is greater than or equal to threshold, otherwise false.",difficulty:"warmup",starterCode:`function checkSelfTrust(confidence, threshold) {
  // TODO: return true if confidence is at least threshold
  return false;
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('trusted', checkSelfTrust(0.85, 0.8), true);
check('untrusted', checkSelfTrust(0.75, 0.8), false);
return results;`,hints:["Use confidence >= threshold."],solution:`function checkSelfTrust(confidence, threshold) {
  return confidence >= threshold;
}`,explanation:"Self-trust thresholds allow draft models to bypass verification for high-confidence tokens, speeding up speculative generation."},{id:"eagle-token-salvage",stepLabel:"17.2",group:"Token salvage",title:"Salvage rejected draft tokens",concept:"When the target model rejects draft tokens, EAGLE salvages the prefix of accepted tokens to form the new sequence.",objective:"Filter draft tokens: keep only tokens whose corresponding acceptMask value is true.",difficulty:"core",starterCode:`function salvageTokens(draftTokens, acceptMask) {
  const accepted = [];
  for (let i = 0; i < draftTokens.length; i++) {
    // TODO: if acceptMask[i] is true, push draftTokens[i] to accepted
  }
  return accepted;
}`,testCode:`const results = [];
function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual, expected) });
}
check('salvage mixed', salvageTokens(['a', 'b', 'c'], [true, false, true]), ['a', 'c']);
return results;`,hints:["Check if acceptMask[i] is true.","If so, push draftTokens[i] to accepted."],solution:`function salvageTokens(draftTokens, acceptMask) {
  const accepted = [];
  for (let i = 0; i < draftTokens.length; i++) {
    if (acceptMask[i]) {
      accepted.push(draftTokens[i]);
    }
  }
  return accepted;
}`,explanation:"Salvaging ensures accepted draft prefix tokens are kept even if a future token in the batch is rejected."}],D=[{id:"rag-count-tokens",stepLabel:"56.1",group:"Token counts and chunking",title:"Count tokens",concept:"A simple token budget starts by counting how many tokens a piece of text uses.",objective:"Return the number of whitespace-separated tokens.",difficulty:"warmup",starterCode:`function countTokens(text) {
  const trimmed = text.trim();

  if (trimmed === '') return 0;

  // TODO: split on whitespace and return the number of pieces.
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('three words', countTokens('the cat sat'), 3);
check('extra spaces', countTokens('  the   cat   sat  '), 3);
check('empty string', countTokens(''), 0);
check('one token', countTokens('hello'), 1);

return results;`,hints:["Use a regular expression that matches one or more whitespace characters.","trimmed.split(/\\\\s+/) gives an array of simple tokens.","return trimmed.split(/\\\\s+/).length;"],solution:`function countTokens(text) {
  const trimmed = text.trim();

  if (trimmed === '') return 0;

  return trimmed.split(/\\s+/).length;
}`,explanation:"Real tokenizers are more complex than whitespace splitting, but token-budget reasoning starts with counting how much context each text piece consumes."},{id:"rag-chunk-fits-budget",stepLabel:"56.2",group:"Token counts and chunking",title:"Does this chunk fit?",concept:"A chunk can be packed only if its token count is within the remaining context budget.",objective:"Return whether chunkTokens is less than or equal to remainingBudget.",difficulty:"warmup",starterCode:`function chunkFits(chunkTokens, remainingBudget) {
  // TODO: return true when the chunk fits in the remaining budget.
  return false;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('fits exactly', chunkFits(100, 100), true);
check('fits under budget', chunkFits(80, 100), true);
check('too large', chunkFits(120, 100), false);

return results;`,hints:["A chunk fits when it is not larger than the remaining budget.","Use <=.","return chunkTokens <= remainingBudget;"],solution:`function chunkFits(chunkTokens, remainingBudget) {
  return chunkTokens <= remainingBudget;
}`,explanation:"RAG systems often fail not because evidence is unavailable, but because the right chunks do not fit into the final prompt."},{id:"rag-fixed-size-chunks",stepLabel:"56.3",group:"Token counts and chunking",title:"Fixed-size chunks",concept:"Chunking splits a token list into smaller windows.",objective:"Push slices of size chunkSize.",difficulty:"core",starterCode:`function fixedChunks(tokens, chunkSize) {
  const chunks = [];

  for (let start = 0; start < tokens.length; start += chunkSize) {
    // TODO: push tokens from start to start + chunkSize.
    chunks.push([]);
  }

  return chunks;
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

check('chunks of 2', fixedChunks(['a', 'b', 'c', 'd', 'e'], 2), [['a', 'b'], ['c', 'd'], ['e']]);
check('chunks of 3', fixedChunks(['a', 'b', 'c', 'd'], 3), [['a', 'b', 'c'], ['d']]);
check('one chunk', fixedChunks(['a', 'b'], 5), [['a', 'b']]);

return results;`,hints:["Array.slice(start, end) extracts a window.","The end should be start + chunkSize.","chunks.push(tokens.slice(start, start + chunkSize));"],solution:`function fixedChunks(tokens, chunkSize) {
  const chunks = [];

  for (let start = 0; start < tokens.length; start += chunkSize) {
    chunks.push(tokens.slice(start, start + chunkSize));
  }

  return chunks;
}`,explanation:"Fixed chunks are simple, but they can split important evidence across boundaries."},{id:"rag-overlapping-chunks",stepLabel:"56.4",group:"Token counts and chunking",title:"Overlapping chunks",concept:"Overlap preserves context near chunk boundaries.",objective:"Advance by chunkSize - overlap instead of chunkSize.",difficulty:"challenge",starterCode:`function overlappingChunks(tokens, chunkSize, overlap) {
  const chunks = [];
  const step = chunkSize - overlap;

  for (let start = 0; start < tokens.length; start += step) {
    // TODO: push a chunk from start to start + chunkSize.
    chunks.push([]);
  }

  return chunks;
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

check('chunk size 3 overlap 1', overlappingChunks(['a', 'b', 'c', 'd', 'e'], 3, 1), [['a', 'b', 'c'], ['c', 'd', 'e'], ['e']]);
check('chunk size 4 overlap 2', overlappingChunks(['a', 'b', 'c', 'd', 'e'], 4, 2), [['a', 'b', 'c', 'd'], ['c', 'd', 'e'], ['e']]);

return results;`,hints:["The step is already computed.","Each chunk is still tokens.slice(start, start + chunkSize).","chunks.push(tokens.slice(start, start + chunkSize));"],solution:`function overlappingChunks(tokens, chunkSize, overlap) {
  const chunks = [];
  const step = chunkSize - overlap;

  for (let start = 0; start < tokens.length; start += step) {
    chunks.push(tokens.slice(start, start + chunkSize));
  }

  return chunks;
}`,explanation:"Overlap reduces boundary loss, but it also increases total retrieved token cost."},{id:"bow-build-vocabulary",stepLabel:"57.1",group:"Bag-of-words vectors",title:"Build vocabulary",concept:"A bag-of-words vector needs a fixed vocabulary of known terms.",objective:"Return the unique words in first-seen order.",difficulty:"core",starterCode:`function buildVocabulary(tokens) {
  const vocab = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    // TODO: push token only if it is not already in vocab.
  }

  return vocab;
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

check('unique words', buildVocabulary(['cat', 'dog', 'cat', 'fish']), ['cat', 'dog', 'fish']);
check('one word repeated', buildVocabulary(['a', 'a', 'a']), ['a']);
check('already unique', buildVocabulary(['a', 'b', 'c']), ['a', 'b', 'c']);

return results;`,hints:["Use vocab.includes(token) to check if it is already present.","Only push when it is not included.","if (!vocab.includes(token)) vocab.push(token);"],solution:`function buildVocabulary(tokens) {
  const vocab = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (!vocab.includes(token)) vocab.push(token);
  }

  return vocab;
}`,explanation:"Vocabulary fixes the coordinate system for text vectors."},{id:"bow-count-word",stepLabel:"57.2",group:"Bag-of-words vectors",title:"Count one word",concept:"A bag-of-words entry counts how often a vocabulary word appears.",objective:"Count occurrences of target in tokens.",difficulty:"warmup",starterCode:`function countWord(tokens, target) {
  let count = 0;

  for (let i = 0; i < tokens.length; i++) {
    // TODO: increment count when tokens[i] equals target.
  }

  return count;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('cat count', countWord(['cat', 'dog', 'cat'], 'cat'), 2);
check('dog count', countWord(['cat', 'dog', 'cat'], 'dog'), 1);
check('missing count', countWord(['cat', 'dog'], 'fish'), 0);

return results;`,hints:["Use an if statement.","If tokens[i] === target, add one.","if (tokens[i] === target) count += 1;"],solution:`function countWord(tokens, target) {
  let count = 0;

  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i] === target) count += 1;
  }

  return count;
}`,explanation:"Bag-of-words ignores order and keeps only word counts."},{id:"bow-vectorize-document",stepLabel:"57.3",group:"Bag-of-words vectors",title:"Vectorize document",concept:"A bag-of-words vector has one count per vocabulary word.",objective:"Push countWord(tokens, vocab[i]) for each vocabulary word.",difficulty:"core",starterCode:`function countWord(tokens, target) {
  let count = 0;

  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i] === target) count += 1;
  }

  return count;
}

function bowVector(tokens, vocab) {
  const vector = [];

  for (let i = 0; i < vocab.length; i++) {
    // TODO: push the count of vocab[i] in tokens.
    vector.push(0);
  }

  return vector;
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

const vocab = ['cat', 'dog', 'fish'];

check('cat dog cat', bowVector(['cat', 'dog', 'cat'], vocab), [2, 1, 0]);
check('fish fish', bowVector(['fish', 'fish'], vocab), [0, 0, 2]);
check('empty document', bowVector([], vocab), [0, 0, 0]);

return results;`,hints:["Each vector coordinate corresponds to one vocabulary word.","Use countWord(tokens, vocab[i]).","vector.push(countWord(tokens, vocab[i]));"],solution:`function countWord(tokens, target) {
  let count = 0;

  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i] === target) count += 1;
  }

  return count;
}

function bowVector(tokens, vocab) {
  const vector = [];

  for (let i = 0; i < vocab.length; i++) {
    vector.push(countWord(tokens, vocab[i]));
  }

  return vector;
}`,explanation:"Text becomes a vector by counting vocabulary terms."},{id:"bow-normalize-counts",stepLabel:"57.4",group:"Bag-of-words vectors",title:"Normalize counts",concept:"Normalizing counts can reduce the effect of document length.",objective:"Divide each count by total count.",difficulty:"core",starterCode:`function normalizeCounts(counts) {
  const total = counts.reduce((sum, value) => sum + value, 0);

  if (total === 0) return counts.map(() => 0);

  const normalized = [];

  for (let i = 0; i < counts.length; i++) {
    // TODO: divide counts[i] by total.
    normalized.push(counts[i]);
  }

  return normalized;
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

check('normalize [2,1,0]', normalizeCounts([2, 1, 0]), [2 / 3, 1 / 3, 0]);
check('normalize [0,0,2]', normalizeCounts([0, 0, 2]), [0, 0, 1]);
check('normalize empty counts', normalizeCounts([0, 0, 0]), [0, 0, 0]);

return results;`,hints:["total is already computed.","Each normalized value is counts[i] / total.","normalized.push(counts[i] / total);"],solution:`function normalizeCounts(counts) {
  const total = counts.reduce((sum, value) => sum + value, 0);

  if (total === 0) return counts.map(() => 0);

  const normalized = [];

  for (let i = 0; i < counts.length; i++) {
    normalized.push(counts[i] / total);
  }

  return normalized;
}`,explanation:"Normalized vectors compare word proportions rather than raw document length."},{id:"retrieval-dot-score",stepLabel:"58.1",group:"Cosine retrieval",title:"Dot retrieval score",concept:"A simple retrieval score compares a query vector with a document vector.",objective:"Return dot(query, document).",difficulty:"warmup",starterCode:`function dot(a, b) {
  let total = 0;

  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }

  return total;
}

function retrievalDotScore(query, document) {
  // TODO: return query dotted with document.
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('score 1', retrievalDotScore([1, 2], [3, 4]), 11);
check('orthogonal', retrievalDotScore([1, 0], [0, 1]), 0);
check('negative value', retrievalDotScore([-1, 2], [3, 5]), 7);

return results;`,hints:["Use the dot helper.","Retrieval score is a similarity score.","return dot(query, document);"],solution:`function dot(a, b) {
  let total = 0;

  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }

  return total;
}

function retrievalDotScore(query, document) {
  return dot(query, document);
}`,explanation:"Embedding retrieval ranks documents by similarity to the query vector."},{id:"retrieval-cosine-score",stepLabel:"58.2",group:"Cosine retrieval",title:"Cosine retrieval score",concept:"Cosine similarity compares direction instead of raw vector length.",objective:"Return dot(query, document) divided by both norms.",difficulty:"core",starterCode:`function dot(a, b) {
  let total = 0;

  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }

  return total;
}

function norm(v) {
  return Math.sqrt(dot(v, v));
}

function cosineScore(query, document) {
  // TODO: return cosine similarity.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('same direction', cosineScore([1, 0], [5, 0]), 1);
check('perpendicular', cosineScore([1, 0], [0, 1]), 0);
check('opposite', cosineScore([1, 0], [-2, 0]), -1);
check('classic', cosineScore([1, 2], [3, 4]), 11 / (Math.sqrt(5) * 5));

return results;`,hints:["Cosine = dot / (norm(query) * norm(document)).","Use the dot and norm helpers.","return dot(query, document) / (norm(query) * norm(document));"],solution:`function dot(a, b) {
  let total = 0;

  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }

  return total;
}

function norm(v) {
  return Math.sqrt(dot(v, v));
}

function cosineScore(query, document) {
  return dot(query, document) / (norm(query) * norm(document));
}`,explanation:"Cosine retrieval is useful when vector direction matters more than vector magnitude."},{id:"retrieval-score-all-documents",stepLabel:"58.3",group:"Cosine retrieval",title:"Score all documents",concept:"A retriever scores every candidate document before ranking.",objective:"Push cosineScore(query, documents[i]) for each document.",difficulty:"core",starterCode:`function dot(a, b) {
  return a.reduce((total, value, i) => total + value * b[i], 0);
}

function norm(v) {
  return Math.sqrt(dot(v, v));
}

function cosineScore(query, document) {
  return dot(query, document) / (norm(query) * norm(document));
}

function scoreDocuments(query, documents) {
  const scores = [];

  for (let i = 0; i < documents.length; i++) {
    // TODO: push cosine score for this document.
    scores.push(0);
  }

  return scores;
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

check('score three documents', scoreDocuments([1, 0], [[1, 0], [0, 1], [-1, 0]]), [1, 0, -1]);

return results;`,hints:["Loop through the documents.","Use cosineScore(query, documents[i]).","scores.push(cosineScore(query, documents[i]));"],solution:`function dot(a, b) {
  return a.reduce((total, value, i) => total + value * b[i], 0);
}

function norm(v) {
  return Math.sqrt(dot(v, v));
}

function cosineScore(query, document) {
  return dot(query, document) / (norm(query) * norm(document));
}

function scoreDocuments(query, documents) {
  const scores = [];

  for (let i = 0; i < documents.length; i++) {
    scores.push(cosineScore(query, documents[i]));
  }

  return scores;
}`,explanation:"Retrieval turns a query into a ranked list by scoring every candidate document."},{id:"retrieval-rank-documents",stepLabel:"58.4",group:"Cosine retrieval",title:"Rank documents",concept:"Retrieval returns document IDs sorted by descending score.",objective:"Return document IDs sorted from highest score to lowest.",difficulty:"challenge",starterCode:`function rankDocuments(scores) {
  const indexed = scores.map((score, index) => ({ score, index }));

  indexed.sort((a, b) => b.score - a.score);

  // TODO: return the sorted document indices.
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

check('simple ranking', rankDocuments([0.2, 0.9, 0.4]), [1, 2, 0]);
check('negative scores', rankDocuments([-1, 0, 1]), [2, 1, 0]);
check('already sorted', rankDocuments([3, 2, 1]), [0, 1, 2]);

return results;`,hints:["The array is already sorted by score.","Map each item to item.index.","return indexed.map((item) => item.index);"],solution:`function rankDocuments(scores) {
  const indexed = scores.map((score, index) => ({ score, index }));

  indexed.sort((a, b) => b.score - a.score);

  return indexed.map((item) => item.index);
}`,explanation:"The ranker converts similarity scores into retrieval order."},{id:"retrieval-hit-at-k",stepLabel:"59.1",group:"Retrieval metrics",title:"Hit@k",concept:"Hit@k checks whether at least one relevant document appears in the top k.",objective:"Return true if any of the top-k retrieved IDs are relevant.",difficulty:"core",starterCode:`function hitAtK(retrievedIds, relevantIds, k) {
  const topK = retrievedIds.slice(0, k);

  for (let i = 0; i < topK.length; i++) {
    // TODO: return true if topK[i] is relevant.
  }

  return false;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('hit at 1', hitAtK(['a', 'b', 'c'], ['a'], 1), true);
check('miss at 1 hit at 2', hitAtK(['a', 'b', 'c'], ['b'], 1), false);
check('hit at 2', hitAtK(['a', 'b', 'c'], ['b'], 2), true);
check('no hit', hitAtK(['a', 'b'], ['z'], 2), false);

return results;`,hints:["Use relevantIds.includes(topK[i]).","If you find a relevant item, return true immediately.","if (relevantIds.includes(topK[i])) return true;"],solution:`function hitAtK(retrievedIds, relevantIds, k) {
  const topK = retrievedIds.slice(0, k);

  for (let i = 0; i < topK.length; i++) {
    if (relevantIds.includes(topK[i])) return true;
  }

  return false;
}`,explanation:"Hit@k is simple: did retrieval put at least one useful document in the top k?"},{id:"retrieval-recall-at-k",stepLabel:"59.2",group:"Retrieval metrics",title:"Recall@k",concept:"Recall@k measures how many relevant documents were retrieved in the top k.",objective:"Count relevant docs in top-k and divide by total relevant docs.",difficulty:"core",starterCode:`function recallAtK(retrievedIds, relevantIds, k) {
  const topK = retrievedIds.slice(0, k);
  let found = 0;

  for (let i = 0; i < topK.length; i++) {
    // TODO: increment found if topK[i] is relevant.
  }

  return found / relevantIds.length;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('one of two relevant', recallAtK(['a', 'b', 'c'], ['a', 'z'], 2), 0.5);
check('two of two relevant', recallAtK(['a', 'b', 'c'], ['a', 'b'], 2), 1);
check('zero of two relevant', recallAtK(['a', 'b', 'c'], ['x', 'y'], 3), 0);
check('top k matters', recallAtK(['a', 'b', 'c'], ['c'], 2), 0);

return results;`,hints:["Use relevantIds.includes(topK[i]).","Increment found for each relevant retrieved doc.","if (relevantIds.includes(topK[i])) found += 1;"],solution:`function recallAtK(retrievedIds, relevantIds, k) {
  const topK = retrievedIds.slice(0, k);
  let found = 0;

  for (let i = 0; i < topK.length; i++) {
    if (relevantIds.includes(topK[i])) found += 1;
  }

  return found / relevantIds.length;
}`,explanation:"Recall@k matters because a generator cannot use relevant evidence that retrieval failed to include."},{id:"retrieval-mrr",stepLabel:"59.3",group:"Retrieval metrics",title:"Mean reciprocal rank for one query",concept:"MRR rewards placing the first relevant result early.",objective:"Return 1 / rank of the first relevant result.",difficulty:"challenge",starterCode:`function reciprocalRank(retrievedIds, relevantIds) {
  for (let i = 0; i < retrievedIds.length; i++) {
    // TODO: if retrievedIds[i] is relevant, return 1 / (i + 1).
  }

  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('first result relevant', reciprocalRank(['a', 'b', 'c'], ['a']), 1);
check('second result relevant', reciprocalRank(['a', 'b', 'c'], ['b']), 0.5);
check('third result relevant', reciprocalRank(['a', 'b', 'c'], ['c']), 1 / 3);
check('no relevant result', reciprocalRank(['a', 'b'], ['z']), 0);

return results;`,hints:["Rank is i + 1 because arrays are zero-indexed.","Use relevantIds.includes(retrievedIds[i]).","if (relevantIds.includes(retrievedIds[i])) return 1 / (i + 1);"],solution:`function reciprocalRank(retrievedIds, relevantIds) {
  for (let i = 0; i < retrievedIds.length; i++) {
    if (relevantIds.includes(retrievedIds[i])) return 1 / (i + 1);
  }

  return 0;
}`,explanation:"MRR focuses on how soon the first useful result appears."},{id:"retrieval-dcg-at-k",stepLabel:"59.4",group:"Retrieval metrics",title:"DCG@k",concept:"DCG gives more credit to relevant documents that appear earlier in the ranking.",objective:"Add relevance / log2(rank + 1) for each top-k result.",difficulty:"challenge",starterCode:`function dcgAtK(relevances, k) {
  let total = 0;

  for (let i = 0; i < Math.min(k, relevances.length); i++) {
    const rank = i + 1;

    // TODO: add discounted relevance.
    total += 0;
  }

  return total;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('single relevant first', dcgAtK([1, 0, 0], 3), 1);
check('single relevant second', dcgAtK([0, 1, 0], 3), 1 / Math.log2(3));
check('graded relevance', dcgAtK([3, 2], 2), 3 / Math.log2(2) + 2 / Math.log2(3));

return results;`,hints:["Rank starts at 1, not 0.","Discount denominator is Math.log2(rank + 1).","total += relevances[i] / Math.log2(rank + 1);"],solution:`function dcgAtK(relevances, k) {
  let total = 0;

  for (let i = 0; i < Math.min(k, relevances.length); i++) {
    const rank = i + 1;
    total += relevances[i] / Math.log2(rank + 1);
  }

  return total;
}`,explanation:"DCG rewards both relevance and good ordering."},{id:"rerank-by-score",stepLabel:"60.1",group:"Reranking and grounding checks",title:"Rerank by score",concept:"A reranker reorders retrieved chunks using a more expensive relevance score.",objective:"Return chunk IDs sorted by descending reranker score.",difficulty:"core",starterCode:`function rerank(chunkScores) {
  const indexed = chunkScores.map((item) => ({
    id: item.id,
    score: item.score,
  }));

  indexed.sort((a, b) => b.score - a.score);

  // TODO: return sorted chunk IDs.
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

check('rerank chunks', rerank([{ id: 'a', score: 0.2 }, { id: 'b', score: 0.9 }, { id: 'c', score: 0.4 }]), ['b', 'c', 'a']);

return results;`,hints:["The array is already sorted by score.","Map each item to item.id.","return indexed.map((item) => item.id);"],solution:`function rerank(chunkScores) {
  const indexed = chunkScores.map((item) => ({
    id: item.id,
    score: item.score,
  }));

  indexed.sort((a, b) => b.score - a.score);

  return indexed.map((item) => item.id);
}`,explanation:"Retrieval often uses a fast first pass, then reranks a smaller candidate set more carefully."},{id:"grounding-answer-phrase-check",stepLabel:"60.2",group:"Reranking and grounding checks",title:"Answer phrase support",concept:"A simple grounding check asks whether the cited chunk contains the answer phrase.",objective:"Return whether chunkText includes answerPhrase.",difficulty:"warmup",starterCode:`function chunkContainsAnswer(chunkText, answerPhrase) {
  // TODO: return whether answerPhrase appears in chunkText.
  return false;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('contains phrase', chunkContainsAnswer('The cancellation fee is waived after 12 months.', '12 months'), true);
check('missing phrase', chunkContainsAnswer('The cancellation fee is waived after 24 months.', '12 months'), false);
check('exact phrase', chunkContainsAnswer('refund policy', 'refund'), true);

return results;`,hints:["Use string includes.","chunkText.includes(answerPhrase) checks for substring support.","return chunkText.includes(answerPhrase);"],solution:`function chunkContainsAnswer(chunkText, answerPhrase) {
  return chunkText.includes(answerPhrase);
}`,explanation:"This is a toy grounding check. Real grounding needs entailment, not just substring matching."},{id:"grounding-detect-unsupported-citation",stepLabel:"60.3",group:"Reranking and grounding checks",title:"Unsupported citation",concept:"A citation is suspicious when the cited chunk does not contain the required answer evidence.",objective:"Return true when the citation is unsupported.",difficulty:"core",starterCode:`function isUnsupportedCitation(chunkText, answerPhrase) {
  const supports = chunkText.includes(answerPhrase);

  // TODO: return true when supports is false.
  return false;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('supported citation', isUnsupportedCitation('Fee waived after 12 months.', '12 months'), false);
check('unsupported citation', isUnsupportedCitation('Fee waived after 24 months.', '12 months'), true);
check('missing answer entirely', isUnsupportedCitation('No fee details here.', '12 months'), true);

return results;`,hints:["Unsupported means not supported.","supports is already computed.","return !supports;"],solution:`function isUnsupportedCitation(chunkText, answerPhrase) {
  const supports = chunkText.includes(answerPhrase);
  return !supports;
}`,explanation:"Unsupported citations are dangerous because they make hallucinations look grounded."},{id:"grounding-conflict-check",stepLabel:"60.4",group:"Reranking and grounding checks",title:"Conflicting evidence",concept:"RAG systems should detect when retrieved chunks disagree.",objective:"Return true when two chunks contain different claimed values.",difficulty:"challenge",starterCode:`function hasConflict(valueA, valueB) {
  // TODO: return true when values disagree.
  return false;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('same value no conflict', hasConflict('12 months', '12 months'), false);
check('different values conflict', hasConflict('12 months', '24 months'), true);
check('same number no conflict', hasConflict(5, 5), false);
check('different number conflict', hasConflict(5, 7), true);

return results;`,hints:["Conflict means the values are not equal.","Use !==.","return valueA !== valueB;"],solution:`function hasConflict(valueA, valueB) {
  return valueA !== valueB;
}`,explanation:"A good RAG system should not silently choose one source when retrieved evidence conflicts."},{id:"prompt-packing-reserve-answer-budget",stepLabel:"61.1",group:"Prompt packing / context budget",title:"Reserve answer budget",concept:"A prompt packer should leave room for the model response.",objective:"Return totalContext - answerBudget.",difficulty:"warmup",starterCode:`function inputBudget(totalContext, answerBudget) {
  // TODO: return how many tokens are available for input.
  return totalContext;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('reserve 1000 from 8000', inputBudget(8000, 1000), 7000);
check('reserve 500 from 4096', inputBudget(4096, 500), 3596);
check('reserve zero', inputBudget(1000, 0), 1000);

return results;`,hints:["Input and output share the context window.","Subtract answerBudget from totalContext.","return totalContext - answerBudget;"],solution:`function inputBudget(totalContext, answerBudget) {
  return totalContext - answerBudget;
}`,explanation:"If you fill the whole context with input, there may be no room left for the answer."},{id:"prompt-packing-greedy-chunks",stepLabel:"61.2",group:"Prompt packing / context budget",title:"Greedy chunk packing",concept:"A simple prompt packer adds chunks until the budget is exhausted.",objective:"Add a chunk only if it fits.",difficulty:"core",starterCode:`function packChunksGreedy(chunks, budget) {
  const packed = [];
  let used = 0;

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];

    // TODO: if used + chunk.tokens <= budget, pack the chunk and update used.
  }

  return packed;
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

const chunks = [
  { id: 'a', tokens: 100 },
  { id: 'b', tokens: 200 },
  { id: 'c', tokens: 300 },
];

check('budget 250', packChunksGreedy(chunks, 250), ['a']);
check('budget 500', packChunksGreedy(chunks, 500), ['a', 'b']);
check('budget 600', packChunksGreedy(chunks, 600), ['a', 'b', 'c']);

return results;`,hints:["Check whether used + chunk.tokens is within budget.","If it fits, push chunk.id and add chunk.tokens to used.",`if (used + chunk.tokens <= budget) {
  packed.push(chunk.id);
  used += chunk.tokens;
}`],solution:`function packChunksGreedy(chunks, budget) {
  const packed = [];
  let used = 0;

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];

    if (used + chunk.tokens <= budget) {
      packed.push(chunk.id);
      used += chunk.tokens;
    }
  }

  return packed;
}`,explanation:"Greedy packing is simple, but it may skip a smaller useful chunk after a large chunk consumes the budget."},{id:"prompt-packing-sort-by-relevance",stepLabel:"61.3",group:"Prompt packing / context budget",title:"Sort by relevance",concept:"Prompt packing usually prioritizes high-relevance chunks before filling the budget.",objective:"Sort chunks by descending relevance.",difficulty:"core",starterCode:`function sortByRelevance(chunks) {
  const sorted = chunks.slice();

  // TODO: sort highest relevance first.
  return sorted;
}`,testCode:`const results = [];

function sameArray(a, b) {
  return JSON.stringify(a.map((x) => x.id)) === JSON.stringify(b);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual.map((x) => x.id)),
    expected: JSON.stringify(expected),
    passed: sameArray(actual, expected),
  });
}

check('sort chunks', sortByRelevance([{ id: 'a', relevance: 0.2 }, { id: 'b', relevance: 0.9 }, { id: 'c', relevance: 0.4 }]), ['b', 'c', 'a']);

return results;`,hints:["Use Array.sort.","Descending means b.relevance - a.relevance.","sorted.sort((a, b) => b.relevance - a.relevance);"],solution:`function sortByRelevance(chunks) {
  const sorted = chunks.slice();

  sorted.sort((a, b) => b.relevance - a.relevance);

  return sorted;
}`,explanation:"RAG systems often rerank or sort chunks before packing them into the final prompt."},{id:"prompt-packing-relevance-budget",stepLabel:"61.4",group:"Prompt packing / context budget",title:"Pack relevant chunks within budget",concept:"A practical packer sorts by relevance, then greedily adds chunks that fit.",objective:"Sort by relevance and pack fitting chunks.",difficulty:"challenge",starterCode:`function packRelevantChunks(chunks, budget) {
  const sorted = chunks.slice();
  sorted.sort((a, b) => b.relevance - a.relevance);

  const packed = [];
  let used = 0;

  for (let i = 0; i < sorted.length; i++) {
    const chunk = sorted[i];

    // TODO: pack this chunk if it fits.
  }

  return packed;
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

const chunks = [
  { id: 'a', tokens: 100, relevance: 0.2 },
  { id: 'b', tokens: 300, relevance: 0.9 },
  { id: 'c', tokens: 200, relevance: 0.8 },
  { id: 'd', tokens: 100, relevance: 0.7 },
];

check('budget 300', packRelevantChunks(chunks, 300), ['b']);
check('budget 400', packRelevantChunks(chunks, 400), ['b', 'd']);
check('budget 500', packRelevantChunks(chunks, 500), ['b', 'c']);

return results;`,hints:["The chunks are already sorted by relevance.","Use the same budget check as greedy packing.","If it fits, push chunk.id and update used.",`if (used + chunk.tokens <= budget) {
  packed.push(chunk.id);
  used += chunk.tokens;
}`],solution:`function packRelevantChunks(chunks, budget) {
  const sorted = chunks.slice();
  sorted.sort((a, b) => b.relevance - a.relevance);

  const packed = [];
  let used = 0;

  for (let i = 0; i < sorted.length; i++) {
    const chunk = sorted[i];

    if (used + chunk.tokens <= budget) {
      packed.push(chunk.id);
      used += chunk.tokens;
    }
  }

  return packed;
}`,explanation:"Prompt packing balances relevance against token budget. The best chunk is not useful if it crowds out required evidence."}],P=[{id:"eval-true-positive",stepLabel:"62.1",group:"Confusion matrix",title:"True positive",concept:"A true positive happens when the model predicts positive and the true label is positive.",objective:"Return true only when prediction and label are both 1.",difficulty:"warmup",starterCode:`function isTruePositive(prediction, label) {
  // TODO: return true only when prediction is 1 and label is 1.
  return false;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('predicted positive, actually positive', isTruePositive(1, 1), true);
check('predicted positive, actually negative', isTruePositive(1, 0), false);
check('predicted negative, actually positive', isTruePositive(0, 1), false);
check('predicted negative, actually negative', isTruePositive(0, 0), false);

return results;`,hints:["True positive means both values are positive.","Use prediction === 1 and label === 1.","return prediction === 1 && label === 1;"],solution:`function isTruePositive(prediction, label) {
  return prediction === 1 && label === 1;
}`,explanation:"True positives are the successful detections of the positive class."},{id:"eval-false-positive",stepLabel:"62.2",group:"Confusion matrix",title:"False positive",concept:"A false positive happens when the model predicts positive but the true label is negative.",objective:"Return true only when prediction is 1 and label is 0.",difficulty:"warmup",starterCode:`function isFalsePositive(prediction, label) {
  // TODO: return true only when prediction is 1 and label is 0.
  return false;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('predicted positive, actually negative', isFalsePositive(1, 0), true);
check('predicted positive, actually positive', isFalsePositive(1, 1), false);
check('predicted negative, actually positive', isFalsePositive(0, 1), false);
check('predicted negative, actually negative', isFalsePositive(0, 0), false);

return results;`,hints:["False positive means the alarm fired but the event was not real.","Use prediction === 1 and label === 0.","return prediction === 1 && label === 0;"],solution:`function isFalsePositive(prediction, label) {
  return prediction === 1 && label === 0;
}`,explanation:"False positives matter when incorrect alarms are costly."},{id:"eval-false-negative",stepLabel:"62.3",group:"Confusion matrix",title:"False negative",concept:"A false negative happens when the model predicts negative but the true label is positive.",objective:"Return true only when prediction is 0 and label is 1.",difficulty:"warmup",starterCode:`function isFalseNegative(prediction, label) {
  // TODO: return true only when prediction is 0 and label is 1.
  return false;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('predicted negative, actually positive', isFalseNegative(0, 1), true);
check('predicted positive, actually positive', isFalseNegative(1, 1), false);
check('predicted positive, actually negative', isFalseNegative(1, 0), false);
check('predicted negative, actually negative', isFalseNegative(0, 0), false);

return results;`,hints:["False negative means the model missed a real positive.","Use prediction === 0 and label === 1.","return prediction === 0 && label === 1;"],solution:`function isFalseNegative(prediction, label) {
  return prediction === 0 && label === 1;
}`,explanation:"False negatives matter when missing a positive case is dangerous or expensive."},{id:"eval-confusion-counts",stepLabel:"62.4",group:"Confusion matrix",title:"Count confusion matrix",concept:"A confusion matrix counts TP, FP, TN, and FN over a dataset.",objective:"Increment the correct count for each prediction-label pair.",difficulty:"core",starterCode:`function confusionCounts(predictions, labels) {
  const counts = { tp: 0, fp: 0, tn: 0, fn: 0 };

  for (let i = 0; i < predictions.length; i++) {
    const prediction = predictions[i];
    const label = labels[i];

    // TODO: increment exactly one of tp, fp, tn, fn.
  }

  return counts;
}`,testCode:`const results = [];

function sameObject(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: sameObject(actual, expected),
  });
}

check('mixed predictions', confusionCounts([1, 1, 0, 0], [1, 0, 1, 0]), { tp: 1, fp: 1, tn: 1, fn: 1 });
check('perfect predictions', confusionCounts([1, 0, 1, 0], [1, 0, 1, 0]), { tp: 2, fp: 0, tn: 2, fn: 0 });
check('all missed positives', confusionCounts([0, 0, 0], [1, 1, 0]), { tp: 0, fp: 0, tn: 1, fn: 2 });

return results;`,hints:["There are four mutually exclusive cases.","Check prediction and label together.",`if (prediction === 1 && label === 1) counts.tp += 1;
else if (prediction === 1 && label === 0) counts.fp += 1;
else if (prediction === 0 && label === 0) counts.tn += 1;
else counts.fn += 1;`],solution:`function confusionCounts(predictions, labels) {
  const counts = { tp: 0, fp: 0, tn: 0, fn: 0 };

  for (let i = 0; i < predictions.length; i++) {
    const prediction = predictions[i];
    const label = labels[i];

    if (prediction === 1 && label === 1) counts.tp += 1;
    else if (prediction === 1 && label === 0) counts.fp += 1;
    else if (prediction === 0 && label === 0) counts.tn += 1;
    else counts.fn += 1;
  }

  return counts;
}`,explanation:"The confusion matrix is the foundation for precision, recall, specificity, F1, ROC, and PR curves."},{id:"eval-accuracy",stepLabel:"63.1",group:"Precision / recall / F1",title:"Accuracy",concept:"Accuracy is the fraction of examples the model classified correctly.",objective:"Return (tp + tn) / total.",difficulty:"warmup",starterCode:`function accuracy(counts) {
  const total = counts.tp + counts.fp + counts.tn + counts.fn;

  // TODO: return accuracy.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('balanced example', accuracy({ tp: 1, fp: 1, tn: 1, fn: 1 }), 0.5);
check('perfect', accuracy({ tp: 2, fp: 0, tn: 2, fn: 0 }), 1);
check('all wrong', accuracy({ tp: 0, fp: 2, tn: 0, fn: 2 }), 0);

return results;`,hints:["Correct predictions are true positives plus true negatives.","Divide by total examples.","return (counts.tp + counts.tn) / total;"],solution:`function accuracy(counts) {
  const total = counts.tp + counts.fp + counts.tn + counts.fn;
  return (counts.tp + counts.tn) / total;
}`,explanation:"Accuracy is easy to understand, but it can be misleading on imbalanced datasets."},{id:"eval-precision",stepLabel:"63.2",group:"Precision / recall / F1",title:"Precision",concept:"Precision asks: among predicted positives, how many were truly positive?",objective:"Return tp / (tp + fp).",difficulty:"core",starterCode:`function precision(counts) {
  const predictedPositive = counts.tp + counts.fp;

  if (predictedPositive === 0) return 0;

  // TODO: return precision.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('one true, one false positive', precision({ tp: 1, fp: 1, tn: 1, fn: 1 }), 0.5);
check('perfect precision', precision({ tp: 3, fp: 0, tn: 1, fn: 2 }), 1);
check('no predicted positives', precision({ tp: 0, fp: 0, tn: 5, fn: 2 }), 0);

return results;`,hints:["Precision focuses on predictions labeled positive.","The denominator is tp + fp.","return counts.tp / predictedPositive;"],solution:`function precision(counts) {
  const predictedPositive = counts.tp + counts.fp;

  if (predictedPositive === 0) return 0;

  return counts.tp / predictedPositive;
}`,explanation:"High precision means positive predictions are trustworthy."},{id:"eval-recall",stepLabel:"63.3",group:"Precision / recall / F1",title:"Recall",concept:"Recall asks: among actual positives, how many did the model find?",objective:"Return tp / (tp + fn).",difficulty:"core",starterCode:`function recall(counts) {
  const actualPositive = counts.tp + counts.fn;

  if (actualPositive === 0) return 0;

  // TODO: return recall.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('one found, one missed', recall({ tp: 1, fp: 1, tn: 1, fn: 1 }), 0.5);
check('perfect recall', recall({ tp: 3, fp: 2, tn: 1, fn: 0 }), 1);
check('no actual positives', recall({ tp: 0, fp: 2, tn: 5, fn: 0 }), 0);

return results;`,hints:["Recall focuses on actual positive cases.","The denominator is tp + fn.","return counts.tp / actualPositive;"],solution:`function recall(counts) {
  const actualPositive = counts.tp + counts.fn;

  if (actualPositive === 0) return 0;

  return counts.tp / actualPositive;
}`,explanation:"High recall means the model misses fewer positive cases."},{id:"eval-f1",stepLabel:"63.4",group:"Precision / recall / F1",title:"F1 score",concept:"F1 is the harmonic mean of precision and recall.",objective:"Return 2pr / (p + r).",difficulty:"challenge",starterCode:`function f1Score(precisionValue, recallValue) {
  if (precisionValue + recallValue === 0) return 0;

  // TODO: return F1 score.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('precision 0.5 recall 0.5', f1Score(0.5, 0.5), 0.5);
check('precision 1 recall 0.5', f1Score(1, 0.5), 2 / 3);
check('precision 0 recall 0', f1Score(0, 0), 0);

return results;`,hints:["F1 combines precision and recall.","Use 2 * precision * recall / (precision + recall).","return (2 * precisionValue * recallValue) / (precisionValue + recallValue);"],solution:`function f1Score(precisionValue, recallValue) {
  if (precisionValue + recallValue === 0) return 0;

  return (2 * precisionValue * recallValue) / (precisionValue + recallValue);
}`,explanation:"F1 is useful when you need a single score that balances false positives and false negatives."},{id:"threshold-predict",stepLabel:"64.1",group:"ROC / PR threshold sweeps",title:"Predict by threshold",concept:"A probabilistic classifier becomes a hard classifier by choosing a threshold.",objective:"Return 1 when score is at least threshold, otherwise 0.",difficulty:"warmup",starterCode:`function predictByThreshold(score, threshold) {
  // TODO: return 1 if score >= threshold, else 0.
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('above threshold', predictByThreshold(0.8, 0.5), 1);
check('below threshold', predictByThreshold(0.3, 0.5), 0);
check('equal threshold counts positive', predictByThreshold(0.5, 0.5), 1);

return results;`,hints:["Thresholding turns scores into labels.","Use score >= threshold.","return score >= threshold ? 1 : 0;"],solution:`function predictByThreshold(score, threshold) {
  return score >= threshold ? 1 : 0;
}`,explanation:"Changing the threshold changes the tradeoff between false positives and false negatives."},{id:"threshold-predict-all",stepLabel:"64.2",group:"ROC / PR threshold sweeps",title:"Threshold all scores",concept:"A threshold sweep applies many thresholds to the same scores.",objective:"Push thresholded prediction for each score.",difficulty:"core",starterCode:`function predictByThreshold(score, threshold) {
  return score >= threshold ? 1 : 0;
}

function predictionsAtThreshold(scores, threshold) {
  const predictions = [];

  for (let i = 0; i < scores.length; i++) {
    // TODO: push prediction for scores[i].
    predictions.push(0);
  }

  return predictions;
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

check('threshold 0.5', predictionsAtThreshold([0.8, 0.3, 0.5], 0.5), [1, 0, 1]);
check('threshold 0.7', predictionsAtThreshold([0.8, 0.3, 0.5], 0.7), [1, 0, 0]);
check('threshold 0.2', predictionsAtThreshold([0.8, 0.3, 0.5], 0.2), [1, 1, 1]);

return results;`,hints:["Use predictByThreshold on each score.","Push the result into predictions.","predictions.push(predictByThreshold(scores[i], threshold));"],solution:`function predictByThreshold(score, threshold) {
  return score >= threshold ? 1 : 0;
}

function predictionsAtThreshold(scores, threshold) {
  const predictions = [];

  for (let i = 0; i < scores.length; i++) {
    predictions.push(predictByThreshold(scores[i], threshold));
  }

  return predictions;
}`,explanation:"Threshold sweeps let you see how metrics change as the decision boundary moves."},{id:"roc-false-positive-rate",stepLabel:"64.3",group:"ROC / PR threshold sweeps",title:"False positive rate",concept:"FPR asks: among actual negatives, how many did the model incorrectly mark positive?",objective:"Return fp / (fp + tn).",difficulty:"core",starterCode:`function falsePositiveRate(counts) {
  const actualNegatives = counts.fp + counts.tn;

  if (actualNegatives === 0) return 0;

  // TODO: return FPR.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('one false positive, one true negative', falsePositiveRate({ tp: 1, fp: 1, tn: 1, fn: 1 }), 0.5);
check('no false positives', falsePositiveRate({ tp: 1, fp: 0, tn: 4, fn: 1 }), 0);
check('all negatives false positive', falsePositiveRate({ tp: 1, fp: 4, tn: 0, fn: 1 }), 1);

return results;`,hints:["FPR is based on actual negatives.","The denominator is fp + tn.","return counts.fp / actualNegatives;"],solution:`function falsePositiveRate(counts) {
  const actualNegatives = counts.fp + counts.tn;

  if (actualNegatives === 0) return 0;

  return counts.fp / actualNegatives;
}`,explanation:"ROC curves plot true positive rate against false positive rate."},{id:"roc-true-positive-rate",stepLabel:"64.4",group:"ROC / PR threshold sweeps",title:"True positive rate",concept:"TPR is another name for recall.",objective:"Return tp / (tp + fn).",difficulty:"core",starterCode:`function truePositiveRate(counts) {
  const actualPositives = counts.tp + counts.fn;

  if (actualPositives === 0) return 0;

  // TODO: return TPR.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('one found, one missed', truePositiveRate({ tp: 1, fp: 1, tn: 1, fn: 1 }), 0.5);
check('perfect recall', truePositiveRate({ tp: 4, fp: 1, tn: 1, fn: 0 }), 1);
check('miss all positives', truePositiveRate({ tp: 0, fp: 1, tn: 1, fn: 4 }), 0);

return results;`,hints:["TPR is recall.","The denominator is tp + fn.","return counts.tp / actualPositives;"],solution:`function truePositiveRate(counts) {
  const actualPositives = counts.tp + counts.fn;

  if (actualPositives === 0) return 0;

  return counts.tp / actualPositives;
}`,explanation:"TPR measures how many actual positives the model catches."},{id:"calibration-bin-index",stepLabel:"65.1",group:"Calibration bins",title:"Calibration bin index",concept:"Calibration groups predictions by score range.",objective:"Return the bin index for a score using equal-width bins.",difficulty:"core",starterCode:`function binIndex(score, numBins) {
  // Scores are between 0 and 1.
  // TODO: return Math.floor(score * numBins), capped at numBins - 1.
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('score 0.05 bin 0 of 10', binIndex(0.05, 10), 0);
check('score 0.35 bin 3 of 10', binIndex(0.35, 10), 3);
check('score 0.99 bin 9 of 10', binIndex(0.99, 10), 9);
check('score 1.0 capped bin 9 of 10', binIndex(1.0, 10), 9);

return results;`,hints:["Start with Math.floor(score * numBins).","A score of 1.0 would produce numBins, so cap it.","return Math.min(numBins - 1, Math.floor(score * numBins));"],solution:`function binIndex(score, numBins) {
  return Math.min(numBins - 1, Math.floor(score * numBins));
}`,explanation:"Calibration bins let you compare predicted confidence with actual frequency."},{id:"calibration-bin-confidence",stepLabel:"65.2",group:"Calibration bins",title:"Average bin confidence",concept:"A bin average confidence is the mean predicted probability in that bin.",objective:"Return average of the scores.",difficulty:"warmup",starterCode:`function averageConfidence(scores) {
  if (scores.length === 0) return 0;

  let total = 0;

  for (let i = 0; i < scores.length; i++) {
    total += scores[i];
  }

  // TODO: return average confidence.
  return total;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('average two scores', averageConfidence([0.2, 0.4]), 0.3);
check('one score', averageConfidence([0.7]), 0.7);
check('empty bin', averageConfidence([]), 0);

return results;`,hints:["Average means total divided by count.","The count is scores.length.","return total / scores.length;"],solution:`function averageConfidence(scores) {
  if (scores.length === 0) return 0;

  let total = 0;

  for (let i = 0; i < scores.length; i++) {
    total += scores[i];
  }

  return total / scores.length;
}`,explanation:"If a bin average confidence is 0.8, a calibrated model should be correct about 80% of the time in that bin."},{id:"calibration-bin-accuracy",stepLabel:"65.3",group:"Calibration bins",title:"Bin accuracy",concept:"A bin empirical accuracy is the fraction of examples in that bin that were correct.",objective:"Return number correct divided by bin size.",difficulty:"core",starterCode:`function binAccuracy(correctFlags) {
  if (correctFlags.length === 0) return 0;

  let correct = 0;

  for (let i = 0; i < correctFlags.length; i++) {
    // TODO: increment correct when correctFlags[i] is true.
  }

  return correct / correctFlags.length;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('two of three correct', binAccuracy([true, true, false]), 2 / 3);
check('all correct', binAccuracy([true, true]), 1);
check('none correct', binAccuracy([false, false]), 0);
check('empty bin', binAccuracy([]), 0);

return results;`,hints:["correctFlags[i] is a boolean.","If it is true, add 1.","if (correctFlags[i]) correct += 1;"],solution:`function binAccuracy(correctFlags) {
  if (correctFlags.length === 0) return 0;

  let correct = 0;

  for (let i = 0; i < correctFlags.length; i++) {
    if (correctFlags[i]) correct += 1;
  }

  return correct / correctFlags.length;
}`,explanation:"Calibration compares confidence to empirical accuracy."},{id:"calibration-gap",stepLabel:"65.4",group:"Calibration bins",title:"Calibration gap",concept:"A calibration gap is the absolute difference between confidence and accuracy.",objective:"Return |confidence - accuracy|.",difficulty:"warmup",starterCode:`function calibrationGap(confidence, accuracy) {
  // TODO: return absolute difference.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('overconfident gap', calibrationGap(0.8, 0.6), 0.2);
check('underconfident gap', calibrationGap(0.4, 0.7), 0.3);
check('perfect gap', calibrationGap(0.5, 0.5), 0);

return results;`,hints:["Use Math.abs.","Subtract accuracy from confidence, then take absolute value.","return Math.abs(confidence - accuracy);"],solution:`function calibrationGap(confidence, accuracy) {
  return Math.abs(confidence - accuracy);
}`,explanation:"A calibrated model has small gaps between predicted confidence and observed correctness."},{id:"ece-bin-weight",stepLabel:"66.1",group:"Expected calibration error",title:"Bin weight",concept:"ECE weights each bin by how many examples it contains.",objective:"Return binCount / totalCount.",difficulty:"warmup",starterCode:`function binWeight(binCount, totalCount) {
  // TODO: return bin fraction.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('half the examples', binWeight(50, 100), 0.5);
check('one tenth', binWeight(10, 100), 0.1);
check('empty bin', binWeight(0, 100), 0);

return results;`,hints:["Weight is the bin size divided by total size.","Use binCount / totalCount.","return binCount / totalCount;"],solution:`function binWeight(binCount, totalCount) {
  return binCount / totalCount;
}`,explanation:"Large bins should matter more than tiny bins in the final ECE."},{id:"ece-bin-contribution",stepLabel:"66.2",group:"Expected calibration error",title:"One bin contribution",concept:"A bin contributes weight times calibration gap to ECE.",objective:"Return weight * abs(confidence - accuracy).",difficulty:"core",starterCode:`function eceBinContribution(binCount, totalCount, confidence, accuracy) {
  const weight = binCount / totalCount;

  // TODO: return weighted calibration gap.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('simple contribution', eceBinContribution(50, 100, 0.8, 0.6), 0.1);
check('perfect bin', eceBinContribution(50, 100, 0.8, 0.8), 0);
check('small bin', eceBinContribution(10, 100, 0.4, 0.7), 0.03);

return results;`,hints:["Calibration gap is Math.abs(confidence - accuracy).","Multiply by weight.","return weight * Math.abs(confidence - accuracy);"],solution:`function eceBinContribution(binCount, totalCount, confidence, accuracy) {
  const weight = binCount / totalCount;
  return weight * Math.abs(confidence - accuracy);
}`,explanation:"ECE summarizes calibration error across bins with size weighting."},{id:"ece-full",stepLabel:"66.3",group:"Expected calibration error",title:"Expected calibration error",concept:"ECE is the sum of weighted calibration gaps across bins.",objective:"Accumulate each bin weighted gap.",difficulty:"challenge",starterCode:`function expectedCalibrationError(bins, totalCount) {
  let ece = 0;

  for (let i = 0; i < bins.length; i++) {
    const bin = bins[i];

    // bin has count, confidence, accuracy.
    // TODO: add this bin's contribution.
    ece += 0;
  }

  return ece;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('two bins', expectedCalibrationError([{ count: 50, confidence: 0.8, accuracy: 0.6 }, { count: 50, confidence: 0.4, accuracy: 0.5 }], 100), 0.15);
check('perfect calibration', expectedCalibrationError([{ count: 30, confidence: 0.7, accuracy: 0.7 }, { count: 70, confidence: 0.2, accuracy: 0.2 }], 100), 0);

return results;`,hints:["For each bin, contribution is count / totalCount times absolute confidence-accuracy gap.","Use Math.abs(bin.confidence - bin.accuracy).","ece += (bin.count / totalCount) * Math.abs(bin.confidence - bin.accuracy);"],solution:`function expectedCalibrationError(bins, totalCount) {
  let ece = 0;

  for (let i = 0; i < bins.length; i++) {
    const bin = bins[i];

    ece += (bin.count / totalCount) * Math.abs(bin.confidence - bin.accuracy);
  }

  return ece;
}`,explanation:"ECE is a compact calibration summary, but it depends on binning choices."},{id:"cost-false-positive",stepLabel:"67.1",group:"Cost-sensitive thresholding",title:"False positive cost",concept:"False positives and false negatives can have different costs.",objective:"Return fp * falsePositiveCost.",difficulty:"warmup",starterCode:`function falsePositiveCost(fp, falsePositiveCostPerCase) {
  // TODO: return total false-positive cost.
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('two false positives cost 5', falsePositiveCost(2, 5), 10);
check('zero false positives', falsePositiveCost(0, 5), 0);
check('three false positives cost 10', falsePositiveCost(3, 10), 30);

return results;`,hints:["Total cost is count times cost per case.","Use fp * falsePositiveCostPerCase.","return fp * falsePositiveCostPerCase;"],solution:`function falsePositiveCost(fp, falsePositiveCostPerCase) {
  return fp * falsePositiveCostPerCase;
}`,explanation:"When false alarms are expensive, precision may matter more."},{id:"cost-false-negative",stepLabel:"67.2",group:"Cost-sensitive thresholding",title:"False negative cost",concept:"False negatives may be much more expensive than false positives in safety-critical tasks.",objective:"Return fn * falseNegativeCost.",difficulty:"warmup",starterCode:`function falseNegativeCost(fn, falseNegativeCostPerCase) {
  // TODO: return total false-negative cost.
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('two false negatives cost 50', falseNegativeCost(2, 50), 100);
check('zero false negatives', falseNegativeCost(0, 50), 0);
check('three false negatives cost 10', falseNegativeCost(3, 10), 30);

return results;`,hints:["Total cost is count times cost per case.","Use fn * falseNegativeCostPerCase.","return fn * falseNegativeCostPerCase;"],solution:`function falseNegativeCost(fn, falseNegativeCostPerCase) {
  return fn * falseNegativeCostPerCase;
}`,explanation:"When misses are expensive, recall may matter more."},{id:"cost-total-decision-cost",stepLabel:"67.3",group:"Cost-sensitive thresholding",title:"Total decision cost",concept:"A threshold can be chosen by minimizing total false-positive and false-negative cost.",objective:"Return fp cost plus fn cost.",difficulty:"core",starterCode:`function totalDecisionCost(counts, costs) {
  const fpCost = counts.fp * costs.falsePositive;
  const fnCost = counts.fn * costs.falseNegative;

  // TODO: return total cost.
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('balanced costs', totalDecisionCost({ fp: 2, fn: 3 }, { falsePositive: 5, falseNegative: 5 }), 25);
check('false negatives expensive', totalDecisionCost({ fp: 2, fn: 3 }, { falsePositive: 1, falseNegative: 10 }), 32);
check('no mistakes', totalDecisionCost({ fp: 0, fn: 0 }, { falsePositive: 5, falseNegative: 10 }), 0);

return results;`,hints:["fpCost and fnCost are already computed.","Total cost is their sum.","return fpCost + fnCost;"],solution:`function totalDecisionCost(counts, costs) {
  const fpCost = counts.fp * costs.falsePositive;
  const fnCost = counts.fn * costs.falseNegative;

  return fpCost + fnCost;
}`,explanation:"The best threshold depends on the business or safety cost of each error type."},{id:"cost-choose-threshold",stepLabel:"67.4",group:"Cost-sensitive thresholding",title:"Choose lower-cost threshold",concept:"A cost-sensitive classifier chooses the threshold with lower expected cost.",objective:"Return thresholdA if costA <= costB, otherwise thresholdB.",difficulty:"core",starterCode:`function chooseLowerCostThreshold(thresholdA, costA, thresholdB, costB) {
  // TODO: return the threshold with lower cost.
  return thresholdA;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('A lower cost', chooseLowerCostThreshold(0.3, 10, 0.7, 20), 0.3);
check('B lower cost', chooseLowerCostThreshold(0.3, 30, 0.7, 20), 0.7);
check('tie chooses A', chooseLowerCostThreshold(0.3, 20, 0.7, 20), 0.3);

return results;`,hints:["Compare costA and costB.","If costA is lower or tied, return thresholdA.","return costA <= costB ? thresholdA : thresholdB;"],solution:`function chooseLowerCostThreshold(thresholdA, costA, thresholdB, costB) {
  return costA <= costB ? thresholdA : thresholdB;
}`,explanation:"Threshold selection is a decision problem, not just a metrics problem."},{id:"drift-mean-shift",stepLabel:"68.1",group:"Drift checks",title:"Mean shift",concept:"A simple drift check compares feature means between reference and current data.",objective:"Return currentMean - referenceMean.",difficulty:"warmup",starterCode:`function meanShift(referenceMean, currentMean) {
  // TODO: return current minus reference.
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('positive shift', meanShift(10, 13), 3);
check('negative shift', meanShift(10, 7), -3);
check('no shift', meanShift(10, 10), 0);

return results;`,hints:["Shift is current value compared with reference.","Use currentMean - referenceMean.","return currentMean - referenceMean;"],solution:`function meanShift(referenceMean, currentMean) {
  return currentMean - referenceMean;
}`,explanation:"Mean shift is a simple first warning that a feature distribution has changed."},{id:"drift-standardized-mean-shift",stepLabel:"68.2",group:"Drift checks",title:"Standardized mean shift",concept:"Standardized shift divides mean change by reference standard deviation.",objective:"Return (currentMean - referenceMean) / referenceStd.",difficulty:"core",starterCode:`function standardizedMeanShift(referenceMean, currentMean, referenceStd) {
  // TODO: return standardized shift.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('one std shift', standardizedMeanShift(10, 12, 2), 1);
check('negative shift', standardizedMeanShift(10, 7, 3), -1);
check('zero shift', standardizedMeanShift(10, 10, 5), 0);

return results;`,hints:["First compute currentMean - referenceMean.","Then divide by referenceStd.","return (currentMean - referenceMean) / referenceStd;"],solution:`function standardizedMeanShift(referenceMean, currentMean, referenceStd) {
  return (currentMean - referenceMean) / referenceStd;
}`,explanation:"A shift of 2 units may be small or large depending on normal feature variation."},{id:"drift-threshold-check",stepLabel:"68.3",group:"Drift checks",title:"Drift threshold check",concept:"A drift alert can fire when absolute standardized shift exceeds a threshold.",objective:"Return true when |shift| > threshold.",difficulty:"core",starterCode:`function driftAlert(standardizedShift, threshold) {
  // TODO: return whether absolute shift exceeds threshold.
  return false;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('large positive shift', driftAlert(2.5, 2), true);
check('large negative shift', driftAlert(-2.5, 2), true);
check('small shift', driftAlert(1.5, 2), false);
check('equal threshold is not greater', driftAlert(2, 2), false);

return results;`,hints:["Use Math.abs.","Compare absolute shift with threshold.","return Math.abs(standardizedShift) > threshold;"],solution:`function driftAlert(standardizedShift, threshold) {
  return Math.abs(standardizedShift) > threshold;
}`,explanation:"Drift checks are not proof of model failure, but they can trigger investigation."},{id:"drift-psi-term",stepLabel:"68.4",group:"Drift checks",title:"PSI term",concept:"Population Stability Index compares reference and current proportions in a bin.",objective:"Return (current - reference) * log(current / reference).",difficulty:"challenge",starterCode:`function psiTerm(referenceProportion, currentProportion) {
  // TODO: return one PSI bin contribution.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('same proportions', psiTerm(0.2, 0.2), 0);
check('changed proportions', psiTerm(0.2, 0.4), (0.4 - 0.2) * Math.log(0.4 / 0.2));
check('another change', psiTerm(0.5, 0.25), (0.25 - 0.5) * Math.log(0.25 / 0.5));

return results;`,hints:["PSI compares current and reference proportions.","Use Math.log(currentProportion / referenceProportion).","return (currentProportion - referenceProportion) * Math.log(currentProportion / referenceProportion);"],solution:`function psiTerm(referenceProportion, currentProportion) {
  return (currentProportion - referenceProportion) * Math.log(currentProportion / referenceProportion);
}`,explanation:"PSI is a common monitoring heuristic for distribution shift across binned features."},{id:"drift-total-psi",stepLabel:"68.5",group:"Drift checks",title:"Total PSI",concept:"Total PSI sums bin-level PSI contributions.",objective:"Accumulate psiTerm for every bin.",difficulty:"challenge",starterCode:`function psiTerm(referenceProportion, currentProportion) {
  return (currentProportion - referenceProportion) * Math.log(currentProportion / referenceProportion);
}

function populationStabilityIndex(referenceBins, currentBins) {
  let total = 0;

  for (let i = 0; i < referenceBins.length; i++) {
    // TODO: add PSI contribution for this bin.
    total += 0;
  }

  return total;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('no drift', populationStabilityIndex([0.5, 0.5], [0.5, 0.5]), 0);
check('two-bin drift', populationStabilityIndex([0.5, 0.5], [0.25, 0.75]), psiTerm(0.5, 0.25) + psiTerm(0.5, 0.75));

return results;`,hints:["Use psiTerm(referenceBins[i], currentBins[i]).","Add each bin contribution to total.","total += psiTerm(referenceBins[i], currentBins[i]);"],solution:`function psiTerm(referenceProportion, currentProportion) {
  return (currentProportion - referenceProportion) * Math.log(currentProportion / referenceProportion);
}

function populationStabilityIndex(referenceBins, currentBins) {
  let total = 0;

  for (let i = 0; i < referenceBins.length; i++) {
    total += psiTerm(referenceBins[i], currentBins[i]);
  }

  return total;
}`,explanation:"PSI summarizes how much a binned distribution changed between reference and current data."},{id:"rank-dot-score",stepLabel:"12.1",group:"Dot score",title:"User-item dot product score",concept:"Collaborative filtering and ranking models score user-item pairs by calculating the dot product of user and item embedding vectors.",objective:"Compute the dot product score of user and item vectors.",difficulty:"warmup",starterCode:`function dotUserItem(user, item) {
  let score = 0;
  for (let i = 0; i < user.length; i++) {
    // TODO: multiply user[i] by item[i] and add to score
    score += 0;
  }
  return score;
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('score aligned', dotUserItem([0.5, 0.5], [2.0, 3.0]), 2.5);
check('score zero', dotUserItem([0.0, 1.0], [5.0, 0.0]), 0);
return results;`,hints:["Multiply user[i] by item[i].","Add it to the score variable.","score += user[i] * item[i];"],solution:`function dotUserItem(user, item) {
  let score = 0;
  for (let i = 0; i < user.length; i++) {
    score += user[i] * item[i];
  }
  return score;
}`,explanation:"User-item dot product measures how much the user preferences align with item features."},{id:"rank-pairwise-hinge",stepLabel:"12.2",group:"Pairwise hinge",title:"Pairwise hinge loss",concept:"Pairwise ranking loss pushes positive items to have higher scores than negative items. Hinge loss is max(0, margin - (scorePos - scoreNeg)).",objective:"Compute the pairwise hinge loss with a given margin.",difficulty:"core",starterCode:`function pairwiseHingeLoss(scorePos, scoreNeg, margin = 1.0) {
  const diff = scorePos - scoreNeg;
  // TODO: return max(0, margin - diff)
  return 0;
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('loss positive', pairwiseHingeLoss(0.5, 0.2, 1.0), 0.7); // 1.0 - 0.3 = 0.7
check('loss zero', pairwiseHingeLoss(1.5, 0.2, 1.0), 0); // 1.0 - 1.3 = -0.3 <= 0
return results;`,hints:["Use Math.max(0, margin - diff)."],solution:`function pairwiseHingeLoss(scorePos, scoreNeg, margin = 1.0) {
  const diff = scorePos - scoreNeg;
  return Math.max(0, margin - diff);
}`,explanation:"Hinge loss penalizes the model when the positive item score is not higher than the negative item score by at least the margin."},{id:"eval-pass-at-k",stepLabel:"28.1",group:"Pass@k",title:"Pass@k evaluation metric",concept:"Pass@k measures LLM code generation quality: probability that at least one of k generated samples passes tests. Formula: 1 - C(n-c, k) / C(n, k), where n is total samples and c is number of passing samples.",objective:"Compute the Pass@k ratio. If n - c < k, return 1.0; otherwise calculate the product.",difficulty:"challenge",starterCode:`function passAtK(n, c, k) {
  if (n - c < k) return 1.0;
  let prod = 1.0;
  for (let i = 0; i < k; i++) {
    // TODO: multiply prod by (n - c - i) / (n - i)
    prod *= 1.0;
  }
  return 1.0 - prod;
}`,testCode:`const results = [];
function approxEqual(a, b, tol = 1e-5) {
  return Math.abs(a - b) <= tol;
}
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('pass@1 equal', passAtK(10, 2, 1), 0.2); // c/n = 0.2
check('pass@2 with c=2', passAtK(10, 2, 2), 0.377778); // 1 - (8/10 * 7/9) = 1 - 0.622222 = 0.377778
return results;`,hints:["The term for index i is (n - c - i) / (n - i).","Multiply prod by this term.","prod *= (n - c - i) / (n - i);"],solution:`function passAtK(n, c, k) {
  if (n - c < k) return 1.0;
  let prod = 1.0;
  for (let i = 0; i < k; i++) {
    prod *= (n - c - i) / (n - i);
  }
  return 1.0 - prod;
}`,explanation:"Pass@k estimates how likely a user is to get a working code snippet if they sample k solutions from the model."},{id:"interpretability-marginal",stepLabel:"48.1",group:"Marginal contrib",title:"Marginal Contribution",concept:"Shapley values explain predictions by computing the marginal contribution of each feature across subset combinations.",objective:"Compute the difference in model prediction with versus without feature i: f(S union {i}) - f(S).",difficulty:"warmup",starterCode:`function marginalContribution(predWith, predWithout) {
  // TODO: return the difference between prediction with and without feature
  return 0;
}`,testCode:`const results = [];
function approxEqual(a, b, tol = 1e-5) {
  return Math.abs(a - b) <= tol;
}
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('positive contribution', marginalContribution(0.85, 0.60), 0.25);
check('negative contribution', marginalContribution(0.40, 0.55), -0.15);
return results;`,hints:["Subtract predWithout from predWith.","return predWith - predWithout;"],solution:`function marginalContribution(predWith, predWithout) {
  return predWith - predWithout;
}`,explanation:"A feature's marginal contribution measures its direct value-add to a specific coalition of features."},{id:"interpretability-shapley-sum",stepLabel:"48.2",group:"Sum to delta",title:"Shapley Attribution Sum",concept:"The sum of Shapley values for all features exactly equals the difference between the model's prediction and the base expected value.",objective:"Verify that the sum of feature attributions matches the prediction delta: sum(phi_i) === f(x) - E[f(x)].",difficulty:"core",starterCode:`function verifyShapleySum(attributions, prediction, baseline) {
  let sum = 0;
  for (let i = 0; i < attributions.length; i++) {
    // TODO: accumulate attributions
    sum += 0;
  }
  const delta = prediction - baseline;
  // Check if they are approximately equal within a small tolerance
  return Math.abs(sum - delta) < 1e-5;
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('sum matches delta', verifyShapleySum([0.15, 0.05, -0.10], 0.85, 0.75), true);
check('sum mismatch', verifyShapleySum([0.15, 0.05, -0.10], 0.95, 0.75), false);
return results;`,hints:["Accumulate attributions[i] into sum.","sum += attributions[i];"],solution:`function verifyShapleySum(attributions, prediction, baseline) {
  let sum = 0;
  for (let i = 0; i < attributions.length; i++) {
    sum += attributions[i];
  }
  const delta = prediction - baseline;
  return Math.abs(sum - delta) < 1e-5;
}`,explanation:"Efficiency (or efficiency axiom) ensures that the total payout (prediction offset) is fully distributed among players (features)."},{id:"fairness-group-rate",stepLabel:"49.1",group:"Group rate",title:"Subgroup Positive Rate",concept:"Fairness audits require measuring metric rates within protected subgroups.",objective:"Compute the positive prediction rate (selection rate) for a target subgroup: count(y_pred=1) / count(group=targetGroup).",difficulty:"warmup",starterCode:`function subgroupSelectionRate(predictions, groups, targetGroup) {
  let groupCount = 0;
  let positiveCount = 0;
  
  for (let i = 0; i < predictions.length; i++) {
    // TODO: if groups[i] is targetGroup, increment groupCount.
    // Additionally, if prediction is 1, increment positiveCount.
  }
  
  if (groupCount === 0) return 0;
  return positiveCount / groupCount;
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
const preds = [1, 0, 1, 1, 0];
const grps  = ['A', 'A', 'B', 'B', 'B'];
check('selection rate group A', subgroupSelectionRate(preds, grps, 'A'), 0.5);
check('selection rate group B', subgroupSelectionRate(preds, grps, 'B'), 2 / 3);
return results;`,hints:["Check if groups[i] === targetGroup.","If true, increment groupCount, and check if predictions[i] === 1 to increment positiveCount."],solution:`function subgroupSelectionRate(predictions, groups, targetGroup) {
  let groupCount = 0;
  let positiveCount = 0;
  
  for (let i = 0; i < predictions.length; i++) {
    if (groups[i] === targetGroup) {
      groupCount++;
      if (predictions[i] === 1) {
        positiveCount++;
      }
    }
  }
  
  if (groupCount === 0) return 0;
  return positiveCount / groupCount;
}`,explanation:"Measuring selection rate within groups is the first step to checking demographic parity."},{id:"fairness-parity-gap",stepLabel:"49.2",group:"Parity gap",title:"Demographic Parity Gap",concept:"Demographic parity states that the likelihood of receiving a positive outcome should be equal across all subgroups.",objective:"Calculate the demographic parity gap: |rate_A - rate_B|.",difficulty:"core",starterCode:`function demographicParityGap(predictions, groups, groupA, groupB) {
  function getRate(target) {
    let count = 0;
    let pos = 0;
    for (let i = 0; i < predictions.length; i++) {
      if (groups[i] === target) {
        count++;
        if (predictions[i] === 1) pos++;
      }
    }
    return count === 0 ? 0 : pos / count;
  }
  
  const rateA = getRate(groupA);
  const rateB = getRate(groupB);
  
  // TODO: return absolute difference between rateA and rateB
  return 0;
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
const preds = [1, 0, 1, 1, 0];
const grps  = ['A', 'A', 'B', 'B', 'B'];
check('parity gap', demographicParityGap(preds, grps, 'A', 'B'), 2/3 - 0.5);
return results;`,hints:["Use Math.abs to compute absolute differences.","return Math.abs(rateA - rateB);"],solution:`function demographicParityGap(predictions, groups, groupA, groupB) {
  function getRate(target) {
    let count = 0;
    let pos = 0;
    for (let i = 0; i < predictions.length; i++) {
      if (groups[i] === target) {
        count++;
        if (predictions[i] === 1) pos++;
      }
    }
    return count === 0 ? 0 : pos / count;
  }
  
  const rateA = getRate(groupA);
  const rateB = getRate(groupB);
  
  return Math.abs(rateA - rateB);
}`,explanation:"A demographic parity gap close to 0 indicates outcome independence from protected attributes."},{id:"uncertainty-entropy",stepLabel:"50.1",group:"Predictive entropy",title:"Shannon Entropy Uncertainty",concept:"Uncertainty can be quantified using Shannon entropy on class probabilities: H(p) = -sum(p_i * log2(p_i)).",objective:"Compute the entropy for a binary probability vector [p, 1-p].",difficulty:"warmup",starterCode:`function binaryEntropy(p) {
  if (p === 0 || p === 1) return 0;
  const q = 1 - p;
  // TODO: compute and return - (p * log2(p) + q * log2(q))
  return 0;
}`,testCode:`const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('maximum entropy', binaryEntropy(0.5), 1.0);
check('low entropy', binaryEntropy(0.1), 0.468996);
return results;`,hints:["Use Math.log2 to compute log base 2.","return -(p * Math.log2(p) + q * Math.log2(q));"],solution:`function binaryEntropy(p) {
  if (p === 0 || p === 1) return 0;
  const q = 1 - p;
  return -(p * Math.log2(p) + q * Math.log2(q));
}`,explanation:"Entropy is highest (1.0 for binary) when model outputs are completely uncertain (0.5 prediction probability)."},{id:"uncertainty-mc-variance",stepLabel:"50.2",group:"Variance across samples",title:"Monte Carlo Dropout Variance",concept:"MC Dropout estimates uncertainty by running multiple forward passes with active dropout and measuring variance.",objective:"Compute sample variance of prediction outputs: sum((x_i - mean)^2) / (N - 1).",difficulty:"core",starterCode:`function mcVariance(preds) {
  const n = preds.length;
  if (n <= 1) return 0;
  
  let sum = 0;
  for (let i = 0; i < n; i++) sum += preds[i];
  const mean = sum / n;
  
  let varSum = 0;
  for (let i = 0; i < n; i++) {
    // TODO: accumulate squared deviation from mean
    varSum += 0;
  }
  
  return varSum / (n - 1);
}`,testCode:`const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('variance sample list', mcVariance([0.8, 0.7, 0.9]), 0.01);
return results;`,hints:["For each prediction x_i, compute (x_i - mean)^2.","varSum += Math.pow(preds[i] - mean, 2);"],solution:`function mcVariance(preds) {
  const n = preds.length;
  if (n <= 1) return 0;
  
  let sum = 0;
  for (let i = 0; i < n; i++) sum += preds[i];
  const mean = sum / n;
  
  let varSum = 0;
  for (let i = 0; i < n; i++) {
    varSum += Math.pow(preds[i] - mean, 2);
  }
  
  return varSum / (n - 1);
}`,explanation:"High variance across dropout passes indicates high model epistemic uncertainty about a sample."},{id:"security-fgsm-step",stepLabel:"51.1",group:"Gradient sign step",title:"FGSM Perturbation Step",concept:"The Fast Gradient Sign Method (FGSM) generates adversarial examples by shifting input coordinates in the direction of the sign of the loss gradient.",objective:"Compute the adversarial image coordinate: x_adv = x + epsilon * sign(grad).",difficulty:"warmup",starterCode:`function fgsmStep(x, grad, epsilon) {
  // TODO: compute adversarial value based on sign of gradient.
  // sign(grad) is 1 if grad > 0, -1 if grad < 0, 0 if grad === 0.
  let sign = 0;
  
  return x + epsilon * sign;
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('positive gradient shift', fgsmStep(0.5, 0.2, 0.05), 0.55);
check('negative gradient shift', fgsmStep(0.5, -4.5, 0.05), 0.45);
check('zero gradient shift', fgsmStep(0.5, 0.0, 0.05), 0.50);
return results;`,hints:["Use Math.sign(grad) to get the sign of the gradient.","If Math.sign is unavailable or you want to write it out: grad > 0 ? 1 : (grad < 0 ? -1 : 0)."],solution:`function fgsmStep(x, grad, epsilon) {
  const sign = grad > 0 ? 1 : (grad < 0 ? -1 : 0);
  return x + epsilon * sign;
}`,explanation:"Perturbing inputs along the loss sign direction maximizes the loss function, inducing misclassification with minimal visual change."},{id:"security-clip-perturb",stepLabel:"51.2",group:"Perturbation clip",title:"Adversarial Perturbation Clipping",concept:"To keep adversarial examples imperceptible, the total perturbation is clipped to lie within an L-infinity boundary: [x - epsilon, x + epsilon].",objective:"Clip the adversarial value x_adv to stay within epsilon range of the original value x.",difficulty:"core",starterCode:`function clipPerturbation(x, xAdv, epsilon) {
  const minVal = x - epsilon;
  const maxVal = x + epsilon;
  
  // TODO: clip xAdv to lie between minVal and maxVal
  return xAdv;
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('under upper bound', clipPerturbation(0.5, 0.53, 0.05), 0.53);
check('exceeds upper bound', clipPerturbation(0.5, 0.60, 0.05), 0.55);
check('exceeds lower bound', clipPerturbation(0.5, 0.40, 0.05), 0.45);
return results;`,hints:["Use Math.max and Math.min.","return Math.max(minVal, Math.min(maxVal, xAdv));"],solution:`function clipPerturbation(x, xAdv, epsilon) {
  const minVal = x - epsilon;
  const maxVal = x + epsilon;
  return Math.max(minVal, Math.min(maxVal, xAdv));
}`,explanation:"Clipping projects inputs back into the allowed L-infinity constraint perturbation region."}],N=[{id:"experiment-is-treated",stepLabel:"69.1",group:"Treatment/control split",title:"Identify treated user",concept:"Experiments compare a treatment group against a control group.",objective:'Return true when assignment equals "treatment".',difficulty:"warmup",starterCode:`function isTreated(assignment) {
  // TODO: return whether this unit is in treatment.
  return false;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('treatment user', isTreated('treatment'), true);
check('control user', isTreated('control'), false);
check('other label', isTreated('holdout'), false);

return results;`,hints:['Treatment is represented by the string "treatment".',"Use strict equality.",'return assignment === "treatment";'],solution:`function isTreated(assignment) {
  return assignment === "treatment";
}`,explanation:"A treatment indicator is the starting point for computing experiment outcomes by group."},{id:"experiment-count-treatment",stepLabel:"69.2",group:"Treatment/control split",title:"Count treatment units",concept:"Before analyzing an experiment, check how many units landed in treatment.",objective:'Count assignments equal to "treatment".',difficulty:"core",starterCode:`function countTreatment(assignments) {
  let count = 0;

  for (let i = 0; i < assignments.length; i++) {
    // TODO: increment count for treatment assignment.
  }

  return count;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('mixed assignments', countTreatment(['treatment', 'control', 'treatment']), 2);
check('all control', countTreatment(['control', 'control']), 0);
check('all treatment', countTreatment(['treatment', 'treatment']), 2);

return results;`,hints:["Check each assignment string.",'If assignments[i] === "treatment", add one.','if (assignments[i] === "treatment") count += 1;'],solution:`function countTreatment(assignments) {
  let count = 0;

  for (let i = 0; i < assignments.length; i++) {
    if (assignments[i] === "treatment") count += 1;
  }

  return count;
}`,explanation:"Group counts help catch broken randomization or unexpected traffic allocation."},{id:"experiment-control-outcomes",stepLabel:"69.3",group:"Treatment/control split",title:"Collect control outcomes",concept:"Control outcomes estimate what would happen without the intervention.",objective:'Push outcomes whose matching assignment is "control".',difficulty:"core",starterCode:`function controlOutcomes(assignments, outcomes) {
  const values = [];

  for (let i = 0; i < assignments.length; i++) {
    // TODO: collect outcomes for control units.
  }

  return values;
}`,testCode:`const results = [];

function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual, expected) });
}

check('mixed outcomes', controlOutcomes(['treatment', 'control', 'control'], [10, 20, 30]), [20, 30]);
check('no control', controlOutcomes(['treatment'], [10]), []);
check('all control', controlOutcomes(['control', 'control'], [1, 2]), [1, 2]);

return results;`,hints:["Use the same index for assignments and outcomes.",'Control units have assignment "control".','if (assignments[i] === "control") values.push(outcomes[i]);'],solution:`function controlOutcomes(assignments, outcomes) {
  const values = [];

  for (let i = 0; i < assignments.length; i++) {
    if (assignments[i] === "control") values.push(outcomes[i]);
  }

  return values;
}`,explanation:"Splitting outcomes by assignment is the first step toward estimating a treatment effect."},{id:"experiment-treatment-rate",stepLabel:"69.4",group:"Treatment/control split",title:"Treatment allocation rate",concept:"The treatment rate is the fraction of units assigned to treatment.",objective:"Return treatment count divided by total count.",difficulty:"core",starterCode:`function treatmentRate(assignments) {
  let treated = 0;

  for (let i = 0; i < assignments.length; i++) {
    if (assignments[i] === "treatment") treated += 1;
  }

  // TODO: return the treatment allocation rate.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('half treated', treatmentRate(['treatment', 'control']), 0.5);
check('two thirds treated', treatmentRate(['treatment', 'control', 'treatment']), 2 / 3);
check('none treated', treatmentRate(['control', 'control']), 0);

return results;`,hints:["treated is already counted.","The denominator is assignments.length.","return treated / assignments.length;"],solution:`function treatmentRate(assignments) {
  let treated = 0;

  for (let i = 0; i < assignments.length; i++) {
    if (assignments[i] === "treatment") treated += 1;
  }

  return treated / assignments.length;
}`,explanation:"A treatment allocation rate far from the planned split can signal assignment problems."},{id:"experiment-mean",stepLabel:"70.1",group:"Difference in means",title:"Mean outcome",concept:"Difference-in-means starts by computing average outcome in each group.",objective:"Return the average of values.",difficulty:"warmup",starterCode:`function mean(values) {
  let total = 0;

  for (let i = 0; i < values.length; i++) {
    total += values[i];
  }

  // TODO: return average value.
  return total;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('mean [1,2,3]', mean([1, 2, 3]), 2);
check('mean [10,20]', mean([10, 20]), 15);
check('mean one value', mean([7]), 7);

return results;`,hints:["Average means total divided by count.","The count is values.length.","return total / values.length;"],solution:`function mean(values) {
  let total = 0;

  for (let i = 0; i < values.length; i++) {
    total += values[i];
  }

  return total / values.length;
}`,explanation:"Group means summarize the outcome level for treatment and control."},{id:"experiment-difference-in-means",stepLabel:"70.2",group:"Difference in means",title:"Difference in means",concept:"The simplest treatment effect estimate is treatment mean minus control mean.",objective:"Return treatmentMean - controlMean.",difficulty:"core",starterCode:`function differenceInMeans(treatmentMean, controlMean) {
  // TODO: return treatment minus control.
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('positive lift', differenceInMeans(12, 10), 2);
check('negative lift', differenceInMeans(8, 10), -2);
check('no lift', differenceInMeans(10, 10), 0);

return results;`,hints:["Treatment effect is treatment outcome minus control outcome.","Keep the sign.","return treatmentMean - controlMean;"],solution:`function differenceInMeans(treatmentMean, controlMean) {
  return treatmentMean - controlMean;
}`,explanation:"A positive difference means the treatment group had a higher average outcome."},{id:"experiment-group-mean",stepLabel:"70.3",group:"Difference in means",title:"Mean for one group",concept:"Experiment analysis computes means conditional on assignment.",objective:"Average outcomes whose assignment matches group.",difficulty:"core",starterCode:`function groupMean(assignments, outcomes, group) {
  let total = 0;
  let count = 0;

  for (let i = 0; i < assignments.length; i++) {
    if (assignments[i] === group) {
      total += outcomes[i];
      count += 1;
    }
  }

  // TODO: return mean for this group.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('control mean', groupMean(['treatment', 'control', 'control'], [10, 20, 30], 'control'), 25);
check('treatment mean', groupMean(['treatment', 'control', 'treatment'], [10, 20, 40], 'treatment'), 25);
check('one unit mean', groupMean(['control'], [7], 'control'), 7);

return results;`,hints:["total and count are already computed.","Mean is total divided by count.","return total / count;"],solution:`function groupMean(assignments, outcomes, group) {
  let total = 0;
  let count = 0;

  for (let i = 0; i < assignments.length; i++) {
    if (assignments[i] === group) {
      total += outcomes[i];
      count += 1;
    }
  }

  return total / count;
}`,explanation:"Conditional means let you compare treatment and control in one shared dataset."},{id:"experiment-ate-from-data",stepLabel:"70.4",group:"Difference in means",title:"ATE from experiment data",concept:"A randomized experiment estimates average treatment effect by subtracting group means.",objective:"Return treatment group mean minus control group mean.",difficulty:"challenge",starterCode:`function groupMean(assignments, outcomes, group) {
  let total = 0;
  let count = 0;
  for (let i = 0; i < assignments.length; i++) {
    if (assignments[i] === group) {
      total += outcomes[i];
      count += 1;
    }
  }
  return total / count;
}

function averageTreatmentEffect(assignments, outcomes) {
  const treatmentMean = groupMean(assignments, outcomes, 'treatment');
  const controlMean = groupMean(assignments, outcomes, 'control');

  // TODO: return difference in means.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('positive effect', averageTreatmentEffect(['treatment', 'control', 'treatment', 'control'], [12, 10, 14, 8]), 4);
check('negative effect', averageTreatmentEffect(['treatment', 'control'], [7, 10]), -3);
check('zero effect', averageTreatmentEffect(['treatment', 'control'], [10, 10]), 0);

return results;`,hints:["Both group means are already computed.","ATE is treatmentMean - controlMean.","return treatmentMean - controlMean;"],solution:`function groupMean(assignments, outcomes, group) {
  let total = 0;
  let count = 0;
  for (let i = 0; i < assignments.length; i++) {
    if (assignments[i] === group) {
      total += outcomes[i];
      count += 1;
    }
  }
  return total / count;
}

function averageTreatmentEffect(assignments, outcomes) {
  const treatmentMean = groupMean(assignments, outcomes, 'treatment');
  const controlMean = groupMean(assignments, outcomes, 'control');
  return treatmentMean - controlMean;
}`,explanation:"Randomization makes difference-in-means a credible estimate of causal effect."},{id:"experiment-sample-variance",stepLabel:"71.1",group:"Standard error and confidence intervals",title:"Sample variance",concept:"Standard errors use sample variance to estimate outcome variability.",objective:"Return sum of squared deviations divided by n - 1.",difficulty:"core",starterCode:`function sampleVariance(values) {
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  let total = 0;

  for (let i = 0; i < values.length; i++) {
    const diff = values[i] - mean;
    // TODO: add squared deviation.
    total += 0;
  }

  return total / (values.length - 1);
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('variance [1,2,3]', sampleVariance([1, 2, 3]), 1);
check('variance [10,20]', sampleVariance([10, 20]), 50);
check('constant values', sampleVariance([5, 5, 5]), 0);

return results;`,hints:["diff is already centered.","Squared deviation is diff * diff.","total += diff * diff;"],solution:`function sampleVariance(values) {
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  let total = 0;

  for (let i = 0; i < values.length; i++) {
    const diff = values[i] - mean;
    total += diff * diff;
  }

  return total / (values.length - 1);
}`,explanation:"Sample variance estimates how noisy outcomes are around their mean."},{id:"experiment-standard-error-mean",stepLabel:"71.2",group:"Standard error and confidence intervals",title:"Standard error of mean",concept:"The standard error of a mean shrinks as sample size grows.",objective:"Return sqrt(variance / n).",difficulty:"core",starterCode:`function standardErrorMean(variance, n) {
  // TODO: return standard error of one mean.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('variance 4 n 4', standardErrorMean(4, 4), 1);
check('variance 9 n 9', standardErrorMean(9, 9), 1);
check('variance 25 n 100', standardErrorMean(25, 100), 0.5);

return results;`,hints:["Variance of a sample mean is variance / n.","Standard error is the square root of that.","return Math.sqrt(variance / n);"],solution:`function standardErrorMean(variance, n) {
  return Math.sqrt(variance / n);
}`,explanation:"More samples reduce uncertainty in the estimated mean."},{id:"experiment-standard-error-diff",stepLabel:"71.3",group:"Standard error and confidence intervals",title:"Standard error of difference",concept:"For independent groups, variances of the two sample means add.",objective:"Return sqrt(treatmentVariance / nTreatment + controlVariance / nControl).",difficulty:"challenge",starterCode:`function standardErrorDifference(treatmentVariance, nTreatment, controlVariance, nControl) {
  // TODO: return standard error for difference in means.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('equal groups', standardErrorDifference(4, 4, 4, 4), Math.sqrt(2));
check('larger samples', standardErrorDifference(9, 9, 16, 16), Math.sqrt(2));
check('zero variance', standardErrorDifference(0, 10, 0, 10), 0);

return results;`,hints:["Add variance / n for both groups.","Then take Math.sqrt.","return Math.sqrt(treatmentVariance / nTreatment + controlVariance / nControl);"],solution:`function standardErrorDifference(treatmentVariance, nTreatment, controlVariance, nControl) {
  return Math.sqrt(treatmentVariance / nTreatment + controlVariance / nControl);
}`,explanation:"The difference-in-means estimate is noisier when either group has high variance or low sample size."},{id:"experiment-confidence-interval",stepLabel:"71.4",group:"Standard error and confidence intervals",title:"Confidence interval bounds",concept:"An approximate confidence interval is estimate plus or minus critical value times standard error.",objective:"Return [estimate - z * se, estimate + z * se].",difficulty:"core",starterCode:`function confidenceInterval(estimate, standardError, z = 1.96) {
  const margin = z * standardError;

  // TODO: return lower and upper bounds.
  return [];
}`,testCode:`const results = [];

function approxArray(a, b, tolerance = 1e-9) {
  return a.length === b.length && a.every((value, index) => Math.abs(value - b[index]) <= tolerance);
}

function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: approxArray(actual, expected) });
}

check('default z', confidenceInterval(10, 1), [8.04, 11.96]);
check('custom z', confidenceInterval(5, 2, 2), [1, 9]);
check('zero se', confidenceInterval(3, 0), [3, 3]);

return results;`,hints:["The margin is already computed.","Lower is estimate - margin, upper is estimate + margin.","return [estimate - margin, estimate + margin];"],solution:`function confidenceInterval(estimate, standardError, z = 1.96) {
  const margin = z * standardError;
  return [estimate - margin, estimate + margin];
}`,explanation:"Confidence intervals communicate uncertainty around an estimated effect."},{id:"ab-z-statistic",stepLabel:"72.1",group:"A/B test z-statistic",title:"Z-statistic",concept:"A z-statistic measures how many standard errors an estimate is away from zero.",objective:"Return estimate / standardError.",difficulty:"warmup",starterCode:`function zStatistic(estimate, standardError) {
  // TODO: return z-statistic.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('two standard errors', zStatistic(4, 2), 2);
check('negative estimate', zStatistic(-3, 1.5), -2);
check('zero estimate', zStatistic(0, 2), 0);

return results;`,hints:["Divide effect estimate by its standard error.","Keep the sign.","return estimate / standardError;"],solution:`function zStatistic(estimate, standardError) {
  return estimate / standardError;
}`,explanation:"Large absolute z-statistics are less compatible with a zero-effect null hypothesis."},{id:"ab-significant-two-sided",stepLabel:"72.2",group:"A/B test z-statistic",title:"Two-sided significance",concept:"A two-sided z-test flags effects far from zero in either direction.",objective:"Return true when abs(z) exceeds critical value.",difficulty:"core",starterCode:`function isSignificant(z, criticalValue = 1.96) {
  // TODO: compare absolute z with critical value.
  return false;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('large positive z', isSignificant(2.1), true);
check('large negative z', isSignificant(-2.1), true);
check('small z', isSignificant(1.5), false);
check('equal critical is not greater', isSignificant(1.96), false);

return results;`,hints:["Use Math.abs(z).","Compare with criticalValue.","return Math.abs(z) > criticalValue;"],solution:`function isSignificant(z, criticalValue = 1.96) {
  return Math.abs(z) > criticalValue;
}`,explanation:"Two-sided tests detect changes in either direction."},{id:"ab-standard-error-proportion",stepLabel:"72.3",group:"A/B test z-statistic",title:"Proportion standard error",concept:"Binary conversion-rate tests use p(1-p)/n variance for each group proportion.",objective:"Return sqrt(p * (1 - p) / n).",difficulty:"core",starterCode:`function proportionStandardError(p, n) {
  // TODO: return standard error for one conversion rate.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('p 0.5 n 100', proportionStandardError(0.5, 100), 0.05);
check('p 0.2 n 100', proportionStandardError(0.2, 100), 0.04);
check('p 0 n 100', proportionStandardError(0, 100), 0);

return results;`,hints:["Proportion variance is p * (1 - p) / n.","Take the square root.","return Math.sqrt((p * (1 - p)) / n);"],solution:`function proportionStandardError(p, n) {
  return Math.sqrt((p * (1 - p)) / n);
}`,explanation:"Conversion-rate uncertainty is largest near 50% and smaller near 0% or 100%."},{id:"ab-conversion-z",stepLabel:"72.4",group:"A/B test z-statistic",title:"Conversion-rate z-statistic",concept:"A/B conversion tests compare rate lift against the standard error of the difference.",objective:"Return (treatmentRate - controlRate) / standard error.",difficulty:"challenge",starterCode:`function conversionZ(treatmentRate, treatmentN, controlRate, controlN) {
  const se = Math.sqrt(
    (treatmentRate * (1 - treatmentRate)) / treatmentN +
    (controlRate * (1 - controlRate)) / controlN
  );

  // TODO: return z-statistic for conversion lift.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('positive lift', conversionZ(0.12, 1000, 0.10, 1000), (0.12 - 0.10) / Math.sqrt((0.12 * 0.88) / 1000 + (0.10 * 0.90) / 1000));
check('negative lift', conversionZ(0.08, 1000, 0.10, 1000), (0.08 - 0.10) / Math.sqrt((0.08 * 0.92) / 1000 + (0.10 * 0.90) / 1000));

return results;`,hints:["The standard error is already computed as se.","The lift is treatmentRate - controlRate.","return (treatmentRate - controlRate) / se;"],solution:`function conversionZ(treatmentRate, treatmentN, controlRate, controlN) {
  const se = Math.sqrt(
    (treatmentRate * (1 - treatmentRate)) / treatmentN +
    (controlRate * (1 - controlRate)) / controlN
  );

  return (treatmentRate - controlRate) / se;
}`,explanation:"A conversion-rate z-statistic standardizes observed lift by its sampling uncertainty."},{id:"power-effect-to-noise",stepLabel:"73.1",group:"Power and MDE intuition",title:"Effect-to-noise ratio",concept:"Power improves when the effect is large relative to standard error.",objective:"Return effect / standardError.",difficulty:"warmup",starterCode:`function effectToNoise(effect, standardError) {
  // TODO: return effect size in standard-error units.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('two se effect', effectToNoise(4, 2), 2);
check('half se effect', effectToNoise(1, 2), 0.5);
check('negative effect', effectToNoise(-3, 1.5), -2);

return results;`,hints:["This is the same scaling idea as a z-statistic.","Divide effect by standard error.","return effect / standardError;"],solution:`function effectToNoise(effect, standardError) {
  return effect / standardError;
}`,explanation:"Small noisy effects are hard to detect reliably."},{id:"power-min-detectable-effect",stepLabel:"73.2",group:"Power and MDE intuition",title:"Minimum detectable effect",concept:"A rough MDE multiplies standard error by the critical threshold needed for detection.",objective:"Return multiplier * standardError.",difficulty:"core",starterCode:`function minimumDetectableEffect(standardError, multiplier) {
  // TODO: return rough MDE.
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('mde 2 se', minimumDetectableEffect(5, 2), 10);
check('mde 2.8 se', minimumDetectableEffect(10, 2.8), 28);
check('zero se', minimumDetectableEffect(0, 2), 0);

return results;`,hints:["MDE is measured in outcome units.","Multiply standardError by multiplier.","return multiplier * standardError;"],solution:`function minimumDetectableEffect(standardError, multiplier) {
  return multiplier * standardError;
}`,explanation:"A smaller standard error lowers the effect size an experiment can reliably detect."},{id:"power-sample-size-scale",stepLabel:"73.3",group:"Power and MDE intuition",title:"Standard error from sample size",concept:"For a fixed variance, standard error decreases with the square root of sample size.",objective:"Return standardDeviation / sqrt(n).",difficulty:"core",starterCode:`function standardErrorFromN(standardDeviation, n) {
  // TODO: return standard error from sample size.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('sd 10 n 100', standardErrorFromN(10, 100), 1);
check('sd 6 n 9', standardErrorFromN(6, 9), 2);
check('sd 5 n 25', standardErrorFromN(5, 25), 1);

return results;`,hints:["Use Math.sqrt(n).","Divide standard deviation by square root sample size.","return standardDeviation / Math.sqrt(n);"],solution:`function standardErrorFromN(standardDeviation, n) {
  return standardDeviation / Math.sqrt(n);
}`,explanation:"Quadrupling sample size roughly halves standard error."},{id:"power-required-sample-size",stepLabel:"73.4",group:"Power and MDE intuition",title:"Required sample size intuition",concept:"Required sample size grows with variance and shrinks with squared detectable effect.",objective:"Return (multiplier * sd / mde)^2.",difficulty:"challenge",starterCode:`function requiredSampleSize(standardDeviation, mde, multiplier) {
  // TODO: return rough sample size per group.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('basic size', requiredSampleSize(10, 2, 2), 100);
check('larger effect needs fewer samples', requiredSampleSize(10, 4, 2), 25);
check('larger sd needs more samples', requiredSampleSize(20, 2, 2), 400);

return results;`,hints:["Compute multiplier * standardDeviation / mde.","Then square it.","return Math.pow((multiplier * standardDeviation) / mde, 2);"],solution:`function requiredSampleSize(standardDeviation, mde, multiplier) {
  return Math.pow((multiplier * standardDeviation) / mde, 2);
}`,explanation:"Detecting smaller effects requires much more data because sample size scales with one over MDE squared."},{id:"cuped-residual",stepLabel:"74.1",group:"CUPED adjustment",title:"CUPED residual",concept:"CUPED removes predictable variation using a pre-experiment covariate.",objective:"Return outcome - theta * covariate.",difficulty:"warmup",starterCode:`function cupedResidual(outcome, covariate, theta) {
  // TODO: subtract theta times covariate.
  return outcome;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('simple residual', cupedResidual(10, 3, 2), 4);
check('zero theta', cupedResidual(10, 3, 0), 10);
check('negative covariate', cupedResidual(10, -2, 3), 16);

return results;`,hints:["Adjustment is theta * covariate.","Subtract the adjustment from outcome.","return outcome - theta * covariate;"],solution:`function cupedResidual(outcome, covariate, theta) {
  return outcome - theta * covariate;
}`,explanation:"CUPED lowers variance by accounting for pre-existing outcome predictors."},{id:"cuped-theta",stepLabel:"74.2",group:"CUPED adjustment",title:"CUPED theta",concept:"The CUPED coefficient is covariance(outcome, covariate) divided by variance(covariate).",objective:"Return covariance / variance.",difficulty:"core",starterCode:`function cupedTheta(covariance, covariateVariance) {
  // TODO: return CUPED coefficient.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('theta 2', cupedTheta(10, 5), 2);
check('theta half', cupedTheta(3, 6), 0.5);
check('zero covariance', cupedTheta(0, 5), 0);

return results;`,hints:["Theta is a regression-style slope.","Divide covariance by covariate variance.","return covariance / covariateVariance;"],solution:`function cupedTheta(covariance, covariateVariance) {
  return covariance / covariateVariance;
}`,explanation:"A stronger covariate-outcome relationship gives CUPED more variance reduction potential."},{id:"cuped-adjust-vector",stepLabel:"74.3",group:"CUPED adjustment",title:"Adjust outcome vector",concept:"CUPED applies the same residualization formula to every unit.",objective:"Push outcomes[i] - theta * covariates[i].",difficulty:"core",starterCode:`function cupedAdjust(outcomes, covariates, theta) {
  const adjusted = [];

  for (let i = 0; i < outcomes.length; i++) {
    // TODO: push CUPED-adjusted outcome.
    adjusted.push(outcomes[i]);
  }

  return adjusted;
}`,testCode:`const results = [];

function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual, expected) });
}

check('adjust two values', cupedAdjust([10, 20], [3, 4], 2), [4, 12]);
check('zero theta', cupedAdjust([10, 20], [3, 4], 0), [10, 20]);
check('negative covariate', cupedAdjust([10], [-2], 3), [16]);

return results;`,hints:["Use matching outcome and covariate coordinates.","Subtract theta * covariates[i].","adjusted.push(outcomes[i] - theta * covariates[i]);"],solution:`function cupedAdjust(outcomes, covariates, theta) {
  const adjusted = [];

  for (let i = 0; i < outcomes.length; i++) {
    adjusted.push(outcomes[i] - theta * covariates[i]);
  }

  return adjusted;
}`,explanation:"After adjustment, the experiment can compare adjusted outcomes instead of raw outcomes."},{id:"cuped-centered-adjustment",stepLabel:"74.4",group:"CUPED adjustment",title:"Centered CUPED adjustment",concept:"CUPED usually centers the covariate so the adjusted outcome remains on the original scale.",objective:"Return outcome - theta * (covariate - covariateMean).",difficulty:"challenge",starterCode:`function centeredCupedOutcome(outcome, covariate, covariateMean, theta) {
  // TODO: apply centered CUPED adjustment.
  return outcome;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('above mean covariate', centeredCupedOutcome(10, 5, 3, 2), 6);
check('at mean covariate', centeredCupedOutcome(10, 3, 3, 2), 10);
check('below mean covariate', centeredCupedOutcome(10, 1, 3, 2), 14);

return results;`,hints:["First center the covariate: covariate - covariateMean.","Then subtract theta times the centered covariate.","return outcome - theta * (covariate - covariateMean);"],solution:`function centeredCupedOutcome(outcome, covariate, covariateMean, theta) {
  return outcome - theta * (covariate - covariateMean);
}`,explanation:"Centering preserves the average scale while reducing variance from predictable pre-period differences."},{id:"propensity-inverse-weight",stepLabel:"75.1",group:"Propensity score weighting",title:"Inverse propensity weight",concept:"Propensity weighting upweights units that were unlikely to receive their observed assignment.",objective:"Return 1 / propensity.",difficulty:"warmup",starterCode:`function inversePropensityWeight(propensity) {
  // TODO: return inverse propensity weight.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('propensity half', inversePropensityWeight(0.5), 2);
check('propensity quarter', inversePropensityWeight(0.25), 4);
check('propensity one', inversePropensityWeight(1), 1);

return results;`,hints:["Inverse means reciprocal.","Use 1 / propensity.","return 1 / propensity;"],solution:`function inversePropensityWeight(propensity) {
  return 1 / propensity;
}`,explanation:"Inverse propensity weights compensate for unequal assignment probabilities."},{id:"propensity-observed-weight",stepLabel:"75.2",group:"Propensity score weighting",title:"Observed assignment weight",concept:"Treated units use 1 / p, control units use 1 / (1 - p).",objective:"Return the inverse probability of the observed assignment.",difficulty:"core",starterCode:`function observedAssignmentWeight(treated, propensity) {
  // TODO: return treated or control inverse probability weight.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('treated p half', observedAssignmentWeight(true, 0.5), 2);
check('control p half', observedAssignmentWeight(false, 0.5), 2);
check('control p 0.2', observedAssignmentWeight(false, 0.2), 1.25);

return results;`,hints:["If treated, use 1 / propensity.","If control, use 1 / (1 - propensity).","return treated ? 1 / propensity : 1 / (1 - propensity);"],solution:`function observedAssignmentWeight(treated, propensity) {
  return treated ? 1 / propensity : 1 / (1 - propensity);
}`,explanation:"Observed-assignment weights make underrepresented assignment paths count more."},{id:"propensity-weighted-outcome",stepLabel:"75.3",group:"Propensity score weighting",title:"Weighted outcome",concept:"Weighted estimators multiply each outcome by its inverse-propensity weight.",objective:"Return outcome * weight.",difficulty:"warmup",starterCode:`function weightedOutcome(outcome, weight) {
  // TODO: return weighted outcome.
  return outcome;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('double outcome', weightedOutcome(10, 2), 20);
check('zero outcome', weightedOutcome(0, 5), 0);
check('fractional weight', weightedOutcome(10, 0.5), 5);

return results;`,hints:["Weighted outcome is a product.","Multiply outcome by weight.","return outcome * weight;"],solution:`function weightedOutcome(outcome, weight) {
  return outcome * weight;
}`,explanation:"Weighting changes how much each observed unit contributes to the estimator."},{id:"propensity-weighted-mean",stepLabel:"75.4",group:"Propensity score weighting",title:"Weighted mean",concept:"A weighted mean divides weighted outcome sum by total weight.",objective:"Return sum(outcome * weight) / sum(weight).",difficulty:"challenge",starterCode:`function weightedMean(outcomes, weights) {
  let weightedTotal = 0;
  let weightTotal = 0;

  for (let i = 0; i < outcomes.length; i++) {
    weightedTotal += outcomes[i] * weights[i];
    weightTotal += weights[i];
  }

  // TODO: return weighted mean.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('equal weights', weightedMean([10, 20], [1, 1]), 15);
check('heavier first', weightedMean([10, 20], [3, 1]), 12.5);
check('one value', weightedMean([7], [10]), 7);

return results;`,hints:["Both totals are already computed.","Weighted mean is weightedTotal / weightTotal.","return weightedTotal / weightTotal;"],solution:`function weightedMean(outcomes, weights) {
  let weightedTotal = 0;
  let weightTotal = 0;

  for (let i = 0; i < outcomes.length; i++) {
    weightedTotal += outcomes[i] * weights[i];
    weightTotal += weights[i];
  }

  return weightedTotal / weightTotal;
}`,explanation:"Propensity weighting estimates group means after correcting for assignment imbalance."},{id:"dag-has-edge",stepLabel:"76.1",group:"DAG adjustment-set checks",title:"Check DAG edge",concept:"A DAG encodes causal assumptions as directed edges.",objective:"Return true when an edge exists from fromNode to toNode.",difficulty:"warmup",starterCode:`function hasEdge(edges, fromNode, toNode) {
  // TODO: return whether edges contains [fromNode, toNode].
  return false;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

const edges = [['X', 'Y'], ['Z', 'X']];

check('edge exists', hasEdge(edges, 'X', 'Y'), true);
check('reverse edge missing', hasEdge(edges, 'Y', 'X'), false);
check('different edge missing', hasEdge(edges, 'Z', 'Y'), false);

return results;`,hints:["Loop through edge pairs.","Check edge[0] and edge[1].","if (edges[i][0] === fromNode && edges[i][1] === toNode) return true;"],solution:`function hasEdge(edges, fromNode, toNode) {
  for (let i = 0; i < edges.length; i++) {
    if (edges[i][0] === fromNode && edges[i][1] === toNode) return true;
  }

  return false;
}`,explanation:"DAG logic starts with knowing which direct causal arrows are present."},{id:"dag-is-parent",stepLabel:"76.2",group:"DAG adjustment-set checks",title:"Parent node check",concept:"A parent of a node has a directed edge into that node.",objective:"Return true when candidate -> node exists.",difficulty:"core",starterCode:`function isParent(edges, candidate, node) {
  for (let i = 0; i < edges.length; i++) {
    const edge = edges[i];

    // TODO: return true if candidate points into node.
  }

  return false;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

const edges = [['Z', 'X'], ['X', 'Y'], ['W', 'Y']];

check('Z parent of X', isParent(edges, 'Z', 'X'), true);
check('W parent of Y', isParent(edges, 'W', 'Y'), true);
check('Y not parent of X', isParent(edges, 'Y', 'X'), false);

return results;`,hints:["A parent edge is candidate -> node.","Check edge[0] and edge[1].","if (edge[0] === candidate && edge[1] === node) return true;"],solution:`function isParent(edges, candidate, node) {
  for (let i = 0; i < edges.length; i++) {
    const edge = edges[i];

    if (edge[0] === candidate && edge[1] === node) return true;
  }

  return false;
}`,explanation:"Parents are direct causes in the graph, according to the DAG assumptions."},{id:"dag-backdoor-candidate",stepLabel:"76.3",group:"DAG adjustment-set checks",title:"Backdoor candidate",concept:"A common confounder is a variable that points into both treatment and outcome.",objective:"Return true when z is parent of both treatment and outcome.",difficulty:"challenge",starterCode:`function isParent(edges, candidate, node) {
  return edges.some((edge) => edge[0] === candidate && edge[1] === node);
}

function isCommonCause(edges, z, treatment, outcome) {
  // TODO: return whether z points into treatment and outcome.
  return false;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

const edges = [['Z', 'X'], ['Z', 'Y'], ['X', 'Y'], ['W', 'X']];

check('Z common cause', isCommonCause(edges, 'Z', 'X', 'Y'), true);
check('W not common cause', isCommonCause(edges, 'W', 'X', 'Y'), false);
check('X not common cause of itself and Y', isCommonCause(edges, 'X', 'X', 'Y'), false);

return results;`,hints:["Use the isParent helper twice.","z must point into both treatment and outcome.","return isParent(edges, z, treatment) && isParent(edges, z, outcome);"],solution:`function isParent(edges, candidate, node) {
  return edges.some((edge) => edge[0] === candidate && edge[1] === node);
}

function isCommonCause(edges, z, treatment, outcome) {
  return isParent(edges, z, treatment) && isParent(edges, z, outcome);
}`,explanation:"Common causes are typical variables to consider adjusting for in backdoor paths."},{id:"dag-adjustment-set-covers-confounders",stepLabel:"76.4",group:"DAG adjustment-set checks",title:"Adjustment set covers confounders",concept:"A basic adjustment check asks whether all known confounders are included.",objective:"Return true when every confounder is in adjustmentSet.",difficulty:"core",starterCode:`function coversConfounders(adjustmentSet, confounders) {
  for (let i = 0; i < confounders.length; i++) {
    // TODO: return false if a confounder is missing.
  }

  return true;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('covers all', coversConfounders(['Z', 'W'], ['Z', 'W']), true);
check('missing one', coversConfounders(['Z'], ['Z', 'W']), false);
check('no confounders', coversConfounders([], []), true);

return results;`,hints:["Use adjustmentSet.includes(confounders[i]).","If one is missing, return false.","if (!adjustmentSet.includes(confounders[i])) return false;"],solution:`function coversConfounders(adjustmentSet, confounders) {
  for (let i = 0; i < confounders.length; i++) {
    if (!adjustmentSet.includes(confounders[i])) return false;
  }

  return true;
}`,explanation:"This toy check is not full d-separation, but it reinforces the adjustment-set idea."}],R=[{id:"word2vec-dot-similarity",stepLabel:"1.1",group:"Similarity score",title:"Vector Similarity Score",concept:"Skip-gram negative sampling compares center and context embeddings with a dot product. That score drives both the positive likelihood and every negative sample term.",objective:"Inside skipGramTrainStep, compute the positive dot product posScore between vCenter and vContext.",difficulty:"warmup",starterCode:`/**
 * Runs one Skip-gram negative-sampling training step: loss, gradients, in-place vector updates.
 * @param {number[]} vCenter - Center word embedding (mutated in place on later steps).
 * @param {number[]} vContext - True context embedding (mutated in place on later steps).
 * @param {number[][]} vNegatives - Negative noise embeddings (mutated in place on later steps).
 * @param {number} lr - Learning rate applied to gradient updates.
 * @returns {{ loss: number, posScore: number }} Total loss and positive dot product.
 */
function skipGramTrainStep(vCenter, vContext, vNegatives, lr) {
  const d = vCenter.length;
  let posScore = 0;
  for (let i = 0; i < d; i++) {
    // TODO: accumulate vCenter[i] * vContext[i] into posScore.
    posScore += 0;
  }

  const sigmoid = (x) => 1 / (1 + Math.exp(-x));
  let loss = -Math.log(sigmoid(posScore));

  for (let j = 0; j < vNegatives.length; j++) {
    let negScore = 0;
    for (let i = 0; i < d; i++) {
      negScore += vCenter[i] * vNegatives[j][i];
    }
    loss -= Math.log(sigmoid(-negScore));
  }

  return { loss, posScore };
}`,testCode:`const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('orthogonal vectors', skipGramTrainStep([1, 0], [0, 1], [[0, 1]], 0.1).posScore, 0);
check('aligned vectors', skipGramTrainStep([2, 3], [4, 5], [], 0.1).posScore, 23);
check('negative dot', skipGramTrainStep([1, -1], [2, 3], [], 0.1).posScore, -1);
return results;`,hints:["Multiply matching indices and accumulate into posScore.","Use posScore += vCenter[i] * vContext[i].","The dot product is the sum of element-wise products."],solution:`/**
 * Runs one Skip-gram negative-sampling training step: loss, gradients, in-place vector updates.
 * @param {number[]} vCenter - Center word embedding (mutated in place on later steps).
 * @param {number[]} vContext - True context embedding (mutated in place on later steps).
 * @param {number[][]} vNegatives - Negative noise embeddings (mutated in place on later steps).
 * @param {number} lr - Learning rate applied to gradient updates.
 * @returns {{ loss: number, posScore: number }} Total loss and positive dot product.
 */
function skipGramTrainStep(vCenter, vContext, vNegatives, lr) {
  const d = vCenter.length;
  let posScore = 0;
  for (let i = 0; i < d; i++) {
    posScore += vCenter[i] * vContext[i];
  }

  const sigmoid = (x) => 1 / (1 + Math.exp(-x));
  let loss = -Math.log(sigmoid(posScore));

  for (let j = 0; j < vNegatives.length; j++) {
    let negScore = 0;
    for (let i = 0; i < d; i++) {
      negScore += vCenter[i] * vNegatives[j][i];
    }
    loss -= Math.log(sigmoid(-negScore));
  }

  return { loss, posScore };
}`,explanation:"The positive dot product measures how aligned the center and context embeddings already are before the gradient update."},{id:"word2vec-sigmoid-prob",stepLabel:"1.2",group:"Sigmoid activation",title:"Word2Vec Sigmoid Probabilities",concept:"Word2Vec maps dot products to probabilities with sigmoid. The positive pair uses sigmoid(posScore); negatives use sigmoid(-negScore).",objective:"Inside skipGramTrainStep, compute the positive loss term -log(sigmoid(posScore)).",difficulty:"warmup",starterCode:`/**
 * Runs one Skip-gram negative-sampling training step: loss, gradients, in-place vector updates.
 * @param {number[]} vCenter - Center word embedding (mutated in place on later steps).
 * @param {number[]} vContext - True context embedding (mutated in place on later steps).
 * @param {number[][]} vNegatives - Negative noise embeddings (mutated in place on later steps).
 * @param {number} lr - Learning rate applied to gradient updates.
 * @returns {{ loss: number, posScore: number }} Total loss and positive dot product.
 */
function skipGramTrainStep(vCenter, vContext, vNegatives, lr) {
  const d = vCenter.length;
  let posScore = 0;
  for (let i = 0; i < d; i++) {
    posScore += vCenter[i] * vContext[i];
  }

  const sigmoid = (x) => 1 / (1 + Math.exp(-x));
  let loss = 0;
  // TODO: set loss to the positive pair term -Math.log(sigmoid(posScore)).

  for (let j = 0; j < vNegatives.length; j++) {
    let negScore = 0;
    for (let i = 0; i < d; i++) {
      negScore += vCenter[i] * vNegatives[j][i];
    }
    loss -= Math.log(sigmoid(-negScore));
  }

  return { loss, posScore };
}`,testCode:`const results = [];
function approxEqual(a, b, tol = 1e-4) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('zero score positive loss', skipGramTrainStep([0, 0], [0, 0], [], 0.1).loss, 0.693147);
check('aligned positive loss', skipGramTrainStep([1, 0], [1, 0], [], 0.1).loss, 0.313262);
check('opposite positive loss', skipGramTrainStep([1, 0], [-1, 0], [], 0.1).loss, 1.313262);
return results;`,hints:["Apply sigmoid to posScore before taking the log.","The positive term is -Math.log(sigmoid(posScore)).","Negative terms are handled in the loop below."],solution:`/**
 * Runs one Skip-gram negative-sampling training step: loss, gradients, in-place vector updates.
 * @param {number[]} vCenter - Center word embedding (mutated in place on later steps).
 * @param {number[]} vContext - True context embedding (mutated in place on later steps).
 * @param {number[][]} vNegatives - Negative noise embeddings (mutated in place on later steps).
 * @param {number} lr - Learning rate applied to gradient updates.
 * @returns {{ loss: number, posScore: number }} Total loss and positive dot product.
 */
function skipGramTrainStep(vCenter, vContext, vNegatives, lr) {
  const d = vCenter.length;
  let posScore = 0;
  for (let i = 0; i < d; i++) {
    posScore += vCenter[i] * vContext[i];
  }

  const sigmoid = (x) => 1 / (1 + Math.exp(-x));
  let loss = -Math.log(sigmoid(posScore));

  for (let j = 0; j < vNegatives.length; j++) {
    let negScore = 0;
    for (let i = 0; i < d; i++) {
      negScore += vCenter[i] * vNegatives[j][i];
    }
    loss -= Math.log(sigmoid(-negScore));
  }

  return { loss, posScore };
}`,explanation:"Sigmoid turns similarity scores into probabilities so gradient descent can push positive pairs together."},{id:"word2vec-loss",stepLabel:"1.3",group:"Positive pair likelihood",title:"Word2Vec Negative Sampling Loss",concept:"The full negative-sampling objective adds the positive log-likelihood term to every negative noise sample: -log(sigmoid(-negScore)).",objective:"Inside skipGramTrainStep, subtract each negative sample log-likelihood from loss inside the negative loop.",difficulty:"core",starterCode:`/**
 * Runs one Skip-gram negative-sampling training step: loss, gradients, in-place vector updates.
 * @param {number[]} vCenter - Center word embedding (mutated in place on later steps).
 * @param {number[]} vContext - True context embedding (mutated in place on later steps).
 * @param {number[][]} vNegatives - Negative noise embeddings (mutated in place on later steps).
 * @param {number} lr - Learning rate applied to gradient updates.
 * @returns {{ loss: number, posScore: number }} Total loss and positive dot product.
 */
function skipGramTrainStep(vCenter, vContext, vNegatives, lr) {
  const d = vCenter.length;
  let posScore = 0;
  for (let i = 0; i < d; i++) {
    posScore += vCenter[i] * vContext[i];
  }

  const sigmoid = (x) => 1 / (1 + Math.exp(-x));
  let loss = -Math.log(sigmoid(posScore));

  for (let j = 0; j < vNegatives.length; j++) {
    let negScore = 0;
    for (let i = 0; i < d; i++) {
      negScore += vCenter[i] * vNegatives[j][i];
    }
    // TODO: subtract Math.log(sigmoid(-negScore)) from loss for this negative sample.
  }

  return { loss, posScore };
}`,testCode:`const results = [];
function approxEqual(a, b, tol = 1e-4) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('single negative', skipGramTrainStep([1, 0], [0, 1], [[0, 1]], 0.1).loss, 1.386294);
check('aligned with negatives', skipGramTrainStep([1, 0], [1, 0], [[0, 1], [0, -1]], 0.1).loss, 1.699566);
check('multiple negatives', skipGramTrainStep([0.5, 0.5], [0.5, 0.5], [[-0.5, -0.5], [0, 1]], 0.1).loss, 1.922231);
return results;`,hints:["Each negative contributes -log(sigmoid(-negScore)).","Subtract that term from loss inside the loop.","Keep the positive term computed before the loop."],solution:`/**
 * Runs one Skip-gram negative-sampling training step: loss, gradients, in-place vector updates.
 * @param {number[]} vCenter - Center word embedding (mutated in place on later steps).
 * @param {number[]} vContext - True context embedding (mutated in place on later steps).
 * @param {number[][]} vNegatives - Negative noise embeddings (mutated in place on later steps).
 * @param {number} lr - Learning rate applied to gradient updates.
 * @returns {{ loss: number, posScore: number }} Total loss and positive dot product.
 */
function skipGramTrainStep(vCenter, vContext, vNegatives, lr) {
  const d = vCenter.length;
  let posScore = 0;
  for (let i = 0; i < d; i++) {
    posScore += vCenter[i] * vContext[i];
  }

  const sigmoid = (x) => 1 / (1 + Math.exp(-x));
  let loss = -Math.log(sigmoid(posScore));

  for (let j = 0; j < vNegatives.length; j++) {
    let negScore = 0;
    for (let i = 0; i < d; i++) {
      negScore += vCenter[i] * vNegatives[j][i];
    }
    loss -= Math.log(sigmoid(-negScore));
  }

  return { loss, posScore };
}`,explanation:"Negative samples push unrelated words apart while the positive term pulls the true context closer."},{id:"word2vec-gradients",stepLabel:"1.4",group:"Negative sample loss",title:"Word2Vec Context Gradient",concept:"The gradient for the context vector is (sigmoid(posScore) - 1) * vCenter. Applying it with learning rate lr updates vContext in place.",objective:"Inside skipGramTrainStep, compute gradContext and apply the lr update to vContext after loss is computed.",difficulty:"core",starterCode:`/**
 * Runs one Skip-gram negative-sampling training step: loss, gradients, in-place vector updates.
 * @param {number[]} vCenter - Center word embedding (mutated in place on later steps).
 * @param {number[]} vContext - True context embedding (mutated in place on later steps).
 * @param {number[][]} vNegatives - Negative noise embeddings (mutated in place on later steps).
 * @param {number} lr - Learning rate applied to gradient updates.
 * @returns {{ loss: number, posScore: number }} Total loss and positive dot product.
 */
function skipGramTrainStep(vCenter, vContext, vNegatives, lr) {
  const d = vCenter.length;
  let posScore = 0;
  for (let i = 0; i < d; i++) {
    posScore += vCenter[i] * vContext[i];
  }

  const sigmoid = (x) => 1 / (1 + Math.exp(-x));
  let loss = -Math.log(sigmoid(posScore));

  for (let j = 0; j < vNegatives.length; j++) {
    let negScore = 0;
    for (let i = 0; i < d; i++) {
      negScore += vCenter[i] * vNegatives[j][i];
    }
    loss -= Math.log(sigmoid(-negScore));
  }

  const posProb = sigmoid(posScore);
  for (let i = 0; i < d; i++) {
    // TODO: update vContext[i] -= lr * (posProb - 1) * vCenter[i].
  }

  return { loss, posScore };
}`,testCode:`const results = [];
function approxEqual(a, b, tol = 1e-4) { return Math.abs(a - b) <= tol; }
function approxArray(a, b) { return a.length === b.length && a.every((v, i) => approxEqual(v, b[i])); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: approxArray(actual, expected) });
}
const ctx = [0.5, -0.5];
skipGramTrainStep([1, 0], ctx, [[0, 1]], 0.1);
check('context gradient update', ctx, [0.537754, -0.5]);
return results;`,hints:["The context gradient scale is (sigmoid(posScore) - 1).","Multiply that scale by vCenter[i] for each dimension.","Subtract lr times the gradient from vContext[i]."],solution:`/**
 * Runs one Skip-gram negative-sampling training step: loss, gradients, in-place vector updates.
 * @param {number[]} vCenter - Center word embedding (mutated in place on later steps).
 * @param {number[]} vContext - True context embedding (mutated in place on later steps).
 * @param {number[][]} vNegatives - Negative noise embeddings (mutated in place on later steps).
 * @param {number} lr - Learning rate applied to gradient updates.
 * @returns {{ loss: number, posScore: number }} Total loss and positive dot product.
 */
function skipGramTrainStep(vCenter, vContext, vNegatives, lr) {
  const d = vCenter.length;
  let posScore = 0;
  for (let i = 0; i < d; i++) {
    posScore += vCenter[i] * vContext[i];
  }

  const sigmoid = (x) => 1 / (1 + Math.exp(-x));
  let loss = -Math.log(sigmoid(posScore));

  for (let j = 0; j < vNegatives.length; j++) {
    let negScore = 0;
    for (let i = 0; i < d; i++) {
      negScore += vCenter[i] * vNegatives[j][i];
    }
    loss -= Math.log(sigmoid(-negScore));
  }

  const posProb = sigmoid(posScore);
  for (let i = 0; i < d; i++) {
    vContext[i] -= lr * (posProb - 1) * vCenter[i];
  }

  return { loss, posScore };
}`,explanation:"Updating vContext first shows how the positive pair gradient nudges the context embedding toward the center word."},{id:"word2vec-update-step",stepLabel:"1.5",group:"Skip-gram gradient update",title:"Full Skip-Gram Training Step",concept:"A complete Skip-gram step also updates vCenter and every negative vector using their respective gradients from the negative-sampling objective.",objective:"Inside skipGramTrainStep, finish the center and negative gradient updates after the context update.",difficulty:"challenge",starterCode:`/**
 * Runs one Skip-gram negative-sampling training step: loss, gradients, in-place vector updates.
 * @param {number[]} vCenter - Center word embedding (mutated in place on later steps).
 * @param {number[]} vContext - True context embedding (mutated in place on later steps).
 * @param {number[][]} vNegatives - Negative noise embeddings (mutated in place on later steps).
 * @param {number} lr - Learning rate applied to gradient updates.
 * @returns {{ loss: number, posScore: number }} Total loss and positive dot product.
 */
function skipGramTrainStep(vCenter, vContext, vNegatives, lr) {
  const d = vCenter.length;
  let posScore = 0;
  for (let i = 0; i < d; i++) {
    posScore += vCenter[i] * vContext[i];
  }

  const sigmoid = (x) => 1 / (1 + Math.exp(-x));
  let loss = -Math.log(sigmoid(posScore));

  const negScores = [];
  for (let j = 0; j < vNegatives.length; j++) {
    let negScore = 0;
    for (let i = 0; i < d; i++) {
      negScore += vCenter[i] * vNegatives[j][i];
    }
    negScores.push(negScore);
    loss -= Math.log(sigmoid(-negScore));
  }

  const posProb = sigmoid(posScore);
  for (let i = 0; i < d; i++) {
    vContext[i] -= lr * (posProb - 1) * vCenter[i];
  }

  // TODO: update vCenter using the positive context gradient plus every negative contribution.

  return { loss, posScore };
}`,testCode:`const results = [];
function approxEqual(a, b, tol = 1e-3) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const center = [1, 0];
const context = [0, 1];
const neg = [[0, 1]];
const out = skipGramTrainStep(center, context, neg, 0.05);
check('full step loss', out.loss, 1.386294);
check('center moved toward context', center[0] > 1, true);
check('negative adjusted', neg[0][0] < 0, true);
return results;`,hints:["Center gradient starts with (posProb - 1) * vContext.","Add sigmoid(negScore) * vNegatives[j] for each negative sample.","Subtract lr times the accumulated gradient from each vCenter[i]. Also update each negative vector with lr * sigmoid(negScore) * vCenter."],solution:`/**
 * Runs one Skip-gram negative-sampling training step: loss, gradients, in-place vector updates.
 * @param {number[]} vCenter - Center word embedding (mutated in place on later steps).
 * @param {number[]} vContext - True context embedding (mutated in place on later steps).
 * @param {number[][]} vNegatives - Negative noise embeddings (mutated in place on later steps).
 * @param {number} lr - Learning rate applied to gradient updates.
 * @returns {{ loss: number, posScore: number }} Total loss and positive dot product.
 */
function skipGramTrainStep(vCenter, vContext, vNegatives, lr) {
  const d = vCenter.length;
  let posScore = 0;
  for (let i = 0; i < d; i++) {
    posScore += vCenter[i] * vContext[i];
  }

  const sigmoid = (x) => 1 / (1 + Math.exp(-x));
  let loss = -Math.log(sigmoid(posScore));

  const negScores = [];
  for (let j = 0; j < vNegatives.length; j++) {
    let negScore = 0;
    for (let i = 0; i < d; i++) {
      negScore += vCenter[i] * vNegatives[j][i];
    }
    negScores.push(negScore);
    loss -= Math.log(sigmoid(-negScore));
  }

  const posProb = sigmoid(posScore);
  for (let i = 0; i < d; i++) {
    vContext[i] -= lr * (posProb - 1) * vCenter[i];
  }

  const gradCenter = Array(d).fill(0);
  for (let i = 0; i < d; i++) {
    gradCenter[i] = (posProb - 1) * vContext[i];
  }
  for (let j = 0; j < vNegatives.length; j++) {
    const negProb = sigmoid(negScores[j]);
    for (let i = 0; i < d; i++) {
      gradCenter[i] += negProb * vNegatives[j][i];
      vNegatives[j][i] -= lr * negProb * vCenter[i];
    }
  }
  for (let i = 0; i < d; i++) {
    vCenter[i] -= lr * gradCenter[i];
  }

  return { loss, posScore };
}`,explanation:"Completing center and negative updates finishes one stochastic Skip-gram negative-sampling training step."},{id:"glove-weight",stepLabel:"2.1",group:"Co-occurrence weight",title:"GloVe weight function",concept:"GloVe uses a weighting function f(x) = (x/xMax)^alpha if x < xMax, else 1, to prevent rare or frequent co-occurrences from dominating.",objective:"Implement the GloVe co-occurrence weighting function.",difficulty:"warmup",starterCode:`function gloveWeight(x, xMax = 100, alpha = 0.75) {
  if (x === 0) return 0;
  // TODO: return the correct weight based on xMax and alpha bounds
  return 0;
}`,testCode:`const results = [];
function approxEqual(a, b, tolerance = 1e-5) {
  return Math.abs(a - b) <= tolerance;
}
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('x is 0', gloveWeight(0), 0);
check('x above xMax', gloveWeight(120, 100, 0.75), 1.0);
check('x below xMax', gloveWeight(50, 100, 0.75), 0.594603);
return results;`,hints:["If x is greater than or equal to xMax, return 1.","Otherwise, compute Math.pow(x / xMax, alpha)."],solution:`function gloveWeight(x, xMax = 100, alpha = 0.75) {
  if (x === 0) return 0;
  return x >= xMax ? 1 : Math.pow(x / xMax, alpha);
}`,explanation:'The weighting function scales the objective so that very frequent pairs like "the-and" do not bias the word vector updates.'},{id:"glove-prediction",stepLabel:"2.2",group:"Dot-plus-bias prediction",title:"GloVe dot plus bias prediction",concept:"GloVe fits the dot product of two word vectors plus their respective biases to the log of their co-occurrence count.",objective:"Calculate the predicted log co-occurrence using vector dot products and bias terms.",difficulty:"warmup",starterCode:`function glovePredict(wi, wj, biasI, biasJ) {
  function dot(a, b) {
    let sum = 0;
    for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
    return sum;
  }
  // TODO: return dot product of wi and wj plus biasI and biasJ
  return 0;
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('prediction basic', glovePredict([1, 2], [3, 4], 0.5, 0.2), 11.7);
check('prediction zero vectors', glovePredict([0, 0], [0, 0], -1, 2), 1);
return results;`,hints:["Call dot(wi, wj).","Add biasI and biasJ to that dot product."],solution:`function glovePredict(wi, wj, biasI, biasJ) {
  function dot(a, b) {
    let sum = 0;
    for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
    return sum;
  }
  return dot(wi, wj) + biasI + biasJ;
}`,explanation:"Bias terms capture the baseline frequency of words i and j independently of their co-occurrence."},{id:"glove-loss-term",stepLabel:"2.3",group:"Full scalar loss",title:"GloVe single pair loss",concept:"The loss for a word pair (i, j) is the weighted squared difference between prediction and log(x_ij).",objective:"Combine the weight function, prediction, and log co-occurrences to compute single-pair loss.",difficulty:"challenge",starterCode:`function glovePairLoss(wi, wj, biasI, biasJ, xij, xMax = 100, alpha = 0.75) {
  function dot(a, b) {
    let sum = 0;
    for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
    return sum;
  }
  
  const weight = xij >= xMax ? 1 : Math.pow(xij / xMax, alpha);
  const pred = dot(wi, wj) + biasI + biasJ;
  // TODO: compute squared error (pred - ln(xij))^2 and multiply by weight
  return 0;
}`,testCode:`const results = [];
function approxEqual(a, b, tolerance = 1e-5) {
  return Math.abs(a - b) <= tolerance;
}
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const wi = [0.5, -0.2];
const wj = [0.8, 0.4];
check('pair loss xij=10', glovePairLoss(wi, wj, 0.1, 0.2, 10, 100, 0.75), 0.503447);
check('pair loss xij=120', glovePairLoss(wi, wj, 0.1, 0.2, 120, 100, 0.75), 17.367987);
return results;`,hints:["Compute the log co-occurrence using Math.log(xij).","The difference is pred - Math.log(xij).","Return weight * diff * diff."],solution:`function glovePairLoss(wi, wj, biasI, biasJ, xij, xMax = 100, alpha = 0.75) {
  function dot(a, b) {
    let sum = 0;
    for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
    return sum;
  }
  
  const weight = xij >= xMax ? 1 : Math.pow(xij / xMax, alpha);
  const pred = dot(wi, wj) + biasI + biasJ;
  const diff = pred - Math.log(xij);
  return weight * diff * diff;
}`,explanation:"GloVe is a global log-bilinear matrix factorization model that scales quadratic loss with a custom weighting function."},{id:"fasttext-ngrams",stepLabel:"3.1",group:"Character n-gram enumerate",title:"Character n-grams extraction",concept:'FastText represents words by splitting them into overlapping character n-grams bounded by "<" and ">".',objective:"Generate all character n-grams of size n for a decorated word.",difficulty:"core",starterCode:`function getCharacterNGrams(word, n = 3) {
  const decorated = '<' + word + '>';
  const ngrams = [];
  
  // TODO: loop through decorated string and slice substrings of length n
  for (let i = 0; i <= decorated.length - n; i++) {
    const ngram = '';
    ngrams.push(ngram);
  }
  
  return ngrams;
}`,testCode:`const results = [];
function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: sameArray(actual, expected) });
}
check('apple n=3', getCharacterNGrams('apple', 3), ['<ap', 'app', 'ppl', 'ple', 'le>']);
check('cat n=3', getCharacterNGrams('cat', 3), ['<ca', 'cat', 'at>']);
return results;`,hints:["Use decorated.substring(i, i + n) or decorated.slice(i, i + n).","Assign it to the ngram variable."],solution:`function getCharacterNGrams(word, n = 3) {
  const decorated = '<' + word + '>';
  const ngrams = [];
  
  for (let i = 0; i <= decorated.length - n; i++) {
    const ngram = decorated.slice(i, i + n);
    ngrams.push(ngram);
  }
  
  return ngrams;
}`,explanation:"Including n-grams allows FastText to generalize to unseen, out-of-vocabulary words using common subword roots."},{id:"fasttext-hash",stepLabel:"3.2",group:"Hash bucket",title:"N-gram hashing",concept:"Since there are millions of possible n-grams, FastText hashes them to a fixed number of buckets (e.g. 2,000,000) using a string hash algorithm.",objective:"Compute a polynomial rolling hash modulo numBuckets for a subword n-gram.",difficulty:"core",starterCode:`function fasttextHash(ngram, numBuckets) {
  let hash = 5381;
  for (let i = 0; i < ngram.length; i++) {
    // TODO: update hash using: (hash * 33) + character code of current character
    hash = 0;
  }
  return (hash >>> 0) % numBuckets;
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('hash test', fasttextHash('app', 1000), 438);
check('hash check another', fasttextHash('ple', 1000), 630);
return results;`,hints:["Get char code using ngram.charCodeAt(i).","The formula is hash = (hash * 33) + ngram.charCodeAt(i).","Make sure to do standard JS arithmetic or bitwise ops inside."],solution:`function fasttextHash(ngram, numBuckets) {
  let hash = 5381;
  for (let i = 0; i < ngram.length; i++) {
    hash = (hash * 33) + ngram.charCodeAt(i);
  }
  return (hash >>> 0) % numBuckets;
}`,explanation:"Hashing avoids the need to store a separate dictionary for millions of rare n-grams, saving massive amounts of memory."},{id:"fasttext-sum-vectors",stepLabel:"3.3",group:"Subword vector sum",title:"Assemble subword embeddings",concept:"A FastText word vector is the sum of its n-gram embeddings.",objective:"Look up subword vector indices via hashing, and add their coordinates to the sum.",difficulty:"challenge",starterCode:`function sumSubwordVectors(ngrams, buckets, numBuckets, vectorDim) {
  const sum = Array(vectorDim).fill(0);
  
  function fasttextHash(ngram, numBuckets) {
    let hash = 5381;
    for (let i = 0; i < ngram.length; i++) hash = (hash * 33) + ngram.charCodeAt(i);
    return (hash >>> 0) % numBuckets;
  }

  for (let i = 0; i < ngrams.length; i++) {
    const bucketIdx = fasttextHash(ngrams[i], numBuckets);
    const vec = buckets[bucketIdx];
    
    for (let d = 0; d < vectorDim; d++) {
      // TODO: add vector coordinate vec[d] to sum[d]
      sum[d] += 0;
    }
  }
  
  return sum;
}`,testCode:`const results = [];
function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: sameArray(actual, expected) });
}
const buckets = [
  [0.1, 0.2],
  [0.3, 0.4],
  [0.5, 0.6],
  [0.7, 0.8]
];
// ngrams 'app' (hash 200 % 4 = 0) and 'ple' (hash 874 % 4 = 2)
// sums: buckets[0] + buckets[2] = [0.1+0.5, 0.2+0.6] = [0.6, 0.8]
check('sum 2 ngrams', sumSubwordVectors(['app', 'ple'], buckets, 4, 2), [1.0, 1.2]);
return results;`,hints:["The coordinate from the subword bucket is vec[d].","Add it directly to sum[d].","sum[d] += vec[d];"],solution:`function sumSubwordVectors(ngrams, buckets, numBuckets, vectorDim) {
  const sum = Array(vectorDim).fill(0);
  
  function fasttextHash(ngram, numBuckets) {
    let hash = 5381;
    for (let i = 0; i < ngram.length; i++) hash = (hash * 33) + ngram.charCodeAt(i);
    return (hash >>> 0) % numBuckets;
  }

  for (let i = 0; i < ngrams.length; i++) {
    const bucketIdx = fasttextHash(ngrams[i], numBuckets);
    const vec = buckets[bucketIdx];
    
    for (let d = 0; d < vectorDim; d++) {
      sum[d] += vec[d];
    }
  }
  
  return sum;
}`,explanation:'Summing n-grams preserves shared morphological patterns, so words like "learning" and "learnable" share subword vector paths.'}],E=[{id:"split-shuffle",stepLabel:"39.1",group:"Shuffle",title:"Fisher-Yates Shuffle",concept:"To ensure a representative split, datasets should be randomly shuffled before partitioning.",objective:"Implement the Fisher-Yates shuffle algorithm on an array of indices.",difficulty:"warmup",starterCode:`function shuffleIndices(arr, seed) {
  // A simple deterministic pseudo-random generator based on seed
  let r = seed || 42;
  function random() {
    let x = Math.sin(r++) * 10000;
    return x - Math.floor(x);
  }
  
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    // TODO: swap elements at i and j
    const temp = shuffled[i];
    shuffled[i] = shuffled[i];
  }
  return shuffled;
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: JSON.stringify(actual) === JSON.stringify(expected) });
}
const arr = [0, 1, 2, 3, 4];
check('shuffled with seed 42', shuffleIndices(arr, 42), [4, 2, 0, 1, 3]);
return results;`,hints:["Swap shuffled[i] and shuffled[j].","Use temp to hold shuffled[i], set shuffled[i] = shuffled[j], then shuffled[j] = temp."],solution:`function shuffleIndices(arr, seed) {
  let r = seed || 42;
  function random() {
    let x = Math.sin(r++) * 10000;
    return x - Math.floor(x);
  }
  
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    const temp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = temp;
  }
  return shuffled;
}`,explanation:"Shuffling prevents training and test sets from having ordered bias (e.g., all class 0 at the start)."},{id:"split-slices",stepLabel:"39.2",group:"Train slice",title:"Dataset Splitting Slices",concept:"Partition the dataset into Train, Validation, and Test sets based on proportional fractions.",objective:"Compute slice boundaries and return the split datasets.",difficulty:"core",starterCode:`function splitDataset(dataset, trainFrac, valFrac) {
  const n = dataset.length;
  const trainEnd = Math.floor(n * trainFrac);
  const valEnd = Math.floor(n * (trainFrac + valFrac));
  
  // TODO: Slice dataset into train, val, and test arrays
  const train = [];
  const val = [];
  const test = [];
  
  return { train, val, test };
}`,testCode:`const results = [];
function sameObj(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameObj(actual, expected) });
}
const data = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
check('split 60/20/20', splitDataset(data, 0.6, 0.2), {
  train: [10, 20, 30, 40, 50, 60],
  val: [70, 80],
  test: [90, 100]
});
return results;`,hints:["Use dataset.slice(start, end).","train goes from 0 to trainEnd.","val goes from trainEnd to valEnd.","test goes from valEnd to the end."],solution:`function splitDataset(dataset, trainFrac, valFrac) {
  const n = dataset.length;
  const trainEnd = Math.floor(n * trainFrac);
  const valEnd = Math.floor(n * (trainFrac + valFrac));
  
  const train = dataset.slice(0, trainEnd);
  const val = dataset.slice(trainEnd, valEnd);
  const test = dataset.slice(valEnd);
  
  return { train, val, test };
}`,explanation:"Train set fits parameters; Val guides hyperparameter tuning; Test provides unbiased final evaluation."},{id:"split-leakage-check",stepLabel:"39.3",group:"No leakage check",title:"Data Leakage Verification",concept:"To ensure validity, there must be absolute zero overlap (leakage) between splits.",objective:"Implement a function to verify that train, validation, and test sets are completely disjoint.",difficulty:"challenge",starterCode:`function checkNoLeakage(trainIdx, valIdx, testIdx) {
  const trainSet = new Set(trainIdx);
  const valSet = new Set(valIdx);
  const testSet = new Set(testIdx);
  
  // TODO: Check if any element in valSet or testSet exists in trainSet, or if they overlap.
  // Return true if there is NO leakage (mutually disjoint), else false.
  return false;
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('disjoint sets', checkNoLeakage([1, 2, 3], [4, 5], [6]), true);
check('overlap train/val', checkNoLeakage([1, 2, 3], [3, 4], [5]), false);
check('overlap val/test', checkNoLeakage([1, 2], [3, 4], [4, 5]), false);
return results;`,hints:["Check if any element of trainIdx is in valSet or testSet.","Check if any element of valIdx is in testSet.","If any overlap is found, return false. Otherwise return true."],solution:`function checkNoLeakage(trainIdx, valIdx, testIdx) {
  const trainSet = new Set(trainIdx);
  const valSet = new Set(valIdx);
  const testSet = new Set(testIdx);
  
  for (const x of trainIdx) {
    if (valSet.has(x) || testSet.has(x)) return false;
  }
  for (const x of valIdx) {
    if (testSet.has(x)) return false;
  }
  return true;
}`,explanation:"Overlapping samples between splits lead to overly optimistic performance evaluation (leakage)."},{id:"cv-fold-bounds",stepLabel:"40.1",group:"Fold size",title:"Cross-Validation Fold Sizes",concept:"In k-fold cross-validation, the dataset is split into k parts. Each part contains roughly N / k elements.",objective:"Determine the start and end index of fold i (0-indexed) for N samples.",difficulty:"warmup",starterCode:`function getFoldRange(n, k, foldIdx) {
  const baseFoldSize = Math.floor(n / k);
  const remainder = n % k;
  
  // TODO: compute start and end indices of the fold.
  // Account for remainders by distributing them to the first few folds.
  let start = 0;
  let end = 0;
  
  return { start, end };
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: JSON.stringify(actual) === JSON.stringify(expected) });
}
check('fold 0 of 10 samples, k=3', getFoldRange(10, 3, 0), { start: 0, end: 4 });
check('fold 1 of 10 samples, k=3', getFoldRange(10, 3, 1), { start: 4, end: 7 });
check('fold 2 of 10 samples, k=3', getFoldRange(10, 3, 2), { start: 7, end: 10 });
return results;`,hints:["To distribute remainder, folds before remainder get size = baseFoldSize + 1, others get size = baseFoldSize.","Start index is sum of sizes of previous folds.","End index is start + current fold size."],solution:`function getFoldRange(n, k, foldIdx) {
  const baseFoldSize = Math.floor(n / k);
  const remainder = n % k;
  
  let start = 0;
  for (let i = 0; i < foldIdx; i++) {
    start += baseFoldSize + (i < remainder ? 1 : 0);
  }
  const size = baseFoldSize + (foldIdx < remainder ? 1 : 0);
  const end = start + size;
  
  return { start, end };
}`,explanation:"Cross-validation splits the data uniformly, adjusting for remainder items so every sample is evaluated once."},{id:"cv-fold-indices",stepLabel:"40.2",group:"Train/val masks",title:"K-Fold Partitioning",concept:"During fold i, the validation fold is fold i, and the training folds are all other folds combined.",objective:"Split indices 0 to N-1 into trainIndices and valIndices for the current fold.",difficulty:"core",starterCode:`function kFoldSplit(n, k, foldIdx) {
  const baseFoldSize = Math.floor(n / k);
  const remainder = n % k;
  
  let valStart = 0;
  for (let i = 0; i < foldIdx; i++) {
    valStart += baseFoldSize + (i < remainder ? 1 : 0);
  }
  const valSize = baseFoldSize + (foldIdx < remainder ? 1 : 0);
  const valEnd = valStart + valSize;
  
  const trainIndices = [];
  const valIndices = [];
  
  // TODO: fill trainIndices and valIndices from 0 to n-1
  
  return { trainIndices, valIndices };
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: JSON.stringify(actual) === JSON.stringify(expected) });
}
check('k-fold split n=5 k=5 fold=2', kFoldSplit(5, 5, 2), {
  trainIndices: [0, 1, 3, 4],
  valIndices: [2]
});
return results;`,hints:["Loop i from 0 to n-1.","If i is between valStart (inclusive) and valEnd (exclusive), push to valIndices.","Otherwise, push to trainIndices."],solution:`function kFoldSplit(n, k, foldIdx) {
  const baseFoldSize = Math.floor(n / k);
  const remainder = n % k;
  
  let valStart = 0;
  for (let i = 0; i < foldIdx; i++) {
    valStart += baseFoldSize + (i < remainder ? 1 : 0);
  }
  const valSize = baseFoldSize + (foldIdx < remainder ? 1 : 0);
  const valEnd = valStart + valSize;
  
  const trainIndices = [];
  const valIndices = [];
  
  for (let i = 0; i < n; i++) {
    if (i >= valStart && i < valEnd) {
      valIndices.push(i);
    } else {
      trainIndices.push(i);
    }
  }
  
  return { trainIndices, valIndices };
}`,explanation:"Cross-validation repeats training across different folds to yield a more stable estimate of performance."},{id:"leakage-detect-target",stepLabel:"41.1",group:"Label in features",title:"Target Leakage Detection",concept:"Target leakage occurs when the target label (or features directly derived from it) is present in the training features.",objective:"Identify if any feature column is exactly equal (or perfectly correlated) to the target label.",difficulty:"warmup",starterCode:`function detectTargetLeakage(features, target) {
  // features is an array of columns: features[colIdx] is an array of length N.
  // target is an array of length N.
  // TODO: return index of leaked column if all its elements match the target.
  // If no leakage is detected, return -1.
  return -1;
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
const target = [1, 0, 1, 1, 0];
const feats = [
  [0.2, 0.4, 0.6, 0.1, 0.9],
  [1, 0, 1, 1, 0],
  [3, 5, 2, 1, 4]
];
check('leakage in col 1', detectTargetLeakage(feats, target), 1);
check('no leakage', detectTargetLeakage([[1, 2], [3, 4]], [0, 1]), -1);
return results;`,hints:["Iterate through columns from 0 to features.length - 1.","Check if every element features[colIdx][rowIdx] equals target[rowIdx].","Return colIdx if all rows match."],solution:`function detectTargetLeakage(features, target) {
  for (let colIdx = 0; colIdx < features.length; colIdx++) {
    let isLeak = true;
    for (let rowIdx = 0; rowIdx < target.length; rowIdx++) {
      if (features[colIdx][rowIdx] !== target[rowIdx]) {
        isLeak = false;
        break;
      }
    }
    if (isLeak) return colIdx;
  }
  return -1;
}`,explanation:"Including target-like columns in features makes the model look perfect in training, but useless in production."},{id:"leakage-scale-correct",stepLabel:"41.2",group:"Preprocessing leak",title:"Leakage-Free Preprocessing",concept:"Fitting transformers (like scaling, mean imputation) on the full dataset before splitting leaks test statistics into training.",objective:"Implement a preprocessing function that fits scale parameters strictly on train data and applies them to both sets.",difficulty:"challenge",starterCode:`function scaleSplitsCorrectly(trainX, valX) {
  // TODO: Compute mean and standard deviation of trainX ONLY.
  // Then standardize trainX and valX: z = (x - mean) / std. (If std is 0, use std = 1).
  let mean = 0;
  let std = 1;
  const scaledTrain = [];
  const scaledVal = [];
  
  return { scaledTrain, scaledVal, mean, std };
}`,testCode:`const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const train = [10, 20, 30];
const val = [40];
const res = scaleSplitsCorrectly(train, val);
check('train mean', res.mean, 20);
check('train std', res.std, 8.1649658);
check('scaled val', res.scaledVal[0], 2.44949);
return results;`,hints:["Calculate trainX mean: sum / length.","Calculate trainX variance: sum of squared differences from mean divided by length.","std is Math.sqrt(variance). Avoid dividing by 0 by using 1 if std is 0.","Map trainX and valX arrays to (x - mean) / std."],solution:`function scaleSplitsCorrectly(trainX, valX) {
  let sum = 0;
  for (let i = 0; i < trainX.length; i++) {
    sum += trainX[i];
  }
  const mean = sum / trainX.length;
  
  let varSum = 0;
  for (let i = 0; i < trainX.length; i++) {
    varSum += Math.pow(trainX[i] - mean, 2);
  }
  let std = Math.sqrt(varSum / trainX.length);
  if (std === 0) std = 1;
  
  const scaledTrain = trainX.map(x => (x - mean) / std);
  const scaledVal = valX.map(x => (x - mean) / std);
  
  return { scaledTrain, scaledVal, mean, std };
}`,explanation:"Fitting preprocessing params solely on training data avoids leaks, ensuring validation reflects performance on unseen data."},{id:"scaling-mean-std",stepLabel:"42.1",group:"Mean",title:"Mean and Standard Deviation Calculation",concept:"Scaling techniques require computing column-wise statistics, specifically sample mean and standard deviation.",objective:"Compute mean and standard deviation of a 1D numeric array.",difficulty:"warmup",starterCode:`function getMeanAndStd(arr) {
  // TODO: compute mean and standard deviation
  let mean = 0;
  let std = 1;
  
  return { mean, std };
}`,testCode:`const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const res = getMeanAndStd([2, 4, 4, 4, 5, 5, 7, 9]);
check('mean', res.mean, 5);
check('std', res.std, 2);
return results;`,hints:["mean is sum of values divided by count.","std is Math.sqrt(sum((x - mean)^2) / count)."],solution:`function getMeanAndStd(arr) {
  const n = arr.length;
  let sum = 0;
  for (let i = 0; i < n; i++) {
    sum += arr[i];
  }
  const mean = sum / n;
  
  let varSum = 0;
  for (let i = 0; i < n; i++) {
    varSum += Math.pow(arr[i] - mean, 2);
  }
  const std = Math.sqrt(varSum / n);
  
  return { mean, std };
}`,explanation:"Mean and standard deviation quantify the central tendency and spread of feature scales."},{id:"scaling-standardize",stepLabel:"42.2",group:"Transform",title:"Standardization",concept:"Standardization (Z-score normalization) scales features to have a mean of 0 and standard deviation of 1: z = (x - mean) / std.",objective:"Standardize a numeric vector using given mean and std.",difficulty:"core",starterCode:`function standardizeVector(arr, mean, std) {
  // TODO: apply Z-score normalization to each element
  // Handle case where std is 0 by returning unchanged values
  return arr;
}`,testCode:`const results = [];
function sameArr(a, b, tol = 1e-5) {
  return a.every((v, i) => Math.abs(v - b[i]) <= tol);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArr(actual, expected) });
}
check('standardize simple', standardizeVector([10, 20, 30], 20, 10), [-1, 0, 1]);
return results;`,hints:["If std is 0, return arr.","Use arr.map(x => (x - mean) / std)."],solution:`function standardizeVector(arr, mean, std) {
  if (std === 0) return arr;
  return arr.map(x => (x - mean) / std);
}`,explanation:"Standardization is robust to outliers and crucial for distance-based estimators like SVM or kNN."},{id:"scaling-minmax",stepLabel:"42.3",group:"Transform",title:"Min-Max Scaling",concept:"Min-Max scaling normalizes data to a fixed range, typically [0, 1]: x_scaled = (x - min) / (max - min).",objective:"Apply Min-Max scaling to a numeric vector.",difficulty:"core",starterCode:`function minMaxScale(arr) {
  let min = arr[0];
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < min) min = arr[i];
    if (arr[i] > max) max = arr[i];
  }
  
  // TODO: Apply Min-Max scaling to each element. 
  // Handle case where min equals max by returning all zeros.
  return arr;
}`,testCode:`const results = [];
function sameArr(a, b, tol = 1e-5) {
  return a.every((v, i) => Math.abs(v - b[i]) <= tol);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArr(actual, expected) });
}
check('min-max scale', minMaxScale([5, 10, 15, 20]), [0, 0.333333, 0.666667, 1]);
return results;`,hints:["Denominator is max - min.","If max === min, return an array of 0s of the same length.","Otherwise, map x to (x - min) / (max - min)."],solution:`function minMaxScale(arr) {
  let min = arr[0];
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < min) min = arr[i];
    if (arr[i] > max) max = arr[i];
  }
  
  const range = max - min;
  if (range === 0) {
    return arr.map(() => 0);
  }
  return arr.map(x => (x - min) / range);
}`,explanation:"Min-Max scaling preserves structural zeros and works well for algorithms that expect bounded inputs (like neural networks)."},{id:"kmeans-distance",stepLabel:"43.1",group:"Distance to centroid",title:"Euclidean Distance",concept:"K-Means groups points by assigning them to the closest centroid based on distance metrics.",objective:"Compute the Euclidean distance between two coordinate arrays.",difficulty:"warmup",starterCode:`function euclideanDistance(p1, p2) {
  // TODO: compute sqrt(sum((p1[i] - p2[i])^2))
  return 0;
}`,testCode:`const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('distance 2D', euclideanDistance([0, 0], [3, 4]), 5);
return results;`,hints:["Iterate through coordinates from 0 to p1.length - 1.","Sum up the squared differences.","Return Math.sqrt(sum)."],solution:`function euclideanDistance(p1, p2) {
  let sum = 0;
  for (let i = 0; i < p1.length; i++) {
    sum += Math.pow(p1[i] - p2[i], 2);
  }
  return Math.sqrt(sum);
}`,explanation:"Euclidean distance is the canonical similarity metric used to define cluster boundaries in spherical spaces."},{id:"kmeans-assign",stepLabel:"43.2",group:"Assignment",title:"Cluster Assignment",concept:"Each data point is mapped to the cluster index representing its nearest centroid.",objective:"Given a point and list of centroids, return the index of the closest centroid.",difficulty:"core",starterCode:`function assignPointToCentroid(point, centroids) {
  function dist(p1, p2) {
    let s = 0;
    for (let i = 0; i < p1.length; i++) s += Math.pow(p1[i] - p2[i], 2);
    return Math.sqrt(s);
  }
  
  let minIdx = 0;
  let minDistance = Infinity;
  
  // TODO: Iterate over centroids, compute distance, and track the index of the minimum distance.
  
  return minIdx;
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
const centroids = [[1, 1], [5, 5], [10, 10]];
check('closer to centroid 0', assignPointToCentroid([1.5, 2], centroids), 0);
check('closer to centroid 1', assignPointToCentroid([4, 6], centroids), 1);
return results;`,hints:["Loop i from 0 to centroids.length - 1.","Calculate distance d using dist(point, centroids[i]).","If d < minDistance, update minDistance and set minIdx = i."],solution:`function assignPointToCentroid(point, centroids) {
  function dist(p1, p2) {
    let s = 0;
    for (let i = 0; i < p1.length; i++) s += Math.pow(p1[i] - p2[i], 2);
    return Math.sqrt(s);
  }
  
  let minIdx = 0;
  let minDistance = Infinity;
  
  for (let i = 0; i < centroids.length; i++) {
    const d = dist(point, centroids[i]);
    if (d < minDistance) {
      minDistance = d;
      minIdx = i;
    }
  }
  
  return minIdx;
}`,explanation:"Assigning points to the nearest centroid minimizes intra-cluster variance."},{id:"kmeans-update-centroids",stepLabel:"43.3",group:"Mean update",title:"Centroid Position Updates",concept:"Centroids move to the center (mean) of all points currently assigned to their cluster.",objective:"Recompute centroids by averaging coordinates of assigned points.",difficulty:"core",starterCode:`function updateCentroids(points, labels, k, dim) {
  const newCentroids = Array(k).fill(null).map(() => Array(dim).fill(0));
  const counts = Array(k).fill(0);
  
  // TODO: Sum coordinate values for each cluster label, and track point counts.
  // Then divide each coordinate sum by cluster count. If count is 0, leave centroid at [0,0...].
  
  return newCentroids;
}`,testCode:`const results = [];
function sameCentroids(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameCentroids(actual, expected) });
}
const pts = [[1, 2], [2, 3], [5, 6]];
const lbls = [0, 0, 1];
check('update 2 centroids in 2D', updateCentroids(pts, lbls, 2, 2), [[1.5, 2.5], [5, 6]]);
return results;`,hints:["Iterate through all points. Let label = labels[i].","For each coordinate d from 0 to dim-1, add points[i][d] to newCentroids[label][d].","Increment counts[label].","After looping, for each cluster j, divide its coordinates by counts[j] (if counts[j] > 0)."],solution:`function updateCentroids(points, labels, k, dim) {
  const newCentroids = Array(k).fill(null).map(() => Array(dim).fill(0));
  const counts = Array(k).fill(0);
  
  for (let i = 0; i < points.length; i++) {
    const label = labels[i];
    counts[label]++;
    for (let d = 0; d < dim; d++) {
      newCentroids[label][d] += points[i][d];
    }
  }
  
  for (let j = 0; j < k; j++) {
    if (counts[j] > 0) {
      for (let d = 0; d < dim; d++) {
        newCentroids[j][d] /= counts[j];
      }
    }
  }
  
  return newCentroids;
}`,explanation:"Updating centroids to the mean of cluster members iteratively reduces the total within-cluster sum of squares (inertia)."},{id:"knn-predict-vote",stepLabel:"44.1",group:"kNN vote",title:"kNN Classification Voting",concept:"In k-Nearest Neighbors, predictions are resolved by finding the nearest samples and taking a majority vote.",objective:"Vote on labels of closest k items, breaking ties by preferring the first label alphabetically/numerically.",difficulty:"core",starterCode:`function knnVote(neighborLabels, k) {
  // neighborLabels contains labels ordered from closest to furthest neighbor
  const votes = {};
  
  // TODO: Count votes for the first k neighbors.
  // Find and return the label with the highest vote count.
  return null;
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('majority vote', knnVote(['cat', 'cat', 'dog'], 3), 'cat');
check('k limit vote', knnVote(['dog', 'cat', 'cat'], 1), 'dog');
return results;`,hints:["Loop through the first k items of neighborLabels (or fewer if array size is smaller).","Increment counts in a votes dictionary.","Track the max count and winner label."],solution:`function knnVote(neighborLabels, k) {
  const votes = {};
  const limit = Math.min(k, neighborLabels.length);
  for (let i = 0; i < limit; i++) {
    const label = neighborLabels[i];
    votes[label] = (votes[label] || 0) + 1;
  }
  
  let winner = null;
  let maxVotes = -1;
  for (const label in votes) {
    if (votes[label] > maxVotes) {
      maxVotes = votes[label];
      winner = label;
    }
  }
  return winner;
}`,explanation:"The vote resolves label assignments based on localized density representations in metric space."},{id:"svm-hinge-loss",stepLabel:"44.2",group:"SVM hinge",title:"Hinge Loss Calculation",concept:"Support Vector Machines use hinge loss to maximize margins: Loss = max(0, 1 - y * f(x)).",objective:"Compute scalar hinge loss for one data point.",difficulty:"core",starterCode:`function hingeLoss(score, label) {
  // label y is either +1 or -1
  // score is model output f(x)
  // TODO: compute and return max(0, 1 - label * score)
  return 0;
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('correct prediction outside margin', hingeLoss(1.5, 1), 0);
check('correct prediction inside margin', hingeLoss(0.5, 1), 0.5);
check('incorrect prediction', hingeLoss(-0.5, 1), 1.5);
return results;`,hints:["Calculate margin term: 1 - label * score.","Return Math.max(0, margin term)."],solution:`function hingeLoss(score, label) {
  return Math.max(0, 1 - label * score);
}`,explanation:"Hinge loss ignores correctly classified examples that lie beyond the margin boundary, focusing gradients strictly on active support vectors."},{id:"tree-gini-impurity",stepLabel:"45.1",group:"Gini",title:"Gini Impurity Calculation",concept:"Decision trees evaluate split quality using node impurity metrics like Gini: Impurity = 1 - sum(p_i^2).",objective:"Calculate the Gini impurity given categorical count tallies.",difficulty:"warmup",starterCode:`function giniImpurity(counts) {
  let total = 0;
  for (let i = 0; i < counts.length; i++) total += counts[i];
  if (total === 0) return 0;
  
  let sumSquaredProb = 0;
  // TODO: Calculate the sum of squared probabilities for each class,
  // then return 1 - sumSquaredProb
  return 0;
}`,testCode:`const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('perfect purity', giniImpurity([5, 0]), 0);
check('equal distribution', giniImpurity([5, 5]), 0.5);
check('skewed distribution', giniImpurity([9, 1]), 0.18);
return results;`,hints:["Iterate through counts. Probability of class i is counts[i] / total.","Accumulate the square of this probability in sumSquaredProb.","Return 1 - sumSquaredProb."],solution:`function giniImpurity(counts) {
  let total = 0;
  for (let i = 0; i < counts.length; i++) total += counts[i];
  if (total === 0) return 0;
  
  let sumSquaredProb = 0;
  for (let i = 0; i < counts.length; i++) {
    const p = counts[i] / total;
    sumSquaredProb += p * p;
  }
  return 1 - sumSquaredProb;
}`,explanation:"Gini impurity measures the likelihood of misclassification if a label was chosen randomly according to node distributions."},{id:"bagging-average-vote",stepLabel:"45.2",group:"Bagging average",title:"Bagging Ensemble Voting",concept:"Random Forests use bagging (bootstrap aggregating) to reduce variance by averaging independent trees.",objective:"Perform soft-voting averaging across tree class probabilities.",difficulty:"core",starterCode:`function baggingPredict(treeProbabilities) {
  // treeProbabilities is a 2D array: [treeIdx][classIdx]
  const numTrees = treeProbabilities.length;
  const numClasses = treeProbabilities[0].length;
  const averageProbs = Array(numClasses).fill(0);
  
  // TODO: Average predictions across all trees for each class
  
  return averageProbs;
}`,testCode:`const results = [];
function sameArr(a, b, tol = 1e-5) {
  return a.every((v, i) => Math.abs(v - b[i]) <= tol);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArr(actual, expected) });
}
const treeProbs = [
  [0.8, 0.2],
  [0.6, 0.4],
  [0.7, 0.3]
];
check('average 3 trees', baggingPredict(treeProbs), [0.7, 0.3]);
return results;`,hints:["Iterate through each tree i from 0 to numTrees-1.","Iterate through each class c from 0 to numClasses-1.","Accumulate treeProbabilities[i][c] into averageProbs[c].","Divide each averageProbs[c] entry by numTrees."],solution:`function baggingPredict(treeProbabilities) {
  const numTrees = treeProbabilities.length;
  const numClasses = treeProbabilities[0].length;
  const averageProbs = Array(numClasses).fill(0);
  
  for (let i = 0; i < numTrees; i++) {
    for (let c = 0; c < numClasses; c++) {
      averageProbs[c] += treeProbabilities[i][c];
    }
  }
  
  for (let c = 0; c < numClasses; c++) {
    averageProbs[c] /= numTrees;
  }
  
  return averageProbs;
}`,explanation:"Averaging predictions reduces variance without increasing bias, stabilizing performance against random data quirks."},{id:"ts-rolling-mean",stepLabel:"46.1",group:"Window slice",title:"Rolling Mean Windowing",concept:"Rolling statistics smooth time series trends by averaging sliding index bounds.",objective:"Compute rolling average values over window length w.",difficulty:"warmup",starterCode:`function rollingMean(series, w) {
  const result = [];
  
  // TODO: Compute rolling mean.
  // Values before w-1 measurements have insufficient context; push null for those indices.
  // Otherwise, push average of range [i - w + 1, i].
  
  return result;
}`,testCode:`const results = [];
function sameArr(a, b, tol = 1e-5) {
  return a.every((v, i) => {
    if (v === null && b[i] === null) return true;
    return Math.abs(v - b[i]) <= tol;
  });
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArr(actual, expected) });
}
check('rolling window 3', rollingMean([10, 20, 30, 40], 3), [null, null, 20, 30]);
return results;`,hints:["Loop i from 0 to series.length-1.","If i < w - 1, push null.","Else, sum series[j] for j from i - w + 1 to i, divide by w, and push result."],solution:`function rollingMean(series, w) {
  const result = [];
  for (let i = 0; i < series.length; i++) {
    if (i < w - 1) {
      result.push(null);
    } else {
      let sum = 0;
      for (let j = i - w + 1; j <= i; j++) {
        sum += series[j];
      }
      result.push(sum / w);
    }
  }
  return result;
}`,explanation:"Rolling averages damp out short-term fluctuations to reveal underlying macro directions."},{id:"ts-exponential-smoothing",stepLabel:"46.2",group:"One-step forecast",title:"Exponential Smoothing",concept:"Exponential smoothing weights recent values with parameter alpha, fading historical values recursively: y_t = alpha * x_t + (1 - alpha) * y_prev.",objective:"Generate smoothed sequence values from a timeseries.",difficulty:"challenge",starterCode:`function expSmoothing(series, alpha) {
  const smoothed = [];
  if (series.length === 0) return smoothed;
  
  // First value initializes directly
  smoothed[0] = series[0];
  
  // TODO: compute smoothed values for i from 1 to series.length - 1
  
  return smoothed;
}`,testCode:`const results = [];
function sameArr(a, b, tol = 1e-5) {
  return a.every((v, i) => Math.abs(v - b[i]) <= tol);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArr(actual, expected) });
}
check('smoothing alpha 0.5', expSmoothing([10, 20, 30], 0.5), [10, 15, 22.5]);
return results;`,hints:["Loop i from 1 to series.length-1.","Compute: smoothed[i] = alpha * series[i] + (1 - alpha) * smoothed[i-1]."],solution:`function expSmoothing(series, alpha) {
  const smoothed = [];
  if (series.length === 0) return smoothed;
  smoothed[0] = series[0];
  for (let i = 1; i < series.length; i++) {
    smoothed[i] = alpha * series[i] + (1 - alpha) * smoothed[i - 1];
  }
  return smoothed;
}`,explanation:"Exponential smoothing forecasts future steps by assigning decaying weight to increasingly older observations."},{id:"de-impute-median",stepLabel:"47.1",group:"Median impute",title:"Median Imputation",concept:"Missing values must be filled (imputed) prior to model input. The median is robust to outlier values.",objective:"Find the median of non-missing values and replace nulls with it.",difficulty:"core",starterCode:`function imputeMedian(arr) {
  // TODO: Extract non-null values and sort them to calculate the median.
  // Fill null/undefined values in the array copy with this median.
  const clean = [];
  let median = 0;
  
  return arr;
}`,testCode:`const results = [];
function sameArr(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArr(actual, expected) });
}
check('impute odd count list', imputeMedian([5, null, 1, 9, 3]), [5, 4, 1, 9, 3]);
return results;`,hints:["Filter out null and undefined values from arr into clean.","Sort clean numerically: clean.sort((a, b) => a - b).","Compute median. If clean.length is odd, it is clean[Math.floor(len/2)]. If even, it is average of middle two elements.","Map original array replacing null/undefined values with median."],solution:`function imputeMedian(arr) {
  const clean = arr.filter(x => x !== null && x !== undefined);
  if (clean.length === 0) return arr.map(() => 0);
  
  clean.sort((a, b) => a - b);
  const mid = Math.floor(clean.length / 2);
  const median = clean.length % 2 !== 0 ? clean[mid] : (clean[mid - 1] + clean[mid]) / 2;
  
  return arr.map(x => (x === null || x === undefined ? median : x));
}`,explanation:"Imputation keeps feature vectors complete without discarding valuable row observations."},{id:"de-dedupe-key",stepLabel:"47.2",group:"Dedup key",title:"Key-Based Deduplication",concept:"Data pipelines often encounter duplicate log events. We must keep only the freshest row per key.",objective:"Keep only the last occurrence of each unique key, maintaining original array order.",difficulty:"challenge",starterCode:`function dedupeByKey(rows, key) {
  const seen = {};
  
  // TODO: Identify latest index for each key, 
  // then filter rows keeping only the latest records.
  return [];
}`,testCode:`const results = [];
function sameArr(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArr(actual, expected) });
}
const data = [
  { id: 1, val: 'a' },
  { id: 2, val: 'b' },
  { id: 1, val: 'c' }
];
check('dedup by id', dedupeByKey(data, 'id'), [
  { id: 2, val: 'b' },
  { id: 1, val: 'c' }
]);
return results;`,hints:["Iterate backwards through rows from rows.length - 1 down to 0.","If key value is not in seen, set seen[val] = true and push row to a temporary results list.","Reverse the temporary results list to restore final relative ordering."],solution:`function dedupeByKey(rows, key) {
  const seen = {};
  const result = [];
  for (let i = rows.length - 1; i >= 0; i--) {
    const val = rows[i][key];
    if (!seen[val]) {
      seen[val] = true;
      result.push(rows[i]);
    }
  }
  return result.reverse();
}`,explanation:"Deduplication prevents duplicate events from artificially inflating counts or skewing metrics."}],I=[{id:"dist-bernoulli-pmf",stepLabel:"52.1",group:"Bernoulli mean",title:"Bernoulli PMF",concept:"A Bernoulli distribution models a single trial with success probability p. PMF: P(X = k) = p if k=1 else 1-p.",objective:"Compute Bernoulli PMF value for outcome k (0 or 1).",difficulty:"warmup",starterCode:`function bernoulliPmf(k, p) {
  // TODO: return p if k is 1, otherwise 1 - p
  return 0;
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('success k=1', bernoulliPmf(1, 0.75), 0.75);
check('failure k=0', bernoulliPmf(0, 0.75), 0.25);
return results;`,hints:["Use conditional logic or ternary operator: k === 1 ? p : 1 - p."],solution:`function bernoulliPmf(k, p) {
  return k === 1 ? p : 1 - p;
}`,explanation:"The Bernoulli distribution is the simplest discrete distribution, modeling binary outcomes (e.g. coin flips)."},{id:"dist-gaussian-pdf",stepLabel:"52.2",group:"PDF eval",title:"Gaussian PDF",concept:"The Normal (Gaussian) probability density function is: f(x) = (1 / (sigma * sqrt(2 * pi))) * exp(-0.5 * ((x - mu) / sigma)^2).",objective:"Evaluate the 1D Gaussian density at point x.",difficulty:"core",starterCode:`function gaussianPdf(x, mu, sigma) {
  // TODO: compute the Gaussian PDF formula
  return 0;
}`,testCode:`const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('standard normal at mean', gaussianPdf(0, 0, 1), 0.398942);
check('normal at 1 std', gaussianPdf(1, 0, 1), 0.24197);
return results;`,hints:["pi is Math.PI. exp is Math.exp.","Coefficient: 1 / (sigma * Math.sqrt(2 * Math.PI)).","Exponent: -0.5 * Math.pow((x - mu) / sigma, 2).","Multiply coefficient by Math.exp(exponent)."],solution:`function gaussianPdf(x, mu, sigma) {
  const coeff = 1 / (sigma * Math.sqrt(2 * Math.PI));
  const exponent = -0.5 * Math.pow((x - mu) / sigma, 2);
  return coeff * Math.exp(exponent);
}`,explanation:"The Gaussian PDF gives the relative likelihood that a continuous random variable takes a value near x."},{id:"cond-prob-formula",stepLabel:"53.1",group:"P(A|B) formula",title:"Conditional Probability Formula",concept:"Conditional probability is P(A|B) = P(A and B) / P(B). It measures likelihood of event A given B has occurred.",objective:"Compute P(A|B) given joint probability P(A and B) and prior probability P(B).",difficulty:"warmup",starterCode:`function conditionalProbability(pAAndB, pB) {
  // TODO: compute P(A|B). Handle division by zero.
  return 0;
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('simple conditional', conditionalProbability(0.2, 0.5), 0.4);
check('zero conditioning event', conditionalProbability(0, 0), 0);
return results;`,hints:["If P(B) is 0, return 0.","Otherwise return pAAndB / pB."],solution:`function conditionalProbability(pAAndB, pB) {
  if (pB === 0) return 0;
  return pAAndB / pB;
}`,explanation:"Conditional probability restricts the sample space to the conditioning event B."},{id:"cond-chain-rule",stepLabel:"53.2",group:"Chain rule",title:"Probability Chain Rule",concept:"The chain rule computes joint probability of multiple events: P(A and B and C) = P(A) * P(B|A) * P(C | A and B).",objective:"Compute P(A and B and C) using the conditional chain rule probabilities.",difficulty:"core",starterCode:`function jointThreeEvents(pA, pBGivenA, pCGivenAAndB) {
  // TODO: return P(A and B and C)
  return 0;
}`,testCode:`const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('chain joint', jointThreeEvents(0.5, 0.4, 0.3), 0.06);
return results;`,hints:["Multiply all three probabilities together.","return pA * pBGivenA * pCGivenAAndB;"],solution:`function jointThreeEvents(pA, pBGivenA, pCGivenAAndB) {
  return pA * pBGivenA * pCGivenAAndB;
}`,explanation:"The chain rule allows joint probability calculation by breaking it into sequential conditional probabilities."},{id:"bayes-numerator-calc",stepLabel:"54.1",group:"Numerator",title:"Bayes Rule Numerator",concept:"Bayes rule computes posterior probability. The numerator is likelihood times prior: P(B|A) * P(A).",objective:"Compute the Bayes numerator for a hypothesis.",difficulty:"warmup",starterCode:`function bayesNumerator(likelihood, prior) {
  // TODO: compute likelihood * prior
  return 0;
}`,testCode:`const results = [];
function approxEqual(a, b, tol = 1e-5) {
  return Math.abs(a - b) <= tol;
}
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('simple numerator', bayesNumerator(0.9, 0.01), 0.009);
return results;`,hints:["Multiply likelihood by prior."],solution:`function bayesNumerator(likelihood, prior) {
  return likelihood * prior;
}`,explanation:"The numerator ranks potential hypotheses before normalizing them by evidence."},{id:"bayes-posterior-calc",stepLabel:"54.2",group:"Posterior normalize",title:"Posterior Probability",concept:"Bayes rule updates a hypothesis prior: P(H|E) = P(E|H)*P(H) / (P(E|H)*P(H) + P(E|~H)*P(~H)).",objective:"Compute the posterior probability P(H|E).",difficulty:"core",starterCode:`function bayesPosterior(prior, likelihoodCorrect, likelihoodIncorrect) {
  // prior is P(H)
  // likelihoodCorrect is P(E|H)
  // likelihoodIncorrect is P(E|~H)
  // TODO: compute P(H|E)
  return 0;
}`,testCode:`const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('rare disease test', bayesPosterior(0.01, 0.99, 0.05), 0.166667);
return results;`,hints:["Calculate numerator: prior * likelihoodCorrect.","Calculate negative prior: 1 - prior.","Calculate denominator: numerator + negativePrior * likelihoodIncorrect.","Return numerator / denominator."],solution:`function bayesPosterior(prior, likelihoodCorrect, likelihoodIncorrect) {
  const num = prior * likelihoodCorrect;
  const den = num + (1 - prior) * likelihoodIncorrect;
  if (den === 0) return 0;
  return num / den;
}`,explanation:"Bayes rule combines prior belief with empirical evidence to output posterior confidence."},{id:"mle-gauss-mean",stepLabel:"55.1",group:"Gaussian mean MLE",title:"Gaussian Mean MLE",concept:"The Maximum Likelihood Estimator for a Gaussian mean is simply the sample average of observations.",objective:"Compute the MLE estimation of mu for data samples.",difficulty:"warmup",starterCode:`function mleGaussianMean(data) {
  if (data.length === 0) return 0;
  // TODO: return sample mean
  return 0;
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('mean of list', mleGaussianMean([10, 20, 30, 40]), 25);
return results;`,hints:["Sum all data points and divide by data.length."],solution:`function mleGaussianMean(data) {
  if (data.length === 0) return 0;
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    sum += data[i];
  }
  return sum / data.length;
}`,explanation:"The sample average maximizes the probability of observing the given Gaussian dataset."},{id:"mle-bern-loglik",stepLabel:"55.2",group:"Per-sample log",title:"Bernoulli Log-Likelihood",concept:"To optimize parameters, MLE maximizes log-likelihood: log L(p) = sum(k_i * log(p) + (1 - k_i) * log(1 - p)).",objective:"Evaluate the Bernoulli log-likelihood given data array (values 0 or 1) and parameter p.",difficulty:"core",starterCode:`function bernoulliLogLikelihood(data, p) {
  if (p <= 0 || p >= 1) return -Infinity;
  let logLik = 0;
  
  // TODO: Loop through data and sum log likelihoods.
  // Use Math.log for natural logarithm.
  
  return logLik;
}`,testCode:`const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('loglik simple p=0.5', bernoulliLogLikelihood([1, 0, 1], 0.5), -2.07944);
check('loglik biased p=0.8', bernoulliLogLikelihood([1, 0, 1], 0.8), -2.055725);
return results;`,hints:["Loop through elements. Let k = data[i].","For each element, add: k * Math.log(p) + (1 - k) * Math.log(1 - p)."],solution:`function bernoulliLogLikelihood(data, p) {
  if (p <= 0 || p >= 1) return -Infinity;
  let logLik = 0;
  for (let i = 0; i < data.length; i++) {
    const k = data[i];
    logLik += k * Math.log(p) + (1 - k) * Math.log(1 - p);
  }
  return logLik;
}`,explanation:"Maximizing log-likelihood is mathematically simpler than maximizing raw likelihood due to products turning into sums."},{id:"ev-discrete-calc",stepLabel:"56.1",group:"Weighted sum",title:"Discrete Expected Value",concept:"Expected Value is the probability-weighted average outcome: E[X] = sum(x_i * p_i).",objective:"Compute the expected value given outcomes and their probabilities.",difficulty:"warmup",starterCode:`function expectedValue(outcomes, probabilities) {
  let ev = 0;
  
  // TODO: compute sum of outcomes[i] * probabilities[i]
  
  return ev;
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('die expectation', expectedValue([1, 2, 3, 4, 5, 6], [1/6, 1/6, 1/6, 1/6, 1/6, 1/6]), 3.5);
return results;`,hints:["Loop i from 0 to outcomes.length-1.","Multiply outcomes[i] by probabilities[i] and add to ev."],solution:`function expectedValue(outcomes, probabilities) {
  let ev = 0;
  for (let i = 0; i < outcomes.length; i++) {
    ev += outcomes[i] * probabilities[i];
  }
  return ev;
}`,explanation:"Expected value represents the long-term average outcome of repeating trials."},{id:"var-discrete-calc",stepLabel:"56.2",group:"Variance formula",title:"Discrete Variance",concept:"Variance measures the spread of outcomes around the expected value: Var(X) = sum((x_i - E[X])^2 * p_i).",objective:"Compute variance of discrete outcomes given pre-calculated expected value.",difficulty:"core",starterCode:`function discreteVariance(outcomes, probabilities, ev) {
  let variance = 0;
  
  // TODO: compute sum of (outcomes[i] - ev)^2 * probabilities[i]
  
  return variance;
}`,testCode:`const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('die variance', discreteVariance([1, 2, 3, 4, 5, 6], [1/6, 1/6, 1/6, 1/6, 1/6, 1/6], 3.5), 2.916667);
return results;`,hints:["Loop i from 0 to outcomes.length-1.","Compute squared difference: Math.pow(outcomes[i] - ev, 2).","Multiply by probabilities[i] and accumulate."],solution:`function discreteVariance(outcomes, probabilities, ev) {
  let variance = 0;
  for (let i = 0; i < outcomes.length; i++) {
    variance += Math.pow(outcomes[i] - ev, 2) * probabilities[i];
  }
  return variance;
}`,explanation:"Variance gauges the uncertainty or volatility of a random variable's outcomes."},{id:"spearman-rank-ties",stepLabel:"57.1",group:"Rank with ties",title:"Rank Data with Ties",concept:"Spearman correlation uses ranks. Tied values receive the average of the ranks they would have otherwise spanned.",objective:"Assign fractional ranks to elements in an array, handling ties correctly.",difficulty:"core",starterCode:`function rankData(arr) {
  const sorted = arr.map((val, idx) => ({ val, idx })).sort((a, b) => a.val - b.val);
  const ranks = Array(arr.length);
  
  let i = 0;
  while (i < sorted.length) {
    let j = i;
    while (j < sorted.length && sorted[j].val === sorted[i].val) {
      j++;
    }
    // TODO: assign the average rank of the tied group to ranks[sorted[k].idx]
    // The tied range is index i to j - 1. 1-based ranks span from i + 1 to j.
    // Average rank is (sum of integers from i+1 to j) / count = (i + 1 + j) / 2.
    const avgRank = 0;
    
    i = j;
  }
  return ranks;
}`,testCode:`const results = [];
function sameArr(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArr(actual, expected) });
}
check('ties ranking', rankData([10, 20, 20, 30]), [1, 2.5, 2.5, 4]);
check('no ties ranking', rankData([5, 15, 10]), [1, 3, 2]);
return results;`,hints:["Average rank of elements from i (0-indexed) to j-1 is (i + 1 + j) / 2.","Loop k from i to j-1 and set ranks[sorted[k].idx] = avgRank."],solution:`function rankData(arr) {
  const sorted = arr.map((val, idx) => ({ val, idx })).sort((a, b) => a.val - b.val);
  const ranks = Array(arr.length);
  
  let i = 0;
  while (i < sorted.length) {
    let j = i;
    while (j < sorted.length && sorted[j].val === sorted[i].val) {
      j++;
    }
    const avgRank = (i + 1 + j) / 2;
    for (let k = i; k < j; k++) {
      ranks[sorted[k].idx] = avgRank;
    }
    i = j;
  }
  return ranks;
}`,explanation:"Fractional ranking maintains continuous values for identical data attributes, preventing arbitrary skew in correlations."},{id:"spearman-rho-calc",stepLabel:"57.2",group:"Pearson on ranks",title:"Spearman Correlation Coefficient",concept:"Spearman's rank correlation evaluates monotonic relationships. It is calculated by running Pearson correlation on ranked values.",objective:"Implement Spearman rho calculation using Pearson correlation on rank-transformed inputs.",difficulty:"challenge",starterCode:`function rankData(arr) {
  const sorted = arr.map((val, idx) => ({ val, idx })).sort((a, b) => a.val - b.val);
  const ranks = Array(arr.length);
  let i = 0;
  while (i < sorted.length) {
    let j = i;
    while (j < sorted.length && sorted[j].val === sorted[i].val) j++;
    const avgRank = (i + 1 + j) / 2;
    for (let k = i; k < j; k++) ranks[sorted[k].idx] = avgRank;
    i = j;
  }
  return ranks;
}

function spearmanRho(x, y) {
  const rankX = rankData(x);
  const rankY = rankData(y);
  const n = rankX.length;
  
  let sumX = 0, sumY = 0;
  for (let i = 0; i < n; i++) {
    sumX += rankX[i];
    sumY += rankY[i];
  }
  const meanX = sumX / n;
  const meanY = sumY / n;
  
  let num = 0;
  let denX = 0;
  let denY = 0;
  
  // TODO: Compute covariance numerator and standard deviations denominators.
  // Formula: num = sum((rx - meanX) * (ry - meanY)), denX = sum((rx - meanX)^2), denY = sum((ry - meanY)^2)
  
  if (denX === 0 || denY === 0) return 0;
  return num / Math.sqrt(denX * denY);
}`,testCode:`const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('monotonic positive correlation', spearmanRho([10, 20, 30, 40], [5, 15, 25, 35]), 1.0);
check('monotonic negative correlation', spearmanRho([10, 20, 30, 40], [35, 25, 15, 5]), -1.0);
check('weak correlation', spearmanRho([10, 20, 30, 40], [10, 30, 20, 40]), 0.8);
return results;`,hints:["Loop i from 0 to n-1.","Compute dx = rankX[i] - meanX, and dy = rankY[i] - meanY.","Accumulate dx * dy in num, dx * dx in denX, and dy * dy in denY."],solution:`function rankData(arr) {
  const sorted = arr.map((val, idx) => ({ val, idx })).sort((a, b) => a.val - b.val);
  const ranks = Array(arr.length);
  let i = 0;
  while (i < sorted.length) {
    let j = i;
    while (j < sorted.length && sorted[j].val === sorted[i].val) j++;
    const avgRank = (i + 1 + j) / 2;
    for (let k = i; k < j; k++) ranks[sorted[k].idx] = avgRank;
    i = j;
  }
  return ranks;
}

function spearmanRho(x, y) {
  const rankX = rankData(x);
  const rankY = rankData(y);
  const n = rankX.length;
  
  let sumX = 0, sumY = 0;
  for (let i = 0; i < n; i++) {
    sumX += rankX[i];
    sumY += rankY[i];
  }
  const meanX = sumX / n;
  const meanY = sumY / n;
  
  let num = 0;
  let denX = 0;
  let denY = 0;
  
  for (let i = 0; i < n; i++) {
    const dx = rankX[i] - meanX;
    const dy = rankY[i] - meanY;
    num += dx * dy;
    denX += dx * dx;
    denY += dy * dy;
  }
  
  if (denX === 0 || denY === 0) return 0;
  return num / Math.sqrt(denX * denY);
}`,explanation:"Spearman correlation detects monotonic non-linear relationships, making it less sensitive to outliers than Pearson correlation."}],V=[{id:"rl-one-step-return",stepLabel:"58.1",group:"One-step return",title:"One-Step Expected Return",concept:"In reinforcement learning, the state-action value can be estimated using the immediate reward and the discounted future value of the next state.",objective:"Compute the one-step temporal difference return: r + gamma * nextValue.",difficulty:"warmup",starterCode:`function oneStepReturn(reward, nextValue, gamma) {
  // TODO: compute and return r + gamma * nextValue
  return 0;
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('normal return', oneStepReturn(2.0, 10.0, 0.9), 11.0);
check('zero discount', oneStepReturn(5.0, 10.0, 0.0), 5.0);
return results;`,hints:["Multiply nextValue by gamma, then add reward.","return reward + gamma * nextValue;"],solution:`function oneStepReturn(reward, nextValue, gamma) {
  return reward + gamma * nextValue;
}`,explanation:"The one-step return is the fundamental building block of TD learning and Bellman backups."},{id:"rl-discount-chain-calc",stepLabel:"58.2",group:"Discount chain",title:"Discounted Episode Return",concept:"The total discounted return of an episode trajectory is the sum of rewards weighted by exponentially decaying discount factor: G = sum(gamma^t * r_t).",objective:"Calculate the total discounted return for a list of rewards.",difficulty:"core",starterCode:`function discountedReturn(rewards, gamma) {
  let g = 0;
  // TODO: compute the sum of gamma^t * rewards[t] for t from 0 to rewards.length - 1
  return g;
}`,testCode:`const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('decaying rewards', discountedReturn([1, 2, 4], 0.5), 3.0);
return results;`,hints:["Use a loop. Keep track of the current discount factor power, starting at 1 (gamma^0).","For each step, add rewards[t] * discount to g, then set discount *= gamma."],solution:`function discountedReturn(rewards, gamma) {
  let g = 0;
  let discount = 1;
  for (let t = 0; t < rewards.length; t++) {
    g += discount * rewards[t];
    discount *= gamma;
  }
  return g;
}`,explanation:"Discounting weights immediate rewards higher than future ones, representing urgency or uncertainty in long-term outcomes."},{id:"mdp-transition-sum",stepLabel:"59.1",group:"Transition sum",title:"Transition Probability Verification",concept:"An MDP transition model maps state-action pairs to a probability distribution over next states. The sum of these probabilities must be exactly 1.",objective:"Verify that transition probabilities sum to 1 within a small numeric tolerance.",difficulty:"warmup",starterCode:`function verifyTransitionDistribution(probs) {
  let sum = 0;
  for (let i = 0; i < probs.length; i++) {
    // TODO: accumulate probabilities
    sum += 0;
  }
  return Math.abs(sum - 1.0) < 1e-5;
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('valid distribution', verifyTransitionDistribution([0.1, 0.6, 0.3]), true);
check('invalid distribution', verifyTransitionDistribution([0.1, 0.6, 0.2]), false);
return results;`,hints:["Accumulate probs[i] into sum.","sum += probs[i];"],solution:`function verifyTransitionDistribution(probs) {
  let sum = 0;
  for (let i = 0; i < probs.length; i++) {
    sum += probs[i];
  }
  return Math.abs(sum - 1.0) < 1e-5;
}`,explanation:"Transition dynamics must form a valid probability distribution to conserve system state dynamics."},{id:"mdp-bellman-expectation-calc",stepLabel:"59.2",group:"Gamma discount",title:"Bellman Expectation Backup",concept:"The Bellman Expectation Equation expresses the value of a state under policy pi: V(s) = sum_a pi(a|s) sum_s' P(s'|s,a) [R(s,a,s') + gamma * V(s')].",objective:"Implement the nested expectation backup sum.",difficulty:"core",starterCode:`function bellmanExpectation(pi, P, R, V, gamma, numActions, numStates, stateIdx) {
  let vState = 0;
  
  for (let a = 0; a < numActions; a++) {
    const actionProb = pi[stateIdx][a];
    let qAction = 0;
    
    for (let sNext = 0; sNext < numStates; sNext++) {
      const transProb = P[stateIdx][a][sNext];
      const reward = R[stateIdx][a][sNext];
      const nextVal = V[sNext];
      
      // TODO: accumulate the expected return component into qAction
      qAction += 0;
    }
    
    vState += actionProb * qAction;
  }
  
  return vState;
}`,testCode:`const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const pi = [[0.5, 0.5]];
const P = [[[0.8, 0.2], [0.1, 0.9]]];
const R = [[[10, 0], [0, 20]]];
const V = [5, 10];
check('expectation backup', bellmanExpectation(pi, P, R, V, 0.9, 2, 2, 0), 19.975);
return results;`,hints:["The component is transProb * (reward + gamma * nextVal).","qAction += transProb * (reward + gamma * nextVal);"],solution:`function bellmanExpectation(pi, P, R, V, gamma, numActions, numStates, stateIdx) {
  let vState = 0;
  
  for (let a = 0; a < numActions; a++) {
    const actionProb = pi[stateIdx][a];
    let qAction = 0;
    
    for (let sNext = 0; sNext < numStates; sNext++) {
      const transProb = P[stateIdx][a][sNext];
      const reward = R[stateIdx][a][sNext];
      const nextVal = V[sNext];
      
      qAction += transProb * (reward + gamma * nextVal);
    }
    
    vState += actionProb * qAction;
  }
  
  return vState;
}`,explanation:"The Bellman expectation equation defines a linear mapping whose unique fixed point is the true state-value function under policy pi."},{id:"vi-q-value-calc",stepLabel:"60.1",group:"Max over actions",title:"Value Iteration Action Value",concept:"Value iteration updates states by maximizing action-values (Q-values) directly: Q(s,a) = sum_s' P(s'|s,a) [R(s,a,s') + gamma * V(s')].",objective:"Compute the Q-value for a specific action state transition.",difficulty:"warmup",starterCode:`function computeQValue(P, R, V, state, action, gamma, numStates) {
  let qValue = 0;
  for (let sNext = 0; sNext < numStates; sNext++) {
    const transProb = P[state][action][sNext];
    const reward = R[state][action][sNext];
    const nextVal = V[sNext];
    // TODO: accumulate transition return in qValue
    qValue += 0;
  }
  return qValue;
}`,testCode:`const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const P = [[[0.8, 0.2]]];
const R = [[[10, 0]]];
const V = [5, 10];
check('compute action Q', computeQValue(P, R, V, 0, 0, 0.9, 2), 13.4);
return results;`,hints:["Add transProb * (reward + gamma * nextVal) to qValue."],solution:`function computeQValue(P, R, V, state, action, gamma, numStates) {
  let qValue = 0;
  for (let sNext = 0; sNext < numStates; sNext++) {
    const transProb = P[state][action][sNext];
    const reward = R[state][action][sNext];
    const nextVal = V[sNext];
    qValue += transProb * (reward + gamma * nextVal);
  }
  return qValue;
}`,explanation:"Action values represent expected discounted utilities, forming the basis for policy choices."},{id:"vi-backup-once",stepLabel:"60.2",group:"Backup once",title:"Value Iteration Update",concept:"One step of value iteration updates V(s) by taking the maximum Q-value over all actions: V(s) = max_a Q(s,a).",objective:"Compute the updated value V(s) by choosing the optimal action.",difficulty:"core",starterCode:`function valueIterationUpdate(P, R, V, state, gamma, numActions, numStates) {
  let maxQ = -Infinity;
  
  for (let a = 0; a < numActions; a++) {
    let qValue = 0;
    for (let sNext = 0; sNext < numStates; sNext++) {
      qValue += P[state][a][sNext] * (R[state][a][sNext] + gamma * V[sNext]);
    }
    // TODO: update maxQ if qValue is larger
  }
  
  return maxQ;
}`,testCode:`const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const P = [[[0.8, 0.2], [0.1, 0.9]]];
const R = [[[10, 0], [0, 20]]];
const V = [5, 10];
check('value iteration update', valueIterationUpdate(P, R, V, 0, 0.9, 2, 2), 26.55);
return results;`,hints:["If qValue > maxQ, update maxQ = qValue."],solution:`function valueIterationUpdate(P, R, V, state, gamma, numActions, numStates) {
  let maxQ = -Infinity;
  
  for (let a = 0; a < numActions; a++) {
    let qValue = 0;
    for (let sNext = 0; sNext < numStates; sNext++) {
      qValue += P[state][a][sNext] * (R[state][a][sNext] + gamma * V[sNext]);
    }
    if (qValue > maxQ) {
      maxQ = qValue;
    }
  }
  
  return maxQ;
}`,explanation:"Value iteration converges to the optimal state-value function, bypassing explicit policy representations."},{id:"pi-eval-step-calc",stepLabel:"61.1",group:"Eval backup",title:"Policy Evaluation Step",concept:"Policy evaluation solves Bellman equations for a fixed policy: V_k+1(s) = sum_s' P(s'|s, pi(s)) [R(s, pi(s), s') + gamma * V_k(s')].",objective:"Compute one policy evaluation step update for state s.",difficulty:"warmup",starterCode:`function policyEvalStep(pi, P, R, V, state, gamma, numStates) {
  const action = pi[state];
  let newValue = 0;
  
  for (let sNext = 0; sNext < numStates; sNext++) {
    const transProb = P[state][action][sNext];
    const reward = R[state][action][sNext];
    const nextVal = V[sNext];
    // TODO: accumulate expected utility in newValue
    newValue += 0;
  }
  
  return newValue;
}`,testCode:`const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const pi = [1];
const P = [[[0.8, 0.2], [0.1, 0.9]]];
const R = [[[10, 0], [0, 20]]];
const V = [5, 10];
check('eval backup action 1', policyEvalStep(pi, P, R, V, 0, 0.9, 2), 26.55);
return results;`,hints:["Multiply transProb by (reward + gamma * nextVal) and add to newValue."],solution:`function policyEvalStep(pi, P, R, V, state, gamma, numStates) {
  const action = pi[state];
  let newValue = 0;
  
  for (let sNext = 0; sNext < numStates; sNext++) {
    const transProb = P[state][action][sNext];
    const reward = R[state][action][sNext];
    const nextVal = V[sNext];
    newValue += transProb * (reward + gamma * nextVal);
  }
  
  return newValue;
}`,explanation:"Evaluating policies determines their exact utility values, guiding directional improvements."},{id:"pi-greedy-improve",stepLabel:"61.2",group:"Greedy improve",title:"Policy Improvement Step",concept:"Policy improvement creates a better policy by acting greedily with respect to current state-values: pi'(s) = argmax_a Q(s,a).",objective:"Select the optimal action index that maximizes Q-values.",difficulty:"core",starterCode:`function policyImprovement(P, R, V, state, gamma, numActions, numStates) {
  let bestAction = 0;
  let maxQ = -Infinity;
  
  for (let a = 0; a < numActions; a++) {
    let qValue = 0;
    for (let sNext = 0; sNext < numStates; sNext++) {
      qValue += P[state][a][sNext] * (R[state][a][sNext] + gamma * V[sNext]);
    }
    // TODO: if qValue > maxQ, update maxQ and bestAction
  }
  
  return bestAction;
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
const P = [[[0.8, 0.2], [0.1, 0.9]]];
const R = [[[10, 0], [0, 20]]];
const V = [5, 10];
check('greedy improvement', policyImprovement(P, R, V, 0, 0.9, 2, 2), 1);
return results;`,hints:["If qValue is strictly greater than maxQ, update maxQ = qValue and set bestAction = a."],solution:`function policyImprovement(P, R, V, state, gamma, numActions, numStates) {
  let bestAction = 0;
  let maxQ = -Infinity;
  
  for (let a = 0; a < numActions; a++) {
    let qValue = 0;
    for (let sNext = 0; sNext < numStates; sNext++) {
      qValue += P[state][a][sNext] * (R[state][a][sNext] + gamma * V[sNext]);
    }
    if (qValue > maxQ) {
      maxQ = qValue;
      bestAction = a;
    }
  }
  
  return bestAction;
}`,explanation:"Policy improvement guarantees monotonic policy utility increases, concluding when the policy becomes optimal."},{id:"q-learning-select-action",stepLabel:"62.1",group:"Epsilon-greedy selection",title:"Epsilon-Greedy Action Selection",concept:"Q-learning balances exploration and exploitation inside every agent step. With probability epsilon, pick a random action; otherwise pick the argmax Q-value for the current state.",objective:"Inside qLearningStep, implement epsilon-greedy action selection from qTable[state].",difficulty:"warmup",starterCode:`/**
 * Runs one tabular Q-learning transition: select an action, compute TD target, update Q in-place.
 * @param {number[][]} qTable - Q(state, action) table updated in-place.
 * @param {number} state - Current state index.
 * @param {number} reward - Immediate reward after the transition.
 * @param {number} nextState - Successor state index (ignored when terminal).
 * @param {boolean} isTerminal - Whether nextState ends the episode.
 * @param {number} alpha - Learning rate for the TD update.
 * @param {number} gamma - Discount factor for future returns.
 * @param {number} epsilon - Exploration probability.
 * @param {number} randVal - Uniform random value in [0, 1) for explore/exploit.
 * @param {number} randAction - Random action index used when exploring.
 * @returns {{ action: number, updatedQ: number }} Selected action and updated Q(state, action).
 */
function qLearningStep(qTable, state, reward, nextState, isTerminal, alpha, gamma, epsilon, randVal, randAction) {
  const qValues = qTable[state];
  if (qValues.length === 0) {
    return { action: 0, updatedQ: 0 };
  }

  let action = 0;
  // TODO: epsilon-greedy — explore with randAction when randVal < epsilon, else argmax qValues.

  const currentQ = qValues[action];
  let tdTarget = reward;
  if (!isTerminal) {
    const nextQValues = qTable[nextState];
    let maxNextQ = nextQValues[0];
    for (let i = 1; i < nextQValues.length; i++) {
      if (nextQValues[i] > maxNextQ) maxNextQ = nextQValues[i];
    }
    tdTarget = reward + gamma * maxNextQ;
  }

  qTable[state][action] = currentQ;
  return { action, updatedQ: qTable[state][action] };
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
const table = [[1.5, 3.0, 2.0], [0.0, 0.0]];
check('explore random choice', qLearningStep(table, 0, 0, 0, false, 0.1, 0.9, 0.2, 0.1, 0).action, 0);
check('exploit best choice', qLearningStep(table, 0, 0, 0, false, 0.1, 0.9, 0.2, 0.5, 1).action, 1);
check('exploit with negatives', qLearningStep([[ -5, -2, -10 ]], 0, 0, 0, true, 0.1, 0.9, 0.1, 0.3, 2).action, 1);
check('explore boundary', qLearningStep([[1, 2]], 0, 0, 0, true, 0.1, 0.9, 0.5, 0.499, 1).action, 1);
return results;`,hints:["If randVal < epsilon, return randAction as the selected action.","Otherwise scan qValues for the index of the maximum value.","Initialize maxIdx = 0 and update when qValues[i] > qValues[maxIdx]."],solution:`/**
 * Runs one tabular Q-learning transition: select an action, compute TD target, update Q in-place.
 * @param {number[][]} qTable - Q(state, action) table updated in-place.
 * @param {number} state - Current state index.
 * @param {number} reward - Immediate reward after the transition.
 * @param {number} nextState - Successor state index (ignored when terminal).
 * @param {boolean} isTerminal - Whether nextState ends the episode.
 * @param {number} alpha - Learning rate for the TD update.
 * @param {number} gamma - Discount factor for future returns.
 * @param {number} epsilon - Exploration probability.
 * @param {number} randVal - Uniform random value in [0, 1) for explore/exploit.
 * @param {number} randAction - Random action index used when exploring.
 * @returns {{ action: number, updatedQ: number }} Selected action and updated Q(state, action).
 */
function qLearningStep(qTable, state, reward, nextState, isTerminal, alpha, gamma, epsilon, randVal, randAction) {
  const qValues = qTable[state];
  if (qValues.length === 0) {
    return { action: 0, updatedQ: 0 };
  }

  let action = 0;
  if (randVal < epsilon) {
    action = randAction;
  } else {
    let maxIdx = 0;
    for (let i = 1; i < qValues.length; i++) {
      if (qValues[i] > qValues[maxIdx]) maxIdx = i;
    }
    action = maxIdx;
  }

  const currentQ = qValues[action];
  let tdTarget = reward;
  if (!isTerminal) {
    const nextQValues = qTable[nextState];
    let maxNextQ = nextQValues[0];
    for (let i = 1; i < nextQValues.length; i++) {
      if (nextQValues[i] > maxNextQ) maxNextQ = nextQValues[i];
    }
    tdTarget = reward + gamma * maxNextQ;
  }

  qTable[state][action] = currentQ;
  return { action, updatedQ: qTable[state][action] };
}`,explanation:"Epsilon-greedy selection is the first decision inside every Q-learning step before the TD update runs."},{id:"q-learning-td-target",stepLabel:"62.2",group:"Terminal-aware TD target",title:"Terminal-Aware TD Target",concept:"The TD target is reward plus discounted best next-state value. Terminal transitions have no future actions, so the target collapses to reward alone.",objective:"Inside qLearningStep, compute tdTarget = reward + gamma * maxNextQ only when the transition is not terminal.",difficulty:"core",starterCode:`/**
 * Runs one tabular Q-learning transition: select an action, compute TD target, update Q in-place.
 * @param {number[][]} qTable - Q(state, action) table updated in-place.
 * @param {number} state - Current state index.
 * @param {number} reward - Immediate reward after the transition.
 * @param {number} nextState - Successor state index (ignored when terminal).
 * @param {boolean} isTerminal - Whether nextState ends the episode.
 * @param {number} alpha - Learning rate for the TD update.
 * @param {number} gamma - Discount factor for future returns.
 * @param {number} epsilon - Exploration probability.
 * @param {number} randVal - Uniform random value in [0, 1) for explore/exploit.
 * @param {number} randAction - Random action index used when exploring.
 * @returns {{ action: number, updatedQ: number }} Selected action and updated Q(state, action).
 */
function qLearningStep(qTable, state, reward, nextState, isTerminal, alpha, gamma, epsilon, randVal, randAction) {
  const qValues = qTable[state];
  if (qValues.length === 0) {
    return { action: 0, updatedQ: 0 };
  }

  let action = 0;
  if (randVal < epsilon) {
    action = randAction;
  } else {
    let maxIdx = 0;
    for (let i = 1; i < qValues.length; i++) {
      if (qValues[i] > qValues[maxIdx]) maxIdx = i;
    }
    action = maxIdx;
  }

  const currentQ = qValues[action];
  let tdTarget = reward;
  if (!isTerminal) {
    const nextQValues = qTable[nextState];
    let maxNextQ = nextQValues[0];
    for (let i = 1; i < nextQValues.length; i++) {
      if (nextQValues[i] > maxNextQ) maxNextQ = nextQValues[i];
    }
    // TODO: set tdTarget = reward + gamma * maxNextQ for non-terminal transitions.
  }

  qTable[state][action] = currentQ + alpha * (tdTarget - currentQ);
  return { action, updatedQ: qTable[state][action] };
}`,testCode:`const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const nonTerminal = [[0, 0], [5, 10, 3]];
const out1 = qLearningStep(nonTerminal, 0, 2.0, 1, false, 1.0, 0.9, 0, 0, 0);
check('non-terminal td target with alpha=1', out1.updatedQ, 11.0);
const terminal = [[0, 0], [4, 4]];
const out2 = qLearningStep(terminal, 0, 1.5, 1, true, 1.0, 0.9, 0, 0, 0);
check('terminal td target is reward only', out2.updatedQ, 1.5);
const zeroGamma = [[0], [10, 20]];
const out3 = qLearningStep(zeroGamma, 0, 3.0, 1, false, 1.0, 0.0, 0, 0, 0);
check('zero discount ignores future', out3.updatedQ, 3.0);
return results;`,hints:["Inside the !isTerminal branch, tdTarget should include the discounted best next Q-value.","Use tdTarget = reward + gamma * maxNextQ.","Terminal transitions keep tdTarget = reward."],solution:`/**
 * Runs one tabular Q-learning transition: select an action, compute TD target, update Q in-place.
 * @param {number[][]} qTable - Q(state, action) table updated in-place.
 * @param {number} state - Current state index.
 * @param {number} reward - Immediate reward after the transition.
 * @param {number} nextState - Successor state index (ignored when terminal).
 * @param {boolean} isTerminal - Whether nextState ends the episode.
 * @param {number} alpha - Learning rate for the TD update.
 * @param {number} gamma - Discount factor for future returns.
 * @param {number} epsilon - Exploration probability.
 * @param {number} randVal - Uniform random value in [0, 1) for explore/exploit.
 * @param {number} randAction - Random action index used when exploring.
 * @returns {{ action: number, updatedQ: number }} Selected action and updated Q(state, action).
 */
function qLearningStep(qTable, state, reward, nextState, isTerminal, alpha, gamma, epsilon, randVal, randAction) {
  const qValues = qTable[state];
  if (qValues.length === 0) {
    return { action: 0, updatedQ: 0 };
  }

  let action = 0;
  if (randVal < epsilon) {
    action = randAction;
  } else {
    let maxIdx = 0;
    for (let i = 1; i < qValues.length; i++) {
      if (qValues[i] > qValues[maxIdx]) maxIdx = i;
    }
    action = maxIdx;
  }

  const currentQ = qValues[action];
  let tdTarget = reward;
  if (!isTerminal) {
    const nextQValues = qTable[nextState];
    let maxNextQ = nextQValues[0];
    for (let i = 1; i < nextQValues.length; i++) {
      if (nextQValues[i] > maxNextQ) maxNextQ = nextQValues[i];
    }
    tdTarget = reward + gamma * maxNextQ;
  }

  qTable[state][action] = currentQ + alpha * (tdTarget - currentQ);
  return { action, updatedQ: qTable[state][action] };
}`,explanation:"Terminal states must not inherit discounted successor values; the TD target becomes the immediate reward."},{id:"q-learning-update-step",stepLabel:"62.3",group:"Tabular Q-update",title:"Q-Value Temporal Difference Update",concept:"Q-learning blends the old estimate toward the TD target: Q_new = Q_old + alpha * (target - Q_old).",objective:"Inside qLearningStep, write the alpha-blending update back into qTable[state][action].",difficulty:"core",starterCode:`/**
 * Runs one tabular Q-learning transition: select an action, compute TD target, update Q in-place.
 * @param {number[][]} qTable - Q(state, action) table updated in-place.
 * @param {number} state - Current state index.
 * @param {number} reward - Immediate reward after the transition.
 * @param {number} nextState - Successor state index (ignored when terminal).
 * @param {boolean} isTerminal - Whether nextState ends the episode.
 * @param {number} alpha - Learning rate for the TD update.
 * @param {number} gamma - Discount factor for future returns.
 * @param {number} epsilon - Exploration probability.
 * @param {number} randVal - Uniform random value in [0, 1) for explore/exploit.
 * @param {number} randAction - Random action index used when exploring.
 * @returns {{ action: number, updatedQ: number }} Selected action and updated Q(state, action).
 */
function qLearningStep(qTable, state, reward, nextState, isTerminal, alpha, gamma, epsilon, randVal, randAction) {
  const qValues = qTable[state];
  if (qValues.length === 0) {
    return { action: 0, updatedQ: 0 };
  }

  let action = 0;
  if (randVal < epsilon) {
    action = randAction;
  } else {
    let maxIdx = 0;
    for (let i = 1; i < qValues.length; i++) {
      if (qValues[i] > qValues[maxIdx]) maxIdx = i;
    }
    action = maxIdx;
  }

  const currentQ = qValues[action];
  let tdTarget = reward;
  if (!isTerminal) {
    const nextQValues = qTable[nextState];
    let maxNextQ = nextQValues[0];
    for (let i = 1; i < nextQValues.length; i++) {
      if (nextQValues[i] > maxNextQ) maxNextQ = nextQValues[i];
    }
    tdTarget = reward + gamma * maxNextQ;
  }

  // TODO: update qTable[state][action] with alpha blending toward tdTarget.
  return { action, updatedQ: qTable[state][action] };
}`,testCode:`const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const table = [[4.0, 2.0], [3.0, 8.5]];
const out = qLearningStep(table, 0, 10.0, 1, true, 0.1, 0.9, 0, 0, 0);
check('alpha blend toward terminal target', out.updatedQ, 4.6);
check('table cell updated in place', table[0][0], 4.6);
const table2 = [[10.0, 1.0], [3.0, 1.0]];
const full = qLearningStep(table2, 1, 2.5, 0, true, 0.2, 0.9, 0, 0, 0);
check('second state update', full.updatedQ, 2.9);
return results;`,hints:["Use currentQ + alpha * (tdTarget - currentQ).","Assign the result to qTable[state][action].","Return the updated value in updatedQ."],solution:`/**
 * Runs one tabular Q-learning transition: select an action, compute TD target, update Q in-place.
 * @param {number[][]} qTable - Q(state, action) table updated in-place.
 * @param {number} state - Current state index.
 * @param {number} reward - Immediate reward after the transition.
 * @param {number} nextState - Successor state index (ignored when terminal).
 * @param {boolean} isTerminal - Whether nextState ends the episode.
 * @param {number} alpha - Learning rate for the TD update.
 * @param {number} gamma - Discount factor for future returns.
 * @param {number} epsilon - Exploration probability.
 * @param {number} randVal - Uniform random value in [0, 1) for explore/exploit.
 * @param {number} randAction - Random action index used when exploring.
 * @returns {{ action: number, updatedQ: number }} Selected action and updated Q(state, action).
 */
function qLearningStep(qTable, state, reward, nextState, isTerminal, alpha, gamma, epsilon, randVal, randAction) {
  const qValues = qTable[state];
  if (qValues.length === 0) {
    return { action: 0, updatedQ: 0 };
  }

  let action = 0;
  if (randVal < epsilon) {
    action = randAction;
  } else {
    let maxIdx = 0;
    for (let i = 1; i < qValues.length; i++) {
      if (qValues[i] > qValues[maxIdx]) maxIdx = i;
    }
    action = maxIdx;
  }

  const currentQ = qValues[action];
  let tdTarget = reward;
  if (!isTerminal) {
    const nextQValues = qTable[nextState];
    let maxNextQ = nextQValues[0];
    for (let i = 1; i < nextQValues.length; i++) {
      if (nextQValues[i] > maxNextQ) maxNextQ = nextQValues[i];
    }
    tdTarget = reward + gamma * maxNextQ;
  }

  qTable[state][action] = currentQ + alpha * (tdTarget - currentQ);
  return { action, updatedQ: qTable[state][action] };
}`,explanation:"The learning rate alpha low-pass filters stochastic TD targets so single transitions do not destabilize the table."},{id:"q-learning-full-step",stepLabel:"62.4",group:"Complete agent step",title:"Complete Tabular Q-Learning Step",concept:"A full agent step selects an action, bootstraps from the best next-state value when non-terminal, and writes the TD update back into the Q-table.",objective:"Verify the complete qLearningStep handles both non-terminal bootstrapping and terminal transitions in one pass.",difficulty:"challenge",starterCode:`/**
 * Runs one tabular Q-learning transition: select an action, compute TD target, update Q in-place.
 * @param {number[][]} qTable - Q(state, action) table updated in-place.
 * @param {number} state - Current state index.
 * @param {number} reward - Immediate reward after the transition.
 * @param {number} nextState - Successor state index (ignored when terminal).
 * @param {boolean} isTerminal - Whether nextState ends the episode.
 * @param {number} alpha - Learning rate for the TD update.
 * @param {number} gamma - Discount factor for future returns.
 * @param {number} epsilon - Exploration probability.
 * @param {number} randVal - Uniform random value in [0, 1) for explore/exploit.
 * @param {number} randAction - Random action index used when exploring.
 * @returns {{ action: number, updatedQ: number }} Selected action and updated Q(state, action).
 */
function qLearningStep(qTable, state, reward, nextState, isTerminal, alpha, gamma, epsilon, randVal, randAction) {
  const qValues = qTable[state];
  if (qValues.length === 0) {
    return { action: 0, updatedQ: 0 };
  }

  let action = 0;
  if (randVal < epsilon) {
    action = randAction;
  } else {
    let maxIdx = 0;
    for (let i = 1; i < qValues.length; i++) {
      if (qValues[i] > qValues[maxIdx]) maxIdx = i;
    }
    action = maxIdx;
  }

  const currentQ = qValues[action];
  let tdTarget = reward;
  if (!isTerminal) {
    const nextQValues = qTable[nextState];
    let maxNextQ = nextQValues[0];
    for (let i = 1; i < nextQValues.length; i++) {
      if (nextQValues[i] > maxNextQ) maxNextQ = nextQValues[i];
    }
    // TODO: finish the non-terminal TD target inside this full agent step.
  }

  qTable[state][action] = currentQ + alpha * (tdTarget - currentQ);
  return { action, updatedQ: qTable[state][action] };
}`,testCode:`const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const qTable = [[1.0, 2.0], [3.0, 4.0]];
const val1 = qLearningStep(qTable, 0, 1.5, 1, false, 0.5, 0.9, 0, 0, 1);
check('non-terminal full step', val1.updatedQ, 3.55);
check('non-terminal table write', qTable[0][1], 3.55);
const val2 = qLearningStep(qTable, 1, 2.5, 0, true, 0.2, 0.9, 1, 0.5, 0);
check('terminal full step', val2.updatedQ, 2.9);
check('terminal table write', qTable[1][0], 2.9);
return results;`,hints:["Non-terminal tdTarget needs reward + gamma * maxNextQ.","Terminal transitions keep tdTarget = reward.","The alpha blend and table write should already be in place from prior steps."],solution:`/**
 * Runs one tabular Q-learning transition: select an action, compute TD target, update Q in-place.
 * @param {number[][]} qTable - Q(state, action) table updated in-place.
 * @param {number} state - Current state index.
 * @param {number} reward - Immediate reward after the transition.
 * @param {number} nextState - Successor state index (ignored when terminal).
 * @param {boolean} isTerminal - Whether nextState ends the episode.
 * @param {number} alpha - Learning rate for the TD update.
 * @param {number} gamma - Discount factor for future returns.
 * @param {number} epsilon - Exploration probability.
 * @param {number} randVal - Uniform random value in [0, 1) for explore/exploit.
 * @param {number} randAction - Random action index used when exploring.
 * @returns {{ action: number, updatedQ: number }} Selected action and updated Q(state, action).
 */
function qLearningStep(qTable, state, reward, nextState, isTerminal, alpha, gamma, epsilon, randVal, randAction) {
  const qValues = qTable[state];
  if (qValues.length === 0) {
    return { action: 0, updatedQ: 0 };
  }

  let action = 0;
  if (randVal < epsilon) {
    action = randAction;
  } else {
    let maxIdx = 0;
    for (let i = 1; i < qValues.length; i++) {
      if (qValues[i] > qValues[maxIdx]) maxIdx = i;
    }
    action = maxIdx;
  }

  const currentQ = qValues[action];
  let tdTarget = reward;
  if (!isTerminal) {
    const nextQValues = qTable[nextState];
    let maxNextQ = nextQValues[0];
    for (let i = 1; i < nextQValues.length; i++) {
      if (nextQValues[i] > maxNextQ) maxNextQ = nextQValues[i];
    }
    tdTarget = reward + gamma * maxNextQ;
  }

  qTable[state][action] = currentQ + alpha * (tdTarget - currentQ);
  return { action, updatedQ: qTable[state][action] };
}`,explanation:"Integrating exploration, bootstrapping, terminal handling, and in-place table updates is the core tabular Q-learning agent step."},{id:"exploration-epsilon-greedy",stepLabel:"63.1",group:"Epsilon mix",title:"Epsilon-Greedy Exploration",concept:"Epsilon-greedy explores by choosing random actions with probability epsilon, and exploiting best actions otherwise.",objective:"Select action index according to epsilon-greedy selection probabilities.",difficulty:"warmup",starterCode:`function selectAction(qValues, epsilon, randomVal, randomActionIdx) {
  // randomVal is a float in [0, 1)
  // randomActionIdx is a random action index in [0, qValues.length - 1]
  // TODO: return randomActionIdx if randomVal < epsilon.
  // Otherwise, return index of action with highest value in qValues.
  return 0;
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('explore random choice', selectAction([1.5, 3.0, 2.0], 0.2, 0.1, 0), 0);
check('exploit best choice', selectAction([1.5, 3.0, 2.0], 0.2, 0.5, 0), 1);
return results;`,hints:["Check if randomVal < epsilon.","If true, return randomActionIdx.","Else find index associated with maximum value in qValues."],solution:`function selectAction(qValues, epsilon, randomVal, randomActionIdx) {
  if (randomVal < epsilon) {
    return randomActionIdx;
  }
  let bestIdx = 0;
  let maxVal = qValues[0];
  for (let i = 1; i < qValues.length; i++) {
    if (qValues[i] > maxVal) {
      maxVal = qValues[i];
      bestIdx = i;
    }
  }
  return bestIdx;
}`,explanation:"Epsilon-greedy acts as a simple mechanism balancing exploratory sample gathering against utility exploitation."},{id:"exploration-ucb-score",stepLabel:"63.2",group:"UCB formula",title:"UCB1 Score Calculation",concept:"The Upper Confidence Bound (UCB1) formula selects actions by adding an uncertainty bonus: Score = mean + c * sqrt(ln(t) / n).",objective:"Calculate the UCB1 score for an action.",difficulty:"core",starterCode:`function getUcbScore(mean, n, t, c = 2.0) {
  if (n === 0) return Infinity;
  // TODO: compute and return mean + c * sqrt(ln(t) / n)
  return 0;
}`,testCode:`const results = [];
function approxEqual(a, b, tol = 1e-4) {
  if (a === Infinity && b === Infinity) return true;
  return Math.abs(a - b) <= tol;
}
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('unvisited action', getUcbScore(5, 0, 100), Infinity);
check('visited action score', getUcbScore(3.5, 10, 100, 2.0), 4.857228);
return results;`,hints:["If n is 0, return Infinity.","The math is: mean + c * Math.sqrt(Math.log(t) / n)."],solution:`function getUcbScore(mean, n, t, c = 2.0) {
  if (n === 0) return Infinity;
  return mean + c * Math.sqrt(Math.log(t) / n);
}`,explanation:"UCB implements optimism in the face of uncertainty, choosing actions that are either high performing or highly uncertain."},{id:"pg-baseline-subtract",stepLabel:"64.1",group:"Baseline subtract",title:"Policy Gradient Baseline Subtraction",concept:"Subtracting a state baseline V(s) from returns reduces gradient variance without altering expectation values.",objective:"Compute the policy gradient surrogate scalar multiplier: returnVal - baseline.",difficulty:"warmup",starterCode:`function computeAdvantage(returnVal, baseline) {
  // TODO: return returnVal - baseline
  return 0;
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('positive advantage', computeAdvantage(10.0, 7.5), 2.5);
check('negative advantage', computeAdvantage(5.0, 7.5), -2.5);
return results;`,hints:["Subtract baseline from returnVal.","return returnVal - baseline;"],solution:`function computeAdvantage(returnVal, baseline) {
  return returnVal - baseline;
}`,explanation:"Advantage measures whether actions performed better or worse than the baseline average expected output."},{id:"pg-surrogate-loss",stepLabel:"64.2",group:"Return multiply",title:"Policy Gradient Surrogate Gradient Weight",concept:"Surrogate gradient targets multiply log probability gradients by the advantage value: Grad_Weight = log_prob_gradient * advantage.",objective:"Compute the surrogate gradient weight.",difficulty:"core",starterCode:`function getPolicyGradientWeight(logProbGrad, returnVal, baseline) {
  const advantage = returnVal - baseline;
  // TODO: return logProbGrad multiplied by advantage
  return 0;
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('positive scale step', getPolicyGradientWeight(0.5, 10.0, 6.0), 2.0);
check('negative scale step', getPolicyGradientWeight(0.5, 2.0, 6.0), -2.0);
return results;`,hints:["Multiply logProbGrad by advantage."],solution:`function getPolicyGradientWeight(logProbGrad, returnVal, baseline) {
  const advantage = returnVal - baseline;
  return logProbGrad * advantage;
}`,explanation:"Surrogate weights scale parameter updates, promoting actions with positive advantage and suppressing those with negative advantage."},{id:"ac-td-error-calc",stepLabel:"65.1",group:"TD error",title:"Actor-Critic TD Error",concept:"The actor-critic advantage is estimated using temporal difference error: delta = reward + gamma * nextValue - currentValue.",objective:"Compute the TD error delta.",difficulty:"warmup",starterCode:`function getActorCriticTdError(reward, currentValue, nextValue, gamma) {
  // TODO: compute and return TD error delta
  return 0;
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('positive error', getActorCriticTdError(2.0, 8.0, 10.0, 0.9), 3.0);
return results;`,hints:["Use formula: reward + gamma * nextValue - currentValue."],solution:`function getActorCriticTdError(reward, currentValue, nextValue, gamma) {
  return reward + gamma * nextValue - currentValue;
}`,explanation:"TD error acts as the critic score, assessing if events turned out better than expected."},{id:"ac-actor-loss-calc",stepLabel:"65.2",group:"Actor log grad",title:"Actor Objective Loss",concept:"Actor networks optimize parameters to maximize expectations by minimizing surrogate loss: Loss = -log_prob * advantage.",objective:"Compute the step loss value.",difficulty:"core",starterCode:`function getActorLoss(logProb, advantage) {
  // TODO: return -logProb * advantage
  return 0;
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('positive advantage loss', getActorLoss(-1.2, 2.0), 2.4);
check('negative advantage loss', getActorLoss(-1.2, -2.0), -2.4);
return results;`,hints:["Multiply logProb by advantage, and negate the result."],solution:`function getActorLoss(logProb, advantage) {
  return -logProb * advantage;
}`,explanation:"Minimizing actor loss increases selection likelihood for actions yielding positive TD error advantages."},{id:"rs-shaped-reward-calc",stepLabel:"66.1",group:"Potential phi",title:"Potential-Based Shaped Reward",concept:"Shaped rewards add potential offsets to guide exploration: F(s, a, s') = gamma * phi(s') - phi(s).",objective:"Compute potential-based shaping term F.",difficulty:"warmup",starterCode:`function getPotentialBasedShaping(phiCurrent, phiNext, gamma) {
  // TODO: compute and return gamma * phiNext - phiCurrent
  return 0;
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('potential gain', getPotentialBasedShaping(2.0, 5.0, 0.9), 2.5);
return results;`,hints:["Multiply phiNext by gamma and subtract phiCurrent."],solution:`function getPotentialBasedShaping(phiCurrent, phiNext, gamma) {
  return gamma * phiNext - phiCurrent;
}`,explanation:"Potential-based shaping guarantees that optimal policies are not altered, avoiding sub-optimal reward loops."},{id:"rs-total-step-calc",stepLabel:"66.2",group:"Total step reward",title:"Total Shaped Step Reward",concept:"The total reward sent to the agent is the raw environment reward plus the shaping potential term: R_shaped = R_raw + F.",objective:"Combine raw reward and potential shaping into one total return.",difficulty:"core",starterCode:`function totalShapedReward(rawReward, phiCurrent, phiNext, gamma) {
  // TODO: compute potential shaping and add it to rawReward
  return 0;
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('combined shaping', totalShapedReward(1.0, 2.0, 5.0, 0.9), 3.5);
return results;`,hints:["Calculate potential shaping term: gamma * phiNext - phiCurrent.","Add the potential shaping term to rawReward."],solution:`function totalShapedReward(rawReward, phiCurrent, phiNext, gamma) {
  const shaping = gamma * phiNext - phiCurrent;
  return rawReward + shaping;
}`,explanation:"Shaping rewards speed up learning significantly by providing denser feedback in sparse reward tasks."},{id:"grpo-group-mean",stepLabel:"67.1",group:"Group mean",title:"GRPO Group Mean",concept:"GRPO computes advantages by comparing student rewards against group performance averages instead of needing critic networks.",objective:"Calculate the average reward score for a group of samples.",difficulty:"warmup",starterCode:`function getGroupMean(rewards) {
  if (rewards.length === 0) return 0;
  let sum = 0;
  // TODO: compute sum of rewards and return the mean (average)
  return 0;
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('group mean average', getGroupMean([2.0, 4.0, 6.0]), 4.0);
return results;`,hints:["Loop through rewards, sum them up, and divide by rewards.length."],solution:`function getGroupMean(rewards) {
  if (rewards.length === 0) return 0;
  let sum = 0;
  for (let i = 0; i < rewards.length; i++) {
    sum += rewards[i];
  }
  return sum / rewards.length;
}`,explanation:"The group mean provides a dynamic baseline representing average sample quality under the current policy."},{id:"grpo-relative-rewards",stepLabel:"67.2",group:"Relative reward",title:"GRPO Relative Advantage",concept:"GRPO computes advantages by standardizing rewards within a generated group: A_i = (R_i - mean) / std.",objective:"Calculate group standardized advantages, handling zero-variance cases by setting advantages to zero.",difficulty:"core",starterCode:`function getGrpoAdvantages(rewards) {
  const n = rewards.length;
  if (n === 0) return [];
  
  let sum = 0;
  for (let i = 0; i < n; i++) sum += rewards[i];
  const mean = sum / n;
  
  let varSum = 0;
  for (let i = 0; i < n; i++) {
    varSum += Math.pow(rewards[i] - mean, 2);
  }
  const std = Math.sqrt(varSum / n);
  
  // TODO: compute (r - mean) / std for each reward.
  // If std is extremely small (< 1e-6), return an array of 0s.
  return [];
}`,testCode:`const results = [];
function sameArr(a, b, tol = 1e-5) {
  return a.every((v, i) => Math.abs(v - b[i]) <= tol);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArr(actual, expected) });
}
check('standard advantages', getGrpoAdvantages([2.0, 4.0, 6.0]), [-1.224744, 0.0, 1.224744]);
check('zero variance advantages', getGrpoAdvantages([4.0, 4.0]), [0.0, 0.0]);
return results;`,hints:["If std < 1e-6, return an array of 0s of length n.","Otherwise, map each reward r to (r - mean) / std."],solution:`function getGrpoAdvantages(rewards) {
  const n = rewards.length;
  if (n === 0) return [];
  
  let sum = 0;
  for (let i = 0; i < n; i++) sum += rewards[i];
  const mean = sum / n;
  
  let varSum = 0;
  for (let i = 0; i < n; i++) {
    varSum += Math.pow(rewards[i] - mean, 2);
  }
  const std = Math.sqrt(varSum / n);
  
  if (std < 1e-6) {
    return Array(n).fill(0);
  }
  return rewards.map(r => (r - mean) / std);
}`,explanation:"Standardizing group rewards creates a relative ranking, directing updates strictly toward the top-performing answers."},{id:"dapo-reward-clip-calc",stepLabel:"68.1",group:"Reward clip",title:"DAPO Reward Clipping",concept:"DAPO prevents policy collapse at scale by clipping reward outliers so gradient scales remain bounded.",objective:"Clip input reward values to stay inside range [low, high].",difficulty:"warmup",starterCode:`function dapoClipReward(r, low, high) {
  // TODO: return r clipped between low and high
  return r;
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('under upper limit', dapoClipReward(1.5, -2.0, 2.0), 1.5);
check('clipped upper limit', dapoClipReward(3.5, -2.0, 2.0), 2.0);
check('clipped lower limit', dapoClipReward(-3.0, -2.0, 2.0), -2.0);
return results;`,hints:["Use Math.max and Math.min.","return Math.max(low, Math.min(high, r));"],solution:`function dapoClipReward(r, low, high) {
  return Math.max(low, Math.min(high, r));
}`,explanation:"Restricting outlier feedback prevents individual extreme rollouts from overriding learning gradients."},{id:"dapo-decoupled-advantage-calc",stepLabel:"68.2",group:"Decoupled baseline",title:"DAPO Decoupled Advantage",concept:"DAPO decouples policy updates from the reference policy using KL penalties: A_dapo = reward - beta * log(pi(a|s) / ref_pi(a|s)).",objective:"Compute decoupled advantage.",difficulty:"core",starterCode:`function dapoDecoupledAdvantage(reward, probPolicy, probRef, beta) {
  // TODO: compute and return reward - beta * log(probPolicy / probRef)
  return 0;
}`,testCode:`const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('decoupled advantage', dapoDecoupledAdvantage(2.0, 0.8, 0.4, 0.5), 1.653426);
return results;`,hints:["Compute ratio: probPolicy / probRef.","Subtract beta * Math.log(ratio) from reward."],solution:`function dapoDecoupledAdvantage(reward, probPolicy, probRef, beta) {
  return reward - beta * Math.log(probPolicy / probRef);
}`,explanation:"Decoupling penalizes shifts away from reference distributions, maintaining training stability at scale."},{id:"mc-transition-multiply",stepLabel:"69.1",group:"One-step multiply",title:"Markov Transition Step",concept:"A Markov chain steps forward by multiplying the current probability state vector by the transition matrix: p_next = p_current * P.",objective:"Compute the 1-step successor state probability distribution.",difficulty:"warmup",starterCode:`function transitionStep(stateDist, transitionMatrix) {
  const n = stateDist.length;
  const nextDist = Array(n).fill(0);
  
  for (let j = 0; j < n; j++) {
    let sum = 0;
    for (let i = 0; i < n; i++) {
      // TODO: multiply stateDist[i] by transitionMatrix[i][j] and accumulate in sum
      sum += 0;
    }
    nextDist[j] = sum;
  }
  
  return nextDist;
}`,testCode:`const results = [];
function sameArr(a, b, tol = 1e-5) {
  return a.every((v, i) => Math.abs(v - b[i]) <= tol);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArr(actual, expected) });
}
const dist = [0.6, 0.4];
const P = [
  [0.7, 0.3],
  [0.4, 0.6]
];
check('transition multiply', transitionStep(dist, P), [0.58, 0.42]);
return results;`,hints:["Multiply stateDist[i] by transitionMatrix[i][j].","sum += stateDist[i] * transitionMatrix[i][j];"],solution:`function transitionStep(stateDist, transitionMatrix) {
  const n = stateDist.length;
  const nextDist = Array(n).fill(0);
  
  for (let j = 0; j < n; j++) {
    let sum = 0;
    for (let i = 0; i < n; i++) {
      sum += stateDist[i] * transitionMatrix[i][j];
    }
    nextDist[j] = sum;
  }
  
  return nextDist;
}`,explanation:"Succcessor states are linear combinations of predecessor states weighted by transition probabilities."},{id:"mc-stationary-check-step",stepLabel:"69.2",group:"Stationary",title:"Stationary Distribution Verification",concept:"A distribution pi is stationary if it remains unchanged after transitions: pi * P === pi.",objective:"Verify if a state distribution is stationary under transition matrix P.",difficulty:"core",starterCode:`function checkStationary(pi, P, tol = 1e-5) {
  const n = pi.length;
  // TODO: Multiply pi by P to get the next distribution.
  // Then check if the absolute difference between each element of the next distribution and pi is <= tol.
  // Return true if stationary, else false.
  return false;
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
const P = [
  [0.7, 0.3],
  [0.4, 0.6]
];
check('stationary distribution', checkStationary([4/7, 3/7], P), true);
check('non-stationary distribution', checkStationary([0.6, 0.4], P), false);
return results;`,hints:["Compute next distribution nextPi using vector-matrix multiplication nextPi[j] = sum_i pi[i] * P[i][j].","Loop through j and check if Math.abs(nextPi[j] - pi[j]) > tol. If so, return false.","If all elements match, return true."],solution:`function checkStationary(pi, P, tol = 1e-5) {
  const n = pi.length;
  const nextPi = Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    let sum = 0;
    for (let i = 0; i < n; i++) {
      sum += pi[i] * P[i][j];
    }
    nextPi[j] = sum;
  }
  
  for (let i = 0; i < n; i++) {
    if (Math.abs(nextPi[i] - pi[i]) > tol) {
      return false;
    }
  }
  return true;
}`,explanation:"A stationary distribution represents the long-term steady-state probability distribution of Markov chains."}],z=[{id:"diffbasics-beta-schedule",stepLabel:"72.1",group:"Noise scale",title:"Linear Beta Schedule",concept:"Diffusion models inject noise according to a variance schedule beta_t. A linear schedule ramps from betaMin to betaMax across T steps.",objective:"Inside diffusionBasicsStep, fill the betas array with linearly spaced schedule values.",difficulty:"warmup",starterCode:`/**
 * Runs one diffusion basics forward step: beta schedule, alpha-bar accumulation, noisy sample, SNR.
 * @param {number} x0 - Clean signal value.
 * @param {number} noise - Standard normal noise sample paired with x0.
 * @param {number} t - Timestep index (0-based).
 * @param {number} totalSteps - Number of diffusion steps T.
 * @param {number} betaMin - Starting beta value.
 * @param {number} betaMax - Ending beta value.
 * @returns {{ betas: number[], alphaBars: number[], xt: number, snr: number, alphaBarT: number }} Schedule and forward sample outputs.
 */
function diffusionBasicsStep(x0, noise, t, totalSteps, betaMin, betaMax) {
  const betas = [];
  // TODO: push totalSteps linearly spaced beta values from betaMin to betaMax (single step => betaMin).

  const alphaBars = [];
  let running = 1;
  for (let i = 0; i < totalSteps; i++) {
    running *= (1 - betas[i]);
    alphaBars.push(running);
  }

  const alphaBarT = alphaBars[t];
  let xt = 0;
  xt = Math.sqrt(alphaBarT) * x0 + Math.sqrt(1 - alphaBarT) * noise;

  let snr = 0;
  snr = alphaBarT / (1 - alphaBarT);

  return { betas, alphaBars, xt, snr, alphaBarT };
}`,testCode:`const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function sameArray(a, b) { return a.length === b.length && a.every((v, i) => approxEqual(v, b[i])); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual, expected) });
}
check('beta schedule', diffusionBasicsStep(1, 0, 0, 5, 0.0001, 0.02).betas, [0.0001, 0.005075, 0.01005, 0.015025, 0.02]);
check('single step', diffusionBasicsStep(1, 0, 0, 1, 0.1, 0.2).betas, [0.1]);
return results;`,hints:["Loop i from 0 to totalSteps - 1 and push each beta.","When totalSteps === 1, push betaMin only; otherwise interpolate with i / (totalSteps - 1).","betas.push(betaMin + (totalSteps === 1 ? 0 : i / (totalSteps - 1)) * (betaMax - betaMin));"],solution:`/**
 * Runs one diffusion basics forward step: beta schedule, alpha-bar accumulation, noisy sample, SNR.
 * @param {number} x0 - Clean signal value.
 * @param {number} noise - Standard normal noise sample paired with x0.
 * @param {number} t - Timestep index (0-based).
 * @param {number} totalSteps - Number of diffusion steps T.
 * @param {number} betaMin - Starting beta value.
 * @param {number} betaMax - Ending beta value.
 * @returns {{ betas: number[], alphaBars: number[], xt: number, snr: number, alphaBarT: number }} Schedule and forward sample outputs.
 */
function diffusionBasicsStep(x0, noise, t, totalSteps, betaMin, betaMax) {
  const betas = [];
  for (let i = 0; i < totalSteps; i++) {
    const frac = totalSteps === 1 ? 0 : i / (totalSteps - 1);
    betas.push(betaMin + frac * (betaMax - betaMin));
  }

  const alphaBars = [];
  let running = 1;
  for (let i = 0; i < totalSteps; i++) {
    running *= (1 - betas[i]);
    alphaBars.push(running);
  }

  const alphaBarT = alphaBars[t];
  let xt = 0;
  xt = Math.sqrt(alphaBarT) * x0 + Math.sqrt(1 - alphaBarT) * noise;

  let snr = 0;
  snr = alphaBarT / (1 - alphaBarT);

  return { betas, alphaBars, xt, snr, alphaBarT };
}`,explanation:"The beta schedule controls how quickly noise is injected across diffusion timesteps."},{id:"diffbasics-alpha-bar",stepLabel:"72.2",group:"Alpha bar",title:"Cumulative Alpha Bar",concept:"Alpha bar is the cumulative product of (1 - beta_t). It measures how much clean signal survives at step t.",objective:"Inside diffusionBasicsStep, update the alphaBars loop so running accumulates the product of (1 - beta_i).",difficulty:"core",starterCode:`/**
 * Runs one diffusion basics forward step: beta schedule, alpha-bar accumulation, noisy sample, SNR.
 * @param {number} x0 - Clean signal value.
 * @param {number} noise - Standard normal noise sample paired with x0.
 * @param {number} t - Timestep index (0-based).
 * @param {number} totalSteps - Number of diffusion steps T.
 * @param {number} betaMin - Starting beta value.
 * @param {number} betaMax - Ending beta value.
 * @returns {{ betas: number[], alphaBars: number[], xt: number, snr: number, alphaBarT: number }} Schedule and forward sample outputs.
 */
function diffusionBasicsStep(x0, noise, t, totalSteps, betaMin, betaMax) {
  const betas = [];
  for (let i = 0; i < totalSteps; i++) {
    const frac = totalSteps === 1 ? 0 : i / (totalSteps - 1);
    betas.push(betaMin + frac * (betaMax - betaMin));
  }

  const alphaBars = [];
  let running = 1;
  for (let i = 0; i < totalSteps; i++) {
    // TODO: multiply running by (1 - betas[i]) and push the updated running value.
    alphaBars.push(running);
  }

  const alphaBarT = alphaBars[t];
  let xt = 0;
  xt = Math.sqrt(alphaBarT) * x0 + Math.sqrt(1 - alphaBarT) * noise;

  let snr = 0;
  snr = alphaBarT / (1 - alphaBarT);

  return { betas, alphaBars, xt, snr, alphaBarT };
}`,testCode:`const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function sameArray(a, b) { return a.length === b.length && a.every((v, i) => approxEqual(v, b[i])); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual, expected) });
}
const out = diffusionBasicsStep(1, 0, 2, 3, 0.1, 0.3);
check('alpha bars', out.alphaBars, [0.9, 0.9 * 0.8, 0.9 * 0.8 * 0.7]);
check('alpha bar at t', out.alphaBarT, 0.9 * 0.8 * 0.7);
return results;`,hints:["Before pushing, update running *= (1 - betas[i]).","Push running after each multiplication.","Alpha bar at step i is the product of all (1 - beta_j) for j <= i."],solution:`/**
 * Runs one diffusion basics forward step: beta schedule, alpha-bar accumulation, noisy sample, SNR.
 * @param {number} x0 - Clean signal value.
 * @param {number} noise - Standard normal noise sample paired with x0.
 * @param {number} t - Timestep index (0-based).
 * @param {number} totalSteps - Number of diffusion steps T.
 * @param {number} betaMin - Starting beta value.
 * @param {number} betaMax - Ending beta value.
 * @returns {{ betas: number[], alphaBars: number[], xt: number, snr: number, alphaBarT: number }} Schedule and forward sample outputs.
 */
function diffusionBasicsStep(x0, noise, t, totalSteps, betaMin, betaMax) {
  const betas = [];
  for (let i = 0; i < totalSteps; i++) {
    const frac = totalSteps === 1 ? 0 : i / (totalSteps - 1);
    betas.push(betaMin + frac * (betaMax - betaMin));
  }

  const alphaBars = [];
  let running = 1;
  for (let i = 0; i < totalSteps; i++) {
    running *= (1 - betas[i]);
    alphaBars.push(running);
  }

  const alphaBarT = alphaBars[t];
  let xt = 0;
  xt = Math.sqrt(alphaBarT) * x0 + Math.sqrt(1 - alphaBarT) * noise;

  let snr = 0;
  snr = alphaBarT / (1 - alphaBarT);

  return { betas, alphaBars, xt, snr, alphaBarT };
}`,explanation:"Cumulative alpha bars let us sample x_t in closed form without unrolling the forward chain."},{id:"diffbasics-forward-sample",stepLabel:"72.3",group:"Forward sample",title:"Forward Diffusion Sample",concept:"The forward process samples x_t directly from x_0: x_t = sqrt(alpha_bar_t) * x_0 + sqrt(1 - alpha_bar_t) * noise.",objective:"Inside diffusionBasicsStep, compute xt from x0, noise, and alphaBarT.",difficulty:"core",starterCode:`/**
 * Runs one diffusion basics forward step: beta schedule, alpha-bar accumulation, noisy sample, SNR.
 * @param {number} x0 - Clean signal value.
 * @param {number} noise - Standard normal noise sample paired with x0.
 * @param {number} t - Timestep index (0-based).
 * @param {number} totalSteps - Number of diffusion steps T.
 * @param {number} betaMin - Starting beta value.
 * @param {number} betaMax - Ending beta value.
 * @returns {{ betas: number[], alphaBars: number[], xt: number, snr: number, alphaBarT: number }} Schedule and forward sample outputs.
 */
function diffusionBasicsStep(x0, noise, t, totalSteps, betaMin, betaMax) {
  const betas = [];
  for (let i = 0; i < totalSteps; i++) {
    const frac = totalSteps === 1 ? 0 : i / (totalSteps - 1);
    betas.push(betaMin + frac * (betaMax - betaMin));
  }

  const alphaBars = [];
  let running = 1;
  for (let i = 0; i < totalSteps; i++) {
    running *= (1 - betas[i]);
    alphaBars.push(running);
  }

  const alphaBarT = alphaBars[t];
  let xt = 0;
  // TODO: xt = sqrt(alphaBarT) * x0 + sqrt(1 - alphaBarT) * noise

  let snr = 0;
  snr = alphaBarT / (1 - alphaBarT);

  return { betas, alphaBars, xt, snr, alphaBarT };
}`,testCode:`const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('forward matches closed form', (() => {
  const out = diffusionBasicsStep(1.5, -0.8, 5, 11, 0.1, 0.2);
  const ab = out.alphaBarT;
  return out.xt;
})(), (() => {
  const out = diffusionBasicsStep(1.5, -0.8, 5, 11, 0.1, 0.2);
  const ab = out.alphaBarT;
  return Math.sqrt(ab) * 1.5 + Math.sqrt(1 - ab) * (-0.8);
})());
check('zero noise', diffusionBasicsStep(2, 0, 0, 5, 0.0001, 0.02).xt, Math.sqrt(0.9999) * 2);
return results;`,hints:["Use Math.sqrt for alphaBarT and (1 - alphaBarT).","Scale x0 by sqrt(alphaBarT) and noise by sqrt(1 - alphaBarT).","xt = Math.sqrt(alphaBarT) * x0 + Math.sqrt(1 - alphaBarT) * noise;"],solution:`/**
 * Runs one diffusion basics forward step: beta schedule, alpha-bar accumulation, noisy sample, SNR.
 * @param {number} x0 - Clean signal value.
 * @param {number} noise - Standard normal noise sample paired with x0.
 * @param {number} t - Timestep index (0-based).
 * @param {number} totalSteps - Number of diffusion steps T.
 * @param {number} betaMin - Starting beta value.
 * @param {number} betaMax - Ending beta value.
 * @returns {{ betas: number[], alphaBars: number[], xt: number, snr: number, alphaBarT: number }} Schedule and forward sample outputs.
 */
function diffusionBasicsStep(x0, noise, t, totalSteps, betaMin, betaMax) {
  const betas = [];
  for (let i = 0; i < totalSteps; i++) {
    const frac = totalSteps === 1 ? 0 : i / (totalSteps - 1);
    betas.push(betaMin + frac * (betaMax - betaMin));
  }

  const alphaBars = [];
  let running = 1;
  for (let i = 0; i < totalSteps; i++) {
    running *= (1 - betas[i]);
    alphaBars.push(running);
  }

  const alphaBarT = alphaBars[t];
  let xt = 0;
  xt = Math.sqrt(alphaBarT) * x0 + Math.sqrt(1 - alphaBarT) * noise;

  let snr = 0;
  snr = alphaBarT / (1 - alphaBarT);

  return { betas, alphaBars, xt, snr, alphaBarT };
}`,explanation:"Closed-form forward sampling trains the denoiser at arbitrary timesteps without recurrent unrolling."},{id:"diffbasics-signal-noise",stepLabel:"72.4",group:"Signal-to-noise ratio",title:"Signal-to-Noise Ratio",concept:"At timestep t the signal-to-noise ratio SNR = alpha_bar_t / (1 - alpha_bar_t) summarizes how much structure remains versus noise.",objective:"Inside diffusionBasicsStep, compute snr from alphaBarT.",difficulty:"core",starterCode:`/**
 * Runs one diffusion basics forward step: beta schedule, alpha-bar accumulation, noisy sample, SNR.
 * @param {number} x0 - Clean signal value.
 * @param {number} noise - Standard normal noise sample paired with x0.
 * @param {number} t - Timestep index (0-based).
 * @param {number} totalSteps - Number of diffusion steps T.
 * @param {number} betaMin - Starting beta value.
 * @param {number} betaMax - Ending beta value.
 * @returns {{ betas: number[], alphaBars: number[], xt: number, snr: number, alphaBarT: number }} Schedule and forward sample outputs.
 */
function diffusionBasicsStep(x0, noise, t, totalSteps, betaMin, betaMax) {
  const betas = [];
  for (let i = 0; i < totalSteps; i++) {
    const frac = totalSteps === 1 ? 0 : i / (totalSteps - 1);
    betas.push(betaMin + frac * (betaMax - betaMin));
  }

  const alphaBars = [];
  let running = 1;
  for (let i = 0; i < totalSteps; i++) {
    running *= (1 - betas[i]);
    alphaBars.push(running);
  }

  const alphaBarT = alphaBars[t];
  let xt = 0;
  xt = Math.sqrt(alphaBarT) * x0 + Math.sqrt(1 - alphaBarT) * noise;

  let snr = 0;
  // TODO: snr = alphaBarT / (1 - alphaBarT)

  return { betas, alphaBars, xt, snr, alphaBarT };
}`,testCode:`const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('snr mid schedule', (() => {
  const out = diffusionBasicsStep(1, 0, 5, 11, 0.1, 0.2);
  return out.snr;
})(), (() => {
  const out = diffusionBasicsStep(1, 0, 5, 11, 0.1, 0.2);
  return out.alphaBarT / (1 - out.alphaBarT);
})());
check('snr early step', (() => {
  const out = diffusionBasicsStep(1, 0, 0, 11, 0.1, 0.2);
  return out.snr;
})(), (() => {
  const out = diffusionBasicsStep(1, 0, 0, 11, 0.1, 0.2);
  return out.alphaBarT / (1 - out.alphaBarT);
})());
return results;`,hints:["Divide alphaBarT by its noise complement (1 - alphaBarT).","High SNR at early timesteps means the sample is still mostly signal.","snr = alphaBarT / (1 - alphaBarT);"],solution:`/**
 * Runs one diffusion basics forward step: beta schedule, alpha-bar accumulation, noisy sample, SNR.
 * @param {number} x0 - Clean signal value.
 * @param {number} noise - Standard normal noise sample paired with x0.
 * @param {number} t - Timestep index (0-based).
 * @param {number} totalSteps - Number of diffusion steps T.
 * @param {number} betaMin - Starting beta value.
 * @param {number} betaMax - Ending beta value.
 * @returns {{ betas: number[], alphaBars: number[], xt: number, snr: number, alphaBarT: number }} Schedule and forward sample outputs.
 */
function diffusionBasicsStep(x0, noise, t, totalSteps, betaMin, betaMax) {
  const betas = [];
  for (let i = 0; i < totalSteps; i++) {
    const frac = totalSteps === 1 ? 0 : i / (totalSteps - 1);
    betas.push(betaMin + frac * (betaMax - betaMin));
  }

  const alphaBars = [];
  let running = 1;
  for (let i = 0; i < totalSteps; i++) {
    running *= (1 - betas[i]);
    alphaBars.push(running);
  }

  const alphaBarT = alphaBars[t];
  let xt = 0;
  xt = Math.sqrt(alphaBarT) * x0 + Math.sqrt(1 - alphaBarT) * noise;

  let snr = 0;
  snr = alphaBarT / (1 - alphaBarT);

  return { betas, alphaBars, xt, snr, alphaBarT };
}`,explanation:"SNR tracks how denoising difficulty grows as more variance is injected through the schedule."},{id:"diff-scheduler-betas",stepLabel:"73.1",group:"Beta scheduling",title:"Linear Beta Schedule",concept:"DDPM uses a linear beta schedule that ramps noise variance from betaStart to betaEnd across T timesteps.",objective:"Inside ddpmSamplingStep, fill the betas array with linearly interpolated values.",difficulty:"warmup",starterCode:`/**
 * Runs one DDPM sampling kernel step: build schedule, optional forward diffuse, reverse denoise sample.
 * @param {number} xt - Noisy latent at timestep t (reverse path input).
 * @param {number} epsTheta - Predicted noise from the denoiser network.
 * @param {number} t - Current timestep index.
 * @param {number} totalSteps - Number of diffusion steps T.
 * @param {number} betaStart - Starting beta value.
 * @param {number} betaEnd - Ending beta value.
 * @param {number} zNoise - Gaussian noise for reverse sampling when t > 0.
 * @param {number|null} x0 - Clean value for forward diffuse tests (null skips forward branch).
 * @param {number|null} forwardNoise - Noise paired with x0 for forward diffuse tests.
 * @returns {{ betas: number[], alphaBars: number[], forwardXt: number|null, reverseXt: number }} Schedule and sample outputs.
 */
function ddpmSamplingStep(xt, epsTheta, t, totalSteps, betaStart, betaEnd, zNoise, x0, forwardNoise) {
  const betas = [];
  // TODO: push T linearly spaced beta values from betaStart to betaEnd.

  const alphaBars = [];
  let running = 1;
  for (let i = 0; i < totalSteps; i++) {
    running *= (1 - betas[i]);
    alphaBars.push(running);
  }

  let forwardXt = null;
  if (x0 !== null && forwardNoise !== null) {
    const ab = alphaBars[t];
    forwardXt = Math.sqrt(ab) * x0 + Math.sqrt(1 - ab) * forwardNoise;
  }

  const betaT = betas[t];
  const alphaT = 1 - betaT;
  const alphaBarT = alphaBars[t];
  const inner = xt - (betaT / Math.sqrt(1 - alphaBarT)) * epsTheta;
  const mu = inner / Math.sqrt(alphaT);
  let reverseXt = mu;
  if (t > 0) reverseXt = mu + Math.sqrt(betaT) * zNoise;

  return { betas, alphaBars, forwardXt, reverseXt };
}`,testCode:`const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function sameArray(a, b) { return a.length === b.length && a.every((v, i) => approxEqual(v, b[i])); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual, expected) });
}
check('beta schedule', ddpmSamplingStep(0, 0, 0, 5, 0.0001, 0.02, 0, null, null).betas, [0.0001, 0.005075, 0.01005, 0.015025, 0.02]);
return results;`,hints:["Step size is (betaEnd - betaStart) / (totalSteps - 1) when totalSteps > 1.","Push betaStart + i * step for each i."],solution:`/**
 * Runs one DDPM sampling kernel step: build schedule, optional forward diffuse, reverse denoise sample.
 * @param {number} xt - Noisy latent at timestep t (reverse path input).
 * @param {number} epsTheta - Predicted noise from the denoiser network.
 * @param {number} t - Current timestep index.
 * @param {number} totalSteps - Number of diffusion steps T.
 * @param {number} betaStart - Starting beta value.
 * @param {number} betaEnd - Ending beta value.
 * @param {number} zNoise - Gaussian noise for reverse sampling when t > 0.
 * @param {number|null} x0 - Clean value for forward diffuse tests (null skips forward branch).
 * @param {number|null} forwardNoise - Noise paired with x0 for forward diffuse tests.
 * @returns {{ betas: number[], alphaBars: number[], forwardXt: number|null, reverseXt: number }} Schedule and sample outputs.
 */
function ddpmSamplingStep(xt, epsTheta, t, totalSteps, betaStart, betaEnd, zNoise, x0, forwardNoise) {
  const betas = [];
  if (totalSteps <= 1) {
    betas.push(betaStart);
  } else {
    const step = (betaEnd - betaStart) / (totalSteps - 1);
    for (let i = 0; i < totalSteps; i++) {
      betas.push(betaStart + i * step);
    }
  }

  const alphaBars = [];
  let running = 1;
  for (let i = 0; i < totalSteps; i++) {
    running *= (1 - betas[i]);
    alphaBars.push(running);
  }

  let forwardXt = null;
  if (x0 !== null && forwardNoise !== null) {
    const ab = alphaBars[t];
    forwardXt = Math.sqrt(ab) * x0 + Math.sqrt(1 - ab) * forwardNoise;
  }

  const betaT = betas[t];
  const alphaT = 1 - betaT;
  const alphaBarT = alphaBars[t];
  const inner = xt - (betaT / Math.sqrt(1 - alphaBarT)) * epsTheta;
  const mu = inner / Math.sqrt(alphaT);
  let reverseXt = mu;
  if (t > 0) reverseXt = mu + Math.sqrt(betaT) * zNoise;

  return { betas, alphaBars, forwardXt, reverseXt };
}`,explanation:"The beta schedule controls how quickly signal is replaced by noise across the forward process."},{id:"diff-forward-diffusion-step",stepLabel:"73.2",group:"Forward noise scheduler",title:"Closed-Form Forward Diffusion",concept:"DDPM can jump directly to x_t with x_t = sqrt(alpha_bar_t) * x_0 + sqrt(1 - alpha_bar_t) * noise.",objective:"Inside ddpmSamplingStep, compute forwardXt when x0 and forwardNoise are provided.",difficulty:"warmup",starterCode:`/**
 * Runs one DDPM sampling kernel step: build schedule, optional forward diffuse, reverse denoise sample.
 * @param {number} xt - Noisy latent at timestep t (reverse path input).
 * @param {number} epsTheta - Predicted noise from the denoiser network.
 * @param {number} t - Current timestep index.
 * @param {number} totalSteps - Number of diffusion steps T.
 * @param {number} betaStart - Starting beta value.
 * @param {number} betaEnd - Ending beta value.
 * @param {number} zNoise - Gaussian noise for reverse sampling when t > 0.
 * @param {number|null} x0 - Clean value for forward diffuse tests (null skips forward branch).
 * @param {number|null} forwardNoise - Noise paired with x0 for forward diffuse tests.
 * @returns {{ betas: number[], alphaBars: number[], forwardXt: number|null, reverseXt: number }} Schedule and sample outputs.
 */
function ddpmSamplingStep(xt, epsTheta, t, totalSteps, betaStart, betaEnd, zNoise, x0, forwardNoise) {
  const betas = [];
  if (totalSteps <= 1) betas.push(betaStart);
  else {
    const step = (betaEnd - betaStart) / (totalSteps - 1);
    for (let i = 0; i < totalSteps; i++) betas.push(betaStart + i * step);
  }

  const alphaBars = [];
  let running = 1;
  for (let i = 0; i < totalSteps; i++) {
    running *= (1 - betas[i]);
    alphaBars.push(running);
  }

  let forwardXt = null;
  if (x0 !== null && forwardNoise !== null) {
    const ab = alphaBars[t];
    // TODO: set forwardXt using closed-form forward diffusion.
  }

  const betaT = betas[t];
  const alphaT = 1 - betaT;
  const alphaBarT = alphaBars[t];
  const inner = xt - (betaT / Math.sqrt(1 - alphaBarT)) * epsTheta;
  const mu = inner / Math.sqrt(alphaT);
  let reverseXt = mu;
  if (t > 0) reverseXt = mu + Math.sqrt(betaT) * zNoise;

  return { betas, alphaBars, forwardXt, reverseXt };
}`,testCode:`const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const out = ddpmSamplingStep(0, 0, 1, 4, 0.01, 0.04, 0, 1.5, -0.8);
check('forward diffuse', out.forwardXt, 1.339380);
return results;`,hints:["Use alphaBars[t] as alpha_bar_t.","forwardXt = Math.sqrt(ab) * x0 + Math.sqrt(1 - ab) * forwardNoise."],solution:`/**
 * Runs one DDPM sampling kernel step: build schedule, optional forward diffuse, reverse denoise sample.
 * @param {number} xt - Noisy latent at timestep t (reverse path input).
 * @param {number} epsTheta - Predicted noise from the denoiser network.
 * @param {number} t - Current timestep index.
 * @param {number} totalSteps - Number of diffusion steps T.
 * @param {number} betaStart - Starting beta value.
 * @param {number} betaEnd - Ending beta value.
 * @param {number} zNoise - Gaussian noise for reverse sampling when t > 0.
 * @param {number|null} x0 - Clean value for forward diffuse tests (null skips forward branch).
 * @param {number|null} forwardNoise - Noise paired with x0 for forward diffuse tests.
 * @returns {{ betas: number[], alphaBars: number[], forwardXt: number|null, reverseXt: number }} Schedule and sample outputs.
 */
function ddpmSamplingStep(xt, epsTheta, t, totalSteps, betaStart, betaEnd, zNoise, x0, forwardNoise) {
  const betas = [];
  if (totalSteps <= 1) betas.push(betaStart);
  else {
    const step = (betaEnd - betaStart) / (totalSteps - 1);
    for (let i = 0; i < totalSteps; i++) betas.push(betaStart + i * step);
  }

  const alphaBars = [];
  let running = 1;
  for (let i = 0; i < totalSteps; i++) {
    running *= (1 - betas[i]);
    alphaBars.push(running);
  }

  let forwardXt = null;
  if (x0 !== null && forwardNoise !== null) {
    const ab = alphaBars[t];
    forwardXt = Math.sqrt(ab) * x0 + Math.sqrt(1 - ab) * forwardNoise;
  }

  const betaT = betas[t];
  const alphaT = 1 - betaT;
  const alphaBarT = alphaBars[t];
  const inner = xt - (betaT / Math.sqrt(1 - alphaBarT)) * epsTheta;
  const mu = inner / Math.sqrt(alphaT);
  let reverseXt = mu;
  if (t > 0) reverseXt = mu + Math.sqrt(betaT) * zNoise;

  return { betas, alphaBars, forwardXt, reverseXt };
}`,explanation:"Closed-form forward diffusion lets training sample any noisy timestep without unrolling the chain."},{id:"diff-posterior-mean",stepLabel:"73.3",group:"Posterior mean estimation",title:"DDPM Reverse Step Mean",concept:"The reverse posterior mean is mu_t = (x_t - (beta_t / sqrt(1 - alpha_bar_t)) * eps_theta) / sqrt(alpha_t).",objective:"Inside ddpmSamplingStep, compute reverseXt as the posterior mean when t = 0 (no extra noise).",difficulty:"core",starterCode:`/**
 * Runs one DDPM sampling kernel step: build schedule, optional forward diffuse, reverse denoise sample.
 * @param {number} xt - Noisy latent at timestep t (reverse path input).
 * @param {number} epsTheta - Predicted noise from the denoiser network.
 * @param {number} t - Current timestep index.
 * @param {number} totalSteps - Number of diffusion steps T.
 * @param {number} betaStart - Starting beta value.
 * @param {number} betaEnd - Ending beta value.
 * @param {number} zNoise - Gaussian noise for reverse sampling when t > 0.
 * @param {number|null} x0 - Clean value for forward diffuse tests (null skips forward branch).
 * @param {number|null} forwardNoise - Noise paired with x0 for forward diffuse tests.
 * @returns {{ betas: number[], alphaBars: number[], forwardXt: number|null, reverseXt: number }} Schedule and sample outputs.
 */
function ddpmSamplingStep(xt, epsTheta, t, totalSteps, betaStart, betaEnd, zNoise, x0, forwardNoise) {
  const betas = [];
  if (totalSteps <= 1) betas.push(betaStart);
  else {
    const step = (betaEnd - betaStart) / (totalSteps - 1);
    for (let i = 0; i < totalSteps; i++) betas.push(betaStart + i * step);
  }

  const alphaBars = [];
  let running = 1;
  for (let i = 0; i < totalSteps; i++) {
    running *= (1 - betas[i]);
    alphaBars.push(running);
  }

  let forwardXt = null;
  if (x0 !== null && forwardNoise !== null) {
    const ab = alphaBars[t];
    forwardXt = Math.sqrt(ab) * x0 + Math.sqrt(1 - ab) * forwardNoise;
  }

  const betaT = betas[t];
  const alphaT = 1 - betaT;
  const alphaBarT = alphaBars[t];
  let reverseXt = 0;
  // TODO: set reverseXt to the posterior mean mu_t (without extra sampling noise).

  return { betas, alphaBars, forwardXt, reverseXt };
}`,testCode:`const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const out = ddpmSamplingStep(1.2, 0.5, 2, 5, 0.0001, 0.02, 0.1, null, null);
check('posterior mean', out.reverseXt, 1.175099);
return results;`,hints:["Subtract (betaT / Math.sqrt(1 - alphaBarT)) * epsTheta from xt.","Divide by Math.sqrt(alphaT)."],solution:`/**
 * Runs one DDPM sampling kernel step: build schedule, optional forward diffuse, reverse denoise sample.
 * @param {number} xt - Noisy latent at timestep t (reverse path input).
 * @param {number} epsTheta - Predicted noise from the denoiser network.
 * @param {number} t - Current timestep index.
 * @param {number} totalSteps - Number of diffusion steps T.
 * @param {number} betaStart - Starting beta value.
 * @param {number} betaEnd - Ending beta value.
 * @param {number} zNoise - Gaussian noise for reverse sampling when t > 0.
 * @param {number|null} x0 - Clean value for forward diffuse tests (null skips forward branch).
 * @param {number|null} forwardNoise - Noise paired with x0 for forward diffuse tests.
 * @returns {{ betas: number[], alphaBars: number[], forwardXt: number|null, reverseXt: number }} Schedule and sample outputs.
 */
function ddpmSamplingStep(xt, epsTheta, t, totalSteps, betaStart, betaEnd, zNoise, x0, forwardNoise) {
  const betas = [];
  if (totalSteps <= 1) betas.push(betaStart);
  else {
    const step = (betaEnd - betaStart) / (totalSteps - 1);
    for (let i = 0; i < totalSteps; i++) betas.push(betaStart + i * step);
  }

  const alphaBars = [];
  let running = 1;
  for (let i = 0; i < totalSteps; i++) {
    running *= (1 - betas[i]);
    alphaBars.push(running);
  }

  let forwardXt = null;
  if (x0 !== null && forwardNoise !== null) {
    const ab = alphaBars[t];
    forwardXt = Math.sqrt(ab) * x0 + Math.sqrt(1 - ab) * forwardNoise;
  }

  const betaT = betas[t];
  const alphaT = 1 - betaT;
  const alphaBarT = alphaBars[t];
  const inner = xt - (betaT / Math.sqrt(1 - alphaBarT)) * epsTheta;
  const mu = inner / Math.sqrt(alphaT);
  let reverseXt = mu;
  if (t > 0) reverseXt = mu + Math.sqrt(betaT) * zNoise;

  return { betas, alphaBars, forwardXt, reverseXt };
}`,explanation:"The posterior mean points the latent toward higher-density regions of the data distribution."},{id:"diff-reverse-denoise-step",stepLabel:"73.4",group:"Denoised reverse step",title:"DDPM Complete Denoising Step",concept:"For t > 0 the reverse step adds sqrt(beta_t) * zNoise to the posterior mean; at t = 0 it returns the mean alone.",objective:"Inside ddpmSamplingStep, add sampling noise to reverseXt when t > 0.",difficulty:"challenge",starterCode:`/**
 * Runs one DDPM sampling kernel step: build schedule, optional forward diffuse, reverse denoise sample.
 * @param {number} xt - Noisy latent at timestep t (reverse path input).
 * @param {number} epsTheta - Predicted noise from the denoiser network.
 * @param {number} t - Current timestep index.
 * @param {number} totalSteps - Number of diffusion steps T.
 * @param {number} betaStart - Starting beta value.
 * @param {number} betaEnd - Ending beta value.
 * @param {number} zNoise - Gaussian noise for reverse sampling when t > 0.
 * @param {number|null} x0 - Clean value for forward diffuse tests (null skips forward branch).
 * @param {number|null} forwardNoise - Noise paired with x0 for forward diffuse tests.
 * @returns {{ betas: number[], alphaBars: number[], forwardXt: number|null, reverseXt: number }} Schedule and sample outputs.
 */
function ddpmSamplingStep(xt, epsTheta, t, totalSteps, betaStart, betaEnd, zNoise, x0, forwardNoise) {
  const betas = [];
  if (totalSteps <= 1) betas.push(betaStart);
  else {
    const step = (betaEnd - betaStart) / (totalSteps - 1);
    for (let i = 0; i < totalSteps; i++) betas.push(betaStart + i * step);
  }

  const alphaBars = [];
  let running = 1;
  for (let i = 0; i < totalSteps; i++) {
    running *= (1 - betas[i]);
    alphaBars.push(running);
  }

  let forwardXt = null;
  if (x0 !== null && forwardNoise !== null) {
    const ab = alphaBars[t];
    forwardXt = Math.sqrt(ab) * x0 + Math.sqrt(1 - ab) * forwardNoise;
  }

  const betaT = betas[t];
  const alphaT = 1 - betaT;
  const alphaBarT = alphaBars[t];
  const inner = xt - (betaT / Math.sqrt(1 - alphaBarT)) * epsTheta;
  const mu = inner / Math.sqrt(alphaT);
  let reverseXt = mu;
  // TODO: if t > 0, add Math.sqrt(betaT) * zNoise to reverseXt.

  return { betas, alphaBars, forwardXt, reverseXt };
}`,testCode:`const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const noisy = ddpmSamplingStep(1.2, 0.5, 4, 10, 0.0001, 0.02, 0.1, null, null);
check('reverse with noise', noisy.reverseXt, 1.184866);
const final = ddpmSamplingStep(1.2, 0.5, 0, 10, 0.0001, 0.02, 0.1, null, null);
check('reverse without noise at t=0', final.reverseXt, 1.195060);
return results;`,hints:["Start from mu = reverseXt.","Add Math.sqrt(betaT) * zNoise only when t > 0."],solution:`/**
 * Runs one DDPM sampling kernel step: build schedule, optional forward diffuse, reverse denoise sample.
 * @param {number} xt - Noisy latent at timestep t (reverse path input).
 * @param {number} epsTheta - Predicted noise from the denoiser network.
 * @param {number} t - Current timestep index.
 * @param {number} totalSteps - Number of diffusion steps T.
 * @param {number} betaStart - Starting beta value.
 * @param {number} betaEnd - Ending beta value.
 * @param {number} zNoise - Gaussian noise for reverse sampling when t > 0.
 * @param {number|null} x0 - Clean value for forward diffuse tests (null skips forward branch).
 * @param {number|null} forwardNoise - Noise paired with x0 for forward diffuse tests.
 * @returns {{ betas: number[], alphaBars: number[], forwardXt: number|null, reverseXt: number }} Schedule and sample outputs.
 */
function ddpmSamplingStep(xt, epsTheta, t, totalSteps, betaStart, betaEnd, zNoise, x0, forwardNoise) {
  const betas = [];
  if (totalSteps <= 1) betas.push(betaStart);
  else {
    const step = (betaEnd - betaStart) / (totalSteps - 1);
    for (let i = 0; i < totalSteps; i++) betas.push(betaStart + i * step);
  }

  const alphaBars = [];
  let running = 1;
  for (let i = 0; i < totalSteps; i++) {
    running *= (1 - betas[i]);
    alphaBars.push(running);
  }

  let forwardXt = null;
  if (x0 !== null && forwardNoise !== null) {
    const ab = alphaBars[t];
    forwardXt = Math.sqrt(ab) * x0 + Math.sqrt(1 - ab) * forwardNoise;
  }

  const betaT = betas[t];
  const alphaT = 1 - betaT;
  const alphaBarT = alphaBars[t];
  const inner = xt - (betaT / Math.sqrt(1 - alphaBarT)) * epsTheta;
  const mu = inner / Math.sqrt(alphaT);
  let reverseXt = mu;
  if (t > 0) reverseXt = mu + Math.sqrt(betaT) * zNoise;

  return { betas, alphaBars, forwardXt, reverseXt };
}`,explanation:"Stochastic reverse steps maintain sample diversity while the t = 0 step returns a deterministic denoised value."},{id:"cfg-combine-noise",stepLabel:"74.1",group:"scale mix",title:"CFG Noise Combination",concept:"Classifier-Free Guidance extrapolates predictions away from unconditioned outputs: eps = eps_uncond + s * (eps_cond - eps_uncond).",objective:"Compute the guided noise prediction vector.",difficulty:"warmup",starterCode:`function cfgCombine(epsCond, epsUncond, scale) {
  // TODO: return epsUncond + scale * (epsCond - epsUncond)
  return 0;
}`,testCode:`const results = [];
function approxEqual(a, b, tol = 1e-5) {
  return Math.abs(a - b) <= tol;
}
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('scale factor 3.0', cfgCombine(0.8, 0.2, 3.0), 2.0); // 0.2 + 3 * 0.6 = 2.0
check('scale factor 1.0', cfgCombine(0.8, 0.2, 1.0), 0.8);
check('scale factor 0.0', cfgCombine(0.8, 0.2, 0.0), 0.2);
return results;`,hints:["Subtract epsUncond from epsCond, multiply by scale, and add epsUncond."],solution:`function cfgCombine(epsCond, epsUncond, scale) {
  return epsUncond + scale * (epsCond - epsUncond);
}`,explanation:"Guidance scales greater than 1 amplify the influence of conditioning signals, boosting text alignment and image contrast."},{id:"unet-skip-shape-calc",stepLabel:"75.1",group:"skip concat",title:"U-Net Skip Connection Channels",concept:"U-Net decoders concatenate encoder feature maps along the channel dimension via skip connections.",objective:"Compute output shapes [H, W, Channels] after concatenating decoder activations and skip activations.",difficulty:"warmup",starterCode:`function concatSkipShape(decShape, skipShape) {
  // Shapes are [H, W, C]
  // TODO: return combined shape. Assert H and W match, and channels sum.
  // Return null if height or width do not match.
  return null;
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: JSON.stringify(actual) === JSON.stringify(expected) });
}
check('matching shapes concat', concatSkipShape([32, 32, 128], [32, 32, 128]), [32, 32, 256]);
check('mismatch height shape', concatSkipShape([32, 32, 128], [16, 32, 128]), null);
return results;`,hints:["Compare decShape[0] with skipShape[0] and decShape[1] with skipShape[1].","If not equal, return null.","Otherwise return [decShape[0], decShape[1], decShape[2] + skipShape[2]]."],solution:`function concatSkipShape(decShape, skipShape) {
  if (decShape[0] !== skipShape[0] || decShape[1] !== skipShape[1]) {
    return null;
  }
  return [decShape[0], decShape[1], decShape[2] + skipShape[2]];
}`,explanation:"Skip connections preserve fine spatial coordinates, countering downsampling information loss."},{id:"dit-patchify-image",stepLabel:"75.2",group:"patch tokens",title:"DiT Patchify Flattening",concept:"Diffusion Transformers (DiT) process visual inputs by dividing images into a sequence of flat patch tokens.",objective:"Convert a 2x2 image grid of 2x2 pixel patches into 4 flattened patch tokens (length 4 each).",difficulty:"core",starterCode:`function patchifyImage(image2D, patchSize) {
  // image2D is 4x4 array of pixel values
  // patchSize is 2. The output tokens array should have length 4.
  const tokens = [];
  
  // TODO: extract four 2x2 patches, flatten each to a length 4 array, and push to tokens.
  // Grid order: top-left, top-right, bottom-left, bottom-right.
  
  return tokens;
}`,testCode:`const results = [];
function sameArr(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArr(actual, expected) });
}
const img = [
  [1, 2,  9, 10],
  [3, 4, 11, 12],
  [5, 6, 13, 14],
  [7, 8, 15, 16]
];
check('extract patches', patchifyImage(img, 2), [
  [1, 2, 3, 4],
  [9, 10, 11, 12],
  [5, 6, 7, 8],
  [13, 14, 15, 16]
]);
return results;`,hints:["Top-left patch: row 0-1, col 0-1.","Top-right patch: row 0-1, col 2-3.","Bottom-left patch: row 2-3, col 0-1.","Bottom-right patch: row 2-3, col 2-3.","Store each group in a 4-element array and push to tokens."],solution:`function patchifyImage(image2D, patchSize) {
  const tokens = [];
  const coords = [
    [0, 0], // top-left
    [0, 2], // top-right
    [2, 0], // bottom-left
    [2, 2]  // bottom-right
  ];
  for (let p = 0; p < coords.length; p++) {
    const rStart = coords[p][0];
    const cStart = coords[p][1];
    const patch = [];
    for (let r = 0; r < patchSize; r++) {
      for (let c = 0; c < patchSize; c++) {
        patch.push(image2D[rStart + r][cStart + c]);
      }
    }
    tokens.push(patch);
  }
  return tokens;
}`,explanation:"Patchifying translates spatial grids into coordinate-grouped tokens compatible with sequence transformer heads."},{id:"sd3-latent-dims",stepLabel:"76.1",group:"VAE downscale",title:"SD3 Latent Shape Calculation",concept:"Stable Diffusion 3 downsamples images by a factor of 8 during VAE encoding: H_lat = H / 8, W_lat = W / 8.",objective:"Compute VAE latent dimension sizes.",difficulty:"warmup",starterCode:`function getSd3LatentShape(width, height) {
  // TODO: divide width and height by 8, return [wLat, hLat]
  return [0, 0];
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: JSON.stringify(actual) === JSON.stringify(expected) });
}
check('512x512 resolution', getSd3LatentShape(512, 512), [64, 64]);
check('1024x768 resolution', getSd3LatentShape(1024, 768), [128, 96]);
return results;`,hints:["Divide width and height by 8."],solution:`function getSd3LatentShape(width, height) {
  return [width / 8, height / 8];
}`,explanation:"Latent-space representation minimizes visual redundancies, reducing computation budgets significantly."},{id:"flow-linear-interp",stepLabel:"77.1",group:"linear interp",title:"Flow Path Interpolation",concept:"Flow matching defines a velocity vector field along linear paths: x_t = (1 - t) * x0 + t * x1.",objective:"Interpolate coordinate x_t at time t (between 0 and 1) between data x0 and noise x1.",difficulty:"warmup",starterCode:`function getFlowInterpolation(x0, x1, t) {
  // TODO: compute and return (1 - t) * x0 + t * x1
  return 0;
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('midpoint t=0.5', getFlowInterpolation(2.0, 10.0, 0.5), 6.0);
check('start point t=0.0', getFlowInterpolation(2.0, 10.0, 0.0), 2.0);
check('end point t=1.0', getFlowInterpolation(2.0, 10.0, 1.0), 10.0);
return results;`,hints:["Multiply x0 by (1 - t), multiply x1 by t, and add the terms."],solution:`function getFlowInterpolation(x0, x1, t) {
  return (1 - t) * x0 + t * x1;
}`,explanation:"Linear interpolation forms the straight-line trajectory matched by flow velocity predictors."},{id:"flow-euler-integration",stepLabel:"77.2",group:"linear interp",title:"Euler Integration Step",concept:"Flow matching samples are generated by integrating predicted velocities using Euler steps: x_next = x_t + dt * velocity.",objective:"Compute the next position coordinate using Euler integration.",difficulty:"core",starterCode:`function eulerStep(xt, velocity, dt) {
  // TODO: return xt + dt * velocity
  return 0;
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('positive velocity step', eulerStep(1.5, 4.0, 0.1), 1.9); // 1.5 + 0.4 = 1.9
check('negative velocity step', eulerStep(1.5, -2.0, 0.05), 1.4);
return results;`,hints:["Multiply velocity by dt, then add the result to xt."],solution:`function eulerStep(xt, velocity, dt) {
  return xt + dt * velocity;
}`,explanation:"Integrating velocity steps generates data along straight trajectories, yielding better samples with fewer steps."},{id:"vae-latent-scaling",stepLabel:"78.1",group:"encode scale",title:"VAE Latent Scaling",concept:"Latent vectors are scaled to ensure training stability and match unit-variance Gaussian distributions.",objective:"Apply the standard scaling factor (e.g. 0.18215) to visual latent representation values.",difficulty:"warmup",starterCode:`function scaleLatent(val, factor = 0.18215) {
  // TODO: return val multiplied by factor
  return 0;
}`,testCode:`const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('standard scale', scaleLatent(5.0), 0.91075);
return results;`,hints:["Multiply val by factor."],solution:`function scaleLatent(val, factor = 0.18215) {
  return val * factor;
}`,explanation:"Scaling coordinates avoids vanishing activation magnitudes, preserving gradients across deep blocks."},{id:"bpe-count-pair-freqs",stepLabel:"79.1",group:"pair count",title:"BPE Pair Frequencies",concept:"Byte-Pair Encoding identifies the most common adjacent token sequences to build vocabulary merges.",objective:"Count frequencies of adjacent token pairs in a tokenized corpus.",difficulty:"core",starterCode:`function countPairs(tokensList) {
  const freqs = {};
  
  // tokensList is an array of arrays of strings: [['l', 'o', 'w'], ['n', 'e', 'w', 'e', 'r']]
  // TODO: Iterate over each token list. For each adjacent pair (tokens[i], tokens[i+1]),
  // join them as "tokenA,tokenB" and increment counts in freqs.
  
  return freqs;
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: JSON.stringify(actual) === JSON.stringify(expected) });
}
const corpus = [['l', 'o', 'w'], ['l', 'o', 'w', 'e', 'r']];
check('pair counts', countPairs(corpus), { 'l,o': 2, 'o,w': 2, 'w,e': 1, 'e,r': 1 });
return results;`,hints:["Loop over each word in tokensList.","For each word, loop index i from 0 to word.length - 2.",'Join word[i] and word[i+1] with a comma: const pair = word[i] + "," + word[i+1].',"Increment freqs[pair] = (freqs[pair] || 0) + 1."],solution:`function countPairs(tokensList) {
  const freqs = {};
  for (let w = 0; w < tokensList.length; w++) {
    const word = tokensList[w];
    for (let i = 0; i < word.length - 1; i++) {
      const pair = word[i] + ',' + word[i + 1];
      freqs[pair] = (freqs[pair] || 0) + 1;
    }
  }
  return freqs;
}`,explanation:"Counting pair frequencies reveals which tokens appear together most frequently, identifying prospective merge operations."},{id:"bpe-merge-tokens-list",stepLabel:"79.2",group:"merge rule",title:"BPE Token Merging",concept:"BPE merges occur by replacing adjacent matching token pairs with combined symbols.",objective:'Merge all adjacent instances of a target pair (e.g. ["l", "o"]) into a single symbol ("lo").',difficulty:"core",starterCode:`function mergePair(wordTokens, pairTarget) {
  // wordTokens is ['l', 'o', 'w']
  // pairTarget is ['l', 'o']
  const merged = [];
  
  // TODO: Loop through wordTokens and replace adjacent pairTarget values with merged string
  
  return merged;
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: JSON.stringify(actual) === JSON.stringify(expected) });
}
check('merge lo in low', mergePair(['l', 'o', 'w'], ['l', 'o']), ['lo', 'w']);
check('merge duplicate letters', mergePair(['a', 'a', 'a'], ['a', 'a']), ['aa', 'a']);
return results;`,hints:["Loop index i from 0 to wordTokens.length - 1.","If i < length - 1 and wordTokens[i] === pairTarget[0] and wordTokens[i+1] === pairTarget[1], push combined string and increment i.","Otherwise, push wordTokens[i]."],solution:`function mergePair(wordTokens, pairTarget) {
  const merged = [];
  let i = 0;
  while (i < wordTokens.length) {
    if (i < wordTokens.length - 1 && wordTokens[i] === pairTarget[0] && wordTokens[i + 1] === pairTarget[1]) {
      merged.push(pairTarget[0] + pairTarget[1]);
      i += 2;
    } else {
      merged.push(wordTokens[i]);
      i++;
    }
  }
  return merged;
}`,explanation:"Replacing character pairs progressively builds longer subword vocabularies, reducing sequence token counts."},{id:"clip-l2-norm",stepLabel:"80.1",group:"L2 normalize",title:"CLIP Vector L2 Normalization",concept:"CLIP maps text and image embeddings to a shared latent space, normalizing vectors to lie on a unit hypersphere.",objective:"Compute the L2 normalized vector: v / ||v||.",difficulty:"warmup",starterCode:`function l2Normalize(vec) {
  let sumSq = 0;
  for (let i = 0; i < vec.length; i++) {
    sumSq += vec[i] * vec[i];
  }
  const norm = Math.sqrt(sumSq);
  if (norm === 0) return vec;
  
  // TODO: divide each vector coordinate by norm and return the normalized array
  return vec;
}`,testCode:`const results = [];
function sameArr(a, b, tol = 1e-5) {
  return a.every((v, i) => Math.abs(v - b[i]) <= tol);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArr(actual, expected) });
}
check('normalize 2D vector', l2Normalize([3.0, 4.0]), [0.6, 0.8]);
return results;`,hints:["Map each element coordinate x to x / norm."],solution:`function l2Normalize(vec) {
  let sumSq = 0;
  for (let i = 0; i < vec.length; i++) {
    sumSq += vec[i] * vec[i];
  }
  const norm = Math.sqrt(sumSq);
  if (norm === 0) return vec;
  return vec.map(x => x / norm);
}`,explanation:"L2 normalization simplifies cosine similarity calculations to basic dot products, accelerating retrieval and matching loops."},{id:"t5-pad-attention-mask",stepLabel:"81.1",group:"pad mask",title:"T5 Padding Attention Mask",concept:"T5 text encoders block attention to padding tokens by constructing boolean masks.",objective:"Generate a binary attention mask where valid tokens are 1 and pad tokens are 0.",difficulty:"warmup",starterCode:`function getAttentionMask(tokenIds, padId) {
  // TODO: map tokenIds to 1 if token is not padId, otherwise 0
  return [];
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: JSON.stringify(actual) === JSON.stringify(expected) });
}
check('mask out padding ID 0', getAttentionMask([42, 107, 0, 0], 0), [1, 1, 0, 0]);
return results;`,hints:["Use tokenIds.map(id => id !== padId ? 1 : 0)."],solution:`function getAttentionMask(tokenIds, padId) {
  return tokenIds.map(id => (id !== padId ? 1 : 0));
}`,explanation:"Padding masks prevent models from aggregating meaningless information from trailing fill tokens."},{id:"joint-attn-concat-seq",stepLabel:"82.1",group:"Concat Q",title:"Multimodal Sequence Concatenation",concept:"SD3's Joint Attention block concatenates text and image tokens along the sequence dimension, letting them interact directly.",objective:"Concatenate text and image token lists into a combined multimodal sequence.",difficulty:"warmup",starterCode:`function concatEmbeddings(textEmbeds, imageEmbeds) {
  // textEmbeds and imageEmbeds are arrays of vectors
  // TODO: return a single array containing textEmbeds followed by imageEmbeds
  return [];
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: JSON.stringify(actual) === JSON.stringify(expected) });
}
check('concat sequences', concatEmbeddings([[1, 2]], [[3, 4], [5, 6]]), [[1, 2], [3, 4], [5, 6]]);
return results;`,hints:["Use the JavaScript concat method: textEmbeds.concat(imageEmbeds) or spread operator [...textEmbeds, ...imageEmbeds]."],solution:`function concatEmbeddings(textEmbeds, imageEmbeds) {
  return textEmbeds.concat(imageEmbeds);
}`,explanation:"Concatenating modalities enables bidirectional cross-attention without separate cross-attention layers."},{id:"dit-adaln-scale-shift",stepLabel:"83.1",group:"adaLN scale/shift",title:"AdaLN Scale and Shift",concept:"Diffusion Transformers modulate layers using adaptive layer normalization (adaLN) scale and shift parameters derived from time embeddings.",objective:"Apply the scale and shift modulation: y = x * (1 + scale) + shift.",difficulty:"core",starterCode:`function applyAdaLN(x, scale, shift) {
  // TODO: compute and return x * (1 + scale) + shift
  return 0;
}`,testCode:`const results = [];
function approxEqual(a, b, tol = 1e-5) {
  return Math.abs(a - b) <= tol;
}
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('scale and shift positive', applyAdaLN(1.5, 0.2, 0.5), 2.3); // 1.5 * 1.2 + 0.5 = 1.8 + 0.5 = 2.3
check('scale and shift negative', applyAdaLN(1.5, -0.2, -0.5), 0.7); // 1.5 * 0.8 - 0.5 = 1.2 - 0.5 = 0.7
return results;`,hints:["Multiply x by (1 + scale).","Add shift to the result."],solution:`function applyAdaLN(x, scale, shift) {
  return x * (1 + scale) + shift;
}`,explanation:"AdaLN conditioning injects temporal context (like noise level) directly into the transformer's layer normalization channels."}],J=[{id:"bloom-hash-index",stepLabel:"70.1",group:"Hash positions",title:"Bloom Filter Hash Function",concept:"Bloom filters use multiple hash functions to map items to bit array indices.",objective:"Compute the bit index for a string item using a simple seeded hash: sum(charCodes[i] * seed) % size.",difficulty:"warmup",starterCode:`function getBloomHash(item, seed, size) {
  let hash = 0;
  for (let i = 0; i < item.length; i++) {
    // TODO: multiply charCode by seed and accumulate in hash
    hash += 0;
  }
  return hash % size;
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('hash test 1', getBloomHash('apple', 31, 100), 30);
check('hash test 2', getBloomHash('banana', 17, 100), 53);
return results;`,hints:["Use item.charCodeAt(i) to get the character code.","Multiply by seed and add to hash.","hash += item.charCodeAt(i) * seed;"],solution:`function getBloomHash(item, seed, size) {
  let hash = 0;
  for (let i = 0; i < item.length; i++) {
    hash += item.charCodeAt(i) * seed;
  }
  return hash % size;
}`,explanation:"A seeded hash function maps arbitrary strings to bounded integer indices deterministically."},{id:"bloom-insert-item",stepLabel:"70.2",group:"Hash positions",title:"Bloom Filter Insertion",concept:"Inserting an item into a Bloom filter sets the bits at all computed hash positions to 1.",objective:"Modify the bit array in-place by setting bits at the positions generated by the seeds.",difficulty:"core",starterCode:`function bloomInsert(bitArray, item, seeds) {
  const size = bitArray.length;
  for (let s = 0; s < seeds.length; s++) {
    const seed = seeds[s];
    let hash = 0;
    for (let i = 0; i < item.length; i++) {
      hash += item.charCodeAt(i) * seed;
    }
    const idx = hash % size;
    // TODO: set the bit at idx in bitArray to 1
  }
}`,testCode:`const results = [];
function sameArr(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArr(actual, expected) });
}
const bits = Array(10).fill(0);
bloomInsert(bits, 'abc', [5, 9]);
check('bits set after insert', bits, [1, 0, 0, 0, 0, 0, 1, 0, 0, 0]);
return results;`,hints:["Set bitArray[idx] = 1."],solution:`function bloomInsert(bitArray, item, seeds) {
  const size = bitArray.length;
  for (let s = 0; s < seeds.length; s++) {
    const seed = seeds[s];
    let hash = 0;
    for (let i = 0; i < item.length; i++) {
      hash += item.charCodeAt(i) * seed;
    }
    const idx = hash % size;
    bitArray[idx] = 1;
  }
}`,explanation:"Setting bits for multiple independent hashes overlays membership signatures in the shared bit array."},{id:"bloom-maybe-contains",stepLabel:"70.3",group:"Query all bits",title:"Bloom Filter Query",concept:"A Bloom filter queries membership by checking if all hash positions are set to 1. If any is 0, the item is definitely not in the set.",objective:"Verify if the item is present in the Bloom filter.",difficulty:"challenge",starterCode:`function bloomContains(bitArray, item, seeds) {
  const size = bitArray.length;
  for (let s = 0; s < seeds.length; s++) {
    const seed = seeds[s];
    let hash = 0;
    for (let i = 0; i < item.length; i++) {
      hash += item.charCodeAt(i) * seed;
    }
    const idx = hash % size;
    // TODO: if bitArray[idx] is 0, return false
  }
  return true;
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
const bits = [1, 0, 0, 0, 0, 0, 1, 0, 0, 0];
check('should contain abc', bloomContains(bits, 'abc', [5, 9]), true);
check('should not contain xyz', bloomContains(bits, 'xyz', [5, 9]), false);
return results;`,hints:["Check if bitArray[idx] === 0. If so, return false."],solution:`function bloomContains(bitArray, item, seeds) {
  const size = bitArray.length;
  for (let s = 0; s < seeds.length; s++) {
    const seed = seeds[s];
    let hash = 0;
    for (let i = 0; i < item.length; i++) {
      hash += item.charCodeAt(i) * seed;
    }
    const idx = hash % size;
    if (bitArray[idx] === 0) {
      return false;
    }
  }
  return true;
}`,explanation:"A zero bit guarantees non-membership; all ones indicate membership, subject to false positive probabilities."},{id:"pagerank-distribute-mass",stepLabel:"71.1",group:"Out-link normalize",title:"PageRank Mass Distribution",concept:"PageRank spreads page importance (rank) across outgoing link connections.",objective:"Add the distributed PageRank mass from source to target pages.",difficulty:"warmup",starterCode:`function distributeRank(sourceRank, outLinks, targetRanks) {
  if (outLinks.length === 0) return;
  const share = sourceRank / outLinks.length;
  for (let i = 0; i < outLinks.length; i++) {
    const targetIdx = outLinks[i];
    // TODO: add share to targetRanks[targetIdx]
    targetRanks[targetIdx] += 0;
  }
}`,testCode:`const results = [];
function sameArr(a, b, tol=1e-5) { return a.every((v, i) => Math.abs(v - b[i]) <= tol); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArr(actual, expected) });
}
const targets = [0, 0, 0];
distributeRank(1.2, [0, 2], targets);
check('mass distributed', targets, [0.6, 0.0, 0.6]);
return results;`,hints:["Add share to targetRanks[targetIdx].","targetRanks[targetIdx] += share;"],solution:`function distributeRank(sourceRank, outLinks, targetRanks) {
  if (outLinks.length === 0) return;
  const share = sourceRank / outLinks.length;
  for (let i = 0; i < outLinks.length; i++) {
    const targetIdx = outLinks[i];
    targetRanks[targetIdx] += share;
  }
}`,explanation:"PageRank mass is divided equally among a page's outward pointing links, representing a random web surfer's choices."},{id:"pagerank-power-iteration",stepLabel:"71.2",group:"Damping teleport",title:"PageRank Power Iteration Step",concept:"PageRank updates combine link mass with a damping teleport factor: PR(i) = (1-d)/N + d * sum_j (PR(j)/L(j)).",objective:"Compute the PageRank scores after one step of power iteration.",difficulty:"core",starterCode:`function pagerankStep(ranks, adjList, d = 0.85) {
  const n = ranks.length;
  const nextRanks = Array(n).fill(0);
  
  // Distribute rank mass from links
  for (let j = 0; j < n; j++) {
    const outLinks = adjList[j];
    if (outLinks.length === 0) {
      // Dangling page: distribute equally to all pages
      for (let i = 0; i < n; i++) {
        nextRanks[i] += ranks[j] / n;
      }
    } else {
      const share = ranks[j] / outLinks.length;
      for (let i = 0; i < outLinks.length; i++) {
        nextRanks[outLinks[i]] += share;
      }
    }
  }
  
  // Apply damping factor
  const teleport = (1 - d) / n;
  for (let i = 0; i < n; i++) {
    // TODO: scale nextRanks[i] by d, and add teleport
    nextRanks[i] = 0;
  }
  
  return nextRanks;
}`,testCode:`const results = [];
function sameArr(a, b, tol=1e-5) { return a.every((v, i) => Math.abs(v - b[i]) <= tol); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArr(actual, expected) });
}
const adj = [
  [1],
  [0, 1],
];
const initRanks = [0.5, 0.5];
check('pagerank iteration step', pagerankStep(initRanks, adj, 0.85), [0.2875, 0.7125]);
return results;`,hints:["Scale the accumulated link mass by d, then add teleport.","nextRanks[i] = d * nextRanks[i] + teleport;"],solution:`function pagerankStep(ranks, adjList, d = 0.85) {
  const n = ranks.length;
  const nextRanks = Array(n).fill(0);
  
  for (let j = 0; j < n; j++) {
    const outLinks = adjList[j];
    if (outLinks.length === 0) {
      for (let i = 0; i < n; i++) {
        nextRanks[i] += ranks[j] / n;
      }
    } else {
      const share = ranks[j] / outLinks.length;
      for (let i = 0; i < outLinks.length; i++) {
        nextRanks[outLinks[i]] += share;
      }
    }
  }
  
  const teleport = (1 - d) / n;
  for (let i = 0; i < n; i++) {
    nextRanks[i] = d * nextRanks[i] + teleport;
  }
  
  return nextRanks;
}`,explanation:"Teleportation represents a surfer typing a random URL, ensuring convergence stability in disconnected web graphs."}],K=[{id:"frontier-weight-bytes",stepLabel:"19.1",group:"Weight bytes",title:"Model parameters memory size",concept:"Frontier LLM serving memory is dominated by parameters. At 16-bit precision (FP16/BF16), each parameter occupies 2 bytes; at 8-bit precision (INT8), it occupies 1 byte.",objective:"Calculate the total gigabytes (GB) needed to store parameters in memory.",difficulty:"warmup",starterCode:`function getWeightBytesGB(numParamsBillions, bytesPerParam) {
  // TODO: return memory in GB: (params * 10^9 * bytesPerParam) / 10^9
  return 0;
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('Llama 70B FP16', getWeightBytesGB(70, 2), 140);
check('Llama 8B INT8', getWeightBytesGB(8, 1), 8);
return results;`,hints:["The billions scale cancels out with the GB scale (both 10^9).","Simply multiply numParamsBillions by bytesPerParam.","return numParamsBillions * bytesPerParam;"],solution:`function getWeightBytesGB(numParamsBillions, bytesPerParam) {
  return numParamsBillions * bytesPerParam;
}`,explanation:"Parameter size represents the static memory baseline required to load a model before processing any inputs."},{id:"frontier-kv-bytes",stepLabel:"19.2",group:"KV bytes",title:"KV Cache size calculation",concept:"The Key-Value (KV) cache grows linearly with sequence length, batch size, and number of layers: size = 2 * layers * kvHeads * headDim * seqLen * bytesPerParam.",objective:"Compute total KV cache bytes for the given inputs.",difficulty:"core",starterCode:`function getKVCacheBytes(layers, kvHeads, headDim, seqLen, bytesPerParam) {
  // TODO: return total bytes of KV cache
  return 0;
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('Llama 8B layer cache size', getKVCacheBytes(32, 8, 128, 2048, 2), 268435456);
return results;`,hints:["Multiply all parameters together along with the factor of 2 (for both Keys and Values).","return 2 * layers * kvHeads * headDim * seqLen * bytesPerParam;"],solution:`function getKVCacheBytes(layers, kvHeads, headDim, seqLen, bytesPerParam) {
  return 2 * layers * kvHeads * headDim * seqLen * bytesPerParam;
}`,explanation:"KV cache size is the main bottleneck for long-context generation, often exceeding parameter sizes at large batch sizes."},{id:"moe-active-params",stepLabel:"20.1",group:"Active fraction",title:"Active parameters fraction",concept:"At Frontier scale, Mixture of Experts (MoE) models only activate a subset of experts per token to minimize computational costs (FLOPs).",objective:"Calculate the active parameters count: nonAttnBase + (activeExperts / totalExperts) * totalExpertParams.",difficulty:"warmup",starterCode:`function getActiveParams(nonAttnBase, totalExpertParams, activeExperts, totalExperts) {
  // TODO: calculate and return active parameters
  return 0;
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('Mixtral 8x7B active params', getActiveParams(12, 35, 2, 8), 20.75);
return results;`,hints:["Multiply totalExpertParams by activeExperts / totalExperts.","Add nonAttnBase to the result.","return nonAttnBase + (activeExperts / totalExperts) * totalExpertParams;"],solution:`function getActiveParams(nonAttnBase, totalExpertParams, activeExperts, totalExperts) {
  return nonAttnBase + (activeExperts / totalExperts) * totalExpertParams;
}`,explanation:"By activating only 2 out of 8 experts per token, MoE models keep latency low while offering massive model capacities."},{id:"mla-compression-ratio",stepLabel:"21.1",group:"Cache size ratio",title:"MLA cache compression ratio",concept:"Multi-head Latent Attention (MLA) compresses the KV cache by projecting key-value vectors into a low-dimensional latent space.",objective:"Calculate the cache savings ratio: compressedLatentDim / (standardKVHeads * headDim).",difficulty:"warmup",starterCode:`function getMLACacheRatio(latentDim, kvHeads, headDim) {
  // TODO: return the ratio of compressed latent size to standard KV size
  return 0;
}`,testCode:`const results = [];
function approxEqual(a, b, tol = 1e-5) {
  return Math.abs(a - b) <= tol;
}
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('DeepSeek-V2 MLA ratio', getMLACacheRatio(128, 128, 128), 0.0078125); // 128 / 16384
return results;`,hints:["Calculate standard KV size: kvHeads * headDim.","Divide latentDim by this standard size.","return latentDim / (kvHeads * headDim);"],solution:`function getMLACacheRatio(latentDim, kvHeads, headDim) {
  return latentDim / (kvHeads * headDim);
}`,explanation:"MLA reduces the memory footprint of KV caches by more than 90%, allowing much larger batch sizes and context lengths."},{id:"grpo-relative-advantage",stepLabel:"22.1",group:"Relative advantage",title:"GRPO relative advantage calculation",concept:"Group Relative Policy Optimization (GRPO) calculates advantages relative to a group baseline rather than using a separate critic network.",objective:"For each score in a group, calculate: (score - mean) / std.",difficulty:"core",starterCode:`function getRelativeAdvantages(scores) {
  const n = scores.length;
  const mean = scores.reduce((sum, s) => sum + s, 0) / n;
  
  let variance = scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / n;
  const std = Math.sqrt(variance) || 1e-8;
  
  const advantages = [];
  for (let i = 0; i < n; i++) {
    // TODO: compute advantage score and push it to advantages array
    advantages.push(0);
  }
  return advantages;
}`,testCode:`const results = [];
function approxArray(a, b, tol = 1e-5) {
  return a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) <= tol);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: approxArray(actual, expected) });
}
check('advantages test', getRelativeAdvantages([2, 4, 6]), [-1.22474, 0, 1.22474]);
return results;`,hints:["The mean is already mean.","The standard deviation is std.","The formula is: (scores[i] - mean) / std."],solution:`function getRelativeAdvantages(scores) {
  const n = scores.length;
  const mean = scores.reduce((sum, s) => sum + s, 0) / n;
  
  let variance = scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / n;
  const std = Math.sqrt(variance) || 1e-8;
  
  const advantages = [];
  for (let i = 0; i < n; i++) {
    advantages.push((scores[i] - mean) / std);
  }
  return advantages;
}`,explanation:"By normalizing rewards across a group of candidate outputs, GRPO reduces policy gradient variance without requiring a value critic."},{id:"budget-thinking-check",stepLabel:"23.1",group:"Budget split",title:"Thinking budget boundary check",concept:"Test-time compute thinking models generate reasoning steps between <thought> and </thought> tags before emitting the final answer.",objective:'Return true if tokens contains "</thought>", signaling thinking is complete, otherwise false.',difficulty:"warmup",starterCode:`function isThinkingComplete(tokens) {
  // TODO: return whether tokens array includes '</thought>' tag
  return false;
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('thought ongoing', isThinkingComplete(['<thought>', 'Let', 'me', 'think']), false);
check('thought ended', isThinkingComplete(['<thought>', 'Okay', '</thought>', 'Answer:']), true);
return results;`,hints:["Use the array .includes() method.","return tokens.includes('</thought>');"],solution:`function isThinkingComplete(tokens) {
  return tokens.includes('</thought>');
}`,explanation:"Checking thinking tags allows LLM inference servers to allocate dynamic token budgets and switch routing modes."},{id:"long-context-scale-kv",stepLabel:"24.1",group:"Linear seq scaling",title:"Linear sequence memory scaling",concept:"Long context models scale their KV cache memory footprint linearly with context length.",objective:"Scale a baseline memory value (in MB) at baselineLen to newLen.",difficulty:"warmup",starterCode:`function scaleMemory(baselineMB, baselineLen, newLen) {
  // TODO: return scaled memory in MB
  return 0;
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('scale from 4k to 32k', scaleMemory(256, 4096, 32768), 2048);
return results;`,hints:["The memory scales by the factor: newLen / baselineLen.","return baselineMB * (newLen / baselineLen);"],solution:`function scaleMemory(baselineMB, baselineLen, newLen) {
  return baselineMB * (newLen / baselineLen);
}`,explanation:"Linear scaling shows how cache requirements grow directly with the input sequence length."},{id:"omni-fuse-embeddings",stepLabel:"25.1",group:"Weighted fuse",title:"Weighted multimodal embedding fusion",concept:"Omni models fuse text and vision/audio tokens by applying gating layers to blend representations.",objective:"Fuse text and vision embeddings coordinate by coordinate: output[i] = gate * vision[i] + (1 - gate) * text[i].",difficulty:"core",starterCode:`function fuseModalEmbeddings(textEmb, visionEmb, gate) {
  const fused = [];
  for (let i = 0; i < textEmb.length; i++) {
    // TODO: compute weighted blend of vision and text coordinates
    fused.push(0);
  }
  return fused;
}`,testCode:`const results = [];
function approxArray(a, b, tol = 1e-5) {
  return a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) <= tol);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: approxArray(actual, expected) });
}
check('fuse half-half', fuseModalEmbeddings([1.0, 2.0], [3.0, 4.0], 0.5), [2.0, 3.0]);
return results;`,hints:["Use the formula: gate * visionEmb[i] + (1 - gate) * textEmb[i].","Push it to the fused array."],solution:`function fuseModalEmbeddings(textEmb, visionEmb, gate) {
  const fused = [];
  for (let i = 0; i < textEmb.length; i++) {
    fused.push(gate * visionEmb[i] + (1 - gate) * textEmb[i]);
  }
  return fused;
}`,explanation:"Gated fusion layers allow the network to dynamically scale the balance of textual and visual inputs at each sequence index."},{id:"diffusion-lm-mask-ratio",stepLabel:"26.1",group:"Mask ratio",title:"Diffusion language model mask ratio",concept:"Diffusion language models iteratively denoise corrupted sequences. At time step t out of T, a linear scheduler masks a fraction t/T of tokens.",objective:"Compute the number of tokens to mask: Math.round(tokens.length * (t / T)).",difficulty:"warmup",starterCode:`function getMaskCount(seqLen, t, T) {
  // TODO: return how many tokens to mask at step t
  return 0;
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('mid diffusion step', getMaskCount(100, 50, 100), 50);
check('start diffusion step', getMaskCount(100, 90, 100), 90);
return results;`,hints:["Divide t by T.","Multiply by seqLen, and round the result using Math.round.","return Math.round(seqLen * (t / T));"],solution:`function getMaskCount(seqLen, t, T) {
  return Math.round(seqLen * (t / T));
}`,explanation:"The noise schedule defines how many tokens are masked/corrupted at each stage of the diffusion generation process."},{id:"serving-batch-utilization",stepLabel:"27.1",group:"Continuous batching",title:"Serving batch slot utilization",concept:"In continuous batching LLM serving, tokens are processed in shared batch slots. Monitoring slot utilization helps scale serving resources.",objective:"Calculate the utilization ratio: activeSlots / maxBatchSlots.",difficulty:"warmup",starterCode:`function getBatchUtilization(activeSlots, maxBatchSlots) {
  // TODO: return utilization fraction
  return 0;
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('half utilized', getBatchUtilization(16, 32), 0.5);
return results;`,hints:["Divide activeSlots by maxBatchSlots.","return activeSlots / maxBatchSlots;"],solution:`function getBatchUtilization(activeSlots, maxBatchSlots) {
  return activeSlots / maxBatchSlots;
}`,explanation:"Continuous batching increases hardware utilization by dynamically packing incoming requests into active GPU scheduling slots."},{id:"tool-use-parse",stepLabel:"29.1",group:"Tool call parser",title:"XML Tool Call Parsing",concept:"Tool-using models emit <call:toolName>arguments</call> tags. The agent runtime parses those tags before dispatching.",objective:"Inside runAgentToolStep, parse the first tool call from assistantText using a regex.",difficulty:"warmup",starterCode:`/**
 * Runs one agent tool step: parse optional tool call, dispatch, append history, decide whether to stop.
 * @param {string} assistantText - Latest assistant message text.
 * @param {Object[]} history - Conversation history updated when a tool executes.
 * @param {Object.<string, function>} registry - Tool name to handler map.
 * @returns {{ nextMessage: Object, shouldStop: boolean, history: Object[] }} Step result.
 */
function runAgentToolStep(assistantText, history, registry) {
  let toolCall = null;
  // TODO: match /<call:(\\w+)>(.*?)<\\/call>/ and set toolCall = { name, args } or null.

  if (toolCall) {
    const toolFn = registry[toolCall.name];
    let content = '';
    if (!toolFn) {
      content = 'Error: Tool "' + toolCall.name + '" not found';
    } else {
      try {
        content = toolFn(toolCall.args);
      } catch (err) {
        content = 'Error: ' + err.message;
      }
    }
    const nextHistory = [...history, { role: 'tool', name: toolCall.name, content }];
    return {
      nextMessage: { role: 'tool', name: toolCall.name, content },
      shouldStop: false,
      history: nextHistory,
    };
  }

  return {
    nextMessage: { role: 'assistant', content: assistantText },
    shouldStop: true,
    history,
  };
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: JSON.stringify(actual) === JSON.stringify(expected) });
}
const reg = { search: (q) => 'found ' + q };
const out = runAgentToolStep('Try <call:search>ml</call>', [], reg);
check('parsed tool call', out.nextMessage, { role: 'tool', name: 'search', content: 'found ml' });
check('no tool means stop', runAgentToolStep('done', [], reg).shouldStop, true);
return results;`,hints:["Use text.match(/<call:(\\w+)>(.*?)<\\/call>/).","If matched, toolCall = { name: match[1], args: match[2] }."],solution:`/**
 * Runs one agent tool step: parse optional tool call, dispatch, append history, decide whether to stop.
 * @param {string} assistantText - Latest assistant message text.
 * @param {Object[]} history - Conversation history updated when a tool executes.
 * @param {Object.<string, function>} registry - Tool name to handler map.
 * @returns {{ nextMessage: Object, shouldStop: boolean, history: Object[] }} Step result.
 */
function runAgentToolStep(assistantText, history, registry) {
  let toolCall = null;
  const match = assistantText.match(/<call:(\\w+)>(.*?)<\\/call>/);
  if (match) {
    toolCall = { name: match[1], args: match[2] };
  }

  if (toolCall) {
    const toolFn = registry[toolCall.name];
    let content = '';
    if (!toolFn) {
      content = 'Error: Tool "' + toolCall.name + '" not found';
    } else {
      try {
        content = toolFn(toolCall.args);
      } catch (err) {
        content = 'Error: ' + err.message;
      }
    }
    const nextHistory = [...history, { role: 'tool', name: toolCall.name, content }];
    return {
      nextMessage: { role: 'tool', name: toolCall.name, content },
      shouldStop: false,
      history: nextHistory,
    };
  }

  return {
    nextMessage: { role: 'assistant', content: assistantText },
    shouldStop: true,
    history,
  };
}`,explanation:"Parsing tool tags is the boundary between free-form LLM text and structured runtime actions."},{id:"tool-use-dispatch",stepLabel:"29.2",group:"Action dispatcher",title:"Tool Call Dispatcher",concept:"After parsing, the dispatcher looks up the handler, catches failures, and returns a string result.",objective:"Inside runAgentToolStep, dispatch toolCall to registry with missing-tool and error handling.",difficulty:"core",starterCode:`/**
 * Runs one agent tool step: parse optional tool call, dispatch, append history, decide whether to stop.
 * @param {string} assistantText - Latest assistant message text.
 * @param {Object[]} history - Conversation history updated when a tool executes.
 * @param {Object.<string, function>} registry - Tool name to handler map.
 * @returns {{ nextMessage: Object, shouldStop: boolean, history: Object[] }} Step result.
 */
function runAgentToolStep(assistantText, history, registry) {
  let toolCall = null;
  const match = assistantText.match(/<call:(\\w+)>(.*?)<\\/call>/);
  if (match) toolCall = { name: match[1], args: match[2] };

  if (toolCall) {
    let content = '';
    // TODO: dispatch toolCall through registry with try/catch and missing-tool fallback strings.

    const nextHistory = [...history, { role: 'tool', name: toolCall.name, content }];
    return {
      nextMessage: { role: 'tool', name: toolCall.name, content },
      shouldStop: false,
      history: nextHistory,
    };
  }

  return {
    nextMessage: { role: 'assistant', content: assistantText },
    shouldStop: true,
    history,
  };
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
const reg = { upper: (s) => s.toUpperCase(), fail: () => { throw new Error('timeout'); } };
check('dispatch success', runAgentToolStep('<call:upper>hi</call>', [], reg).nextMessage.content, 'HI');
check('missing tool', runAgentToolStep('<call:missing>x</call>', [], reg).nextMessage.content, 'Error: Tool "missing" not found');
check('caught error', runAgentToolStep('<call:fail></call>', [], reg).nextMessage.content, 'Error: timeout');
return results;`,hints:["Look up registry[toolCall.name].","Return an error string if the tool is missing or throws."],solution:`/**
 * Runs one agent tool step: parse optional tool call, dispatch, append history, decide whether to stop.
 * @param {string} assistantText - Latest assistant message text.
 * @param {Object[]} history - Conversation history updated when a tool executes.
 * @param {Object.<string, function>} registry - Tool name to handler map.
 * @returns {{ nextMessage: Object, shouldStop: boolean, history: Object[] }} Step result.
 */
function runAgentToolStep(assistantText, history, registry) {
  let toolCall = null;
  const match = assistantText.match(/<call:(\\w+)>(.*?)<\\/call>/);
  if (match) toolCall = { name: match[1], args: match[2] };

  if (toolCall) {
    const toolFn = registry[toolCall.name];
    let content = '';
    if (!toolFn) {
      content = 'Error: Tool "' + toolCall.name + '" not found';
    } else {
      try {
        content = toolFn(toolCall.args);
      } catch (err) {
        content = 'Error: ' + err.message;
      }
    }
    const nextHistory = [...history, { role: 'tool', name: toolCall.name, content }];
    return {
      nextMessage: { role: 'tool', name: toolCall.name, content },
      shouldStop: false,
      history: nextHistory,
    };
  }

  return {
    nextMessage: { role: 'assistant', content: assistantText },
    shouldStop: true,
    history,
  };
}`,explanation:"Safe dispatch prevents one bad tool call from crashing the whole agent loop."},{id:"tool-use-history",stepLabel:"29.3",group:"History integration",title:"Tool History Integration",concept:"Successful tool execution appends a tool-role message so the model can read the result on the next turn.",objective:"Inside runAgentToolStep, append the tool result to history without mutating the input array.",difficulty:"core",starterCode:`/**
 * Runs one agent tool step: parse optional tool call, dispatch, append history, decide whether to stop.
 * @param {string} assistantText - Latest assistant message text.
 * @param {Object[]} history - Conversation history updated when a tool executes.
 * @param {Object.<string, function>} registry - Tool name to handler map.
 * @returns {{ nextMessage: Object, shouldStop: boolean, history: Object[] }} Step result.
 */
function runAgentToolStep(assistantText, history, registry) {
  let toolCall = null;
  const match = assistantText.match(/<call:(\\w+)>(.*?)<\\/call>/);
  if (match) toolCall = { name: match[1], args: match[2] };

  if (toolCall) {
    const toolFn = registry[toolCall.name];
    let content = '';
    if (!toolFn) content = 'Error: Tool "' + toolCall.name + '" not found';
    else {
      try { content = toolFn(toolCall.args); } catch (err) { content = 'Error: ' + err.message; }
    }

    let nextHistory = history;
    // TODO: append { role: 'tool', name: toolCall.name, content } to a copied history array.

    return {
      nextMessage: { role: 'tool', name: toolCall.name, content },
      shouldStop: false,
      history: nextHistory,
    };
  }

  return {
    nextMessage: { role: 'assistant', content: assistantText },
    shouldStop: true,
    history,
  };
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: JSON.stringify(actual) === JSON.stringify(expected) });
}
const hist = [{ role: 'user', content: 'weather?' }];
const out = runAgentToolStep('<call:get_weather>Paris</call>', hist, { get_weather: (x) => 'sunny in ' + x });
check('history append', out.history, [{ role: 'user', content: 'weather?' }, { role: 'tool', name: 'get_weather', content: 'sunny in Paris' }]);
check('input history untouched', hist.length, 1);
return results;`,hints:["Copy history with [...history].","Push the tool message object onto the copy."],solution:`/**
 * Runs one agent tool step: parse optional tool call, dispatch, append history, decide whether to stop.
 * @param {string} assistantText - Latest assistant message text.
 * @param {Object[]} history - Conversation history updated when a tool executes.
 * @param {Object.<string, function>} registry - Tool name to handler map.
 * @returns {{ nextMessage: Object, shouldStop: boolean, history: Object[] }} Step result.
 */
function runAgentToolStep(assistantText, history, registry) {
  let toolCall = null;
  const match = assistantText.match(/<call:(\\w+)>(.*?)<\\/call>/);
  if (match) toolCall = { name: match[1], args: match[2] };

  if (toolCall) {
    const toolFn = registry[toolCall.name];
    let content = '';
    if (!toolFn) content = 'Error: Tool "' + toolCall.name + '" not found';
    else {
      try { content = toolFn(toolCall.args); } catch (err) { content = 'Error: ' + err.message; }
    }

    const nextHistory = [...history, { role: 'tool', name: toolCall.name, content }];
    return {
      nextMessage: { role: 'tool', name: toolCall.name, content },
      shouldStop: false,
      history: nextHistory,
    };
  }

  return {
    nextMessage: { role: 'assistant', content: assistantText },
    shouldStop: true,
    history,
  };
}`,explanation:"Tool-role messages distinguish execution feedback from assistant prose in the dialog state."},{id:"tool-use-agent-loop",stepLabel:"29.4",group:"Agent execution loop",title:"Agent Reason-Action Loop",concept:"When no tool call is present the agent stops; when a tool executes the loop continues with shouldStop = false.",objective:"Inside runAgentToolStep, return shouldStop false for tool calls and true for plain assistant text.",difficulty:"challenge",starterCode:`/**
 * Runs one agent tool step: parse optional tool call, dispatch, append history, decide whether to stop.
 * @param {string} assistantText - Latest assistant message text.
 * @param {Object[]} history - Conversation history updated when a tool executes.
 * @param {Object.<string, function>} registry - Tool name to handler map.
 * @returns {{ nextMessage: Object, shouldStop: boolean, history: Object[] }} Step result.
 */
function runAgentToolStep(assistantText, history, registry) {
  let toolCall = null;
  const match = assistantText.match(/<call:(\\w+)>(.*?)<\\/call>/);
  if (match) toolCall = { name: match[1], args: match[2] };

  if (toolCall) {
    const toolFn = registry[toolCall.name];
    let content = '';
    if (!toolFn) content = 'Error: Tool "' + toolCall.name + '" not found';
    else {
      try { content = toolFn(toolCall.args); } catch (err) { content = 'Error: ' + err.message; }
    }
    const nextHistory = [...history, { role: 'tool', name: toolCall.name, content }];
    return {
      nextMessage: { role: 'tool', name: toolCall.name, content },
      shouldStop: true,
      history: nextHistory,
    };
  }

  // TODO: return assistant nextMessage and the correct shouldStop flag when no tool call is found.
  return { nextMessage: {}, shouldStop: false, history };
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: JSON.stringify(actual) === JSON.stringify(expected) });
}
const reg = { get_weather: (loc) => 'sunny in ' + loc };
check('tool path continues', runAgentToolStep('<call:get_weather>Paris</call>', [], reg), {
  nextMessage: { role: 'tool', name: 'get_weather', content: 'sunny in Paris' },
  shouldStop: false,
  history: [{ role: 'tool', name: 'get_weather', content: 'sunny in Paris' }],
});
check('plain text stops', runAgentToolStep('All done.', [], reg), {
  nextMessage: { role: 'assistant', content: 'All done.' },
  shouldStop: true,
  history: [],
});
return results;`,hints:["Tool execution should set shouldStop to false so the loop continues.","Plain assistant text should set shouldStop to true."],solution:`/**
 * Runs one agent tool step: parse optional tool call, dispatch, append history, decide whether to stop.
 * @param {string} assistantText - Latest assistant message text.
 * @param {Object[]} history - Conversation history updated when a tool executes.
 * @param {Object.<string, function>} registry - Tool name to handler map.
 * @returns {{ nextMessage: Object, shouldStop: boolean, history: Object[] }} Step result.
 */
function runAgentToolStep(assistantText, history, registry) {
  let toolCall = null;
  const match = assistantText.match(/<call:(\\w+)>(.*?)<\\/call>/);
  if (match) toolCall = { name: match[1], args: match[2] };

  if (toolCall) {
    const toolFn = registry[toolCall.name];
    let content = '';
    if (!toolFn) content = 'Error: Tool "' + toolCall.name + '" not found';
    else {
      try { content = toolFn(toolCall.args); } catch (err) { content = 'Error: ' + err.message; }
    }
    const nextHistory = [...history, { role: 'tool', name: toolCall.name, content }];
    return {
      nextMessage: { role: 'tool', name: toolCall.name, content },
      shouldStop: false,
      history: nextHistory,
    };
  }

  return {
    nextMessage: { role: 'assistant', content: assistantText },
    shouldStop: true,
    history,
  };
}`,explanation:"The stop flag is what lets an outer loop alternate between model generation and tool execution."},{id:"agentic-apply-patch",stepLabel:"30.1",group:"Hunk apply",title:"Agentic text replacement",concept:"Agentic coding engines edit code bases by applying diff patches, finding target lines, and replacing them with revised code blocks.",objective:"Replace the first occurrence of targetString with replacementString in the content string.",difficulty:"warmup",starterCode:`function applyPatch(content, targetString, replacementString) {
  // TODO: replace targetString with replacementString in content
  return '';
}`,testCode:`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('replace line', applyPatch('let x = 1;\\nreturn x;', 'let x = 1;', 'let x = 2;'), 'let x = 2;\\nreturn x;');
return results;`,hints:["Use the .replace() method on strings.","return content.replace(targetString, replacementString);"],solution:`function applyPatch(content, targetString, replacementString) {
  return content.replace(targetString, replacementString);
}`,explanation:"Applying localized replacements enables developer agents to make targeted code changes without rewriting entire files."}];function F(e,t){const n=new Set(t);return e.filter(a=>n.has(a.group))}const G={linear:j,nn:q,transformer:L,lm:B,rag:D,eval:P,exp:N,nlp:R,core:E,prob:I,rl:V,diffusion:z,algo:J,frontier:K},f=new Set(["optimizers","ppo-clipped-policy-gradient"]),Q={"matrix-multiplication":{source:"linear",groups:["Dot product","Matrix cell","Matrix multiplication","Shape compatibility"]},"matrix-decompositions":{source:"linear",groups:["Transpose","Identity matrix","Shape compatibility"]},"fundamental-subspaces":{source:"linear",groups:["Projection","Orthogonality","Matrix-vector multiplication"]},"least-squares-projection":{source:"linear",groups:["Least-squares residual","Orthogonality","Projection matrix","Normal equations","Least-squares line fit"]},pseudoinverse:{source:"linear",groups:["Pseudoinverse bridge"]},"change-of-basis":{source:"linear",groups:["Change of basis"]},"condition-number":{source:"linear",groups:["Numerical stability"]},"determinant-volume":{source:"linear",groups:["Determinant and invertibility"]},"projection-matrices":{source:"linear",groups:["Projection matrix","Projection"]},"low-rank-approximation":{source:"linear",groups:["Low-rank approximation"]},pca:{source:"linear",groups:["Centering and covariance","PCA bridge"]},eigenvalue:{source:"linear",groups:["Eigenvalues"]},svd:{source:"linear",groups:["Low-rank approximation","Pseudoinverse bridge","Eigenvalues"]},"qr-decomposition":{source:"linear",groups:["Orthonormal bases","QR bridge"]},"gradient-descent":[{source:"nn",groups:["Derivative basics"]},{source:"nn",groups:["Gradient descent least squares"]}],optimization:[{source:"linear",groups:["Derivative basics","Chain rule"]},{source:"nn",groups:["Optimizer updates"]}],"linear-regression":[{source:"linear",groups:["Least-squares line fit","Gradient descent least squares"]},{source:"nn",groups:["Training loop mechanics"]}],"cosine-similarity":{source:"linear",groups:["Cosine similarity"]},"cross-entropy":[{source:"nn",groups:["Softmax cross-entropy"]},{source:"lm",groups:["Cross-entropy over sequence positions"]}],entropy:{source:"lm",groups:["Cross-entropy over sequence positions"]},"loss-functions-likelihoods":[{source:"nn",groups:["Softmax cross-entropy"]},{source:"lm",groups:["Cross-entropy over sequence positions","Tiny language-model loss"]}],"sampling-confidence-intervals":{source:"exp",groups:["Standard error and confidence intervals"]},"hypothesis-testing-intuition":{source:"exp",groups:["A/B test z-statistic"]},"probability-distributions":{source:"prob",groups:["Bernoulli mean","PDF eval"]},"conditional-probability":{source:"prob",groups:["P(A|B) formula","Chain rule"]},"bayes-rule-ml":{source:"prob",groups:["Numerator","Posterior normalize"]},"maximum-likelihood-estimation":{source:"prob",groups:["Gaussian mean MLE","Per-sample log"]},"expected-value-variance":{source:"prob",groups:["Weighted sum","Variance formula"]},"spearman-correlation":{source:"prob",groups:["Rank with ties","Pearson on ranks"]},"logistic-regression":{source:"nn",groups:["Logistic regression bridge"]},"classification-metrics":{source:"eval",groups:["Confusion matrix","Precision / recall / F1"]},"roc-pr-curves":{source:"eval",groups:["ROC / PR threshold sweeps","Cost-sensitive thresholding"]},calibration:{source:"eval",groups:["Calibration bins","Expected calibration error"]},regularization:{source:"nn",groups:["Regularization"]},overfitting:{source:"nn",groups:["Regularization","Training loop mechanics"]},"bias-variance-tradeoff":{source:"nn",groups:["Regularization","Training loop mechanics"]},"train-validation-test-split":{source:"core",groups:["Shuffle","Train slice","No leakage check"]},"cross-validation":{source:"core",groups:["Fold size","Train/val masks"]},"data-leakage-deep-dive":{source:"core",groups:["Label in features","Preprocessing leak"]},"feature-scaling-preprocessing":{source:"core",groups:["Mean","Transform"]},"k-means":{source:"core",groups:["Distance to centroid","Assignment","Mean update"]},"knn-naive-bayes-svm":{source:"core",groups:["kNN vote","SVM hinge"]},"tree-ensembles":{source:"core",groups:["Gini","Bagging average"]},"time-series-forecasting-track":{source:"core",groups:["Window slice","One-step forecast"]},"data-engineering-for-ml-track":{source:"core",groups:["Median impute","Dedup key"]},relu:{source:"nn",groups:["One neuron","Activation gradients"]},"leaky-relu":{source:"nn",groups:["Activation gradients"]},softmax:{source:"nn",groups:["Softmax cross-entropy","Attention algebra bridge"]},"neural-network":{source:"nn",groups:["One neuron","Mini neural network layer","Batch matrix shapes"]},"computation-graph-backprop":{source:"nn",groups:["Chain rule","One-neuron backprop","Activation gradients","Matrix multiplication backprop"]},"training-loop-dynamics":{source:"nn",groups:["Training loop mechanics"]},"dropout-batchnorm":{source:"nn",groups:["Regularization"]},"gradient-problems":{source:"nn",groups:["Activation gradients","Derivative basics"]},"layer-normalization":{source:"transformer",groups:["LayerNorm and RMSNorm"]},lstm:{source:"nn",groups:["Forget and input gates","Candidate cell","Cell state update","Output gate & hidden output"]},conv2d:{source:"nn",groups:["Output size formula","One patch dot product"]},"max-pooling":{source:"nn",groups:["Window max"]},"conv-relu":{source:"nn",groups:["ReLU clip"]},initialization:{source:"nn",groups:["He std"]},"attention-mechanism":[{source:"nn",groups:["Attention algebra bridge"]},{source:"transformer",groups:["Mini self-attention"]}],"self-attention":{source:"transformer",groups:["Mini self-attention"]},"attention-masks":{source:"transformer",groups:["Transformer mini-block shapes","Mini self-attention"]},"positional-encoding":{source:"transformer",groups:["Transformer mini-block shapes"]},transformer:{source:"transformer",groups:["Transformer mini-block shapes","Mini self-attention","LayerNorm and RMSNorm","Residual stream mechanics","MLP and SwiGLU","Tiny transformer block","Transformer debugging checks"]},"residual-stream":{source:"transformer",groups:["Residual stream mechanics","Tiny transformer block"]},rope:{source:"transformer",groups:["Rotate 2D block","Apply to head dimension"]},"transformer-architecture-families":{source:"transformer",groups:["FFN expansion ratio","Parameter estimate"]},"coconut-latent-reasoning":{source:"transformer",groups:["Latent residual add","Gate blend"]},"grouped-query-attention":{source:"transformer",groups:["KV head index","Repeat/broadcast rule"]},"kv-cache":{source:"transformer",groups:["Cache append","Sequence slicing","Cached cross-attention","Autoregressive generation step"]},"flash-attention":{source:"transformer",groups:["Row max update","Running sum"]},"spec-sparse-attention":{source:"transformer",groups:["Draft prefix length","Criticality average","Top-k block selection","KV blocks skipped","Effective KV rows read"]},turboquant:{source:"transformer",groups:["Cache memory formula","Nearest codebook entry","Dequant reconstruction","Dot-product error","Compression ratio"]},"efficient-inference-compression-track":{source:"transformer",groups:["Shape guard","INT8 dot","Dequant fuse","Per-channel scale"]},bert:{source:"transformer",groups:["80-10-10 masking rule","Bidirectional attention mask","MLM cross-entropy loss","BERT MLM step"]},moe:{source:"transformer",groups:["Softmax gate","Top-k pick","Load per expert","Weighted combine"]},"fine-tuning":{source:"transformer",groups:["Alpha scaling","Effective delta add"]},"native-sparse-attention":{source:"transformer",groups:["Block grid","Top-k blocks","Mask scatter","Effective attention region"]},"recommender-systems-ranking-track":{source:"eval",groups:["Dot score","Pairwise hinge"]},"llm-training-objectives":{source:"lm",groups:["Teacher forcing","Causal label shifting","Cross-entropy over sequence positions","Tiny language-model loss"]},"transformer-token-generation":{source:"lm",groups:["Mini vocabulary and logits","Sampling from logits"]},"sampling-strategies":{source:"lm",groups:["Sampling from logits","Temperature and top-k / top-p"]},"gpt2-comprehensive":{source:"lm",groups:["Mini vocabulary and logits","Cross-entropy over sequence positions","Tiny language-model loss","Teacher forcing","Causal label shifting","Mini token training step","Sampling from logits","Temperature and top-k / top-p"]},"eagle-3-1-speculative-decoding":{source:"lm",groups:["Self-trust threshold","Token salvage"]},"bag-of-words":{source:"rag",groups:["Bag-of-words vectors"]},tokenization:[{source:"rag",groups:["Token counts and chunking"]},{source:"lm",groups:["Mini vocabulary and logits"]}],embeddings:[{source:"transformer",groups:["Transformer mini-block shapes"]},{source:"lm",groups:["Mini vocabulary and logits"]}],word2vec:{source:"nlp",groups:["Similarity score","Sigmoid activation","Positive pair likelihood","Negative sample loss","Skip-gram gradient update"]},glove:{source:"nlp",groups:["Co-occurrence weight","Dot-plus-bias prediction","Full scalar loss"]},fasttext:{source:"nlp",groups:["Character n-gram enumerate","Hash bucket","Subword vector sum"]},rag:{source:"rag",groups:["Token counts and chunking","Bag-of-words vectors","Cosine retrieval","Retrieval metrics","Reranking and grounding checks","Prompt packing / context budget"]},"rag-chunking-context":{source:"rag",groups:["Token counts and chunking","Prompt packing / context budget"]},"rag-vector-indexing":{source:"rag",groups:["Cosine retrieval"]},"rag-reranking-grounding":{source:"rag",groups:["Reranking and grounding checks"]},"rag-retrieval-evaluation":{source:"rag",groups:["Retrieval metrics"]},"rag-failure-modes":{source:"rag",groups:["Reranking and grounding checks","Retrieval metrics"]},vae:{source:"nn",groups:["KL closed form"]},"multimodal-llm":{source:"nn",groups:["Linear project"]},"ab-testing-foundations":{source:"exp",groups:["Treatment/control split","Difference in means","A/B test z-statistic"]},"power-sample-size":{source:"exp",groups:["Power and MDE intuition"]},"cuped-variance-reduction":{source:"exp",groups:["CUPED adjustment"]},"causal-graphs-dags":{source:"exp",groups:["DAG adjustment-set checks"]},"treatment-effects":{source:"exp",groups:["Difference in means"]},"propensity-scores":{source:"exp",groups:["Propensity score weighting"]},"sequential-testing-peeking":{source:"exp",groups:["A/B test z-statistic"]},"confounding-simpsons-paradox":{source:"exp",groups:["DAG adjustment-set checks"]},"bloom-filter":{source:"algo",groups:["Hash positions","Query all bits"]},pagerank:{source:"algo",groups:["Out-link normalize","Damping teleport"]},"diffusion-basics":{source:"diffusion",groups:["Noise scale","Alpha bar","Forward sample","Signal-to-noise ratio"]},"diffusion-sampling":{source:"diffusion",groups:["Beta scheduling","Forward noise scheduler","Posterior mean estimation","Denoised reverse step"]},"classifier-free-guidance":{source:"diffusion",groups:["scale mix"]},"unet-vs-dit":{source:"diffusion",groups:["skip concat","patch tokens"]},"sd3-overview":{source:"diffusion",groups:["VAE downscale"]},"flow-matching":{source:"diffusion",groups:["linear interp"]},"diffusion-vae":{source:"diffusion",groups:["encode scale"]},"tokenizer-bpe":{source:"diffusion",groups:["pair count","merge rule"]},"clip-encoder":{source:"diffusion",groups:["L2 normalize"]},"t5-encoder":{source:"diffusion",groups:["pad mask"]},"joint-attention":{source:"diffusion",groups:["Concat Q"]},dit:{source:"diffusion",groups:["adaLN scale/shift"]},"frontier-llm-architecture-overview":{source:"frontier",groups:["Weight bytes","KV bytes"]},"frontier-moe-systems":{source:"frontier",groups:["Active fraction"]},"multi-head-latent-attention":{source:"frontier",groups:["Cache size ratio"]},"reasoning-rlvr-grpo":{source:"frontier",groups:["Relative advantage"]},"test-time-compute-thinking-budgets":{source:"frontier",groups:["Budget split"]},"long-context-frontier-models":{source:"frontier",groups:["Linear seq scaling"]},"omni-multimodal-architectures":{source:"frontier",groups:["Weighted fuse"]},"diffusion-language-models":{source:"frontier",groups:["Mask ratio"]},"efficient-llm-serving":{source:"frontier",groups:["Continuous batching"]},"frontier-evaluation-safety":{source:"eval",groups:["Pass@k"]},"tool-using-reasoning-models":{source:"frontier",groups:["Tool call parser","Action dispatcher","History integration","Agent execution loop"]},"agentic-coding-systems":{source:"frontier",groups:["Hunk apply"]},"rl-foundations":{source:"rl",groups:["One-step return","Discount chain"]},"mdp-formalism":{source:"rl",groups:["Transition sum","Gamma discount"]},"value-iteration":{source:"rl",groups:["Max over actions","Backup once"]},"policy-iteration":{source:"rl",groups:["Eval backup","Greedy improve"]},"q-learning":{source:"rl",groups:["Epsilon-greedy selection","Terminal-aware TD target","Tabular Q-update","Complete agent step"]},"rl-exploration":{source:"rl",groups:["Epsilon mix","UCB formula"]},"policy-gradients":{source:"rl",groups:["Baseline subtract","Return multiply"]},"actor-critic":{source:"rl",groups:["TD error","Actor log grad"]},"reward-shaping":{source:"rl",groups:["Potential phi","Total step reward"]},"grpo-reasoning":{source:"rl",groups:["Group mean","Relative reward"]},"dapo-reasoning-rl":{source:"rl",groups:["Reward clip","Decoupled baseline"]},"markov-chains":{source:"rl",groups:["One-step multiply","Stationary"]},"model-monitoring":{source:"eval",groups:["Drift checks"]},"model-debugging":{source:"transformer",groups:["Transformer debugging checks"]},"model-interpretability":{source:"eval",groups:["Marginal contrib","Sum to delta"]},"model-fairness":{source:"eval",groups:["Group rate","Parity gap"]},"uncertainty-estimation":{source:"eval",groups:["Predictive entropy","Variance across samples"]},"ml-security-robustness-track":{source:"eval",groups:["Gradient sign step","Perturbation clip"]}};function W(e){const t=Array.isArray(e)?e:[e],n=[];for(const a of t){const o=G[a.source];n.push(...F(o,a.groups))}return n}function U(e){if(f.has(e))return null;const t=Q[e];if(!t)return null;const n=W(t);return n.length>0?n:null}function H(e){return e.flatMap(t=>{if(f.has(t.lessonId))return[t];const n=U(t.lessonId);return n?[{...t,exercises:n.map((a,o)=>({...a,id:`${t.lessonId}--${a.id}`,group:t.lessonName,stepLabel:`${t.groupNumber}.${o+1}`}))}]:[]})}function s(e,t){return H(M(e,t))}const X=s("nlp",{kind:"text representation",signalName:"text relevance",stages:["tokenize","vectorize","compare"],stageExplanation:"NLP code usually has to tokenize text before it can build or compare representations."}),_=s("transformers",{kind:"sequence-modeling",signalName:"attention or routing score",stages:["project","score","mix"],stageExplanation:"Transformer internals depend on explicit projection, scoring, and mixing stages."}),$=s("papers",{kind:"paper-reading",signalName:"claim, mechanism, or evidence score",stages:["claim","mechanism","evidence"],stageExplanation:"Paper lessons work best when the claim, mechanism, and evidence are checked separately."}),Y=s("frontier-llms",{kind:"frontier-model evaluation",signalName:"capability or risk score",stages:["measure","compare","gate"],stageExplanation:"Frontier-model systems need measurement, comparison, and release gates before deployment decisions."}),Z=s("neural-networks",{kind:"neural-network computation",signalName:"activation or gradient signal",stages:["forward","loss","update"],stageExplanation:"Neural-network code is built around forward computation, loss measurement, and parameter updates."}),ee=h(Z,"optimizers",()=>[{id:"optimizers-minibatch-mean-gradient",title:"Average mini-batch gradients",concept:"Mini-batch optimizers update from the mean of noisy per-example gradients, not from one arbitrary example.",objective:"Return the coordinate-wise mean gradient for a batch of gradient vectors.",difficulty:"core",starterCode:`function meanGradient(gradients) {
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
}`,explanation:"Bias correction keeps Adam from underestimating early moments, while the second moment still rescales coordinates with different gradient magnitudes."}]),te=s("advanced-models",{kind:"advanced-model pipeline",signalName:"retrieval or multimodal score",stages:["encode","retrieve","ground"],stageExplanation:"Advanced model systems often encode inputs, retrieve or combine evidence, and check grounding."}),ae=s("math-fundamentals",{kind:"mathematical computation",signalName:"numeric fit or stability score",stages:["represent","compute","check"],stageExplanation:"Math code is clearer when representation, computation, and result checks are separate."}),ne=s("core-ml",{kind:"machine-learning workflow",signalName:"validation metric",stages:["split","train","evaluate"],stageExplanation:"Core ML workflows depend on clean data splits, training logic, and honest evaluation."}),re=s("model-reliability",{kind:"reliability check",signalName:"monitoring or risk score",stages:["observe","alert","triage"],stageExplanation:"Reliability systems observe behavior, alert on meaningful shifts, and triage failures."}),oe=s("experimentation-causal-ml",{kind:"experiment analysis",signalName:"effect or balance score",stages:["assign","measure","compare"],stageExplanation:"Experiment code must separate assignment, measurement, and comparison to support causal claims."}),se=s("probability-stats",{kind:"probability/statistics calculation",signalName:"probability or uncertainty score",stages:["count","normalize","summarize"],stageExplanation:"Probability code often counts outcomes, normalizes them, then summarizes uncertainty."}),ie=s("reinforcement-learning",{kind:"reinforcement-learning loop",signalName:"return or action-value score",stages:["observe","act","learn"],stageExplanation:"RL loops observe state, choose actions, and update behavior from feedback."}),ce=h(ie,"ppo-clipped-policy-gradient",()=>[{id:"ppo-policy-ratio",title:"Compute the policy ratio",concept:"PPO compares the new policy probability with the old collection-policy probability for the sampled action.",objective:"Return pi_new divided by pi_old.",difficulty:"core",starterCode:`function policyRatio(newProbability, oldProbability) {
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
}`,explanation:"The minibatch audit links the PPO formula to the lesson table: not every out-of-band ratio clips, because the advantage sign decides which side is conservative."}]),le=s("algorithms",{kind:"algorithmic data structure",signalName:"rank or membership score",stages:["insert","query","verify"],stageExplanation:"Algorithmic structures are useful when updates, queries, and checks are kept explicit."}),ue=s("diffusion-models",{kind:"diffusion-model pipeline",signalName:"noise or denoising score",stages:["noise","condition","denoise"],stageExplanation:"Diffusion systems manage noise, conditioning, and denoising as separate implementation stages."}),g=[...X,..._,...$,...Y,...ee,...te,...ae,...ne,...re,...oe,...se,...ce,...le,...ue],de=Object.fromEntries(g.map(e=>[e.lessonId,e]));g.flatMap(e=>e.exercises);function pe(e){return de[e]||null}function he(e){var t;return((t=pe(e))==null?void 0:t.exercises)||[]}export{g as L,he as g};
