import { readFileSync, writeFileSync } from 'node:fs';

function replaceOnce(path, before, after) {
  const source = readFileSync(path, 'utf8');
  const occurrences = source.split(before).length - 1;
  if (occurrences !== 1) {
    throw new Error(`${path}: expected exactly one match, found ${occurrences}`);
  }
  writeFileSync(path, source.replace(before, after));
}

replaceOnce(
  'unified-app/src/data/linearRegressionAssessment.js',
  "['-16', '4']",
  "['Negative 16', '4']",
);

replaceOnce(
  'unified-app/src/data/fundamentalSubspacesAssessment.js',
  "q('fs-004-row-ambient', 'Foundation', 'Where does Row(A) live for an m by n matrix?', 'In the input domain R^n', ['In the output codomain R^m', 'In the scalar field only'],",
  "q('fs-004-row-ambient', 'Foundation', 'Where does Row(A) live for an m by n matrix?', 'In the input domain R^n', ['In a separate output-only coordinate system unrelated to the rows', 'In the scalar field only'],",
);

replaceOnce(
  'unified-app/src/data/fundamentalSubspacesAssessment.js',
  "q('fs-011-rank-shared', 'Foundation', 'Which two spaces always have dimension rank(A)?', 'Row(A) and Col(A)', ['Null(A) and Null(A^T)', 'Row(A) and Null(A)'],",
  "q('fs-011-rank-shared', 'Foundation', 'Which two spaces always have dimension rank(A)?', 'Row(A) and Col(A)', ['Null(A) and Null(A^T)', 'Row(A) paired with an arbitrary null-space direction'],",
);

replaceOnce(
  'unified-app/src/data/fundamentalSubspacesAssessment.js',
  "q('fs-012-nullity', 'Foundation', 'For rank r, what is dim Null(A)?', 'n - r', ['m - r', 'r + n'],",
  "q('fs-012-nullity', 'Foundation', 'For rank r, what is dim Null(A)?', 'n - r', ['m + r', 'r + n'],",
);

replaceOnce(
  'unified-app/src/data/fundamentalSubspacesAssessment.js',
  "q('fs-013-left-nullity', 'Foundation', 'For rank r, what is dim Null(A^T)?', 'm - r', ['n - r', 'r - m'],",
  "q('fs-013-left-nullity', 'Foundation', 'For rank r, what is dim Null(A^T)?', 'm - r', ['n + r', 'r - m'],",
);

replaceOnce(
  'unified-app/src/data/fundamentalSubspacesAssessment.js',
  "q('fs-014-domain-split', 'Foundation', 'Which two spaces split the input domain R^n?', 'Row(A) and Null(A)', ['Col(A) and Null(A^T)', 'Col(A) and Row(A)'],",
  "q('fs-014-domain-split', 'Foundation', 'Which two spaces split the input domain R^n?', 'Row(A) and Null(A)', ['Two output-side subspaces in R^m', 'Col(A) and Row(A)'],",
);

replaceOnce(
  'unified-app/src/data/fundamentalSubspacesAssessment.js',
  "q('fs-015-codomain-split', 'Foundation', 'Which two spaces split the output codomain R^m?', 'Col(A) and Null(A^T)', ['Row(A) and Null(A)', 'Null(A) and Col(A)'],",
  "q('fs-015-codomain-split', 'Foundation', 'Which two spaces split the output codomain R^m?', 'Col(A) and Null(A^T)', ['Two input-side subspaces in R^n', 'Null(A) and Col(A)'],",
);

console.log('Additional assessment baseline fixes applied.');
