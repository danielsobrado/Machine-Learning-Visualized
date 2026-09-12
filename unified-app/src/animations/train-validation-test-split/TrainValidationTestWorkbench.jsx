import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import PreprocessingLeakageLab from './PreprocessingLeakageLab.jsx';
import SplitStrategyLab from './SplitStrategyLab.jsx';
import TestContaminationLab from './TestContaminationLab.jsx';
import TrainServeSkewLab from './TrainServeSkewLab.jsx';
import {
  DEFAULT_SPLIT,
  PREPROCESSING_LEAKAGE_DEMO,
  SELECTION_EXPERIMENT,
} from './trainValidationTestSplitConstants.js';

export default function TrainValidationTestWorkbench() {
  const [targetId, setTargetId] = useState('unseenEntity');
  const [mode, setMode] = useState('stratified');
  const [validationPercent, setValidationPercent] = useState(DEFAULT_SPLIT.validation);
  const [testPercent, setTestPercent] = useState(DEFAULT_SPLIT.test);
  const [candidateCount, setCandidateCount] = useState(SELECTION_EXPERIMENT.defaultCandidates);
  const [testSize, setTestSize] = useState(SELECTION_EXPERIMENT.defaultTestSize);
  const [holdoutShift, setHoldoutShift] = useState(PREPROCESSING_LEAKAGE_DEMO.defaultShift);
  const [contractId, setContractId] = useState('aligned');

  const reset = () => {
    setTargetId('unseenEntity');
    setMode('stratified');
    setValidationPercent(DEFAULT_SPLIT.validation);
    setTestPercent(DEFAULT_SPLIT.test);
    setCandidateCount(SELECTION_EXPERIMENT.defaultCandidates);
    setTestSize(SELECTION_EXPERIMENT.defaultTestSize);
    setHoldoutShift(PREPROCESSING_LEAKAGE_DEMO.defaultShift);
    setContractId('aligned');
  };

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-slate-500">Evaluation foundations</p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">Train / Validation / Test Split</h2>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
              A split is an independence contract, not an 80/10/10 recipe. The boundary must match deployment, development feedback must stay out of the final test, learned preprocessing must respect the boundary, and production must compute the same inputs evaluated offline.
            </p>
          </div>
          <button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-800">
            <RotateCcw size={16} /> Reset labs
          </button>
        </div>
      </section>

      <SplitStrategyLab
        targetId={targetId}
        mode={mode}
        validationPercent={validationPercent}
        testPercent={testPercent}
        onTargetChange={setTargetId}
        onModeChange={setMode}
        onValidationChange={setValidationPercent}
        onTestChange={setTestPercent}
      />

      <PreprocessingLeakageLab holdoutShift={holdoutShift} onHoldoutShiftChange={setHoldoutShift} />
      <TestContaminationLab
        candidateCount={candidateCount}
        testSize={testSize}
        onCandidateCountChange={setCandidateCount}
        onTestSizeChange={setTestSize}
      />
      <TrainServeSkewLab contractId={contractId} onContractChange={setContractId} />

      <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-5">
          <p className="text-xs font-black uppercase tracking-wide text-cyan-700">Boundary rule</p>
          <p className="mt-2 text-sm leading-6 text-cyan-950">Split by the unit and direction of generalization: rows, entities, time, or a combination.</p>
        </div>
        <div className="rounded-lg border border-violet-200 bg-violet-50 p-5">
          <p className="text-xs font-black uppercase tracking-wide text-violet-700">Selection rule</p>
          <p className="mt-2 text-sm leading-6 text-violet-950">Validation is development feedback. Test is evidence after the recipe is frozen. Repeated test peeking destroys that distinction.</p>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-5">
          <p className="text-xs font-black uppercase tracking-wide text-amber-700">Transformation rule</p>
          <p className="mt-2 text-sm leading-6 text-amber-950">During development, fit learned preprocessing on training data only and apply the frozen transform to validation or test. After the recipe is frozen, the whole pipeline may be refit on train + validation before one final test evaluation.</p>
        </div>
        <div className="rounded-lg border border-sky-200 bg-sky-50 p-5">
          <p className="text-xs font-black uppercase tracking-wide text-sky-700">Serving rule</p>
          <p className="mt-2 text-sm leading-6 text-sky-950">Validate feature semantics, not just schemas. The same column name can encode a different production computation.</p>
        </div>
      </section>
    </div>
  );
}
