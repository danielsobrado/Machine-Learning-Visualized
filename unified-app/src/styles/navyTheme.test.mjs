import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const themePath = path.join(here, 'cloudflare-theme.css');
const navyPath = path.join(here, 'cloudflare', 'navy-theme.css');

const theme = fs.readFileSync(themePath, 'utf8');
const navy = fs.readFileSync(navyPath, 'utf8');

test('navy theme is the final template palette authority', () => {
  const imports = [...theme.matchAll(/@import\s+['"]([^'"]+)['"]/g)].map((match) => match[1]);
  assert.equal(imports.at(-1), './cloudflare/navy-theme.css');
});

test('template accent and warm aliases resolve to deep blue families', () => {
  assert.match(navy, /--cf-accent:\s*#0a2a4a;/);
  assert.match(navy, /--cf-accent-strong:\s*#08233e;/);
  assert.match(navy, /--cf-accent-ink:\s*#061b31;/);
  assert.match(navy, /--cf-warning:\s*#123d66;/);
  assert.match(navy, /--ds-warm:\s*var\(--cf-warning\);/);
  assert.match(navy, /--ds-warn:\s*var\(--cf-warning\);/);
});

test('legacy warm utility chrome is remapped to navy', () => {
  for (const family of ['orange', 'amber', 'yellow']) {
    assert.match(navy, new RegExp(`text-${family}-`));
    assert.match(navy, new RegExp(`border-${family}-`));
    assert.match(navy, new RegExp(`bg-${family}-`));
  }
});

test('authoritative navy layer does not reintroduce the old brown-orange palette', () => {
  const forbidden = [
    '#f48120',
    '#b85a08',
    '#93450b',
    '#a16207',
    '#a85a3a',
    '#dd731a',
    '#e97718',
    '244 129 32',
    '168, 90, 58',
  ];

  for (const color of forbidden) {
    assert.equal(navy.toLowerCase().includes(color.toLowerCase()), false, `Found legacy warm color ${color}`);
  }
});
