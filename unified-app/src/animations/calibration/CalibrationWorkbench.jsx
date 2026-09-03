import React, { useMemo, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import CalibrationControls from './CalibrationControls.jsx';
import CalibrationDecisionImpact from './CalibrationDecisionImpact.jsx';
import CalibrationDiagnostics from './CalibrationDiagnostics.jsx';
import CalibrationSliceAudit from './CalibrationSliceAudit.jsx';
import ReliabilityDiagram from './ReliabilityDiagram.jsx';
import {
  DEFAULT_SCENARIO_ID,
  DEFAULT_THRESHOLD,
  RECALIBRATION_METHODS,
  REFERENCE_BINS,
  SHIFT_SCENARIOS,
} from './calibrationConstants.js';
import {
  diagnoseShift,
  reliabilityMetrics,
} from './calibrationModel.js';
import { evaluateRecalibration } from './calibrationRecalibration.js';

export default function CalibrationWorkbench() {
  const [scenarioId, setScenarioId] = useState(DEFAULT_SCENARIO_ID);
  const [method, setMethod] = useState('none');
  const [threshold, setThreshold] = useState(DEFAULT_THRESHOLD);
  const scenario = SHIFT_SCENARIOS[scenarioId];

  const evaluation = useMemo(
    () => evaluateRecalibration(method, scenario.calibrationBins, scenario.evaluationBins),
    [method, scenario],
  );
  const referenceMetrics = useMemo(() => reliabilityMetrics(REFERENCE_BINS), []);
  const diagnostic = useMemo(
    () => diagnoseShift(REFERENCE_BINS, scenario.evaluationBins),
    [scenario],
  );

  const changeScenario = (nextScenarioId) => {
    setScenarioId(nextScenarioId);
    setMethod('none');
    setThreshold(DEFAULT_THRESHOLD);
  };

  const reset = () => {
    setScenarioId(DEFAULT_SCENARIO_ID);
    setMethod('none');
    setThreshold(DEFAULT_THRESHOLD);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-slate-500">Probability quality under shift</p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">Calibration</h2>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
              Calibration is not a certificate a model earns once. Compare a healthy reference population with new labeled data, diagnose whether probability levels or ranking degraded, then test recalibration on held-out scores without hiding model drift.
            </p>
          </div>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-800"
          >
            <RotateCcw size={16} /> Reset lab
          </button>
        </div>
      </section>

      <CalibrationControls
        scenarioId={scenarioId}
        method={method}
        onScenarioChange={changeScenario}
        onMethodChange={setMethod}
      />

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <ReliabilityDiagram
          referenceBins={REFERENCE_BINS}
          rawBins={scenario.evaluationBins}
          calibratedBins={evaluation.calibratedBins}
          methodLabel={RECALIBRATION_METHODS[method].label}
          showCalibrated={method !== 'none'}
        />
        <CalibrationDiagnostics
          referenceMetrics={referenceMetrics}
          rawMetrics={evaluation.rawMetrics}
          calibratedMetrics={evaluation.calibratedMetrics}
          diagnostic={diagnostic}
          method={method}
          parameters={evaluation.parameters}
        />
      </div>

      <CalibrationSliceAudit />

      <CalibrationDecisionImpact
        rawBins={scenario.evaluationBins}
        calibratedBins={evaluation.calibratedBins}
        threshold={threshold}
        onThresholdChange={setThreshold}
      />

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-cyan-800">Split discipline</p>
          <p className="mt-2 text-sm leading-6 text-cyan-950">
            Fit the base model first, fit the calibrator on separate labeled scores, then report final probability quality on untouched data or honest out-of-fold predictions.
          </p>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-amber-800">Slice discipline</p>
          <p className="mt-2 text-sm leading-6 text-amber-950">
            Treat overall calibration as the starting point. Audit important deployment slices separately because opposite subgroup errors can cancel almost perfectly in aggregate.
          </p>
        </div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-emerald-800">Recalibration boundary</p>
          <p className="mt-2 text-sm leading-6 text-emerald-950">
            Monotonic recalibration repairs probability levels, not features or ranking. If discrimination falls, investigate drift and retrain instead of celebrating a lower ECE.
          </p>
        </div>
      </section>
    </div>
  );
}
