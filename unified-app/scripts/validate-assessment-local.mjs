import { spawnSync } from 'node:child_process';

const GIT_COMMAND = process.platform === 'win32' ? 'git.exe' : 'git';
const NPM_COMMAND = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const VALIDATION_STEPS = Object.freeze([
  Object.freeze({ label: 'Unit and contract tests', args: ['test'] }),
  Object.freeze({ label: 'Semantic coverage audit', args: ['run', 'audit:assessment-semantic'] }),
  Object.freeze({ label: 'Near-duplicate audit', args: ['run', 'audit:assessment-duplicates'] }),
  Object.freeze({ label: 'Lesson quality audit', args: ['run', 'audit:quality'] }),
  Object.freeze({ label: 'Production build', args: ['run', 'build'] }),
  Object.freeze({ label: 'Assessment browser smoke', args: ['run', 'test:assessment-browser'] }),
]);

function run(command, args, options = {}) {
  return spawnSync(command, args, {
    encoding: 'utf8',
    shell: false,
    ...options,
  });
}

function readGitOutput(args, purpose) {
  const result = run(GIT_COMMAND, args);
  if (result.error || result.status !== 0) {
    const detail = result.error?.message || result.stderr?.trim() || 'unknown error';
    throw new Error(`Unable to ${purpose}: ${detail}`);
  }
  return result.stdout.trim();
}

function assertCleanWorktree() {
  const status = readGitOutput(['status', '--porcelain'], 'inspect the Git worktree');
  if (status) {
    throw new Error('Local validation requires a clean worktree so the result maps to an exact commit.');
  }
}

function runValidationStep({ label, args }) {
  console.log(`\n[assessment-local] ${label}`);
  const result = spawnSync(NPM_COMMAND, args, {
    stdio: 'inherit',
    shell: false,
  });

  if (result.error) {
    throw new Error(`Failed to start ${label}: ${result.error.message}`);
  }
  if (result.status !== 0) {
    throw new Error(`${label} failed with exit code ${result.status ?? 1}.`);
  }
}

try {
  assertCleanWorktree();
  const commitSha = readGitOutput(['rev-parse', 'HEAD'], 'resolve the current commit');
  console.log(`[assessment-local] Commit: ${commitSha}`);

  for (const step of VALIDATION_STEPS) {
    runValidationStep(step);
  }

  console.log(`\n[assessment-local] PASS ${commitSha}`);
} catch (error) {
  console.error(`\n[assessment-local] FAIL: ${error.message}`);
  process.exit(1);
}
