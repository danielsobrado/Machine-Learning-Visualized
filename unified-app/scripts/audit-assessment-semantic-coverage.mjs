import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import {
  classifyAssessmentSemanticProtection,
  isSemanticallyProtectedClassification,
  validateAssessmentSemanticCoverage,
} from '../src/data/assessmentSemanticCoverage.js';
import { ASSESSMENT_COMPETENCY_AUDITED_LESSON_IDS } from '../src/data/assessmentCompetencyRegistry.js';
import { ASSESSMENT_QUALITY_PRIORITY_LESSON_IDS } from '../src/data/assessmentQualityManifest.js';
import { lessonAssessments } from '../src/data/lessonAssessments.js';

const DATA_DIR = fileURLToPath(new URL('../src/data/', import.meta.url));
const AUDITED_EXPORT_SUFFIX = '_AUDITED_LESSON_IDS';
const REQUIREMENTS_EXPORT_PATTERN = /_REQUIREMENTS$/;
const COVERAGE_EXPORT_PATTERN = /_COVERAGE$/;
const ASSESSMENT_TEST_PATTERN = /Assessment\.test\.mjs$/;
const COVERAGE_MODULE_PATTERN = /Coverage\.js$/;
const DEDICATED_ASSESSMENT_PATTERN = /Assessment\.js$/;
const LESSON_LOOKUP_PATTERN = /getLessonAssessment\(\s*(['"`])([^'"`]+)\1\s*\)/g;

async function dataFiles() {
  return (await readdir(DATA_DIR, { withFileTypes: true }))
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .sort();
}

async function discoverTopicTestLessonIds(files) {
  const lessonIds = new Set();

  for (const fileName of files.filter((name) => ASSESSMENT_TEST_PATTERN.test(name))) {
    const source = await readFile(path.join(DATA_DIR, fileName), 'utf8');
    for (const match of source.matchAll(LESSON_LOOKUP_PATTERN)) lessonIds.add(match[2]);
  }

  return lessonIds;
}

function addLessonId(lessonIds, lessonId) {
  if (typeof lessonId === 'string' && lessonId.length > 0) lessonIds.add(lessonId);
}

export function getCoverageLessonIdsFromModule(module) {
  const lessonIds = new Set();

  for (const [exportName, value] of Object.entries(module)) {
    if (exportName.endsWith(AUDITED_EXPORT_SUFFIX) && Array.isArray(value)) {
      for (const lessonId of value) addLessonId(lessonIds, lessonId);
      continue;
    }

    if (REQUIREMENTS_EXPORT_PATTERN.test(exportName) && Array.isArray(value)) {
      for (const requirement of value) addLessonId(lessonIds, requirement?.lessonId);
      continue;
    }

    if (COVERAGE_EXPORT_PATTERN.test(exportName) && value && typeof value === 'object' && !Array.isArray(value)) {
      for (const lessonId of Object.keys(value)) addLessonId(lessonIds, lessonId);
    }
  }

  return lessonIds;
}

async function discoverLegacyCoverageLessonIds(files) {
  const lessonIds = new Set();

  for (const fileName of files.filter((name) => COVERAGE_MODULE_PATTERN.test(name))) {
    const filePath = path.join(DATA_DIR, fileName);
    const source = await readFile(filePath, 'utf8');
    if (!source.includes('_COVERAGE') && !source.includes('_REQUIREMENTS') && !source.includes(AUDITED_EXPORT_SUFFIX)) {
      continue;
    }

    const module = await import(pathToFileURL(filePath).href);
    for (const lessonId of getCoverageLessonIdsFromModule(module)) lessonIds.add(lessonId);
  }

  return lessonIds;
}

function classificationCounts(records) {
  return Object.freeze(Object.fromEntries(
    [...new Set(records.map(({ classification }) => classification))]
      .sort()
      .map((classification) => [
        classification,
        records.filter((record) => record.classification === classification).length,
      ]),
  ));
}

export async function buildAssessmentSemanticCoverageInventory() {
  const files = await dataFiles();
  const priorityLessonIds = new Set(ASSESSMENT_QUALITY_PRIORITY_LESSON_IDS);
  const competencyLessonIds = new Set(ASSESSMENT_COMPETENCY_AUDITED_LESSON_IDS);
  const intentionallyNonPriorityLessonIds = new Set();
  const [topicTestLessonIds, legacyCoverageLessonIds] = await Promise.all([
    discoverTopicTestLessonIds(files),
    discoverLegacyCoverageLessonIds(files),
  ]);
  const lessonIds = new Set([
    ...Object.keys(lessonAssessments),
    ...priorityLessonIds,
    ...competencyLessonIds,
  ]);

  const records = [...lessonIds]
    .sort()
    .map((lessonId) => {
      const assessment = lessonAssessments[lessonId] || { source: 'empty' };
      const classification = classifyAssessmentSemanticProtection({
        lessonId,
        source: assessment.source,
        priorityLessonIds,
        competencyLessonIds,
        topicTestLessonIds,
        legacyCoverageLessonIds,
        intentionallyNonPriorityLessonIds,
      });

      return Object.freeze({
        lessonId,
        priority: priorityLessonIds.has(lessonId),
        dedicated: assessment.source === 'curated',
        source: assessment.source,
        classification,
      });
    });

  const dedicatedAssessmentModuleFiles = files
    .filter((name) => DEDICATED_ASSESSMENT_PATTERN.test(name))
    .sort();
  const priorityGaps = records
    .filter((record) => record.priority && !isSemanticallyProtectedClassification(record.classification))
    .map(({ lessonId }) => lessonId);
  const promotionCandidates = records
    .filter((record) => record.dedicated && !isSemanticallyProtectedClassification(record.classification))
    .map(({ lessonId }) => lessonId);

  return Object.freeze({
    records: Object.freeze(records),
    dedicatedAssessmentModuleFiles: Object.freeze(dedicatedAssessmentModuleFiles),
    summaryByClassification: classificationCounts(records),
    priorityGaps: Object.freeze(priorityGaps),
    promotionCandidates: Object.freeze(promotionCandidates),
  });
}

export function formatAssessmentSemanticCoverageJson(report) {
  return `${JSON.stringify(report, null, 2)}\n`;
}

export function formatAssessmentSemanticCoverageMarkdown(report) {
  const lines = [
    '# Assessment semantic coverage',
    '',
    `- Registered lessons: ${report.records.length}`,
    `- Dedicated assessment modules: ${report.dedicatedAssessmentModuleFiles.length}`,
    `- Priority semantic gaps: ${report.priorityGaps.length}`,
    `- Promotion candidates: ${report.promotionCandidates.length}`,
    '',
    '## Classification counts',
    '',
    '| Classification | Lessons |',
    '|---|---:|',
    ...Object.entries(report.summaryByClassification).map(([classification, count]) => `| ${classification} | ${count} |`),
    '',
    '## Priority coverage',
    '',
    '| Lesson | Classification |',
    '|---|---|',
    ...report.records
      .filter(({ priority }) => priority)
      .map(({ lessonId, classification }) => `| ${lessonId} | ${classification} |`),
  ];

  if (report.promotionCandidates.length > 0) {
    lines.push('', '## Promotion candidates', '', ...report.promotionCandidates.map((lessonId) => `- ${lessonId}`));
  }

  return `${lines.join('\n')}\n`;
}

async function runCli() {
  const report = await buildAssessmentSemanticCoverageInventory();
  const errors = validateAssessmentSemanticCoverage(report.records);
  const format = process.argv.includes('--json') ? 'json' : 'markdown';

  process.stdout.write(
    format === 'json'
      ? formatAssessmentSemanticCoverageJson(report)
      : formatAssessmentSemanticCoverageMarkdown(report),
  );

  if (errors.length > 0) {
    process.stderr.write(`\nSemantic coverage errors:\n${errors.map((error) => `- ${error}`).join('\n')}\n`);
    process.exitCode = 1;
  }
}

const invokedPath = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : null;
if (invokedPath === import.meta.url) {
  runCli().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
