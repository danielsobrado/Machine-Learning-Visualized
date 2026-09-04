import { COMMAND_RULES } from './agentConfig.js';

export function classifyCommand(command, rules = COMMAND_RULES) {
  const match = rules.find((rule) => command.startsWith(rule.prefix));
  return match ?? { prefix: '', class: 'approval', reason: 'unknown command requires review' };
}

export function evaluatePatch(candidate, { maxUnrelatedFiles = 0 } = {}) {
  if (!candidate) throw new TypeError('candidate is required');

  const allowed = new Set(candidate.allowedFiles);
  const unrelatedFiles = candidate.changedFiles.filter((path) => !allowed.has(path));
  const commandRows = candidate.commands.map((command) => ({ command, ...classifyCommand(command) }));
  const requiredTests = candidate.tests.filter((item) => item.required);
  const failToPass = candidate.tests.filter((item) => item.kind === 'fail-to-pass');
  const passToPass = candidate.tests.filter((item) => item.kind === 'pass-to-pass');

  const requiredTestsPass = requiredTests.every((item) => item.after === 'pass');
  const forbiddenCommands = commandRows.filter((item) => item.class === 'blocked');
  const approvalCommands = commandRows.filter((item) => item.class === 'approval');
  const scopePass = unrelatedFiles.length <= maxUnrelatedFiles;

  const gateFailures = [];
  if (!requiredTestsPass) gateFailures.push('required regression test failed');
  if (forbiddenCommands.length) gateFailures.push('blocked command proposed');
  if (!scopePass) gateFailures.push('diff exceeds allowed scope');

  return {
    candidate,
    commandRows,
    unrelatedFiles,
    unrelatedFileCount: unrelatedFiles.length,
    requiredTestsPass,
    scopePass,
    forbiddenCommandCount: forbiddenCommands.length,
    approvalCommandCount: approvalCommands.length,
    failToPassRate: failToPass.length ? failToPass.filter((item) => item.after === 'pass').length / failToPass.length : 1,
    passToPassRate: passToPass.length ? passToPass.filter((item) => item.after === 'pass').length / passToPass.length : 1,
    testsRun: candidate.tests.filter((item) => item.after !== 'skip').length,
    testsSkipped: candidate.tests.filter((item) => item.after === 'skip').length,
    gateFailures,
    ship: gateFailures.length === 0,
    rollbackRequired: !requiredTestsPass || forbiddenCommands.length > 0,
  };
}

export function comparePatches(candidates, options) {
  return candidates.map((candidate) => evaluatePatch(candidate, options));
}
