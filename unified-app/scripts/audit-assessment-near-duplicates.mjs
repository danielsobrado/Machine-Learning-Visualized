import { findAssessmentNearDuplicates, assessmentNearDuplicateDefaults } from '../src/data/assessmentNearDuplicates.js';
import { lessonAssessments } from '../src/data/lessonAssessments.js';

const ALLOWLIST = Object.freeze([]);

function markdown(findings) {
  const defaults = assessmentNearDuplicateDefaults();
  const lines = [
    '# Assessment near-duplicate audit',
    '',
    `- Similarity threshold: ${defaults.threshold}`,
    `- Minimum normalized tokens: ${defaults.minTokens}`,
    `- Suspected pairs: ${findings.length}`,
    '',
  ];

  if (!findings.length) return `${lines.join('\n')}No suspected near-duplicates found.\n`;

  lines.push('| Similarity | Lesson | Left | Right |', '|---:|---|---|---|');
  for (const finding of findings) {
    lines.push(`| ${finding.similarity.toFixed(4)} | ${finding.lessonId} | ${finding.leftId} | ${finding.rightId} |`);
  }

  lines.push('', 'These are review candidates only. This audit is intentionally non-blocking.');
  return `${lines.join('\n')}\n`;
}

const findings = findAssessmentNearDuplicates(lessonAssessments, { allowlist: ALLOWLIST });

if (process.argv.includes('--json')) {
  process.stdout.write(`${JSON.stringify(findings, null, 2)}\n`);
} else {
  process.stdout.write(markdown(findings));
}
