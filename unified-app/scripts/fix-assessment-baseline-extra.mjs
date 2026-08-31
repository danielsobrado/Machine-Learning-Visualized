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

console.log('Additional assessment baseline fixes applied.');
