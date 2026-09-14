import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { allAnimations, categories, getAnimationById } from '../src/data/animations.js';
import { HUB_LEARNING_PATHS } from '../src/data/learningPaths.js';
import { lessonAssessments } from '../src/data/lessonAssessments.js';
import { getGlossaryTermsForCategory } from '../src/data/glossaryRepository.js';
import { EFFECTIVE_MANUAL_LESSON_QUALITY } from '../src/data/effectiveLessonQuality.js';
import {
  D_TIER_PLACEHOLDERS,
  MODULE_QUALITY_TIERS,
} from '../src/data/lessonQualityManifest.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(__dirname, '..');
const OUTPUT_PATH = path.join(APP_ROOT, 'curriculum-module-audit.md');

const criticalPaths = new Set(
  HUB_LEARNING_PATHS.flatMap((learningPath) => learningPath.nodes),
);

function findIndexFile(dir) {
  const candidates = ['index.jsx', 'index.tsx', 'index.js', 'index.ts'];
  return candidates.find((fileName) => fs.existsSync(path.join(dir, fileName)));
}

function countChildPanels(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => /\.tsx?$|\.jsx$/.test(name) && !name.startsWith('index.'))
    .length;
}

function inferTierFromSource(id, indexFilePath) {
  const source = fs.readFileSync(indexFilePath, 'utf8');
  const { size } = fs.statSync(indexFilePath);
  const dir = path.dirname(indexFilePath);
  const childCount = countChildPanels(dir);
  const importsCoreMlShared = /core-ml-shared/.test(source) || /CoreMlLesson/.test(source);

  if (size <= 260) return 'C';
  if (importsCoreMlShared && size <= 1400 && childCount === 0) return 'C';
  if (size >= 13000 || childCount >= 9) return 'A';
  if (size >= 7000 || childCount >= 4) return 'B';
  if (size >= 3500) return 'B';
  return 'C';
}

function classifyLesson(id) {
  const animation = getAnimationById(id);
  const dir = path.join(APP_ROOT, 'src', 'animations', id);
  const indexFile = findIndexFile(dir);

  if (!animation || !indexFile) {
    return {
      tier: 'D',
      source: 'missing',
      reason: 'Lesson missing expected component entry.',
      action: 'Implement module folder and index entry before testing.',
      size: 0,
      childCount: 0,
    };
  }

  const indexPath = path.join(dir, indexFile);
  const manual = EFFECTIVE_MANUAL_LESSON_QUALITY[id];
  const size = fs.statSync(indexPath).size;
  const childCount = countChildPanels(dir);

  if (manual) {
    return {
      ...manual,
      source: 'manual',
      size,
      childCount,
    };
  }

  const tier = inferTierFromSource(id, indexPath);
  return {
    tier,
    source: 'auto',
    rationale: 'Auto-classified by source density and component breadth.',
    nextAction: 'Review and set explicit manual quality entry.',
    size,
    childCount,
  };
}

function buildCategoryBuckets() {
  const byCategory = Object.fromEntries(categories.map((category) => [category.id, []]));

  for (const animation of allAnimations) {
    byCategory[animation.categoryId]?.push(animation.id);
  }

  return byCategory;
}

function toMarkdownTableRow(module) {
  const tierBadge = `${module.tier} (${MODULE_QUALITY_TIERS[module.tier]})`;
  return `| ${module.id} | ${tierBadge} | ${module.source} | ${module.size} | ${module.childCount} | ${module.assessmentCount} | ${module.labCount} | ${module.glossaryCount} | ${module.estimatedMinutes || ''} | ${module.status || ''} | ${module.nextAction} |`;
}

function generateMarkdown() {
  const byCategory = buildCategoryBuckets();
  const reportDate = new Date().toISOString();
  const entries = allAnimations
    .map((animation) => {
      const audit = classifyLesson(animation.id);
      const assessment = lessonAssessments[animation.id] || {};
      return {
        ...animation,
        ...audit,
        assessmentCount: assessment.quiz?.length || 0,
        labCount: assessment.labs?.length || 0,
        glossaryCount: getGlossaryTermsForCategory(animation.categoryId).length,
      };
    })
    .sort((a, b) => a.id.localeCompare(b.id));

  const criticalEntries = entries.filter((entry) => criticalPaths.has(entry.id));
  const dTierEntries = entries.filter((entry) => entry.tier === 'D');
  const placeholderD = dTierEntries.filter((entry) => D_TIER_PLACEHOLDERS.includes(entry.id));
  const unexpectedD = dTierEntries.filter((entry) => !D_TIER_PLACEHOLDERS.includes(entry.id));

  const lines = [];
  lines.push('# Curriculum Module Audit');
  lines.push('');
  lines.push(`Generated: ${reportDate}`);
  lines.push('');
  lines.push('## Review Policy');
  lines.push('');
  lines.push('- Tier A: excellent custom lesson with strong interaction and assessment-facing mechanics.');
  lines.push('- Tier B: meaningful lesson with reusable controls and working conceptual workflow.');
  lines.push('- Tier C: adequate but currently shallow or shared lesson wrapper.');
  lines.push('- Tier D: placeholder or insufficient quality requiring immediate conversion.');
  lines.push('- Source `manual` means the lesson quality tier is manifest-claimed; source `auto` means it was inferred from inspected source shape.');
  lines.push('- Release checklist: `npm test`, `npm run audit:quality`, `npm run test:smoke`, `npm run build`.');
  lines.push('');
  lines.push(`- Total active lessons: ${entries.length}`);
  lines.push(`- Priority paths covered: ${HUB_LEARNING_PATHS.map((pathDef) => pathDef.label).join(', ')}`);
  lines.push('');
  lines.push('## Priority Track Coverage');
  lines.push('');
  lines.push('| Lesson | Tier | Source | Size (bytes) | Side-Panel Files | Assessment Count | Lab Count | Glossary Count | Est. Min | Status | Next Action |');
  lines.push('| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |');
  for (const entry of criticalEntries.sort((a, b) => a.id.localeCompare(b.id))) {
    lines.push(toMarkdownTableRow(entry));
  }
  lines.push('');
  lines.push('## All Modules');
  lines.push('');

  for (const [categoryId, ids] of Object.entries(byCategory)) {
    lines.push(`### ${categoryId}`);
    lines.push('');
    lines.push('| Lesson | Tier | Source | Size (bytes) | Side-Panel Files | Assessment Count | Lab Count | Glossary Count | Est. Min | Status | Next Action |');
    lines.push('| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |');
    ids
      .map((id) => entries.find((entry) => entry.id === id))
      .sort((a, b) => a.id.localeCompare(b.id))
      .forEach((entry) => {
        lines.push(toMarkdownTableRow(entry));
      });
    lines.push('');
  }

  lines.push('## Immediate Remediation');
  lines.push('');
  if (placeholderD.length) {
    lines.push('### Placeholder/Transition Modules');
    for (const entry of placeholderD.sort((a, b) => a.id.localeCompare(b.id))) {
      lines.push(`- ${entry.id}: ${entry.nextAction}`);
    }
    lines.push('');
  }

  if (unexpectedD.length) {
    lines.push('### Unexpected Tier D Items (Review Required)');
    for (const entry of unexpectedD.sort((a, b) => a.id.localeCompare(b.id))) {
      lines.push(`- ${entry.id}: ${entry.nextAction}`);
    }
    lines.push('');
  } else {
    lines.push('No unexpected Tier D items were detected.');
  }

  return `${lines.join('\n')}\n`;
}

const output = generateMarkdown();
fs.writeFileSync(OUTPUT_PATH, output, 'utf8');

console.log(`Curriculum module audit generated: ${OUTPUT_PATH}`);
